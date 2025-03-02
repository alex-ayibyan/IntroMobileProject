import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapComponent from '@/components/MapComponent';
import { getSightings, Sighting } from '../../constants/Api';
import { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../constants/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProps = StackNavigationProp<RootStackParamList, 'TabLayout'>;

const initialRegion: Region = {
  latitude: 50.85,
  longitude: 4.35,
  latitudeDelta: 40,
  longitudeDelta: 40,
};

const fetchAllSightings = async () => {
  const apiSightings = await getSightings();
  const storedSightings = await AsyncStorage.getItem('sightings');
  const localSightings = storedSightings ? JSON.parse(storedSightings) : [];

  const allSightings = [...apiSightings, ...localSightings];
  
  const uniqueSightings = Array.from(
    new Map(allSightings.map(sighting => [sighting.id, sighting])).values()
  );

  return uniqueSightings;
};

export default function TabOneScreen() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProps>();

  const loadSightings = useCallback(async () => {
    setLoading(true);
    const allSightings = await fetchAllSightings();
    setSightings(allSightings);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSightings();
    }, [loadSightings])
  );

  const handleAddSighting = () => {
    navigation.navigate('AddSighting');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapComponent initialRegion={initialRegion} sightings={sightings} />

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
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
});
