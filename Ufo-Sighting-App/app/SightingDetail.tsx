import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../constants/Types';
import SightingDetailComponent from '../components/DetailComponent';

const SightingDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SightingDetail'>>();
  const { sightingId } = route.params;

  return (
    <View style={styles.screenContainer}>
      <SightingDetailComponent sightingId={sightingId} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SightingDetailScreen;
