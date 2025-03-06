import { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';

const PLACES = [
  { id: '1', name: 'Main Library', category: 'Library' },
  { id: '2', name: 'Student Center', category: 'Services' },
  { id: '3', name: 'Science Building', category: 'Academic' },
  { id: '4', name: 'Sports Complex', category: 'Athletics' },
  { id: '5', name: 'Dining Hall', category: 'Food' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredPlaces = PLACES.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlaceSelect = (place) => {
    // Navigate to the map screen with the selected place
    router.push({
      pathname: '/(tabs)/',
      params: { placeId: place.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for buildings, classrooms..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.resultItem}
            onPress={() => handlePlaceSelect(item)}>
            <View>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeCategory}>{item.category}</Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.resultsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    fontFamily: 'Inter-Regular',
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  placeName: {
    fontSize: 16,
    color: '#0f172a',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  placeCategory: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
});