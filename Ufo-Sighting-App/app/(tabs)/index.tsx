import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapComponent from '@/components/MapComponent';
import { getSightings, Sighting } from '../../constants/Api';
import { Region } from 'react-native-maps';

const initialRegion: Region = {
  latitude: 100,
  longitude: 50,
  latitudeDelta: 1,
  longitudeDelta: 0.5,
};

export default function TabOneScreen() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSightings = async () => {
      const fetchedSightings = await getSightings();
      setSightings(fetchedSightings);
      setLoading(false);
    };

    fetchSightings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapComponent initialRegion={initialRegion} sightings={sightings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


