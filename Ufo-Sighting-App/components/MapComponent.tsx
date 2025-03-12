import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Sighting } from '../constants/Api';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface MapComponentProps {
  initialRegion: Region;
  sightings: Sighting[];
  onRegionChange?: (region: Region) => void;
}

const MapComponent = ({ initialRegion, sightings, onRegionChange }: MapComponentProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChange}
      >
        {sightings.map((sighting) => (
          <Marker
            key={sighting.id}
            coordinate={{
              latitude: sighting.location.latitude,
              longitude: sighting.location.longitude,
            }}
            onPress={() =>
              navigation.navigate('SightingDetail', { sightingId: sighting.id })
            }
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapComponent;
