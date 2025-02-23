import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapComponent from '@/components/MapComponent';
import { getSightings, Sighting } from '../../constants/Api';
import { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; // Import for the plus icon
import { useNavigation } from '@react-navigation/native'; // For navigation
import { RootStackParamList } from '../../constants/Types';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProps = StackNavigationProp<RootStackParamList, 'TabLayout'>;

const initialRegion: Region = {
  latitude: 100,
  longitude: 50,
  latitudeDelta: 1,
  longitudeDelta: 0.5,
};

export default function TabOneScreen() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const fetchSightings = async () => {
      const fetchedSightings = await getSightings();
      setSightings(fetchedSightings);
      setLoading(false);
    };

    fetchSightings();
  }, []);

  const handleAddSighting = () => {
    navigation.navigate('AddSighting'); // Navigate to an "Add Sighting" screen (configure this in your navigation)
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapComponent initialRegion={initialRegion} sightings={sightings} />

      {/* ➕ Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddSighting}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
});
