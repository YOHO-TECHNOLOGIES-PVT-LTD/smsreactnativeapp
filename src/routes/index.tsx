import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import toast from '../utils/toast';
import CustomDrawer from '../tabs/CustomDrawer';
import {
  BookingCartScreen,
  BookingsScreen,
  FAQsScreen,
  ForgotPasswordScreen,
  HelpCenterScreen,
  HomeScreen,
  LoginScreen,
  NotificationScreen,
  OtpVerificationScreen,
  ProfileScreen,
  RegisterScreen,
  ServicesScreen,
  SetNewPasswordScreen,
  SettingsScreen,
  SosScreen,
  SparePartsScreen,
} from '~/screens';

// Define the types for navigation stack
export type RootStackParamList = {
  AuthStack: undefined;
  MainStack: undefined;
  CustomDrawer: undefined;
  HomeScreen: undefined;
  SOSScreen: undefined;
  ServicesScreen: undefined;
  SparePartsScreen: undefined;
  ProfileScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  OtpVerificationScreen: undefined;
  SetNewPasswordScreen: undefined;
  ForgotPasswordScreen: undefined;
  NotificationScreen: undefined;
  SettingsScreen: undefined;
  BookingCartScreen: undefined;
  BookingsScreen: undefined;
  FAQsScreen: undefined;
  HelpCenterScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const isLoggedIn = true; // Replace this with your actual logic
        if (isLoggedIn) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthStack' }],
          });
        }
      } catch (error: any) {
        toast.error('Error during auth state check:', error.message || 'Unknown error');
      }
    };

    checkAuthState();
  }, [navigation]);

  const AuthStack: React.FC = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgetPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
      <Stack.Screen name="SetNewPasswordScreen" component={SetNewPasswordScreen} />
    </Stack.Navigator>
  );

  const MainStack: React.FC = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomDrawer" component={CustomDrawer} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SOSScreen" component={SosScreen} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
      <Stack.Screen name="SparePartsScreen" component={SparePartsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="BookingsScreen" component={BookingsScreen} />
      <Stack.Screen name="BookingCartSceen" component={BookingCartScreen} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
      <Stack.Screen name="FAQsScreen" component={FAQsScreen} />
    </Stack.Navigator>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
};

export default Routes;
