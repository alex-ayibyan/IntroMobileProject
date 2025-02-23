import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { getSightings, Sighting } from '../constants/Api';

interface SightingDetailProps {
  sightingId: number;
}

const DetailComponent = ({ sightingId }: SightingDetailProps) => {
  const [sighting, setSighting] = useState<Sighting | null>(null);

  useEffect(() => {
    console.log('Sighting ID:', sightingId);
    const fetchSighting = async () => {
      const sightings = await getSightings();
      console.log("Fetched Sightings:", sightings);
      const detail = sightings.find((s) => s.id === sightingId);
      console.log("Sighting Detail:", detail);
      setSighting(detail || null);
    };
  
    fetchSighting();
  }, [sightingId]);
  
  

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
});

export default DetailComponent;
