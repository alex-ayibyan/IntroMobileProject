import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { Button } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) 
      throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log("Fonts loaded, hiding splash screen...");
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'light' ? '' : '#013a63', // header bar
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colorScheme === 'light' ? '' : '#fdfffc', // header title
            fontFamily: '',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#fdfffc',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="SightingDetail"
          options={{
            title: 'Sighting Details',
            headerLeft: () => (
              <Button title="Go back" color="#fdfffc" onPress={() => { router.back(); }} />
            ),
          }}
        />
        <Stack.Screen
          name="AddSighting"
          options={{
            title: 'Report a Sighting',
            headerLeft: () => (
              <Button title="Go back" color="#fdfffc" onPress={() => { router.back(); }} />
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

