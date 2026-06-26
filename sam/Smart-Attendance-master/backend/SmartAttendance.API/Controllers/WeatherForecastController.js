const summaries = [
  "Freezing",
  "Bracing",
  "Chilly",
  "Cool",
  "Mild",
  "Warm",
  "Balmy",
  "Hot",
  "Sweltering",
  "Scorching"
];

const getWeatherForecast = async (req, res) => {
  try {
    const forecasts = [];

    for (let i = 1; i <= 5; i++) {
      forecasts.push({
        date: new Date(
          Date.now() + i * 24 * 60 * 60 * 1000
        ),
        temperatureC:
          Math.floor(
            Math.random() * (55 - (-20) + 1)
          ) - 20,
        summary:
          summaries[
            Math.floor(
              Math.random() *
                summaries.length
            )
          ]
      });
    }

    res.status(200).json(forecasts);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getWeatherForecast
};