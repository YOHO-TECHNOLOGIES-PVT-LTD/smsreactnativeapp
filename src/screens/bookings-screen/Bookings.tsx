import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { COLORS, FONTS, icons, SIZES, SPACING } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import BookingCard from '~/components/Bookings/BookingCard';
import { getAllBookingsCartItems } from '~/features/bookings/service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '~/features/token/redux/selectors';
import { getToken } from '~/features/token/redux/thunks';
import { AppDispatch } from '~/store';
import { selectCartItems } from '~/features/booking-cart/redux/selectors';
import { RefreshControl } from 'react-native';
import { getBookingCartItems } from '~/features/booking-cart/redux/thunks';

interface Product {
  _id: string;
  price: string;
  productId: {
    _id: string;
    productName: string;
    price: string;
    image?: string;
    description?: string;
    warrantyPeriod?: string;
  } | null;
  quantity: number;
}

interface Service {
  _id: string;
  service_name: string;
  description: string;
  price: number;
}

interface Order {
  _id: string;
  amount: number;
  confirm_Date: string;
  customerId: string;
  products?: Product[];
  services?: Service[];
  status: string;
  uuid: string;
}

interface BookingCardItem {
  id: string;
  orderId: string;
  name: string;
  imageUrl: string;
  description: string;
  date: string;
  price: number;
  warranty?: string;
  quantity: number;
  status: string;
  type: 'spare' | 'service';
}

const Bookings = () => {
  const navigate = useNavigation();
  const [tab, setTab] = useState<'All Orders' | 'Spare Parts' | 'Services'>('All Orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const tokenSelector = useSelector(selectToken);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const cartItems = useSelector(selectCartItems);
  const [cartCount, setCartCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const didFetch = useRef(false);

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

  const fetchOrders = async () => {
    try {
      const response = tokenSelector && (await getAllBookingsCartItems({}));
      if (response?.success) {
        const allOrders = [...(response.productConfirm || []), ...(response.serviceConfirm || [])];
        setOrders(allOrders);
      }
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
  };

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
    }
  };

  useEffect(() => {
    setCartCount(getCartCount() ?? 0);
  }, [tokenSelector, cartItems]);

  useEffect(() => {
    if (tokenSelector && !didFetch.current) {
      dispatch(getBookingCartItems());
      fetchOrders();
      didFetch.current = true;
    }
  }, [tokenSelector]);

  const filteredOrders = orders?.filter((order: any) => {
    const matchesTab =
      tab === 'All Orders' ||
      (tab === 'Spare Parts' && order?.products) ||
      (tab === 'Services' && order?.services);
    return matchesTab;
  });

  const totalOrders = orders?.length;
  const completedOrders = orders?.filter(
    (order) => order?.status.toLowerCase() === 'completed'
  )?.length;
  const pendingOrders = orders?.filter(
    (order) => order?.status.toLowerCase() === 'pending'
  )?.length;
  const dispatchOrders = orders?.filter(
    (order) => order?.status === 'Dispatched to Courier'
  )?.length;

  const handleRefresh = async () => {
    if (!tokenSelector) return;
    setRefreshing(true);
    try {
      fetchOrders();
      dispatch(getBookingCartItems());
    } catch (error) {
      console.log('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
        <ImageBackground
          source={icons.home_background}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.bookingsContainer}>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity onPress={() => navigate.goBack()}>
                <Image
                  source={icons.back}
                  style={{ width: 25, height: 25 }}
                  tintColor={COLORS.primary_text}
                />
              </TouchableOpacity>
              <Text style={{ ...FONTS.h2, color: COLORS.primary_text, fontWeight: 500 }}>
                My Orders
              </Text>
            </View>
            <View>
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.primary_01,
                  marginVertical: SIZES.extraSmall,
                }}>
                Track and manage all your orders in one place
              </Text>
            </View>

            {/* Count cards */}
            <View style={styles.countCardsContainer}>
              <View style={styles.countCard}>
                <Text style={{ ...FONTS.h3, color: COLORS.support1, fontWeight: 600 }}>
                  {totalOrders}
                </Text>
                <Text style={styles.text}>Total</Text>
              </View>
              <View style={styles.countCard}>
                <Text style={{ color: COLORS.sucesss_darkgreen, ...FONTS.h3, fontWeight: 600 }}>
                  {completedOrders}
                </Text>
                <Text style={styles.text}>Completed</Text>
              </View>
              <View style={styles.countCard}>
                <Text style={{ color: COLORS.success_lightgreen, ...FONTS.h3, fontWeight: 600 }}>
                  {dispatchOrders}
                </Text>
                <Text style={styles.text}>Dispatch</Text>
              </View>
              <View style={styles.countCard}>
                <Text style={{ ...FONTS.h3, color: COLORS.error, fontWeight: 600 }}>
                  {pendingOrders}
                </Text>
                <Text style={styles.text}>Pending</Text>
              </View>
            </View>

            {/* Search and Tabs */}
            <View style={styles.tabContainer}>
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tabButton, tab === 'All Orders' && styles.activeTabButton]}
                  onPress={() => setTab('All Orders')}>
                  <Text style={[styles.tabText, tab === 'All Orders' && styles.activeTabText]}>
                    All Orders
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, tab === 'Spare Parts' && styles.activeTabButton]}
                  onPress={() => setTab('Spare Parts')}>
                  <Text style={[styles.tabText, tab === 'Spare Parts' && styles.activeTabText]}>
                    Spare Parts
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, tab === 'Services' && styles.activeTabButton]}
                  onPress={() => setTab('Services')}>
                  <Text style={[styles.tabText, tab === 'Services' && styles.activeTabText]}>
                    Services
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Order List */}
            {filteredOrders?.length > 0 ? (
              <FlatList
                data={filteredOrders}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }) => <BookingCard data={item} />}
                contentContainerStyle={styles.ordersList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                  />
                }
              />
            ) : (
              <ScrollView
                contentContainerStyle={styles.emptyContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                  />
                }>
                <Text style={{ ...FONTS.body3, color: COLORS.grey }}>No orders found</Text>
              </ScrollView>
            )}
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

// Keep your existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  bookingsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.small,
    paddingTop: 5,
  },
  countCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.radius,
  },
  countCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginHorizontal: SIZES.extraSmall,
    elevation: 1,
  },
  text: {
    ...FONTS.body5,
    color: COLORS.primary_text,
    fontWeight: 400,
  },
  tabContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.small,
    marginBottom: SIZES.small,
    elevation: 1,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: SIZES.small,
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey20,
    paddingLeft: 45,
    borderRadius: SIZES.radius,
    height: 45,
    backgroundColor: COLORS.white,
    color: COLORS.primary_text,
    ...FONTS.body4,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    width: 15,
    height: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    marginHorizontal: 2,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary_01,
  },
  tabText: {
    ...FONTS.h4,
    color: COLORS.primary_text,
    textAlign: 'center',
    fontWeight: 500,
  },
  activeTabText: {
    color: COLORS.white,
  },
  ordersList: {
    paddingBottom: SIZES.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
});

export default Bookings;
