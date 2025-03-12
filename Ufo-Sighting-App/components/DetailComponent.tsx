import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getSightings, Sighting } from '../constants/Api';

interface SightingDetailProps {
  sightingId: number;
}

const DetailComponent = ({ sightingId }: SightingDetailProps) => {
  const [sighting, setSighting] = useState<Sighting | null>(null);
  const [isLocalSighting, setIsLocalSighting] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSighting = async () => {
      const apiSightings = await getSightings();
      const detail = apiSightings.find((s) => s.id === sightingId);
      setSighting(detail || null);

      const storedSightings = await AsyncStorage.getItem('sightings');
      const localSightings: Sighting[] = storedSightings ? JSON.parse(storedSightings) : [];
      const foundInLocal = localSightings.some((s) => s.id === sightingId);

      setIsLocalSighting(foundInLocal);
    };

    fetchSighting();
  }, [sightingId]);

  const deleteSighting = async () => {
    try {
      const storedSightings = await AsyncStorage.getItem('sightings');
      const localSightings: Sighting[] = storedSightings ? JSON.parse(storedSightings) : [];

      const updatedSightings = localSightings.filter((s) => s.id !== sightingId);
      await AsyncStorage.setItem('sightings', JSON.stringify(updatedSightings));

      Alert.alert('Deleted', 'Sighting has been removed!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error deleting sighting:', error);
    }
  };

  if (!sighting) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{sighting.witnessName}</Text>
      <Text style={styles.date}>{new Date(sighting.dateTime).toLocaleString()}</Text>
      {sighting.picture && (
        <Image style={styles.image} source={{ uri: sighting.picture }} />
      )}
      <Text style={styles.status}>Status: {sighting.status}</Text>
      <Text style={styles.description}>{sighting.description}</Text>
      <Text style={styles.contact}>Contact: {sighting.witnessContact}</Text>

      {isLocalSighting && (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteSighting}>
          <Text style={styles.deleteText}>Delete Sighting</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 6,
  },
  image: {
    width: '100%',
    height: 400,
    marginVertical: 12,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  contact: {
    fontSize: 16,
    color: 'black',
    marginTop: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetailComponent;
