# Weather App

A full-stack weather application that displays real-time weather information for multiple cities with a beautiful, responsive UI and authentication powered by Auth0.



## Features

- 🔐 **User Authentication** - Secure signup/login with JWT and bcrypt
- 👥 **Public Registration** - Open signup for all users
- 🌍 **Multi-City Weather** - View weather for multiple cities simultaneously
- 🔄 **Auto-Refresh** - Weather data updates automatically every 5 minutes
- 💾 **Server-Side Caching** - Efficient API usage with 5-minute cache
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Auth0 React SDK** - Authentication
- **Axios** - HTTP client
- **React Router** - Routing

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **OpenWeatherMap API** - Weather data provider
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Auth0 Account** (free tier available)
- **OpenWeatherMap API Key** (free tier available)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SPBT2002/real-time-weather-app.git
cd real-time-weather-app
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
BASE_URL="https://api.openweathermap.org/data/2.5/weather?id="
API_KEY_OWM=your_openweathermap_api_key_here
```
### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_AUTH0_DOMAIN=dev-6liv24iltlfh7fzt.us.auth0.com
VITE_AUTH0_CLIENT_ID=mTWtOEYwaEGRpqNooxdMQv8oUyriW2N0
```

## 4. Running the Application

### Start Backend Server

In the `backend` directory:

```bash
npm start
```
The backend server will start on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal, navigate to the `frontend` directory:

```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```
## Test User Credentials

Default Admin User to log in:

- **Email:** supunpiyumal127@gmail.com
- **Password:** Pass#fidenz

## 5. Usage
1. **Sign Up** - Create a new account with your email and password (min 6 characters)
2. **Login** - Click the login button and authenticate via Auth0
3. **View Weather** - See weather cards for all configured cities
4. **Click Cards** - Click any weather card to view detailed information in a popup
5. **Auto-Update** - Weather data refreshes automatically every 5 minutes
6. **Logout** - Click the logout button in the top-right corner

## 6. Project Structure

```
weather-dashboard/
├── backend/
│   ├── app.js                    # Express server & API endpoints
│   ├── cities.json               # List of cities to fetch weather for
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables (not in repo)
│   ├── cache/
│   │   └── cache.js              # Caching utility (if used)
│   └── utils/
│       └── weatherData.js        # OpenWeatherMap API integration
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── App.jsx               # Main application component
│   │   ├── App.css               # Global styles
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Base styles
│   │   ├── assets/
│   │   │   ├── bg.jpg            # Background image
│   │   │   └── icons/            # Weather icons
│   │   │       ├── clear.png
│   │   │       ├── cloud.png
│   │   │       ├── mist.png
│   │   │       ├── rain.png
│   │   │       ├── snow.png
│   │   │       └── weather.png
│   │   └── components/
│   │       ├── Dashboard/
│   │       │   ├── Dashboard.jsx      # Main dashboard view
│   │       │   └── Dashboard.css      # Dashboard styles
│   │       ├── Login/
│   │       │   ├── Login.jsx          # Login page with auth
│   │       │   └── Login.css          # Login styles
│   │       ├── Signup/
│   │       │   ├── Signup.jsx         # User registration page
│   │       │   └── Signup.css         # Signup styles
│   │       ├── WeatherCard/
│   │       │   ├── WeatherCard.jsx    # Weather card component
│   │       │   └── WeatherCard.css    # Card styles
│   │       └── ProtectedRoute/
│   │           └── ProtectedRoute.jsx # Route authentication guard
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── eslint.config.js          # ESLint configuration
│   └── .env                      # Environment variables (not in repo)
│
├── README.md                     # Main project documentation
└── .gitignore                    # Git ignore rules
```

## 7. Comfort Index Score System

### Formula Explanation

The Comfort Index Score is a **numerical value from 0-100** that ranks cities from "Most Comfortable" to "Least Comfortable" based on weather conditions. The score is **calculated on the backend** using three key weather parameters:

#### **Formula Components:**

```javascript
Comfort Score = (Temperature Score × 50%) + (Humidity Score × 30%) + (Wind Speed Score × 20%)
```

#### **Parameter Breakdown:**

| Parameter | Weight | Optimal Range | Reasoning |
|-----------|--------|---------------|-----------|
| **Temperature** | 50% | 18-24°C (64-75°F) | Most significant factor affecting human comfort |
| **Humidity** | 30% | 30-60% | Significantly impacts perceived temperature and comfort |
| **Wind Speed** | 20% | 0-5 m/s | Affects perceived temperature (wind chill/heat index) |

