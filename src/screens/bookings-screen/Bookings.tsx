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
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { COLORS, FONTS, icons, SIZES, SPACING } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import BookingCard from '~/components/Bookings/BookingCard';

// OrderDetails Interface
interface OrderDetails {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  date?: string;
  price: number;
  compatibility: string;
  type: 'spare' | 'service';
}

// Sample Data - Combined all orders
const allOrders: OrderDetails[] = [
  {
    id: '1',
    name: 'Brake Pad Set',
    price: 1800,
    imageUrl: 'https://mountuneusa.com/cdn/shop/products/2364-BPR-EY-2.jpg?v=1679085769',
    description: 'High-quality ceramic brake pads for safe and smooth braking.',
    date: '2025-01-15', // Future date - In Progress
    compatibility: 'Honda City',
    type: 'spare',
  },
  {
    id: '2',
    name: 'Air Filter Element',
    price: 500,
    imageUrl:
      'https://ix-cdn.b2e5.com/images/27094/27094_64f064db089b431fb5edb0d696b3ee39_1539205525.jpeg',
    description: 'Durable air filter ensuring clean air intake and better mileage.',
    date: '2024-01-10',
    compatibility: 'Hyundai i20',
    type: 'spare',
  },
  {
    id: '3',
    name: 'Engine Oil 5W-30 (3L)',
    price: 700,
    imageUrl:
      'https://www.veedolindia.com/sites/default/files/assets/products/01_TAKE-OFF-4T-RACING-10W-50-SP-MA2.jpg',
    description: 'Premium synthetic oil for high-performance engines.',
    date: '2025-01-20', // Future date - In Progress
    compatibility: 'Universal',
    type: 'spare',
  },
  {
    id: '4',
    name: 'Headlight Assembly',
    price: 900,
    imageUrl: 'https://ragillyspares.com/cdn/shop/files/719k8aSruQL._SL1500.jpg?v=1683808827',
    description: 'Complete headlamp assembly with long-lasting brightness.',
    date: '2023-06-01',
    compatibility: 'Maruti Swift',
    type: 'spare',
  },
  {
    id: '5',
    name: 'Wiper Blade Set',
    price: 1000,
    imageUrl:
      'https://cdn11.bigcommerce.com/s-fqaftp/images/stencil/1280x1280/products/17091/39298/D3WIPEBOSCHA1__94725.1620205879.jpg?c=2?imbypass=on',
    description: 'All-weather wiper blades with streak-free performance.',
    date: '2024-05-20',
    compatibility: 'Toyota Corolla',
    type: 'spare',
  },
  {
    id: '6',
    name: 'Transmission Fluid',
    price: 850,
    imageUrl:
      'https://i5.walmartimages.com/seo/Super-Tech-MERCON-V-Automatic-Transmission-Fluid-1-Quart_f916ff04-41c6-496b-be51-cb2642c23f80.a3727600f85548013ae5d72232f876cf.jpeg',
    description: 'High-performance transmission fluid for smooth gear shifts.',
    date: '2025-01-25', // Future date - In Progress
    compatibility: 'Ford Focus',
    type: 'spare',
  },
  {
    id: '7',
    name: 'Spark Plugs Set',
    price: 1200,
    imageUrl:
      'https://images-cdn.ubuy.co.in/634d135710a6ca0e676a098a-new-ngk-standard-spark-plug-b8hs10-5126.jpg',
    description: 'Premium iridium spark plugs for better engine performance.',
    date: '2025-01-18', // Future date - In Progress
    compatibility: 'Volkswagen Golf',
    type: 'spare',
  },
  {
    id: 's1',
    name: 'Oil Change Service',
    price: 2000,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQxmvTKOLWVAdnoDPRQZTYZJ90KDVlVzMhQA&s',
    description: 'Complete oil change service with premium synthetic oil',
    compatibility: 'First Class Service',
    date: '2025-01-12', // Future date - In Progress
    type: 'service',
  },
  {
    id: 's2',
    name: 'Tire Rotation',
    price: 1000,
    imageUrl:
      'https://allmakescollision.ca/wp-content/uploads/2022/04/heveAdeZhFtnsUOwTf1tUf08fFeRMxMTRuX3IqlD.jpg',
    description: 'Professional tire rotation and balancing service',
    compatibility: 'First Class Service',
    date: '2019-03-01',
    type: 'service',
  },
  {
    id: 's3',
    name: 'Brake Inspection',
    price: 1500,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYfW70xQsp2FOJGbhI_Maejt6jHAdJrQtZuw&s',
    description: 'Comprehensive brake system inspection and maintenance',
    compatibility: 'Premium Service',
    date: '2025-01-22', // Future date - In Progress
    type: 'service',
  },
  {
    id: 's4',
    name: 'AC Service',
    price: 2500,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJhOk79SOrDJDnjXvam5PcDVMQ4MlCsX3h-w&s',
    description: 'Complete air conditioning system service and gas refill',
    compatibility: 'Premium Service',
    date: '2025-01-30', // Future date - In Progress
    type: 'service',
  },
];

