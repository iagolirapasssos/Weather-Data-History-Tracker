# Weather Data & History Tracker

## Overview

**Weather Data & History Tracker** is a web application designed for tracking real-time weather data as well as manually entered weather conditions. The app allows users to visualize this data through interactive graphs, compare historical trends, and manage weather data storage. This project uses the OpenWeatherMap API to fetch weather data and is built with HTML, JavaScript, and Bootstrap.

## Features

### For Users:
- **Real-Time Weather Data**: Fetch and display weather data from any city using the OpenWeatherMap API.
- **Custom Data Entry**: Enter custom weather data, such as temperature, humidity, wind speed, wind direction, and pressure, to track local conditions.
- **Graph Visualization**: View interactive graphs of weather history, including temperature, humidity, wind speed, and more.
- **Data Storage**: Store weather data in the browser using LocalStorage, allowing users to view historical data over time.
- **Responsive Design**: The app is designed to work across various devices, including desktops, tablets, and smartphones.

### For Developers:
- **Customizable Graphs**: Weather data is visualized using Chart.js, making it easy to modify and add new datasets or graph types.
- **API Integration**: The application is integrated with the OpenWeatherMap API for fetching real-time weather information.
- **Bootstrap Layout**: The UI is styled with Bootstrap, allowing for quick changes and responsive layouts.
- **Modular Code**: The project uses modular JavaScript for handling forms, API calls, graph updates, and LocalStorage management, making it easy to extend functionality.

## How to Use

### For Users:
1. **Enter Custom Data**: Fill in the custom weather fields (Temperature, Humidity, Wind Speed, Wind Direction, Pressure) and click `Calculate` to view results.
2. **Fetch API Data**: Enter a city name and click `Fetch Data` to retrieve the latest weather information from the OpenWeatherMap API.
3. **View Weather History**: The graph displays a historical timeline of user-entered and API-fetched weather data.
4. **Modify Settings**: Open the settings (gear icon) to enter your OpenWeatherMap API key. This key is required to fetch live data.

### For Developers:
1. Clone or download the repository:
    ```bash
    git clone https://github.com/iagolirapasssos/Weather-Data-History-Tracker.git
    ```
2. Modify the `script.js` file to customize graph behavior, API endpoints, or add new features.
3. Customize the layout and UI by editing the `index.html` and `style.css` files.
4. You can add new weather parameters or modify the API call to include more detailed data (e.g., UV index, cloud cover).

## Installation

### Prerequisites:
- **API Key**: Sign up on [OpenWeatherMap](https://home.openweathermap.org/users/sign_up) to get your API key.
- **Web Browser**: Use any modern web browser (Google Chrome, Firefox, Edge, etc.).

### Steps:
1. Download or clone the repository.
2. Open the `index.html` file in your browser.
3. Enter your OpenWeatherMap API key by clicking the gear icon (bottom-right corner) and entering the key in the modal that appears.
4. Start using the app by entering a city name or custom weather data.

## API Key Management

- The API key is stored securely in LocalStorage for use across sessions.
- The API key field in the settings modal is masked as a password field to protect the key from being visible on screen.

## Tech Stack

- **HTML/CSS**: For structuring and styling the UI.
- **JavaScript**: Handles form submission, API calls, data processing, and chart rendering.
- **Chart.js**: Used for graphing weather data.
- **Bootstrap**: Provides responsive design and UI components.
- **LocalStorage**: Stores user-entered weather data and API results for offline access.

## Customization Guide (For Developers)

### 1. API Customization
You can change the weather data source or modify the API parameters by editing the following section in `script.js`:
```javascript
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => { 
        // Process the weather data here
    });
```

### 2. Graph Customization
The graph is generated using Chart.js, and the dataset can be easily extended or modified. For example, to add new weather parameters (like UV index), you can add a new dataset to the `weatherChart` object in `script.js`.

### 3. UI Modifications
You can modify the UI by editing the `index.html` file or enhancing the layout using Bootstrap classes. For example, you can add more sections, style changes, or modify the modal windows.

## Contributing

If you'd like to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.

---

Feel free to reach out with any questions or issues!