### Why This Formula?

#### 1. **Temperature (50% weight)**
- **Primary comfort factor**: Temperature has the most direct and immediate impact on how comfortable we feel
- **Wide consensus**: Research shows temperature is universally the #1 factor in thermal comfort
- **Measurable impact**: Outside optimal range (18-24°C), comfort decreases rapidly

#### 2. **Humidity (30% weight)**
- **Secondary importance**: High humidity makes heat feel worse; low humidity causes dryness
- **Health impact**: Affects breathing, skin comfort, and how the body regulates temperature
- **Amplifies temperature**: 30°C at 80% humidity feels worse than 30°C at 40% humidity

#### 3. **Wind Speed (20% weight)**
- **Modifying factor**: Wind doesn't create discomfort alone but modifies temperature perception
- **Situational**: Light breeze (2-5 m/s) can be pleasant; strong wind (>10 m/s) is uncomfortable
- **Lower weight justified**: Less impactful than temperature and humidity in most scenarios

### Scoring Logic

Each parameter receives a score from 0-100 based on how close it is to the optimal range:

#### **Temperature Scoring:**
```
18-24°C  → 100 points (Perfect)
15-18°C  → 80-50 points (Cool but acceptable)
24-28°C  → 80-50 points (Warm but acceptable)
<15°C    → <50 points (Cold)
>28°C    → <50 points (Hot)
<5°C or >38°C → Near 0 (Extreme)
```

#### **Humidity Scoring:**
```
30-60%   → 100 points (Ideal)
20-30%   → 80-60 points (Slightly dry)
60-70%   → 80-60 points (Slightly humid)
<20% or >85% → <40 points (Very dry or very humid)
```

#### **Wind Speed Scoring:**
```
0-2 m/s  → 100 points (Calm)
2-5 m/s  → 100-70 points (Light breeze)
5-10 m/s → 70-30 points (Moderate wind)
>15 m/s  → <10 points (Strong/uncomfortable)
```

### Example Calculation

**City: London**
- Temperature: 22°C → Score: 100 (perfect range)
- Humidity: 45% → Score: 100 (perfect range)
- Wind Speed: 3 m/s → Score: 90 (light breeze)

**Comfort Score = (100 × 0.5) + (100 × 0.3) + (90 × 0.2) = 50 + 30 + 18 = 98.0**

**Result: Rank #1 - Excellent Comfort** 🟢

### Display System

The comfort score is displayed with color-coded indicators:

| Score Range | Level | Color | Description |
|-------------|-------|-------|-------------|
| 80-100 | Excellent | 🟢 Green | Ideal weather conditions |
| 65-79 | Good | 🔵 Blue | Very comfortable |
| 50-64 | Moderate | 🟠 Orange | Acceptable conditions |
| 35-49 | Fair | 🟣 Purple | Some discomfort expected |
| 0-34 | Poor | 🔴 Red | Uncomfortable conditions |

### Implementation

- ✅ **Backend calculation** - Scores computed in `app.js` (lines 74-146)
- ✅ **Automatic ranking** - Cities sorted by score (highest to lowest)
- ✅ **Real-time updates** - Recalculated every 5 minutes with fresh weather data
- ✅ **Cached results** - Efficient API usage with server-side caching

## 8. API Endpoints

### Backend API

- **GET /** - Health check endpoint
- **GET /weather** - Fetch weather data for all cities

## 9. Features in Detail

### Weather Cards
- Color-coded by city (5 different color schemes)
- Display temperature, city, and weather condition
- Hover effect for better interactivity
- Click to open detailed modal view

### Modal Popup
- Shows full weather details
- Includes temperature, city, and weather condition
- Back button to close
- Click outside to dismiss
- Disabled on mobile devices (< 480px) for better UX

## 10. Environment Variables

### Backend (.env)
```env
PORT=5000                              # Server port
BASE_URL="https://api.openweathermap.org/data/2.5/weather?id="
API_KEY_OWM=your_api_key      # OpenWeatherMap API key
```
### Frontend (.env)
```env
VITE_AUTH0_DOMAIN=your_domain         # Auth0 domain
VITE_AUTH0_CLIENT_ID=your_client_id   # Auth0 client ID
```

## 11. Author
**Supun Piyumal**

## 12. Acknowledgments

- OpenWeatherMap for weather data API
- Auth0 for authentication services
- React and Vite communities for excellent tools

---


