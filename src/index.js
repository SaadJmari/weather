import "./styles.css"
import getWeather from "./data"
import getCitySuggestions from "./autocomplete";

const body = document.querySelector("body");
const header = document.createElement("header");
const form = document.createElement("form");
const userInput = document.createElement("input");
const submitBtn = document.createElement("button");
const main = document.createElement("main");
const todayContainer = document.createElement("div");
const forecastContainer = document.createElement("div");
const suggestionBox = document.createElement("ul");

userInput.classList.add("user.input");
todayContainer.classList.add("today");
forecastContainer.classList.add("forecast");
suggestionBox.classList.add("suggestions");


submitBtn.textContent = "Search";
userInput.placeholder = "Enter the city's name";


form.appendChild(userInput);
form.appendChild(submitBtn);
header.appendChild(form);
header.appendChild(suggestionBox);
main.appendChild(todayContainer);
main.appendChild(forecastContainer);
body.appendChild(header);
body.appendChild(main);

document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) {
        suggestionBox.innerHTML = "";
    }
});

userInput.addEventListener("input", async () => {
    const value = userInput.value.trim();
    if (value.length < 1) {
        suggestionBox.innerHTML = "";
        return;
    }

    const suggestions = await getCitySuggestions(value);
    suggestionBox.innerHTML = "";

    suggestions.slice(0, 5).forEach(city => {
        const li = document.createElement("li");
        li.textContent = `${city.city}, ${city.country}`;
        li.addEventListener("click", () => {
            userInput.value = city.city;
            suggestionBox.innerHTML = "";
        });
        suggestionBox.appendChild(li);
    });
});

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    const userValue = userInput.value;
    const weather = await getWeather(userValue);
    const now = new Date();
    const currentHour = now.getHours();

    // Find current hour's index
    const currentDayHours = weather.days[0].hours;
    const nextDayHours = weather.days[1]?.hours || [];
    const hourIndex = weather.days[0].hours.findIndex(hour =>
        parseInt(hour.datetime.split(":")[0]) === currentHour
    );

    // Get remaining hours in today
    const todayHours = currentDayHours.slice(hourIndex, hourIndex + 6);

    // If not enough hours, get more from next day
    let upcomingHours = [...todayHours];

    if (upcomingHours.length < 6) {
        const hoursNeeded = 6 - upcomingHours.length;
        const nextDaySlice = nextDayHours.slice(0, hoursNeeded);
        upcomingHours = upcomingHours.concat(nextDaySlice);
    }

    // Clear previous results
    todayContainer.innerHTML = "";
    forecastContainer.innerHTML = "";

    // Create today's card
    const todayCard = document.createElement("div");
    const hourlyDiv = document.createElement("div");
    todayCard.classList.add("card");
    hourlyDiv.classList.add("hourly");

    const firstHours = weather.days[0].hours.slice(0, 6); // show 6 hours
    todayCard.innerHTML = `
        <h2>${weather.name}</h2>
        <p>${weather.days[0].date}</p>
        <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${weather.icon}.png" 
         alt="${weather.description}" 
         class="weather-icon">
        <p><strong>Timezone:</strong> ${weather.timezone}<p>
        <p><strong>Temp:</strong> ${weather.days[0].temp}°C</p>
        <p><strong>Feels like:</strong> ${weather.days[0].feelsLike}°C</p>
        <p><strong>Humidity:</strong> ${weather.days[0].humidity}%</p>
        <p><strong>Temp Max:</strong> ${weather.days[0].tempMax}°C</p>
        <p><strong>Snow:</strong> ${weather.days[0].snow} cm</p>
    `;

    upcomingHours.forEach(hour => {
        const hourBlock = document.createElement("div");
        hourBlock.classList.add("hour");
        const hourString = hour.datetime;
        const hourNum = parseInt(hourString.split(":")[0]);
        const ampmHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
        const ampm = hourNum < 12 ? "AM" : "PM";
        hourBlock.innerHTML = `
        <p>${ampmHour} ${ampm}</p>
        <p>${hour.temp}°C</p>
    `;
        hourlyDiv.appendChild(hourBlock);
    });

    todayCard.appendChild(hourlyDiv);
    todayContainer.appendChild(todayCard);

    // Create next 7 days' cards
    for (let i = 1; i <= 7; i++) {
        const day = weather.days[i];
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${day.date}</h3>
            <p><strong>High:</strong> ${day.tempMax}°C</p>
            <p><strong>Low:</strong> ${day.tempMin}°C</p>
            <p><strong>Rain:</strong> ${day.precip} mm</p>
        `;
        forecastContainer.appendChild(card);
    }
});
