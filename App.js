import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { DataEntryScreen } from './src/screens/DataEntryScreen';
import { NutritionDetailScreen } from './src/screens/NutritionDetailScreen';
import { EnergyDetailScreen } from './src/screens/EnergyDetailScreen';
import { ActivityDetailScreen } from './src/screens/ActivityDetailScreen';
import { RecoveryDetailScreen } from './src/screens/RecoveryDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ navigation }) => ({
            title: 'FlexLog',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('DataEntry')}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: '#fff', fontSize: 28 }}>+</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="DataEntry"
          component={DataEntryScreen}
          options={{ title: 'Log Data' }}
        />
        <Stack.Screen
          name="NutritionDetail"
          component={NutritionDetailScreen}
          options={{ title: 'Nutrition' }}
        />
        <Stack.Screen
          name="EnergyDetail"
          component={EnergyDetailScreen}
          options={{ title: 'Energy' }}
        />
        <Stack.Screen
          name="ActivityDetail"
          component={ActivityDetailScreen}
          options={{ title: 'Activity' }}
        />
        <Stack.Screen
          name="RecoveryDetail"
          component={RecoveryDetailScreen}
          options={{ title: 'Recovery' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
