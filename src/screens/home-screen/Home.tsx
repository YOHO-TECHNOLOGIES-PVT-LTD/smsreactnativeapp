import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Header from '~/components/Header';
import { COLORS, FONTS, icons, screens, SIZES } from '~/constants';
import IconButton from '~/components/IconButton';
import { setSelectedTab } from '~/store/tab/tabSlice';
import AutoSlidingCarousel from '~/components/HomePage/AutoSlidingCarousel';
import { ImageBackground } from 'react-native';
import { getAllSpareParts } from '~/features/spare-parts/service';
import { getAllServices } from '~/features/services-page/service';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const scrollInterval = useRef<NodeJS.Timeout>(null);
  const [spareParts, setSpareParts] = useState([]);
  const [services, setServices] = useState([]);

  const fetchSpareParts = async () => {
    try {
      const response = await getAllSpareParts('');
      if (response) {
        setSpareParts(response.data.data);
        console.log('Spare parts fetched successfully:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await getAllServices('');
      if (response) {
        setServices(response.data.data);
        console.log('Services fetched successfully:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchSpareParts();
    fetchServices();
  }, []);

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

  // const services = [
  //   { id: '1', name: 'Car Wash', icon: 'local-car-wash' },
  //   { id: '2', name: 'AC Service', icon: 'ac-unit' },
  //   { id: '3', name: 'Battery', icon: 'battery-charging-full' },
  //   { id: '4', name: 'Tyre Care', icon: 'settings' },
  //   { id: '5', name: 'Denting', icon: 'build' },
  //   { id: '6', name: 'Insurance', icon: 'security' },
  // ];

  const offers = [
    { id: '1', title: 'Free Pickup & Drop', discount: 'On all services above ₹2000' },
    { id: '2', title: 'Refer & Earn', discount: 'Get ₹500 for every referral' },
    { id: '3', title: 'Festive Special', discount: 'Extra 10% off this week' },
  ];

  // const spareParts = [
  //   {
  //     id: '1',
  //     name: 'Battery',
  //     price: '₹450',
  //     oem: 'Bosch',
  //     image: require('../../assets/sparepartsimage/parts/battery.jpg'),
  //   },
  //   {
  //     id: '2',
  //     name: 'Brake Pads',
  //     price: '₹1200',
  //     oem: 'Brembo',
  //     image: require('../../assets/sparepartsimage/parts/brakepads.jpg'),
  //   },
  //   {
  //     id: '3',
  //     name: 'Exhaust System',
  //     price: '₹600',
  //     oem: 'Mahle',
  //     image: require('../../assets/sparepartsimage/parts/exhaust.jpg'),
  //   },
  //   {
  //     id: '4',
  //     name: 'Engine',
  //     price: '₹600',
  //     oem: 'Mahle',
  //     image: require('../../assets/sparepartsimage/parts/engine.jpg'),
  //   },
  //   {
  //     id: '5',
  //     name: 'Interior',
  //     price: '₹600',
  //     oem: 'Mahle',
  //     image: require('../../assets/sparepartsimage/parts/interior.jpg'),
  //   },
  //   {
  //     id: '6',
  //     name: 'Suspension',
  //     price: '₹600',
  //     oem: 'Mahle',
  //     image: require('../../assets/sparepartsimage/parts/suspension.jpg'),
  //   },
  // ];

  const blogs = [
    { id: '1', title: '5 Signs Your Car Needs Service', date: '15 May 2023' },
    { id: '2', title: 'How to Maintain Your Car Battery', date: '22 May 2023' },
    { id: '3', title: 'Choosing the Right Engine Oil', date: '30 May 2023' },
  ];

  useEffect(() => {
    scrollInterval.current = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % banners.length;
      setCurrentBannerIndex(nextIndex);
      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(scrollInterval.current);
  }, [currentBannerIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentBannerIndex(index);
  };

  const renderBannerItem = ({ item }: { item: (typeof banners)[0] }) => (
    <View style={{ width, paddingHorizontal: 16 }}>
      <View style={styles.bannerContainer}>
        <Image source={item.image} style={styles.bannerImage} />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>{item.cta}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <Header
        containerStyle={{
          height: 50,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
        }}
        leftComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: COLORS.grey60,
            }}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Image source={icons.menu} style={{ width: 20, height: 20 }} resizeMode="contain" />
          </TouchableOpacity>
        }
        rightComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon={icons.notification}
              containerStyle={{
                borderWidth: 0.5,
                borderRadius: 25,
                borderColor: COLORS.primary,
              }}
              onPress={() => {
                navigation.navigate('NotificationScreen' as never);
              }}
            />

            <TouchableOpacity
              style={{
                borderRadius: SIZES.radius,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                dispatch(setSelectedTab(screens.profile));
              }}>
              <Image
                source={require('../../assets/images/profile_picture.jpg')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: SIZES.body2,
                }}
                onError={() => setError(true)}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={{ borderBottomWidth: 3, borderColor: COLORS.primary }}></View>
      <Animated.ScrollView
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <ImageBackground source={icons.home_background} style={{ paddingHorizontal: 10 }}>
          {/* Search Bar */}
          <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color="#666" />
              <TextInput style={styles.searchText} placeholder="Search..." />
            </View>
          </Animated.View>

          <View>
            <AutoSlidingCarousel />
          </View>

          {/* Banner Carousel */}
          {/* <View style={styles.section}>
        <FlatList
          ref={bannerRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderBannerItem}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        <View style={styles.indicatorContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === currentBannerIndex && styles.activeIndicator]}
            />
          ))}
        </View>
      </View> */}

          {/* Quick Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <View style={styles.servicesGrid}>
              {services.map((item) => (
                <TouchableOpacity key={item._id} style={styles.serviceItem1}>
                  <MaterialIcons name={item.icon} size={28} color={COLORS.primary_text} />
                  <Text style={styles.serviceText}> {item.category_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Available Spare Parts */}
          <View style={[styles.section, { marginTop: -10 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Spare Parts</Text>
              <TouchableOpacity onPress={() => dispatch(setSelectedTab(screens.spare_parts))}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Original OEM parts with warranty</Text>

            <View style={styles.partsContainer1}>
              {spareParts.map((item) => (
                <View	key={item._id} style={styles.partCard1}>
                  <Image source={item.image} style={styles.partImage} />
                  <View style={styles.partDetails}>
                  <Text style={styles.partName}>{item.productName}</Text>
                  <Text style={styles.partOem}>Brand: {item.brand}</Text>
                  <Text style={styles.partPrice}>₹{item.price}</Text>
                    <TouchableOpacity style={styles.partButton}>
                      <Text style={styles.partButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
          <View style={[styles.section]}>
            <View style={[styles.sectionHeader, { marginBottom: 15 }]}>
              <Text style={styles.sectionTitle}>Blog & Articles</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.blogsContainer}>
              {blogs.map((blog) => (
                <TouchableOpacity key={blog.id} style={styles.blogCard}>
                  <Image
                    source={require('../../assets/service-images/generalservice.png')}
                    style={styles.blogImage}
                  />
                  <View style={styles.blogContent}>
                    <Text style={styles.blogTitle}>{blog.title}</Text>
                    <Text style={styles.blogDate}>{blog.date}</Text>
                    <Text style={styles.blogReadMore}>Read More →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Special Offers */}
          <View style={[styles.section, { marginTop: -10 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Special Offers</Text>
            <View style={styles.offersContainer}>
              {offers.map((offer) => (
                <Animated.View key={offer.id} style={[styles.offerCard, { opacity: fadeAnim }]}>
                  <View style={styles.offerBadge}>
                    <FontAwesome name="tag" size={16} color={COLORS.white} />
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
          <View style={{ marginTop: 80 }}></View>
        </ImageBackground>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    marginVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 5,
    elevation: 2,
  },
  searchText: {
    marginLeft: 8,
    color: '#666',
    ...FONTS.body4,
  },
  section: {
    marginVertical: 25,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  sectionSubtitle: {
    ...FONTS.body4,
    color: '#666',
    marginBottom: 12,
  },
  seeAll: {
    color: COLORS.primary,
    ...FONTS.h5,
    textDecorationLine: 'underline',
  },
  bannerContainer: {
    width: width - 16,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 8,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  bannerButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCC',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
    width: 12,
  },
  servicesContainer: {
    paddingVertical: 8,
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
  serviceText: {
    marginTop: 8,
    ...FONTS.h5,
    color: COLORS.primary_borders,
    textAlign: 'center',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  offerCard: {
    width: '48%',
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
    backgroundColor: COLORS.primary_01,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTitle: {
    ...FONTS.h5,
    color: COLORS.primary_text,
    marginBottom: 4,
  },
  offerDiscount: {
    ...FONTS.body6,
    color: '#666',
    marginBottom: 12,
  },
  offerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  offerButtonText: {
    color: COLORS.white,
    ...FONTS.h6,
  },
  referContainer: {
    height: 160,
    marginBottom: 25,
    position: 'relative',
    borderRadius: 5,
  },
  referBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
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
    borderRadius: 5,
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
    width: 150,
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
    height: 100,
    resizeMode: 'cover',
    backgroundColor: '#F5F5F5',
  },
  partDetails: {
    padding: 12,
  },
  partName: {
    ...FONTS.h4,
    color: COLORS.primary_text,
    marginBottom: 4,
  },
  partOem: {
    ...FONTS.body5,
    color: '#666',
    marginBottom: 4,
  },
  partPrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: 8,
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
    backgroundColor: '#F9F9F9',
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
    marginTop: 12,
  },
  blogCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
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
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderRadius: 5,
  },
  footerCtaText: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: 8,
  },
  footerCtaButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  footerCtaButtonText: {
    color: COLORS.primary,
    ...FONTS.h5,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  serviceItem1: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  partsContainer1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 5,
  },

  partCard1: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HomeScreen;
 