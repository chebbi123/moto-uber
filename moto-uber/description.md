# Moto Uber Project

Moto Uber is a platform designed to provide fast and affordable motorcycle rides in Tunisia. The project includes a backend API and a frontend application with the following features:

## Features

### 1. User Authentication
- **Signup**: Users can register with their name, email, password, and phone number.
- **Login**: Users can log in using their email and password.
- **Roles**: Supports roles like `user`, `driver`, and `admin`.

### 2. Ride Management
- **Book a Ride**: Users can book rides by specifying pickup and dropoff locations.
- **Ride History**: Users can view their past rides.
- **Fare Estimation**: Users can estimate the fare for a ride before booking.

### 3. Wallet Management
- **Add Funds**: Users can add funds to their wallet.
- **View Balance**: Users can check their wallet balance.

### 4. Notifications
- **Real-time Updates**: Users receive notifications about ride status updates.

### 5. Admin Management
- **User Management**: Admins can view and delete users.
- **Analytics**: Admins can view platform analytics, such as total users, rides, and revenue.

### 6. Driver Management
- **Location Tracking**: Drivers can update their real-time location.
- **Availability**: Drivers can update their availability status.
- **Performance Metrics**: Drivers can view their completed rides and average ratings.

### 7. Localization
- **Multi-language Support**: The app supports English, French, and Arabic.
- **RTL Layout**: Arabic language support includes right-to-left layout adjustments.

### 8. Progressive Web App (PWA)
- **Offline Access**: The app includes PWA features for offline access.
- **Installable**: Users can install the app on their devices.

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Other Tools**: Stripe for payments, Twilio for SMS notifications, i18next for localization.

## Project Structure
```
/project
  /public
    manifest.webmanifest
    /icons
      icon-192x192.png
      icon-512x512.png
  /src
    main.tsx
    App.tsx
    index.tsx
  vite.config.ts
  package.json
  index.html
```

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser at `http://localhost:5173`.

