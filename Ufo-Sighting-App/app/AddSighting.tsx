import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Sighting } from '../constants/Api';
import { Picker } from '@react-native-picker/picker';

export default function AddSighting() {
  const [witnessName, setWitnessName] = useState<string>('');
  const [witnessContact, setWitnessContact] = useState<string>('');
  const [status, setStatus] = useState<'Confirmed' | 'Unconfirmed'>('Unconfirmed');
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const navigation = useNavigation();

  const handleMapPress = (event: MapPressEvent) => {
    setLocation(event.nativeEvent.coordinate);
  };

  const saveSighting = async () => {
    if (!title || !witnessName || !witnessContact || !location) {
      Alert.alert('Missing Information', 'Please fill in all fields and select a location.');
      return;
    }

    try {
      const storedSightings = await AsyncStorage.getItem('sightings');
      const sightings = storedSightings ? JSON.parse(storedSightings) : [];

      const nextId = sightings.length > 0 ? sightings[sightings.length - 1].id + 1 : 1;

      const newSighting: Sighting = {
        id: nextId,
        witnessName,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        description: title,
        picture: '',
        status,
        dateTime: new Date().toISOString(),
        witnessContact,
      };

      sightings.push(newSighting);
      await AsyncStorage.setItem('sightings', JSON.stringify(sightings));

      Alert.alert('Success', 'Sighting added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving sighting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report a UFO Sighting</Text>

      <TextInput
        placeholder="Enter witness name"
        style={styles.input}
        value={witnessName}
        onChangeText={setWitnessName}
      />
      <TextInput
        placeholder="Enter witness email"
        style={styles.input}
        value={witnessContact}
        onChangeText={setWitnessContact}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Enter sighting description"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.input}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Unconfirmed" value="Unconfirmed" />
          <Picker.Item label="Confirmed" value="Confirmed" />
        </Picker>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 50,
          longitude: 5,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        onPress={handleMapPress}
      >
        {location && <Marker coordinate={location} />}
      </MapView>

      <Button title="Save Sighting" onPress={saveSighting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#ffffff',
  },
  map: {
    height: 250,
    marginBottom: 10,
  },

});
