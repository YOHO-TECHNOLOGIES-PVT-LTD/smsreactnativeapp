import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Grid1 from '../../components/Bookings/Grid1';
import { COLORS, FONTS } from '~/constants';

const Settings = () => {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Booking Cart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Grid1 />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.h3,
    marginLeft: 12,
    color: COLORS.white,
  },
});
