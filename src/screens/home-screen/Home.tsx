import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, icons, screens } from '~/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch, useSelector } from 'react-redux';
import HandShakeAnimation from '~/components/HomePage/HandShakeAnimation';
import toast from '~/utils/toast';
import AnimatedSearch from '~/components/HomePage/AnimatedSearch';
import ImageCarousel from '~/components/HomePage/ImageCarousel';
import { useNavigation } from '@react-navigation/native';
import LoadingAnimation from '~/components/LoadingAnimation';
import { getToken, logout } from '~/features/token/redux/thunks';
import { selectToken } from '~/features/token/redux/selectors';
import { AppDispatch } from '~/store';
import CustomLogoutModal from '~/components/CustomLogoutModal';
import { getAllSpareParts } from '~/features/spare-parts/service';
import { getAllServiceCategories } from '~/features/services-page/service';
import { getAllOffers } from '~/features/Offer/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfileDetails } from '~/features/profile/service';

const chatMessages = [
  { id: '1', sender: 'admin', text: 'Hello! How can I help you today?', time: '10:30 AM' },
  { id: '2', sender: 'user', text: 'I need help with my car AC service', time: '10:32 AM' },
  {
    id: '3',
    sender: 'admin',
    text: 'Sure, we can help with that. What model is your car?',
    time: '10:33 AM',
  },
  {
    id: '4',
    sender: 'admin',
    text: 'We have special offers on AC service this week',
    time: '10:34 AM',
  },
  { id: '5', sender: 'user', text: "It's a Honda City 2018 model", time: '10:36 AM' },
];

