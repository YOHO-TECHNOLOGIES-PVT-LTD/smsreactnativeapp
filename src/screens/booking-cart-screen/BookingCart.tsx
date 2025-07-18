import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Grid1 from '../../components/Bookings/Grid1';
import { COLORS, FONTS, icons } from '~/constants';
import { getAllBookingCartItems } from '~/features/booking-cart/service';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store';
import { selectToken } from '~/features/token/redux/selectors';
import { getToken } from '~/features/token/redux/thunks';

const Settings = () => {
  const navigation = useNavigation();
  const [bookingCarts, setBookingCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tokenSelector = useSelector(selectToken);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    try {
      setIsLoading(true);
      dispatch(getToken());
      setIsLoading(false);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const fetchAllBookingCarts = async () => {
    const response = tokenSelector && (await getAllBookingCartItems({}));
    if (response) {
      setBookingCarts(response || []);
    }
    try {
    } catch (error) {
      console.log('Error fetching booking carts:', error);
    }
  };

  useEffect(() => {
    if (tokenSelector) {
      fetchAllBookingCarts();
    }
  }, [dispatch, tokenSelector]);

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

          <View style={{ flex: 1 }}>
            <Grid1 bookingCarts={bookingCarts} onChangeCart={fetchAllBookingCarts} />
          </View>
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
