# *React Native Outdoor AR Navigation - README*

## *Project Overview*
This project implements an *outdoor AR navigation system* that renders a *blue path instead of arrows* using:
- *Google Maps API* for route generation.
- *ViroReact* to display a *3D blue path* in augmented reality.
- *GPS-to-AR conversion* to correctly position the path in the real world.

---

## *Installation & Setup*
### *1. Initialize React Native Project*
sh
npx react-native init ARNavigation
cd ARNavigation


### *2. Install Required Dependencies*
sh
npm install react-viro react-native-maps react-native-geolocation-service axios



---

## *Configuration*
### *Enable Location Permissions*
Modify AndroidManifest.xml (for Android):
xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>

Modify Info.plist (for iOS):
xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location for navigation</string>


### *Set Up Google Maps API Key*
- Generate an API key from *Google Cloud Console*.
- Enable *Google Maps & Directions API*.
- Replace "YOUR_API_KEY" in the code with your actual key.

---

## *How It Works*
### *1. Display Route on Google Maps*
- The app fetches *real-time location*.
- It requests a *route from Google Directions API*.
- A *blue polyline* is drawn on the map.

### *2. Convert GPS Coordinates to AR World Positions*
- The route’s *GPS coordinates are transformed* into AR-friendly 3D points.
- A *3D blue path* is drawn in AR using *ViroPolyline*.

### *3. Display Route in Augmented Reality*
- The AR scene *tracks the user’s position*.
- The blue path is updated dynamically as the user moves.

---

## *Running the Project*
### *Android*
sh
npx react-native run-android


*Note:* Ensure you run this on a *physical device* since AR features won’t work in emulators.

---

## *Final Steps & Optimization*
- *Calibrate GPS-to-AR scaling* for improved accuracy.
- *Optimize battery usage* by limiting GPS polling frequency.
- *Fine-tune AR path rendering* for smoother visuals.

---

### *Need help with debugging or deployment?* 🚀
