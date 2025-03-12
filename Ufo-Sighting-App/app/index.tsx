import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';

const LandingPage = () => {
  return (
    <ImageBackground 
      source={require('../assets/images/ufo_background.jpg')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>UFO Sightings</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Explore and report UFO sightings around the world.
          </Text>
          <Link href="/(tabs)/Map" style={styles.button}>
            <Text style={styles.buttonText}>Start Your Journey</Text>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Alex Ayibyan and Furkan Bas</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic', 
  },
  button: {
    backgroundColor: '#013a63',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'white',
    fontStyle: 'italic',
    marginBottom: 10
  },
});

export default LandingPage;
