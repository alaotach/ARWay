🌐 React Native Outdoor Navigation
📜 Project Overview
Welcome to the React Native Outdoor Navigation project! This application leverages Google Maps API to provide real-time route generation and navigation. It displays a visually appealing blue path to guide users from their starting point to their destination.

🚀 Features
Real-time Navigation: Utilizes Google Maps API for accurate and real-time route generation.

Blue Path Rendering: Displays a clear and distinctive blue path for easier navigation.

Location Services: Fetches real-time user location using GPS.

User-Friendly Interface: Intuitive and easy-to-use interface for a seamless navigation experience.

🛠️ Installation & Setup
1. Initialize React Native Project
sh
npx react-native init NavigationApp
cd NavigationApp
2. Install Required Dependencies
sh
npm install react-native-maps react-native-geolocation-service axios
⚙️ Configuration
Enable Location Permissions
Modify AndroidManifest.xml (for Android):

xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
Modify Info.plist (for iOS):

xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location for navigation</string>
Set Up Google Maps API Key
Generate an API key from Google Cloud Console.

Enable Google Maps & Directions API.

Replace "YOUR_API_KEY" in the code with your actual key.

🗺️ How It Works
1. Display Route on Google Maps
Fetches real-time location.

Requests a route from Google Directions API.

Draws a blue polyline on the map.

2. Convert GPS Coordinates to Map Positions
Transforms route’s GPS coordinates into map-friendly points.

Draws a blue path on the map using Polyline.

▶️ Running the Project
Android
sh
npx react-native run-android
> Note: Ensure you run this on a physical device for accurate GPS location.

🎯 Final Steps & Optimization
Calibrate: Adjust GPS-to-map scaling for improved accuracy.

Optimize: Improve battery usage by limiting GPS polling frequency.

Fine-tune: Enhance map path rendering for smoother visuals.
