import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: colorScheme === 'light' ? '' : '#fdfffc', // tab icon
      tabBarInactiveTintColor: colorScheme === 'light' ? '' : '#6c757d', // grey for inactive tab
      tabBarStyle: {
        backgroundColor: colorScheme === 'light' ? '' : '#013a63', // tab bar
    },
    headerStyle: {
      backgroundColor: colorScheme === 'light' ? '' : '#013a63', // header bar
    },
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colorScheme === 'light' ? '' : '#fdfffc', // header title
    },
    headerTintColor: '#FFF',
  }}
>
  <Tabs.Screen
    name="Map"
    options={{
      title: 'Map',
      tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
    }}
  />
  <Tabs.Screen
    name="two"
    options={{
      title: 'List',
      tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
    }}
  />
</Tabs>
  );
}
