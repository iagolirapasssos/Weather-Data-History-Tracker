const apiKeyInput = document.getElementById('apiKey'); //https://home.openweathermap.org/api_keys
const apiKeyForm = document.getElementById('apiKeyForm');
let apiKey = localStorage.getItem('apiKey') || '';

const maxStorageEntries = 100;
let weatherData = JSON.parse(localStorage.getItem('weatherData')) || [];

// Inicializa o gráfico
const ctx = document.getElementById('weatherChart').getContext('2d');
let weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'User Data (Temperature)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4 // Ajuste a tensão para suavizar as curvas
            },
            {
                label: 'API Data (Temperature)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Linha tracejada para a API
                fill: false,
                tension: 0.4 // Ajuste a tensão para suavizar as curvas
            },
            {
                label: 'User Data (Rain Probability)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4, // Ajuste a tensão para suavizar as curvas
                type: 'line'
            },
            {
                label: 'API Data (Rain Probability)',
                data: [],
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Linha tracejada para a API
                fill: false,
                tension: 0.4, // Ajuste a tensão para suavizar as curvas
                type: 'line'
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    }
});

// Atualiza o gráfico com base nos dados armazenados
function updateGraph(type = 'temperature') {
    // Verifica se há dados para atualizar o gráfico
    if (weatherData.length > 0) {
        // Filtra os dados para mostrar apenas os dados do usuário
        const userWeatherData = weatherData.filter(item => item.isUserData);
        
        const labels = userWeatherData.map(item => item.timestamp);
        const userData = userWeatherData.map(item => item[type]);

        weatherChart.data.labels = labels;
        weatherChart.data.datasets[0].data = userData;  // Dados do usuário para o tipo selecionado
        weatherChart.data.datasets[1].data = [];        // Limpa os dados da API
        weatherChart.data.datasets[2].data = [];        // Limpa os dados da probabilidade de chuva do usuário
        weatherChart.data.datasets[3].data = [];        // Limpa os dados da probabilidade de chuva da API

        weatherChart.data.datasets[0].label = `User Data (${type.charAt(0).toUpperCase() + type.slice(1)})`;
        weatherChart.data.datasets[1].label = ''; // Label vazio para a API
        weatherChart.data.datasets[2].label = '';
        weatherChart.data.datasets[3].label = '';

        weatherChart.update();
    }
}

// Alterna o tipo de gráfico
function toggleGraph(type) {
    if (type === 'rainProbability') {
        updateGraph('rainProbability');
    } else {
        updateGraph(type);
    }
}

// Adiciona dados ao localStorage
function addWeatherData(data, isUserData = false) {
    if (weatherData.length >= maxStorageEntries) {
        weatherData.shift(); // Remove o primeiro elemento se estiver no limite
    }
    data.isUserData = isUserData;  // Indica se os dados são do usuário
    weatherData.push(data);
    localStorage.setItem('weatherData', JSON.stringify(weatherData));
    updateGraph(); // Atualiza o gráfico
}

