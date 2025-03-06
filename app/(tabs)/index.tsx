import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import axios from 'axios';
import { Navigation } from 'lucide-react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Platform } from 'react-native';
import 'react-native-get-random-values';

const GOOGLE_MAPS_API_KEY = 'AIzaSyC7ukDsf603LrgOht4zr6TahkpVksq4WrE';

interface Route {
  points: Array<{ latitude: number; longitude: number }>;
  distance: string;
  duration: string;
}

interface Place {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

interface Coords {
  latitude: number;
  longitude: number;
}

interface LocationSubscription {
  remove: () => void;
}

const CAMPUS_REGION = {
  latitude: 28.544051,
  longitude: 77.1694887,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};


const BUILDINGS = [
  {
    id: '1',
    name: 'Main Library',
    coordinate: { latitude: 28.5406024, longitude: 77.1656729 },
    description: 'Central library with study spaces',
  },
  {
    id: '2',
    name: 'Student Center',
    coordinate: { latitude: 28.5470794, longitude: 77.1694262 },
    description: 'Student activities and dining',
  },
];

interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export default function MapScreen() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [watchSubscription, setWatchSubscription] = useState<LocationSubscription | null>(null);
  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const mapRef = useRef(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  const calculateRoute = async () => {
    if (!origin || !destination) {
      Alert.alert('Error', 'Please select both origin and destination');
      return;
    }

    const start = `${origin.coordinate.latitude},${origin.coordinate.longitude}`;
    const end = `${destination.coordinate.latitude},${destination.coordinate.longitude}`;
    await getDirections(start, end);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const startRealTimeNavigation = async () => {
    if (!destination) {
      Alert.alert('Error', 'Please select a destination');
      return;
    }
  
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Location permission denied');
        return;
      }
  
      setIsNavigating(true);
  
      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserLocation({ latitude, longitude });
          
          // Update route if user moves significantly
          if (destination) {
            getDirections(
              `${latitude},${longitude}`,
              `${destination.coordinate.latitude},${destination.coordinate.longitude}`
            );
          }
        }
      );
      setWatchSubscription(subscription);
  } catch (error) {
    console.error('Error starting navigation:', error);
    Alert.alert('Error', 'Failed to start navigation');
  }
};

const stopRealTimeNavigation = () => {
  if (watchSubscription) {
    watchSubscription.remove();
    setWatchSubscription(null);
  }
  setIsNavigating(false);
  setRoute(null);
};

  const getDirections = async (startLoc: string, destinationLoc: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.routes.length) {
        const route = response.data.routes[0];
        const points = decodePolyline(route.overview_polyline.points);
        const distance = route.legs[0].distance.text;
        const duration = route.legs[0].duration.text;

        setRoute({
          points,
          distance,
          duration,
        });

        mapRef.current?.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      setErrorMsg('Failed to fetch directions');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = async (building) => {
    setSelectedBuilding(building);
    if (location) {
      const start = `${location.coords.latitude},${location.coords.longitude}`;
      const destination = `${building.coordinate.latitude},${building.coordinate.longitude}`;
      await getDirections(start, destination);
    }
  };

  const openGoogleMapsNavigation = async (building) => {
    if (!location) {
      Alert.alert('Error', 'Unable to get your current location');
      return;
    }

    try {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${location.coords.latitude},${location.coords.longitude}&destination=${building.coordinate.latitude},${building.coordinate.longitude}&travelmode=walking`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Google Maps');
      }
    } catch (error) {
      console.error('Error opening navigation:', error);
      Alert.alert('Error', 'Failed to open navigation');
    }
  };



  const decodePolyline = (encoded: string) => {
    const points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let shift = 0, result = 0;
      let byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5,
      });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Enter origin"
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) {
                  setOrigin({
                    id: generateUniqueId(),
                    name: data.description,
                    coordinate: {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    },
                    description: details.formatted_address,
                  });
                }
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.searchInput,
              }}
            />
            <GooglePlacesAutocomplete
              placeholder="Enter destination"
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) {
                  setDestination({
                    id: data.place_id,
                    name: data.description,
                    coordinate: {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    },
                    description: details.formatted_address,
                  });
                }
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.searchInput,
              }}
            />
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={calculateRoute}>
              <Text style={styles.calculateButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={CAMPUS_REGION}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            followsUserLocation={isNavigating}
            userLocationUpdateInterval={1000}
            userLocationFastestInterval={1000}>
            {origin && (
              <Marker
                coordinate={origin.coordinate}
                title={origin.name}
                description="Origin"
                pinColor="green"
              />
            )}
            {destination && (
              <Marker
                coordinate={destination.coordinate}
                title={destination.name}
                description="Destination"
                pinColor="red"
              />
            )}
            {route && (
              <Polyline
                coordinates={route.points}
                strokeWidth={3}
                strokeColor="#2563eb"
              />
            )}
          </MapView>

          {route && (
              <View style={styles.bottomSheet}>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeTitle}>Route Details</Text>
                  <Text style={styles.routeDescription}>
                    Distance: {route.distance} • Walking time: {route.duration}
                  </Text>
                </View>
                {loading ? (
                  <ActivityIndicator color="#2563eb" />
                ) : (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.navigationButton, styles.buttonFlex]}
                      onPress={() => {
                        if (origin && destination) {
                          openGoogleMapsNavigation(destination);
                        }
                      }}>
                      <Navigation size={24} color="#ffffff" />
                      <Text style={styles.navigationButtonText}>Open in Google Maps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.navigationButton,
                        styles.buttonFlex,
                        isNavigating && styles.stopButton,
                      ]}
                      onPress={() => {
                        if (isNavigating) {
                          stopRealTimeNavigation();
                        } else {
                          startRealTimeNavigation();
                        }
                      }}>
                      <Text style={styles.navigationButtonText}>
                        {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
        </>
      )}
    </View> 
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buildingInfo: {
    marginBottom: 15,
  },
  buildingName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 4,
  },
  buildingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
  },
  navigationButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 10,
    right: 10,
    zIndex: 1,
    elevation: 3,
  },
  autocompleteContainer: {
    flex: 0,
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});