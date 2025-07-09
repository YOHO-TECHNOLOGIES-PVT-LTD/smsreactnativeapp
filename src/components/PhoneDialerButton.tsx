import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { COLORS } from '~/constants';

const PhoneDialerButton = () => {
  const phoneNumber = '+91-9876543210';

  const handlePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Feather name="phone-call" size={22} color={COLORS.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PhoneDialerButton;
