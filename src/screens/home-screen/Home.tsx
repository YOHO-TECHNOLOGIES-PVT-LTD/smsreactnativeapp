import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, icons, screens } from '~/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ImageCarousel from '~/components/HomePage/ImageCarousel';
import AnimatedSearch from '~/components/HomePage/AnimatedSearch';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const services = [
  { id: '1', name: 'Car Services', icon: 'directions-car' },
  { id: '2', name: 'AC Service & Repair', icon: 'ac-unit' },
  { id: '3', name: 'Batteries', icon: 'battery-charging-full' },
  { id: '4', name: 'Tyres & Wheel Care', icon: 'settings' },
  { id: '5', name: 'Denting & Painting', icon: 'build' },
  { id: '6', name: 'Insurance Claims', icon: 'security' },
  { id: '7', name: 'Clutch & Body Parts', icon: 'view-in-ar' },
  { id: '8', name: 'Suspension & Fitments', icon: 'plumbing' },
  { id: '9', name: 'Car Inspections', icon: 'car-repair' },
  { id: '10', name: 'Windshield & Lights', icon: 'highlight' },
  { id: '11', name: 'Car Spa & Cleaning', icon: 'local-car-wash' },
  { id: '12', name: 'Detailing Services', icon: 'policy' },
];

const banners = [
  {
    id: '1',
    title: 'Premium Car Wash',
    subtitle: 'Get 30% off on your first booking',
    image: require('../../assets/service-images/generalservice.png'),
    cta: 'Book Now',
  },
  {
    id: '2',
    title: 'Annual Maintenance',
    subtitle: 'Comprehensive checkup package',
    image: require('../../assets/service-images/generalservice.png'),
    cta: 'Learn More',
  },
  {
    id: '3',
    title: 'Genuine Spare Parts',
    subtitle: 'Original OEM parts with warranty',
    image: require('../../assets/service-images/generalservice.png'),
    cta: 'Shop Now',
  },
];

const offers = [
  { id: '1', title: 'Free Pickup & Drop', discount: 'On all services above ₹2000' },
  { id: '2', title: 'Refer & Earn', discount: 'Get ₹500 for every referral' },
  { id: '3', title: 'Festive Special', discount: 'Extra 10% off this week' },
  { id: '4', title: 'Membership Combo', discount: 'Get ₹800 for every referral' },
];

const spareParts = [
  {
    id: '1',
    name: 'Battery',
    price: '₹450',
    oem: 'Bosch',
    image: require('../../assets/sparepartsimage/parts/battery.jpg'),
  },
  {
    id: '2',
    name: 'Brake Pads',
    price: '₹1200',
    oem: 'Brembo',
    image: require('../../assets/sparepartsimage/parts/brakepads.jpg'),
  },
  {
    id: '3',
    name: 'Exhaust System',
    price: '₹600',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/exhaust.jpg'),
  },
  {
    id: '4',
    name: 'Engine',
    price: '₹750',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/engine.jpg'),
  },
  {
    id: '5',
    name: 'Interior',
    price: '₹470',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/interior.jpg'),
  },
  {
    id: '6',
    name: 'Suspension',
    price: '₹300',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/suspension.jpg'),
  },
];

const blogs = [
  { id: '1', title: '5 Signs Your Car Needs Service', date: '15 May 2023' },
  { id: '2', title: 'How to Maintain Your Car Battery', date: '22 May 2023' },
  { id: '3', title: 'Choosing the Right Engine Oil', date: '30 May 2023' },
];

