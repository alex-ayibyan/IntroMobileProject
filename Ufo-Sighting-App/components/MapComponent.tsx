import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Sighting } from '../constants/Api';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface MapComponentProps {
  initialRegion: Region;
  sightings: Sighting[];
}

const MapComponent = ({ initialRegion, sightings }: MapComponentProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {sightings.map((sighting) => (
          <Marker
            key={sighting.id}
            coordinate={{
              latitude: sighting.location.latitude,
              longitude: sighting.location.longitude,
            }}
            onPress={() =>
              navigation.navigate('Details')
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
