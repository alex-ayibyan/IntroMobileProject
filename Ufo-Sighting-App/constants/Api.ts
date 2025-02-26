import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://sampleapis.assimilate.be/ufo/sightings';

export interface Sighting {
  id: number;
  witnessName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  picture: string;
  status: string;
  dateTime: string;
  witnessContact: string;
}
export const getSightings = async (): Promise<Sighting[]> => {
  try {
    const response = await axios.get<Sighting[]>(API_URL);
    const apiSightings = response.data;

    const storedSightings = await AsyncStorage.getItem('sightings');
    const localSightings: Sighting[] = storedSightings ? JSON.parse(storedSightings) : [];

    return [...apiSightings, ...localSightings];
  } catch (error) {
    console.error('Error fetching sightings:', error);
    return [];
  }
};