const HomePage = () => {
  const searchContent = ['Warranty', 'Dent Paint', 'Periodic Services', 'Miles', 'Top Assist'];
  const [searchIndex, setSearchIndex] = useState(0);
  const [search, setSearch] = useState(searchContent[0]);
  const dispatch = useDispatch();
  const [showAddress, setShowAddress] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const scrollInterval = useRef<NodeJS.Timeout>(null);
  const navigation = useNavigation();
  const blogsImage = [
    require('../../assets/sparepartsimage/category/lighting.jpg'),
    require('../../assets/sparepartsimage/category/battery.jpg'),
    require('../../assets/sparepartsimage/category/engine.jpg'),
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Set up interval to rotate through search terms
    const interval = setInterval(() => {
      setSearchIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % searchContent.length;
        setSearch(searchContent[newIndex]);
        return newIndex;
      });
    }, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const images = [icons.promo1, icons.promo2, icons.promo3];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 1,
            }}>
            <Image
              source={require('../../assets/home/LOGO.png')}
              style={{ width: 145, height: 25 }}
            />
            <TouchableOpacity
              onPress={() => setShowAddress(!showAddress)}
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                gap: 5,
                justifyContent: 'flex-end',
              }}>
              <FontAwesome name="location-arrow" size={18} color="black" />
              <Text style={styles.title}>Keelkattalai</Text>
            </TouchableOpacity>
          </View>
          {
            <Text style={[styles.subtitle, { textAlign: 'right' }]}>
              Chennai, Tamil Nadu 600117, India
            </Text>
          }
          {/* Search Bar */}
          <AnimatedSearch />
        </View>
        <ScrollView>
          {/* Image Carousel */}
          <View style={{ backgroundColor: COLORS.grey08, paddingVertical: 10 }}>
            <ImageCarousel images={images} />
          </View>

          {/* Services */}
          <View style={styles.section}>
            <View style={styles.servicesGrid}>
              {services.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.serviceItem1}
                  onPress={() => dispatch(setSelectedTab(screens.services))}>
                  <MaterialIcons name={item.icon} size={28} color={COLORS.primary_02} />
                  <Text style={styles.serviceText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Available Spare Parts */}
          <View style={[styles.section, { padding: 15, backgroundColor: COLORS.grey20 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Spare Parts</Text>
              <TouchableOpacity onPress={() => dispatch(setSelectedTab(screens.spare_parts))}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Original OEM parts with warranty</Text>

            <ScrollView
              style={styles.partsContainer1}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 195 }} // Extra padding at end
            >
              {spareParts.map((item) => (
                <View key={item.id} style={styles.partCard1}>
                  <Image source={item.image} style={styles.partImage} />
                  <View style={styles.partDetails}>
                    <Text style={styles.partName}>{item.name}</Text>
                    <Text style={styles.partOem}>{item.oem}</Text>
                    <Text style={styles.partPrice}>{item.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Special Offers */}
          <View style={[styles.section, { padding: 15, backgroundColor: COLORS.grey08 }]}>
            <Text style={[styles.sectionTitle, {}]}>Special Offers</Text>
            <View style={styles.offersContainer}>
              {offers.map((offer) => (
                <Animated.View key={offer.id} style={[styles.offerCard, { opacity: fadeAnim }]}>
                  <View style={styles.offerBadge}>
                    <FontAwesome name="tag" size={14} color={COLORS.white} />
                  </View>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDiscount}>{offer.discount}</Text>
                  <TouchableOpacity style={styles.offerButton}>
                    <Text style={styles.offerButtonText}>Claim Offer</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Guarantee Terms */}
          <View style={styles.guaranteeContainer}>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="verified" size={28} color="#8B0000" />
              <Text style={styles.guaranteeText}>100% Genuine Parts</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="security" size={28} color="#8B0000" />
              <Text style={styles.guaranteeText}>6 Months Warranty</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="money-off" size={28} color="#8B0000" />
              <Text style={styles.guaranteeText}>Price Match Guarantee</Text>
            </View>
          </View>

          {/* Blog Posts */}
          <View style={[styles.section, { padding: 15 }]}>
            <View style={[styles.sectionHeader, { marginBottom: 5 }]}>
              <Text style={styles.sectionTitle}>Blog & Articles</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.blogsContainer}>
              {blogs.map((blog, index) => (
                <TouchableOpacity key={blog.id} style={styles.blogCard}>
                  <Image source={blogsImage[index]} style={styles.blogImage} />
                  <View style={styles.blogContent}>
                    <Text style={styles.blogTitle}>{blog.title}</Text>
                    <Text style={styles.blogDate}>{blog.date}</Text>
                    <Text style={styles.blogReadMore}>Read More →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Refer & Earn */}
          <View style={styles.referContainer}>
            <Image
              source={require('../../assets/service-images/generalservice.png')}
              style={styles.referBg}
            />
            <View style={styles.referContent}>
              <Text style={styles.referTitle}>Refer & Earn</Text>
              <Text style={styles.referText}>Get ₹500 for every friend who books a service</Text>
              <TouchableOpacity style={styles.referButton}>
                <Text style={styles.referButtonText}>Invite Friends</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer CTA */}
          <View style={styles.footerCta}>
            <Text style={styles.footerCtaText}>Need help? Chat with our experts</Text>
            <TouchableOpacity style={styles.footerCtaButton}>
              <Text style={styles.footerCtaButtonText}>Chat Now</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 65 }}></View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.grey,
    marginBottom: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 5,
    paddingLeft: 10,
    marginTop: 10,
    elevation: 5,
  },
  searchText: {
    marginLeft: 7,
    color: '#666',
    fontSize: 12,
  },
  promoBanner: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  promoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoText: {
    color: '#fff',
    fontSize: 16,
  },
  promoDiscount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  bookNowButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  bookNowText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  discountTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.primary_text,
    fontWeight: 500,
  },
  sectionSubtitle: {
    ...FONTS.body6,
    color: COLORS.grey80,
    marginVertical: 5,
  },
  servicesContainer: {
    paddingVertical: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  serviceItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceItem1: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: 500,
    textAlign: 'center',
  },
  seeAll: {
    color: COLORS.primary_text,
    ...FONTS.h6,
    fontWeight: 500,
    textDecorationLine: 'underline',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  offerCard: {
    width: '48%',
    height: 125,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offerBadge: {
    position: 'absolute',
    top: -10,
    right: -8,
    backgroundColor: COLORS.primary,
    width: 25,
    height: 25,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTitle: {
    ...FONTS.h5,
    color: COLORS.primary_text,
    fontWeight: 500,
  },
  offerDiscount: {
    ...FONTS.body6,
    color: COLORS.grey,
    marginBottom: 10,
  },
  offerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  offerButtonText: {
    color: COLORS.white,
    ...FONTS.h6,
    fontWeight: 500,
  },
  referContainer: {
    height: 160,
    position: 'relative',
  },
  referBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  referContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 24,
    justifyContent: 'center',
  },
  referTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: 8,
  },
  referText: {
    ...FONTS.body5,
    color: COLORS.white,
    marginBottom: 16,
  },
  referButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  referButtonText: {
    color: COLORS.white,
    ...FONTS.h5,
    marginRight: 8,
  },
  partsContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  partCard: {
    width: 180,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  partImage: {
    width: '100%',
    height: 45,
    borderRadius: 5,
    resizeMode: 'cover',
    backgroundColor: '#F5F5F5',
  },
  partDetails: {
    // padding: 10,
  },
  partName: {
    ...FONTS.h6,
    color: COLORS.primary_text,
    fontWeight: 500,
    lineHeight: 12,
    marginTop: 5,
  },
  partOem: {
    ...FONTS.body7,
    color: '#666',
    marginVertical: 4,
  },
  partPrice: {
    ...FONTS.h6,
    color: COLORS.primary,
    fontWeight: 500,
    // marginBottom: 8,
  },
  partButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  partButtonText: {
    color: COLORS.white,
    ...FONTS.h5,
  },
  guaranteeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 5,
    backgroundColor: COLORS.grey20,
    borderRadius: 8,
  },
  guaranteeItem: {
    alignItems: 'center',
    width: '30%',
  },
  guaranteeText: {
    ...FONTS.body6,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  blogsContainer: {
    marginTop: 10,
  },
  blogCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blogImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  blogContent: {
    flex: 1,
    padding: 12,
  },
  blogTitle: {
    ...FONTS.h5,
    color: '#333',
    marginBottom: 4,
  },
  blogDate: {
    ...FONTS.body6,
    color: '#666',
    marginBottom: 8,
  },
  blogReadMore: {
    color: COLORS.primary,
    ...FONTS.h6,
  },
  footerCta: {
    padding: 15,
    backgroundColor: COLORS.warning08,
    alignItems: 'center',
    borderRadius: 5,
  },
  footerCtaText: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: 8,
  },
  footerCtaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  footerCtaButtonText: {
    color: COLORS.white,
    ...FONTS.h5,
    fontWeight: 500,
  },
  partsContainer1: {
    flexGrow: 0, // Prevent vertical expansion
    paddingVertical: 10,
  },

  partCard1: {
    width: '25%',
    backgroundColor: COLORS.white,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HomePage;
