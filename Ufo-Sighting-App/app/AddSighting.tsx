import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Sighting } from '../constants/Api';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import DropDownPicker from 'react-native-dropdown-picker';

export default function AddSighting() {
  const [witnessName, setWitnessName] = useState<string>('');
  const [witnessContact, setWitnessContact] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [items, setItems] = useState([
    { label: "Unconfirmed", value: "Unconfirmed" },
    { label: "Confirmed", value: "Confirmed" },
  ]);
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  const navigation = useNavigation();

  const getCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  React.useEffect(() => {
    getCameraPermission();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    setLocation(event.nativeEvent.coordinate);
    setIsMapVisible(false);
  };

  const openMap = () => {
    setIsMapVisible(true);
  };

  function openCamera() {
    setIsCameraVisible(true);
  }

  const closeCamera = () => {
    setIsCameraVisible(false);
  };

  const checkSavedSightings = async () => {
    try {
      const storedSightings = await AsyncStorage.getItem('sightings');
      if (storedSightings) {
        console.log('Saved Sightings:', JSON.parse(storedSightings));
        Alert.alert('Sightings have been logged in the console.');
      } else {
        Alert.alert('No Sightings', 'No sightings found in storage.');
      }
    } catch (error) {
      console.error('Error retrieving sightings:', error);
    }
  };
  

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared!');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        const fileUri = FileSystem.documentDirectory + `sighting_${Date.now()}.jpg`;
  
        try {
          await FileSystem.moveAsync({
            from: photo.uri,
            to: fileUri,
          });
  
          setPhotoUri(fileUri);
          closeCamera();
        } catch (error) {
          console.error('Error saving photo:', error);
        }
      }
    }
  };

  const isSavingRef = useRef(false);

  const validateEmail = (email: string) => {
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailCheck.test(email);
  };
  
  const saveSighting = async () => {
    if (isSavingRef.current) {
      console.log("Duplicate prevention triggered, skipping...");
      return;
    }
    isSavingRef.current = true;
  
    console.log("Attempting to save sighting...");
  
    if (!title || !witnessName || !witnessContact || !location) {
      Alert.alert('Missing Information', 'Please fill in all fields and select a location.');
      isSavingRef.current = false;
      return;
    }
  
    // Email validation check
    if (!validateEmail(witnessContact)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      isSavingRef.current = false;
      return;
    }
  
    try {
      const storedSightings = await AsyncStorage.getItem('sightings');
      const localSightings: Sighting[] = storedSightings ? JSON.parse(storedSightings) : [];
  
      const exists = localSightings.some(s => 
        s.witnessName === witnessName &&
        s.location.latitude === location.latitude &&
        s.location.longitude === location.longitude &&
        s.description === title
      );
  
      if (exists) {
        Alert.alert('Duplicate Entry', 'This sighting has already been added.');
        isSavingRef.current = false;
        return;
      }
  
      const MIN_LOCAL_ID = 11;
      const maxLocalId = localSightings.length > 0 ? Math.max(...localSightings.map(s => s.id)) : MIN_LOCAL_ID - 1;
      const newSightingId = maxLocalId + 1;
  
      const newSighting: Sighting = {
        id: newSightingId,
        witnessName,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        description: title,
        picture: photoUri || '',
        dateTime: new Date().toISOString(),
        witnessContact,
        status: '',
      };
  
      localSightings.push(newSighting);
      await AsyncStorage.setItem('sightings', JSON.stringify(localSightings));
  
      Alert.alert('Success', 'Sighting added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              navigation.goBack();
              isSavingRef.current = false;
            }, 100);
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving sighting:', error);
      isSavingRef.current = false;
    }
  };
  

  return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter witness name"
          style={styles.input}
          placeholderTextColor="#fdfffc"
          value={witnessName}
          onChangeText={setWitnessName}
        />
        <TextInput
          placeholder="Enter witness email"
          style={styles.input}
          placeholderTextColor="#fdfffc"
          value={witnessContact}
          onChangeText={setWitnessContact}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Enter sighting description"
          style={styles.input}
          placeholderTextColor="#fdfffc"
          value={title}
          onChangeText={setTitle}
        />
        
        <DropDownPicker
          open={open}
          value={status}
          items={items}
          setOpen={setOpen}
          setValue={setStatus}
          setItems={setItems}
          style={styles.dropdown}
          textStyle={{ color: "#fdfffc" }}
          placeholder="Select Status"
          dropDownContainerStyle={styles.dropdownContainer}
        />
  
        <CustomButton title="Open Map" onPress={openMap} />
        {isMapVisible && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 50,
              longitude: 5,
              latitudeDelta: 40,
              longitudeDelta: 40,
            }}
            onPress={handleMapPress}
          >
            {location && <Marker coordinate={location} />}
          </MapView>
        )}
  
        <CustomButton title="Open Camera" onPress={openCamera} />
        {isCameraVisible && hasPermission === true && (
          <><View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing='back' ref={cameraRef}>
          </CameraView>
        </View><CustomButton title="Take Picture" onPress={takePicture} /></>
          
        )}
  
        {photoUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
          </View>
        )}
  

        <CustomButton title="Save Sighting" onPress={(saveSighting)} />
        {/* <CustomButton title="Check Saved Sightings" onPress={(checkSavedSightings)} />
        <CustomButton title="Clear Sightings" onPress={(clearStorage)} /> */}
      </View>
    );
  }


  const CustomButton: React.FC<{ title: string; onPress: () => void }> = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fdfffc',
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#013a63',
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      color: '#fdfffc',
      backgroundColor: '#6c757d',
    },
    dropdown: {
      backgroundColor: "#6c757d",
      borderColor: "#013a63",
      borderRadius: 8,
      marginBottom: 10,
    },
    dropdownContainer: {
      backgroundColor: "#6c757d",
    },
    button: {
      backgroundColor: '#013a63',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 5,
    },
    buttonText: {
      color: '#fdfffc',
      fontSize: 16,
      fontWeight: 'bold',
    },
    map: {
      height: 250,
      marginBottom: 10,
      borderRadius: 10,
    },
    cameraContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    camera: {
      width: '100%',
      height: 400,
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    photoText: {
      fontSize: 16,
      color: '#fdfffc',
      marginBottom: 5,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
  });