// Função para obter os dados do formulário personalizado e da API
function handleCalculate(flagLocalStorage) {
    const temp = parseFloat(document.getElementById('temperature').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const windSpeed = parseFloat(document.getElementById('windSpeed').value);
    const windDirection = parseFloat(document.getElementById('windDirection').value);
    const pressure = parseFloat(document.getElementById('pressure').value);

    const timestamp = new Date().toLocaleTimeString();

    const customData = {
        temperature: temp,
        humidity: humidity,
        windSpeed: windSpeed,
        windDirection: windDirection,
        pressure: pressure,
        probabilityOfRain: calculateRainProbability(temp, humidity, pressure),
        timestamp: timestamp
    };

    if (Object.values(customData).every(value => value !== null && value !== '')) {
        if (flagLocalStorage) {
            addWeatherData(customData, true); // Adiciona dados do usuário
        }
    }

    // Agora obter dados da API e salvar com o mesmo timestamp
    const city = document.getElementById('city').value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const apiData = {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed * 3.6, // Converter m/s para km/h
                windDirection: data.wind.deg,
                pressure: data.main.pressure,
                probabilityOfRain: calculateRainProbability(data.main.temp, data.main.humidity, data.main.pressure),
                timestamp: timestamp // Usar o mesmo timestamp
            };
            
            if (flagLocalStorage) {
                addWeatherData(apiData, false); // Adiciona dados da API
            }

            document.getElementById('customResults').innerHTML = `
                <strong>Temperature:</strong> ${temp}°C <br>
                <strong>Humidity:</strong> ${humidity}% <br>
                <strong>Wind Speed:</strong> ${windSpeed} km/h <br>
                <strong>Wind Direction:</strong> ${windDirection}° <br>
                <strong>Pressure:</strong> ${pressure} hPa <br>
                <strong>Probability of Rain:</strong> ${customData.probabilityOfRain}% <br>
                <strong>Time:</strong> ${timestamp}
            `;

            document.getElementById('apiResults').innerHTML = `
                <strong>City:</strong> ${city} <br>
                <strong>Temperature:</strong> ${apiData.temperature}°C <br>
                <strong>Humidity:</strong> ${apiData.humidity}% <br>
                <strong>Wind Speed:</strong> ${apiData.windSpeed.toFixed(1)} km/h <br>
                <strong>Wind Direction:</strong> ${apiData.windDirection}° <br>
                <strong>Pressure:</strong> ${apiData.pressure} hPa <br>
                <strong>Probability of Rain:</strong> ${apiData.probabilityOfRain}% <br>
                <strong>Time:</strong> ${timestamp}
            `;
        })
        .catch(error => {
            document.getElementById('apiResults').innerHTML = 'Error fetching data from API.';
            console.error('Error:', error);
        });
}

// Função para obter os dados do formulário personalizado
document.getElementById('customForm').addEventListener('submit', function (e) {
    e.preventDefault();
    handleCalculate(true);
});

// Função para obter dados da API OpenWeather
document.getElementById('apiForm').addEventListener('submit', function (e) {
    e.preventDefault();
    handleCalculate(true);
});

// Função para resetar os dados
document.getElementById('resetData').addEventListener('click', function () {
    localStorage.removeItem('weatherData');
    weatherData = [];
    weatherChart.data.labels = [];
    weatherChart.data.datasets.forEach(dataset => dataset.data = []);
    weatherChart.update();
    document.getElementById('customResults').innerHTML = '';
    document.getElementById('apiResults').innerHTML = '';
});

// Carregar a chave da API criptografada do localStorage
function loadApiKey() {
    if (apiKey) {
        // Decrypt the API key (assuming decryption function is implemented)
        apiKey = decrypt(apiKey);
    }
}

// Save the API key with encryption
function saveApiKey(key) {
    // Encrypt the API key (assuming encryption function is implemented)
    const encryptedKey = encrypt(key);
    localStorage.setItem('apiKey', encryptedKey);
}

// Encrypt function (basic example, replace with a secure method)
function encrypt(text) {
    return btoa(text); // Base64 encoding for simplicity
}

// Decrypt function (basic example, replace with a secure method)
function decrypt(text) {
    return atob(text); // Base64 decoding for simplicity
}

apiKeyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const key = apiKeyInput.value;
    saveApiKey(key);
    apiKey = key; // Update local variable
    alert('API Key saved successfully!');
});

//Function to Calculate Probability of Rain
// Função para calcular a probabilidade de chuva usando o modelo de regressão logística
function calculateRainProbability(temperature, humidity, pressure) {
    // Coeficientes do modelo de regressão logística (exemplo, ajuste conforme necessário)
    const b0 = -4.0;  // Intercepto
    const b1 = 0.1;   // Coeficiente para temperatura
    const b2 = 0.05;  // Coeficiente para umidade
    const b3 = -0.02; // Coeficiente para pressão

    // Calcula o valor da função logística
    const logit = b0 + b1 * temperature + b2 * humidity + b3 * pressure;
    const probability = 1 / (1 + Math.exp(-logit)); // Função logística

    // Garante que a probabilidade esteja entre 0% e 100%
    return (probability * 100).toFixed(2); // Retorna com duas casas decimais
}

// Carregar dados do localStorage e atualizar o gráfico ao iniciar a página
document.addEventListener('DOMContentLoaded', function () {
	loadApiKey();
    updateGraph(); // Atualiza o gráfico com os dados existentes
});

