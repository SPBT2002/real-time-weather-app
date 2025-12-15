require('dotenv').config();
const express = require('express');
const weatherData = require('./utils/weatherData');
const cors = require('cors');
const data = require('./cities.json');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'], // Vite ports
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


// In-memory user storage (replace with database in production)
const registeredUsers = [];

// Initialize with the existing admin user
registeredUsers.push({
  email: 'supunpiyumal127@gmail.com',
  passwordHash: '$2b$10$V0ykiFCM8KsYVb7T2Emu0e4xD3QkOaXpGg8aeAZOQGuj1p30zKuZi'
});


function generatePasswordHash(password) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error generating hash:', err);
      return;
    }
    console.log('\nPassword:', password);
    console.log('Hash:', hash);
    console.log('\nAdd this hash to the WHITELISTED_USERS array\n');
  });
}


async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}


function requireAuth(req, res, next) {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-change-in-production');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}


let cache = {
  data: null,
  timestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000;


function calculateComfortScore(weatherData) {

  const tempCelsius = weatherData.main.temp - 273.15;
  let tempScore = 0;
  
  if (tempCelsius >= 18 && tempCelsius <= 24) {
    tempScore = 100;
  } else if (tempCelsius >= 15 && tempCelsius < 18) {
    tempScore = 80 - ((18 - tempCelsius) * 10);
  } else if (tempCelsius > 24 && tempCelsius <= 28) {
    tempScore = 80 - ((tempCelsius - 24) * 10);
  } else if (tempCelsius >= 10 && tempCelsius < 15) {
    tempScore = 60 - ((15 - tempCelsius) * 8);
  } else if (tempCelsius > 28 && tempCelsius <= 32) {
    tempScore = 60 - ((tempCelsius - 28) * 10);
  } else if (tempCelsius >= 5 && tempCelsius < 10) {
    tempScore = 40 - ((10 - tempCelsius) * 6);
  } else if (tempCelsius > 32 && tempCelsius <= 38) {
    tempScore = 40 - ((tempCelsius - 32) * 5);
  } else {
    tempScore = Math.max(0, 20 - Math.abs(tempCelsius - 21) * 2);
  }

  // Humidity score (30% weight) - Optimal: 30-60%
  const humidity = weatherData.main.humidity;
  let humidityScore = 0;
  
  if (humidity >= 30 && humidity <= 60) {
    humidityScore = 100;
  } else if (humidity >= 20 && humidity < 30) {
    humidityScore = 80 - ((30 - humidity) * 2);
  } else if (humidity > 60 && humidity <= 70) {
    humidityScore = 80 - ((humidity - 60) * 2);
  } else if (humidity >= 10 && humidity < 20) {
    humidityScore = 60 - ((20 - humidity) * 3);
  } else if (humidity > 70 && humidity <= 85) {
    humidityScore = 60 - ((humidity - 70) * 2);
  } else if (humidity < 10) {
    humidityScore = Math.max(0, 30 - (10 - humidity) * 5);
  } else {
    humidityScore = Math.max(0, 30 - (humidity - 85) * 3);
  }

  // Wind Speed score (20% weight) - Lower is better, optimal: 0-5 m/s
  const windSpeed = weatherData.wind.speed;
  let windScore = 0;
  
  if (windSpeed <= 2) {
    windScore = 100;
  } else if (windSpeed <= 5) {
    windScore = 100 - ((windSpeed - 2) * 10);
  } else if (windSpeed <= 10) {
    windScore = 70 - ((windSpeed - 5) * 8);
  } else if (windSpeed <= 15) {
    windScore = 30 - ((windSpeed - 10) * 4);
  } else {
    windScore = Math.max(0, 10 - (windSpeed - 15) * 2);
  }

  // Calculate weighted total score
  const totalScore = (
    (tempScore * 0.50) +      
    (humidityScore * 0.30) +  
    (windScore * 0.20)        
  );


  return Math.round(totalScore * 10) / 10;
}

// Login endpoint - Now accepts all registered users
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user in registered users
    const user = registeredUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
      { expiresIn: '1h' }
    );
    
    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      user: { email: user.email },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Signup endpoint - Allow public registration
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      email,
      passwordHash,
      createdAt: new Date()
    };
    
    registeredUsers.push(newUser);
    
    // Generate token
    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
      { expiresIn: '1h' }
    );
    
    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { email: newUser.email },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true, message: 'Logged out successfully' });
});


app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

app.get('/', (req, res) => {
  res.send("Hello world");
});

app.get('/weather', requireAuth, async (req, res) => {
  const now = Date.now();

  if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
    console.log("Serving from cache");
    return res.json(cache.data);
  }

  try {
    console.log("Fetching new data from OpenWeatherMap...");
    const results = [];

    for (const city of data.List) {
      const weather = await weatherData(city.CityCode);
      if (weather) {
        // Calculate comfort score for this city
        const comfortScore = calculateComfortScore(weather);
        
        results.push({
          city: city.CityName,
          country: weather.sys.country,
          temperature: weather.main.temp,
          condition: weather.weather[0].description,
          humidity: weather.main.humidity,
          pressure: weather.main.pressure,
          visibility: (weather.visibility / 1000).toFixed(1),
          sunrise: new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sunset: new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          wind: `${weather.wind.speed} m/s`,
          windSpeed: weather.wind.speed,
          cloudiness: weather.clouds?.all || 0,
          comfortScore: comfortScore
        });
      }
    }

    
    results.sort((a, b) => b.comfortScore - a.comfortScore);
    
    
    results.forEach((city, index) => {
      city.rank = index + 1;
    });

    cache.data = results;
    cache.timestamp = now;

    res.json(results);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: 'Error fetching weather data', error });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});


module.exports = { generatePasswordHash };