const Bookings = () => {
  const navigate = useNavigation();
  const [tab, setTab] = useState<'All Orders' | 'Spare Parts' | 'Services'>('All Orders');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = allOrders.filter((order) => {
    // Filter by tab
    const matchesTab =
      tab === 'All Orders' ||
      (tab === 'Spare Parts' && order.type === 'spare') ||
      (tab === 'Services' && order.type === 'service');

    // Filter by search query (case insensitive)
    const matchesSearch =
      searchQuery === '' ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Counts for the summary cards
  const totalOrders = allOrders.length;
  const completedOrders = allOrders.filter((order) => {
    const orderDate = order.date ? new Date(order.date) : null;
    const today = new Date();
    return orderDate && orderDate < today;
  }).length;
  const pendingOrders = totalOrders - completedOrders;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={icons.home_background} style={styles.container}>
        <View style={styles.bookingsContainer}>
          <TouchableOpacity style={{}} onPress={() => navigate.goBack()}>
            <Image source={icons.back} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <View style={{}}>
            <Text style={{ ...FONTS.h1, color: COLORS.primary_text }}>My Orders</Text>
          </View>
          <Text
            style={{ ...FONTS.body4, color: COLORS.primary_01, marginVertical: SIZES.extraSmall }}>
            Track and manage all your orders in one place
          </Text>

          {/* countcard */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: SIZES.radius,
            }}>
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

          <View style={styles.tabContainer}>
            {/* search bar */}
            <View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for your orders..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Image
                  source={icons.search}
                  style={{ width: 15, height: 15 }}
                  tintColor={COLORS.grey}
                />
              </TouchableOpacity>
            </View>

            {/* ordertabs */}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[
                    styles.tabs,
                    { backgroundColor: tab === 'All Orders' ? COLORS.primary_01 : COLORS.white },
                  ]}
                  onPress={() => setTab('All Orders')}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: tab === 'All Orders' ? COLORS.white : COLORS.primary_text,
                      textAlign: 'center',
                    }}>
                    All Orders
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabs,
                    { backgroundColor: tab === 'Spare Parts' ? COLORS.primary_01 : COLORS.white },
                  ]}
                  onPress={() => setTab('Spare Parts')}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: tab === 'Spare Parts' ? COLORS.white : COLORS.primary_text,
                      textAlign: 'center',
                    }}>
                    Spare Parts
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabs,
                    { backgroundColor: tab === 'Services' ? COLORS.primary_01 : COLORS.white },
                  ]}
                  onPress={() => setTab('Services')}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: tab === 'Services' ? COLORS.white : COLORS.primary_text,
                      textAlign: 'center',
                    }}>
                    Services
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* orderlist */}
          <ScrollView style={{ marginVertical: SIZES.radius }} showsVerticalScrollIndicator={false}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((item, index) => (
                <BookingCard key={index} data={item} onPress={() => {}} />
              ))
            ) : (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={{ ...FONTS.body3, color: COLORS.grey }}>No orders found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Bookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookingsContainer: {
    flex: 1,
    marginBlockStart: SPACING.medium_02,
    paddingHorizontal: SPACING.small,
  },
  countCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    backgroundColor: COLORS.white,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    elevation: 1,
  },
  text: {
    ...FONTS.body4,
    color: COLORS.primary_text,
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey20,
    paddingLeft: 45,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
    height: 45,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    color: COLORS.primary_text,
    ...FONTS.body4,
  },
  searchButton: {
    position: 'absolute',
    left: 5,
    top: 5,
    width: 30,
    height: 30,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
    elevation: 1,
    ...FONTS.body4,
    width: '32%',
  },
  tabContainer: {
    paddingHorizontal: 5,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    borderRadius: SIZES.radius,
  },
});
