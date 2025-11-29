# Weather App

A full-stack weather application that displays real-time weather information for multiple cities with a beautiful, responsive UI and authentication powered by Auth0.

![Weather App](./frontend/src/assets/overview.png)

## Features

- 🔐 **Auth0 Authentication** - Secure login/logout functionality
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
git clone https://github.com/oditha4523/WeatherApp.git
cd weatherApp
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
cd ../frontend
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

## 6. Usage

1. **Login** - Click the login button and authenticate via Auth0
2. **View Weather** - See weather cards for all configured cities
3. **Click Cards** - Click any weather card to view detailed information in a popup
4. **Auto-Update** - Weather data refreshes automatically every 5 minutes
5. **Logout** - Click the logout button in the top-right corner

## 7. Project Structure

```
weatherApp/
├── backend/
│   ├── app.js                 # Express server entry point
│   ├── cities.json            # List of cities to fetch weather for
│   ├── package.json           # Backend dependencies
│   ├── cache/
│   │   └── cache.js          # Caching utility
│   └── utils/
│       └── weatherData.js    # OpenWeatherMap API integration
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # React entry point
│   │   ├── components/
│   │   │   ├── Dashboard/    # Main dashboard view
│   │   │   ├── Login/        # Login page
│   │   │   ├── WeatherCard/  # Individual weather card
│   │   │   └── ProtectedRoute/ # Route protection
│   │   └── assets/
│   │       └── icons/        # Weather icons
│   ├── index.html
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
└── README.md                  # This file
```

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
**Oditha Weerasekara**

## 12. Acknowledgments

- OpenWeatherMap for weather data API
- Auth0 for authentication services
- React and Vite communities for excellent tools

---


