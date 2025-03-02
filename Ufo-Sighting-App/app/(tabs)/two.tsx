import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { getSightings, Sighting } from '../../constants/Api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../constants/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProps = StackNavigationProp<RootStackParamList, 'TabLayout'>;

const fetchAllSightings = async () => {
  const apiSightings = await getSightings();
  const storedSightings = await AsyncStorage.getItem('sightings');
  const localSightings = storedSightings ? JSON.parse(storedSightings) : [];

  const allSightings = [...apiSightings, ...localSightings];

  const uniqueSightings = Array.from(
    new Map(allSightings.map(sighting => [sighting.id, sighting])).values()
  );

  return uniqueSightings;
};

export default function TabTwoScreen() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProps>();

  const loadSightings = useCallback(async () => {
    setLoading(true);
    const allSightings = await fetchAllSightings();
    setSightings(allSightings);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSightings();
    }, [loadSightings])
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sightings}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('SightingDetail', { sightingId: item.id })
            }
          >
            <Text style={styles.itemText}>{item.witnessName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
