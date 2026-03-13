import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LoginScreen from '../components/screens/LoginScreen';
import HomeScreen from '../components/screens/HomeScreen';
import SettingsScreen from '../components/screens/SettingsScreen';
import OrdersScreen from '../components/screens/OrdersScreen';
import DashboardScreen from '../components/screens/DashboardScreen';
import BillingScreen from '../components/screens/BillingScreen';
import CartScreen from '../components/screens/CartScreen';
import PaymentScreen from '../components/screens/PaymentScreen';
import ReceiptScreen from '../components/screens/ReceiptScreen';
import { useAppContext } from '../context/store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
      },
      headerTintColor: '#16a085',
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: 'Smart Billing',
        headerLeft: () => null,
      }}
    />
    <Stack.Screen
      name="BillingScreen"
      component={BillingScreen}
      options={{
        title: 'Menu',
      }}
    />
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Your Cart',
      }}
    />
    <Stack.Screen
      name="Payment"
      component={PaymentScreen}
      options={{
        title: 'Payment Method',
      }}
    />
    <Stack.Screen
      name="Receipt"
      component={ReceiptScreen}
      options={{
        title: 'Order Receipt',
        headerLeft: () => null,
      }}
    />
    <Stack.Screen
      name="OrdersTab"
      component={OrdersScreen}
      options={{
        title: 'Orders',
      }}
    />
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
      },
      headerTintColor: '#16a085',
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="DashboardScreen"
      component={DashboardScreen}
      options={{
        title: 'Add Products',
        headerLeft: () => null,
      }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
      },
      headerTintColor: '#16a085',
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        headerLeft: () => null,
      }}
    />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
      },
      headerTintColor: '#16a085',
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="OrdersScreen"
      component={OrdersScreen}
      options={{
        title: 'Orders',
        headerLeft: () => null,
      }}
    />
  </Stack.Navigator>
);

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'DashboardTab') {
          iconName = focused ? 'plus-circle' : 'plus-circle-outline';
        } else if (route.name === 'OrdersTab') {
          iconName = focused ? 'receipt-text' : 'receipt-text-outline';
        } else if (route.name === 'SettingsTab') {
          iconName = focused ? 'cog' : 'cog-outline';
        }

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#16a085',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: '#f0f0f0',
        borderTopWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
      },
    })}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="DashboardTab"
      component={DashboardStack}
      options={{
        tabBarLabel: 'Dashboard',
      }}
    />
    <Tab.Screen
      name="OrdersTab"
      component={OrdersStack}
      options={{
        tabBarLabel: 'Orders',
      }}
    />
    <Tab.Screen
      name="SettingsTab"
      component={SettingsStack}
      options={{
        tabBarLabel: 'Settings',
      }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { state } = useAppContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!state.isLoggedIn ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animationEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{
              animationEnabled: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
