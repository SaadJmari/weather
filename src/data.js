async function getWeather(location) {
    const request = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=J2BNUWTWLZGSF9Z27C3WJXG35`, { mode: 'cors' })
    const weatherData = await request.json()

    const usefulData = {
        name: weatherData.address,
        timezone: weatherData.timezone,
        description: weatherData.description,
        temp: weatherData.days[0].temp,
        icon: weatherData.days[0].icon,
        days: weatherData.days.map(day => ({
            date: day.datetime,
            temp: day.temp,
            tempMax: day.tempmax,
            tempMin: day.tempmin,
            feelsLike: day.feelslike,
            humidity: day.humidity,
            precip: day.precip,
            precipProb: day.precipprob,
            snow: day.snow,
            hours: day.hours
        }))

    }


    console.log(weatherData)

    return usefulData;
}

export default getWeather