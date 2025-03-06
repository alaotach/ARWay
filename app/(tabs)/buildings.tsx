import { StyleSheet, View, FlatList, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';

const BUILDINGS = [
  {
    id: '1',
    name: 'Main Library',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
    category: 'Library',
    description: 'Central library with study spaces and research resources',
  },
  {
    id: '2',
    name: 'Student Center',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585',
    category: 'Services',
    description: 'Hub for student activities, dining, and recreation',
  },
  {
    id: '3',
    name: 'Science Building',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    category: 'Academic',
    description: 'Home to science laboratories and research facilities',
  },
];

export default function BuildingsScreen() {
  const router = useRouter();

  const handleBuildingSelect = (building) => {
    router.push({
      pathname: '/(tabs)/',
      params: { buildingId: building.id },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={BUILDINGS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.buildingCard}
            onPress={() => handleBuildingSelect(item)}>
            <Image
              source={{ uri: item.image }}
              style={styles.buildingImage}
              resizeMode="cover"
            />
            <View style={styles.buildingInfo}>
              <Text style={styles.buildingName}>{item.name}</Text>
              <Text style={styles.buildingCategory}>{item.category}</Text>
              <Text style={styles.buildingDescription}>{item.description}</Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.buildingsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buildingsList: {
    padding: 16,
  },
  buildingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buildingImage: {
    width: '100%',
    height: 200,
  },
  buildingInfo: {
    padding: 16,
  },
  buildingName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  buildingCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 8,
  },
  buildingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#334155',
    lineHeight: 20,
  },
});