const carlogos = [
  icons.carlogo1,
  icons.carlogo3,
  icons.carlogo4,
  icons.carlogo5,
  icons.carlogo6,
  icons.carlogo7,
  icons.carlogo9,
  icons.carlogo10,
  icons.carlogo15,
];

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const blogsImage = [
    require('../../assets/sparepartsimage/category/lighting.jpg'),
    require('../../assets/sparepartsimage/category/battery.jpg'),
    require('../../assets/sparepartsimage/category/engine.jpg'),
    require('../../assets/sparepartsimage/category/tyres.jpg'),
    require('../../assets/sparepartsimage/category/ac.jpg'),
  ];
  const [showOfferApplied, setShowOfferApplied] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const tokenSelector = useSelector(selectToken);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [profileData, setProfileData] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    contact_info: {
      phoneNumber: string;
    };
    vehicleInfo: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    contact_info: {
      phoneNumber: '',
    },
    vehicleInfo: '',
  });

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

  const handleClaimOffer = () => {
    setShowOfferApplied(true);
    setTimeout(() => {
      setShowOfferApplied(false);
    }, 3000);
    toast.success('Offer Applied', 'Your offer has been successfully applied!');
  };

  const handleChatNow = () => {
    setShowChatModal(true);
  };

  const images = [icons.promo1, icons.promo2, icons.promo3, icons.promo4, icons.promo5];

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      dispatch(logout());
      toast.success('Logged out', 'You have been successfully logged out');
      setIsLoading(false);
      setLogoutModalVisible(false);
    } catch (error) {
      toast.error('Logout failed', 'Could not complete logout. Please try again.');
      console.log('Logout error:', error);
    } finally {
      setIsLoading(false);
      setLogoutModalVisible(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response: any = await getUserProfileDetails({});
      if (response) {
        setProfileData(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const fetchAllServices = async () => {
    try {
      const categories = await getAllServiceCategories({});
      if (categories) {
        setServiceCategories(categories);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  };

  const fetchAllOffers = async () => {
    try {
      const response = await getAllOffers();
      if (response) {
        setAnnouncements(response?.data);
      }
    } catch (error) {
      console.log('API Error:', error);
    }
  };

  useEffect(() => {
    getAllSparePartsDetails();
    fetchAllServices();
    fetchAllOffers();
  }, [dispatch]);

  useEffect(() => {
    if (tokenSelector) {
      fetchUserProfile();
    }
  }, [tokenSelector]);

  const handleSubmitEnquiry = () => {
    setShowChatModal(false);
    toast.success('Success', 'Your enquiry submitted successfully!');
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <LoadingAnimation visible={isLoading} />
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
              style={{ width: 145, height: 25, position: 'relative', top: tokenSelector ? 0 : 0 }}
            />
            {tokenSelector ? (
              <View style={{}}>
                <View style={{ flexDirection: 'row' }}>
                  <HandShakeAnimation />
                  <Text style={styles.title}>
                    Hi, {tokenSelector ? profileData?.firstName : 'Customer'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setLogoutModalVisible(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                    marginLeft: 15,
                    marginVertical: 3,
                  }}>
                  <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
                  <Text style={{ fontWeight: 400, ...FONTS.h4, color: COLORS.primary }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoginScreen' as never)}
                  style={{ flexDirection: 'row', gap: 2 }}>
                  <Ionicons name="log-in-outline" size={20} color={COLORS.primary} />
                  <Text style={{ fontWeight: 400, ...FONTS.h4, color: COLORS.primary }}>Login</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Search Bar */}
          <AnimatedSearch />
        </View>
        <ScrollView>
          {/* Image Carousel */}
          <View style={{ backgroundColor: COLORS.primary_04, paddingVertical: 10 }}>
            <ImageCarousel images={images} />
          </View>

          {/* Services */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { padding: 15 }]}>
              <Text style={styles.sectionTitle}>Available Services</Text>
            </View>
            <View style={styles.servicesGrid}>
              {serviceCategories?.length ? (
                serviceCategories?.slice(0, 12)?.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.serviceItem1}
                    onPress={() => dispatch(setSelectedTab(screens.services))}>
                    <MaterialIcons name="directions-car" size={28} color={COLORS.primary_02} />
                    <Text style={styles.serviceText}>{item?.category_name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: -15,
                  }}>
                  <Text style={{ ...FONTS.body5 }}>No Services available</Text>
                </View>
              )}
            </View>
          </View>

          {/* Available Spare Parts */}
          <View style={[styles.section, { padding: 15, backgroundColor: COLORS.primary_03 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Spare Parts</Text>
              <TouchableOpacity onPress={() => dispatch(setSelectedTab(screens.spare_parts))}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Original OEM parts with warranty</Text>

            {spareParts?.length ? (
              <ScrollView
                style={styles.partsContainer1}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}>
                {spareParts?.slice(0, 10)?.map((item: any) => (
                  <View key={item?._id} style={[styles.partCard1, { width: 120 }]}>
                    <Image source={item?.image} style={styles.partImage} />
                    <View style={styles.partDetails}>
                      <Text style={styles.partName}>{item?.productName?.substring(0, 15)}</Text>
                      <Text style={styles.partOem}>{item?.brand}</Text>
                      <Text style={styles.partPrice}>₹{item.price}</Text>
                      <Text style={styles.stock}>
                        {item.inStock === true ? 'In Stock' : 'Out of Stock'}({item?.stock})
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{ ...FONTS.body5 }}>No spare parts available</Text>
              </View>
            )}
          </View>

          {/* Special Offers */}
          <View style={[styles.section, { padding: 15, backgroundColor: COLORS.grey08 }]}>
            <Text style={[styles.sectionTitle, {}]}>Special Offers</Text>
            <View style={styles.offersContainer}>
              {announcements?.length ? (
                announcements?.map((offer: any) => (
                  <Animated.View key={offer?._id} style={[styles.offerCard, { opacity: fadeAnim }]}>
                    <View style={styles.offerBadge}>
                      <FontAwesome name="tag" size={14} color={COLORS.white} />
                    </View>
                    <Image
                      source={offer?.image}
                      style={{
                        width: '100%',
                        height: 75,
                        backgroundColor: COLORS.primary_04,
                        borderRadius: 5,
                        marginBottom: 5,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.offerTitle}>{offer?.title?.substring(0, 12)}</Text>
                      <Text style={[styles.offerDiscount, { color: COLORS.success_lightgreen }]}>
                        {' '}
                        Offer: ₹{offer?.offer}
                      </Text>
                    </View>
                    <Text style={styles.offerDiscount}>{offer?.description?.substring(0, 15)}</Text>
                    <TouchableOpacity style={styles.offerButton} onPress={handleClaimOffer}>
                      <Text style={styles.offerButtonText}>Claim Offer</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{ ...FONTS.body5 }}>No offers available</Text>
                </View>
              )}
            </View>
          </View>

          {/* Offer Applied Toast */}
          {showOfferApplied && (
            <View style={[styles.toastContainer, { top: 100 }]}>
              <Text style={styles.toastText}>Offer Applied Successfully!</Text>
            </View>
          )}

          {/* Guarantee Terms */}
          <View style={styles.guaranteeContainer}>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="verified" size={28} color={COLORS.primary_02} />
              <Text style={styles.guaranteeText}>100% Genuine Parts</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="security" size={28} color={COLORS.primary_02} />
              <Text style={styles.guaranteeText}>6 Months Warranty</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="money-off" size={28} color={COLORS.primary_02} />
              <Text style={styles.guaranteeText}>Price Match Guarantee</Text>
            </View>
          </View>

          {/* Original Spare parnter */}
          <View style={styles.spareparnterConatiner}>
            <View>
              <Text style={{ ...FONTS.h3, fontWeight: 500, color: COLORS.primary_text }}>
                Authorized Spare Parts
              </Text>
              <Text style={{ ...FONTS.body5, color: COLORS.black, marginVertical: 5 }}>
                Beyond Standard Warranty - YesMechanic Assurance
              </Text>
            </View>
            <ScrollView
              style={{}}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{}}>
              {carlogos.map((item, index) => (
                <View key={index} style={{ width: 55, paddingVertical: 15, paddingRight: 5 }}>
                  <Image source={item} style={styles.carLogoImage} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Footer CTA */}
          <View style={styles.footerCta}>
            <Text style={styles.footerCtaText}>Have Questions About Our Services?</Text>
            <Text style={{ ...FONTS.body5, textAlign: 'justify', marginBottom: 10 }}>
              Click Enquiry
            </Text>
            <TouchableOpacity style={styles.footerCtaButton} onPress={handleChatNow}>
              <Text style={styles.footerCtaButtonText}>Enquiry</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 65 }}></View>
        </ScrollView>

        {/* Chat Modal */}
        <View>
          <Modal
            visible={showChatModal}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setShowChatModal(false)}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => setShowChatModal(false)}>
                  <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Enquiry Form</Text>
                <TouchableOpacity style={{}}>
                  <Image
                    source={icons.menu_dots}
                    style={{ width: 25, height: 25 }}
                    tintColor={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.chatContainer}
                keyboardVerticalOffset={80}>
                <View style={{ padding: 15 }}>
                  <View style={{ flexDirection: 'column', gap: 7, marginVertical: 7 }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Full Name *</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.primary_04,
                        paddingHorizontal: 10,
                        color: COLORS.primary,
                        ...FONTS.body4,
                      }}
                      value={profileData?.firstName + " " + profileData?.lastName}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', gap: 7, marginVertical: 7 }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Email *</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.primary_04,
                        paddingHorizontal: 10,
                        color: COLORS.primary,
                        ...FONTS.body4,
                      }}
                      value={profileData?.email}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', gap: 7, marginVertical: 7 }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Phone Number *</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.primary_04,
                        paddingHorizontal: 10,
                        color: COLORS.primary,
                        ...FONTS.body4,
                      }}
                      value={profileData?.contact_info?.phoneNumber}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', gap: 7, marginVertical: 7 }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Car Details *</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.primary_04,
                        paddingHorizontal: 10,
                        color: COLORS.primary,
                        ...FONTS.body4,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', gap: 7, marginVertical: 7 }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Service Type *</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.primary_04,
                        paddingHorizontal: 10,
                        color: COLORS.primary,
                        ...FONTS.body4,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', gap: 7, marginVertical: 7 }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>
                      Preferred Service Date *
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.primary_04,
                        paddingHorizontal: 10,
                        color: COLORS.primary,
                        ...FONTS.body4,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', gap: 7, marginVertical: 7 }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Your Enquiry *</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: COLORS.primary_04,
                        paddingHorizontal: 10,
                        color: COLORS.primary,
                        ...FONTS.body4,
                      }}
                    />
                  </View>
                  <View
                    style={{ marginVertical: 12, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.primary,
                        borderRadius: 12,
                        width: '30%',
                        padding: 10,
                      }}
                      onPress={handleSubmitEnquiry}>
                      <Text
                        style={{
                          ...FONTS.body4,
                          color: COLORS.white,
                          textAlign: 'center',
                          fontWeight: 500,
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </Modal>
        </View>

        <View>
          <CustomLogoutModal
            visible={logoutModalVisible}
            onConfirm={handleLogout}
            onCancel={() => setLogoutModalVisible(false)}
            title="Confirm Logout"
            message="Are you sure, you want to log out?"
            confirmText="Yes, Logout"
            cancelText="No, Stay"
            confirmButtonColor={COLORS.primary}
            cancelButtonColor={COLORS.transparent}
            titleTextColor={COLORS.primary}
            messageTextColor={COLORS.grey}
          />
        </View>
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
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 12,
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
    fontWeight: '500',
  },
  sectionSubtitle: {
    ...FONTS.body6,
    color: COLORS.black,
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
    fontWeight: '500',
    textAlign: 'center',
  },
  seeAll: {
    color: COLORS.primary_text,
    ...FONTS.h6,
    fontWeight: '500',
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
    // height: 100,
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
    fontWeight: '500',
  },
  offerDiscount: {
    ...FONTS.body6,
    color: COLORS.black,
  },
  offerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: 15,
  },
  offerButtonText: {
    color: COLORS.white,
    ...FONTS.h6,
    fontWeight: '500',
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
    height: 80,
    borderRadius: 5,
    resizeMode: 'cover',
    backgroundColor: COLORS.primary_04,
  },
  carLogoImage: {
    width: 55,
    height: 55,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  partDetails: {
    padding: 5,
  },
  partName: {
    ...FONTS.h6,
    color: COLORS.primary_text,
    fontWeight: '500',
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
    fontWeight: '500',
  },
  stock: {
    ...FONTS.h6,
    color: COLORS.success_lightgreen,
    fontWeight: '500',
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
    backgroundColor: COLORS.primary_04,
  },
  guaranteeItem: {
    alignItems: 'center',
    width: '30%',
  },
  guaranteeText: {
    ...FONTS.body6,
    color: COLORS.primary_text,
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
    fontWeight: '500',
  },
  partsContainer1: {
    marginTop: 10,
  },
  partCard1: {
    backgroundColor: COLORS.white,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 10,
    borderRadius: 8,
  },

  // Toast styles
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
    elevation: 5,
  },
  toastText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey20,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: '600',
    color: COLORS.primary_text,
  },
  closeButton: {
    padding: 5,
  },
  backButton: {
    padding: 5,
  },
  modalContent: {
    padding: 15,
  },

  // Blog modal styles
  blogCardModal: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blogImageModal: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  blogContentModal: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  blogTitleModal: {
    ...FONTS.h5,
    color: COLORS.primary_text,
    marginBottom: 4,
  },
  blogDateModal: {
    ...FONTS.body6,
    color: COLORS.grey,
  },

  // Blog detail styles
  blogDetailContainer: {
    padding: 15,
  },
  blogDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  blogDetailTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: 5,
    fontWeight: 500,
  },
  blogDetailDate: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 15,
  },
  blogDetailContent: {
    ...FONTS.body4,
    color: COLORS.primary_text,
    lineHeight: 22,
    textAlign: 'justify',
  },

  // Invite modal styles
  inviteContent: {
    flex: 1,
    padding: 15,
  },
  inviteText: {
    ...FONTS.body3,
    color: COLORS.primary_text,
    marginBottom: 10,
  },
  contactList: {
    paddingBottom: 80,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey20,
  },
  selectedContact: {
    backgroundColor: COLORS.error08,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...FONTS.h5,
    color: COLORS.primary_text,
  },
  contactPhone: {
    ...FONTS.body6,
    color: COLORS.grey,
    marginTop: 3,
  },
  sendInvitesButton: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.grey,
  },
  sendInvitesText: {
    ...FONTS.h5,
    color: COLORS.white,
    fontWeight: '500',
  },

  // Chat modal styles
  chatContainer: {
    flex: 1,
  },
  chatMessages: {
    padding: 15,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  adminMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.grey20,
    borderBottomLeftRadius: 0,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 0,
  },
  messageText: {
    ...FONTS.body4,
    color: COLORS.primary_text,
  },
  userMessageText: {
    color: COLORS.white,
  },
  messageTime: {
    ...FONTS.body7,
    color: COLORS.grey,
    marginTop: 5,
    textAlign: 'right',
  },
  userMessageTime: {
    color: COLORS.light80,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey20,
    backgroundColor: COLORS.white,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.grey20,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spareparnterConatiner: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});

export default HomePage;
