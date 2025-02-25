import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Sighting } from '../constants/Api';
import { Picker } from '@react-native-picker/picker';

export default function AddSighting() {
  const [witnessName, setWitnessName] = useState<string>('');
  const [witnessContact, setWitnessContact] = useState<string>('');
  const [status, setStatus] = useState<'Confirmed' | 'Unconfirmed'>('Unconfirmed');
  const [title, setTitle] = useState<string>('');

  const navigation = useNavigation();

  const saveSighting = async () => {
    if (!title || !witnessName || !witnessContact) {
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
        description: title,
        picture: '',
        status,
        dateTime: new Date().toISOString(),
        witnessContact,
        location: {
          latitude: 0,
          longitude: 0
        }
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
  }
});
