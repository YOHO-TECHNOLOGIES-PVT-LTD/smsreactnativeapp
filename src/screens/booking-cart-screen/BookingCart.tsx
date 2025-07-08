import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Grid1 from '../../components/Bookings/Grid1';
import { COLORS, FONTS, icons } from '~/constants';
import { getAllBookingCartItems } from '~/features/booking-cart/service.ts';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const navigation = useNavigation();
  const [bookingCarts, setBookingCarts] = useState([]);
  const [Token, setToken] = useState<any>('');

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    setToken(token);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchAllBookungCarts = async () => {
    const response = Token && (await getAllBookingCartItems({}));
    setBookingCarts(response || []);
    try {
    } catch (error) {
      console.error('Error fetching booking carts:', error);
    }
  };

  useEffect(() => {
    fetchAllBookungCarts();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            paddingHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Image
            source={require('../../assets/home/LOGO.png')}
            style={{ width: 145, height: 25 }}
          />
          <View style={{ flexDirection: 'row', gap: 15, marginRight: 8 }}>
            <TouchableOpacity onPress={() => navigation.navigate('BookingsScreen' as never)}>
              <Image
                source={icons.booking_icon}
                style={{ width: 23, height: 23 }}
                tintColor={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Booking Cart</Text>
          </View>

          <ScrollView contentContainerStyle={styles.container}>
            <Grid1 bookingCarts={bookingCarts} />
          </ScrollView>
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
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
    fontWeight: 500,
    color: COLORS.white,
  },
});
