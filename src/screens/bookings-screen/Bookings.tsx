import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS, icons, SIZES, SPACING } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import BookingCard from '~/components/Bookings/BookingCard';
import { getAllBookingsCartItems } from '~/features/bookings/service';

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

interface Order {
  _id: string;
  amount: number;
  confirm_Date: string;
  customerId: string;
  products: Product[];
  status: string;
  uuid: string;
}

const Bookings = () => {
  const navigate = useNavigation();
  const [tab, setTab] = useState<'All Orders' | 'Spare Parts' | 'Services'>('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllBookingsCartItems({});
        if (response?.success && response?.productConfirm) {
          setOrders(response.productConfirm);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Transform API data to match your BookingCard component's expected format
  const transformOrderData = (order: Order) => {
    return order.products.map((product, index) => ({
      id: `${order._id}-${index}`,
      orderId: order._id,
      name: product.productId?.productName || 'Unknown Product',
      imageUrl: product.productId?.image || '',
      description: product.productId?.description || 'No description available',
      date: order.confirm_Date,
      price: parseFloat(product.price) * product.quantity,
      warranty: product.productId?.warrantyPeriod || 'No warranty',
      quantity: product.quantity,
      status: order.status,
      type: 'spare' as const,
    }));
  };

  const allOrderItems = orders.flatMap(transformOrderData);

  const filteredOrders = allOrderItems.filter((order) => {
    const matchesTab =
      tab === 'All Orders' ||
      (tab === 'Spare Parts' && order.type === 'spare') ||
      (tab === 'Services' && order.type === 'service');

    const matchesSearch =
      searchQuery === '' ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Counts for the summary cards
  const totalOrders = allOrderItems.length;
  const completedOrders = allOrderItems.filter((order) => order.status === 'completed').length;
  const pendingOrders = allOrderItems.filter((order) => order.status === 'pending').length;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={icons.home_background}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.bookingsContainer}>
          <TouchableOpacity onPress={() => navigate.goBack()}>
            <Image source={icons.back} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>

          <View>
            <Text style={{ ...FONTS.h1, color: COLORS.primary_text }}>My Orders</Text>
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
              <Text style={{ ...FONTS.h4, color: COLORS.support1 }}>{totalOrders}</Text>
              <Text style={styles.text}>Total Orders</Text>
            </View>
            <View style={styles.countCard}>
              <Text style={{ color: COLORS.success_lightgreen, ...FONTS.h4 }}>
                {completedOrders}
              </Text>
              <Text style={styles.text}>Completed</Text>
            </View>
            <View style={styles.countCard}>
              <Text style={{ ...FONTS.h4, color: COLORS.primary }}>{pendingOrders}</Text>
              <Text style={styles.text}>Pending</Text>
            </View>
          </View>

          {/* Search and Tabs */}
          <View style={styles.tabContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for your orders..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.grey}
              />
              <Image source={icons.search} style={styles.searchIcon} tintColor={COLORS.grey} />
            </View>

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
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={{ ...FONTS.body3, color: COLORS.grey }}>Loading orders...</Text>
            </View>
          ) : filteredOrders.length > 0 ? (
            <FlatList
              data={filteredOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BookingCard
                  data={item}
                  onPress={() => {
                    // Add navigation to order details if needed
                  }}
                />
              )}
              contentContainerStyle={styles.ordersList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={{ ...FONTS.body3, color: COLORS.grey }}>
                {searchQuery ? 'No matching orders found' : 'No orders found'}
              </Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  bookingsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.small,
    paddingTop: SPACING.small,
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
    ...FONTS.body4,
    color: COLORS.primary_text,
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
