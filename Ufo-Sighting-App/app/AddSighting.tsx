import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Sighting } from '../constants/Api';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import DropDownPicker from 'react-native-dropdown-picker';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddSighting() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [items, setItems] = useState([
    { label: "Unconfirmed", value: "Unconfirmed" },
    { label: "Confirmed", value: "Confirmed" },
  ]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermission();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    setLocation(event.nativeEvent.coordinate);
    setIsMapVisible(false);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        const fileUri = FileSystem.documentDirectory + `sighting_${Date.now()}.jpg`;
        try {
          await FileSystem.moveAsync({ from: photo.uri, to: fileUri });
          setPhotoUri(fileUri);
          setIsCameraVisible(false);
        } catch (error) {
          console.error('Error saving photo:', error);
        }
      }
    }
  };

  const onSubmit = async (data: any) => {
    if (!location) {
      Alert.alert('Missing Location', 'Please select a location on the map.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Missing Picture', 'Please take a picture.');
      return;
    }

    try {
      const storedSightings = await AsyncStorage.getItem('sightings');
      const localSightings: Sighting[] = storedSightings ? JSON.parse(storedSightings) : [];

      const exists = localSightings.some(s =>
        s.witnessName === data.witnessName &&
        s.location.latitude === location.latitude &&
        s.location.longitude === location.longitude &&
        s.description === data.description
      );

      if (exists) {
        Alert.alert('Duplicate Entry', 'This sighting has already been added.');
        return;
      }

      const newSighting: Sighting = {
        id: Date.now(),
        witnessName: data.witnessName,
        witnessContact: data.witnessContact,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        description: data.description,
        picture: photoUri || '',
        dateTime: date.toISOString(),
        status: status || '',
      };

      localSightings.push(newSighting);
      await AsyncStorage.setItem('sightings', JSON.stringify(localSightings));

      Alert.alert('Success', 'Sighting added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving sighting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="witnessName"
        rules={{ required: 'Name is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter witness name"
            style={styles.input}
            placeholderTextColor="#fdfffc"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.witnessName && <Text style={styles.errorText}>{String(errors.witnessName.message)}</Text>}

      <Controller
        control={control}
        name="witnessContact"
        rules={{
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter witness email"
            style={styles.input}
            placeholderTextColor="#fdfffc"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
          />
        )}
      />
      {errors.witnessContact && <Text style={styles.errorText}>{String(errors.witnessContact.message)}</Text>}

      <Controller
        control={control}
        name="description"
        rules={{ required: 'Description is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter sighting description"
            style={styles.input}
            placeholderTextColor="#fdfffc"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.description && <Text style={styles.errorText}>{String(errors.description.message)}</Text>}

      <DropDownPicker
           open={open}
           value={status}
           items={items}
           setOpen={setOpen}
           setValue={setStatus}
           setItems={setItems}
           style={styles.dropdown}
           textStyle={{ color: "#FFF" }}
           placeholder="Select Status"
           dropDownContainerStyle={styles.dropdownContainer}
         />


      <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate); 
            }
            setShowDatePicker(true);
          }}
          textColor='#013a63'
        />
      )}


      <CustomButton title={isMapVisible ? "Close Map" : "Open Map"} onPress={() => setIsMapVisible(!isMapVisible)} />
      {isMapVisible && (
        <MapView style={styles.map} initialRegion={{ latitude: 50, longitude: 5, latitudeDelta: 40, longitudeDelta: 40 }} onPress={handleMapPress}>
          {location && <Marker coordinate={location} />}
        </MapView>
      )}

      <CustomButton title={isCameraVisible ? "Close Camera" : "Open Camera"} onPress={() => setIsCameraVisible(!isCameraVisible)} />
      {isCameraVisible && hasPermission && (
        <>
          <CustomButton title="Take Picture" onPress={takePicture} />
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing='back' ref={cameraRef} />
          </View>
        </>
      )}

      {photoUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
        </View>
      )}

      <CustomButton title="Save Sighting" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const CustomButton: React.FC<{ title: string; onPress: () => void }> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  errorText: { color: 'red', marginBottom: 10 },
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
  dateText: {
    fontSize: 18,
    color: '#013a63',
    marginVertical: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    backgroundColor: '#fdfffc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#013a63',
    fontWeight: 'bold',
  }
  
});

