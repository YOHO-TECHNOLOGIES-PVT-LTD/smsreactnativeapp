import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, icons } from '~/constants';
import SparePartsPage from '~/components/SpareParts/SparePartsPage';
import { getAllSpareParts } from '~/features/spare-parts/service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/store';
import { getBookingCartItems } from '~/features/booking-cart/redux/thunks';
import { selectCartItems } from '~/features/booking-cart/redux/selectors';
import { selectToken } from '~/features/token/redux/selectors';
import { selectProfile } from '~/features/profile/reducers/selector';
import { getProfileDetailsThunk } from '~/features/profile/reducers/thunks';

const SpareParts = () => {
  const navigation = useNavigation<any>();
  const [spareParts, setSpareParts] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);
  const TokenSelector = useSelector(selectToken);
  const [cartCount, setCartCount] = useState(0);
  const profileData = useSelector(selectProfile);
  const didFetch = useRef(false);

  const getAllSparePartsDetails = async () => {
    try {
      const data = '';
      const response = await getAllSpareParts(data);
      if (response) {
        setSpareParts(response);
      }
    } catch (error) {
      console.log('Error fetching spare parts:', error);
    }
  };

  useEffect(() => {
    getAllSparePartsDetails();
  }, [dispatch]);

  useEffect(() => {
    if (TokenSelector && !didFetch.current) {
      dispatch(getBookingCartItems());
      dispatch(getProfileDetailsThunk({}));
      didFetch.current = true;
    }
  }, [TokenSelector]);

  const onRefreshCartCount = () => {
    const getCartCount = () => {
      if (cartItems?.length == 1) {
        return Number(cartItems[0]?.products?.length) + Number(cartItems[0]?.services?.length);
      } else if (cartItems?.length > 1) {
        return (
          Number(cartItems[0]?.products?.length) +
          Number(cartItems[0]?.services?.length) +
          Number(cartItems[1]?.products?.length) +
          Number(cartItems[1]?.services?.length)
        );
      } else {
        return 0;
      }
    };
    setCartCount(getCartCount() ?? 0);
  };

  useEffect(() => {
    onRefreshCartCount();
  }, [cartItems]);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            marginBottom: 10,
          }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={require('../../assets/home/LOGO.png')}
              style={{ width: 145, height: 25 }}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 20, marginRight: 5 }}>
            <TouchableOpacity onPress={() => navigation.navigate('BookingsScreen' as never)}>
              <Image
                source={icons.booking_icon}
                style={{ width: 23, height: 23 }}
                tintColor={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('BookingCartScreen' as never)}>
              <Ionicons name="cart-outline" size={26} color={COLORS.primary} />
              <View
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: COLORS.primary,
                  borderRadius: 25,
                  position: 'absolute',
                  right: -2,
                  top: -6,
                }}>
                <Text style={{ color: COLORS.white, textAlign: 'center', ...FONTS.body6 }}>
                  {cartCount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <SparePartsPage
          spareParts={spareParts}
          onRefresh={() => {
            getAllSparePartsDetails();
            onRefreshCartCount();
            dispatch(getBookingCartItems());
            TokenSelector && !didFetch.current && dispatch(getBookingCartItems());
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default SpareParts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
});
