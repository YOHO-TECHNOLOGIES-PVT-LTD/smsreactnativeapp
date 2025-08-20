import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BookingCartScreen,
  BookingsScreen,
  FAQsScreen,
  ForgotPasswordScreen,
  HelpCenterScreen,
  HomeScreen,
  LoginScreen,
  NotificationScreen,
  OnboardingScreen,
  OtpVerificationScreen,
  ProfileScreen,
  RegisterScreen,
  ServicesScreen,
  SetNewPasswordScreen,
  SettingsScreen,
  SosScreen,
  SparePartsScreen,
} from '~/screens';
import ServiceDrawer from '../tabs/CustomDrawer';

export type RootStackParamList = {
  AuthStack: undefined;
  Onboarding: undefined;
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
  const MainStack: React.FC = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomDrawer" component={ServiceDrawer} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
      <Stack.Screen name="SetNewPasswordScreen" component={SetNewPasswordScreen} />
      <Stack.Screen name="SOSScreen" component={SosScreen} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
      <Stack.Screen name="SparePartsScreen" component={SparePartsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="BookingsScreen" component={BookingsScreen} />
      <Stack.Screen name="BookingCartScreen" component={BookingCartScreen} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
      <Stack.Screen name="FAQsScreen" component={FAQsScreen} />
    </Stack.Navigator>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
};

export default Routes;
