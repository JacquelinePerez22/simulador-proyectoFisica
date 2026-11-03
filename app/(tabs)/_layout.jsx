import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';
import { TAB_BAR_HEIGHT, useTabBarInsets } from '../../src/hooks/useTabBarInsets';

export default function TabsLayout() {
  const theme = useTheme();
  const { tabBarBottom } = useTabBarInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: [
          styles.floatingTabBar,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.surfaceVariant,
            bottom: tabBarBottom, // separa la barra de los botones de navegación del sistema
          },
        ],
      }}
    >
      <Tabs.Screen
        name="simulator"
        options={{
          title: 'Simular',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'calculator-variant' : 'calculator'}
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wiki"
        options={{
          title: 'Wiki',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'book-open-page-variant' : 'book-open-variant'}
              size={32}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: TAB_BAR_HEIGHT,
    borderRadius: 36,
    borderWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
});