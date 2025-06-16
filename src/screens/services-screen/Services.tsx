import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
  TextInput,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import { COLORS, FONTS, icons, screens, SIZES } from '~/constants';
import { Ionicons, AntDesign, Foundation, MaterialIcons } from '@expo/vector-icons';
import { Clock, Wrench, Car, ShoppingCart } from 'lucide-react-native';
import { getAllServiceCategories } from '~/features/services-page/service';
import { addBookingCartItem } from '~/features/booking-cart/service.ts';
import { SafeAreaView } from 'react-native-safe-area-context';
import toast from '~/utils/toast';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

type ServiceCategory = {
  uuid: string;
  category_name: string;
  services: Service[];
};

type Service = {
  uuid: string;
  service_name: string;
  description: string;
  price: number;
  duration?: string;
  warranty?: string;
  frequency?: string;
};

const Services = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string>('');
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredParts, setFilteredParts] = useState<Service[]>([]);
  const [selectedBookingType, setSelectedBookingType] = useState<'general' | 'prebook'>('general');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const currentCategory =
    serviceCategories.find((cat) => cat.category_name === activeNavItem) || serviceCategories[0];

  useEffect(() => {
    if (currentCategory && currentCategory.services) {
      if (searchQuery.trim() === '') {
        setFilteredParts(currentCategory.services);
      } else {
        const filtered = currentCategory.services.filter(
          (service) =>
            service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (service.description &&
              service.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredParts(filtered);
      }
    }
  }, [searchQuery, currentCategory]);

  const fetchAllServices = async () => {
    try {
      const categories = await getAllServiceCategories({});
      if (categories) {
        setServiceCategories(categories);
        if (categories.length > 0) {
          setActiveNavItem(categories[0].category_name);
          setFilteredParts(categories[0].services);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  const handleAddtoCart = async () => {
    if (!selectedService?.uuid || !selectedService?.price) {
      console.error('Missing required service data');
      return;
    }

    const bookingData = {
      service: selectedService,
      type: selectedBookingType,
      ...(selectedBookingType === 'prebook' && { date: selectedDate }),
      quantity,
      startTime,
      endTime,
    };

    try {
      const data = {
        uuid: selectedService.uuid,
        products: {
          productId: selectedService.uuid,
          quantity,
          price: selectedService.price,
          bookingType: selectedBookingType,
          bookingDate: selectedBookingType === 'prebook' ? selectedDate.toISOString() : undefined,
          startTime,
          endTime,
        },
        type: 'service',
      };

      const response = await addBookingCartItem(data);
      if (response) {
        toast.success('Booked', `${selectedService.service_name} has been booked`);
        setAdded(true);
        setBookingModalVisible(false);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const renderStars = (rating: number = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<MaterialIcons name="star" key={i} size={16} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<MaterialIcons name="star-half" key={i} size={16} color="#FFD700" />);
      } else {
        stars.push(<MaterialIcons name="star-outline" key={i} size={16} color="#FFD700" />);
      }
    }

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
  };

  const renderTabContent = () => {
    if (!selectedService) return null;

    switch (activeTab) {
      case 'description':
        return (
          <Text style={styles.tabContent}>
            {selectedService.description || 'No description available'}
          </Text>
        );
      case 'delivery':
        return (
          <Text style={styles.tabContent}>
            Service duration: {selectedService.duration || '1-2 hours'}
          </Text>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {renderStars()}
            <Text style={{ marginTop: 10 }}>No reviews yet. Be the first to review!</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderBookingModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={bookingModalVisible}
      onRequestClose={() => setBookingModalVisible(false)}>
      <ScrollView style={styles.modalContainer}>
        <View style={styles.modalContent1}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <View style={{}}>
              <TouchableOpacity
                style={styles.backButton1}
                onPress={() => setBookingModalVisible(false)}>
                <Ionicons name="arrow-back" size={26} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>Booking Options</Text>
          </View>

          {/* Booking Type Selection */}
          <View style={styles.bookingTypeContainer}>
            <TouchableOpacity
              style={[
                styles.bookingTypeButton,
                selectedBookingType === 'general' && styles.selectedBookingType,
              ]}
              onPress={() => setSelectedBookingType('general')}>
              <Text
                style={[
                  styles.bookingTypeText,
                  selectedBookingType === 'general' && styles.selectedBookingTypeText,
                ]}>
                General Service
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bookingTypeButton,
                selectedBookingType === 'prebook' && styles.selectedBookingType,
              ]}
              onPress={() => setSelectedBookingType('prebook')}>
              <Text
                style={[
                  styles.bookingTypeText,
                  selectedBookingType === 'prebook' && styles.selectedBookingTypeText,
                ]}>
                Pre-Booked Service
              </Text>
            </TouchableOpacity>
          </View>

          {/* General Service Details */}
          {selectedBookingType === 'general' && (
            <View style={styles.bookingDetails}>
              <Text style={styles.sectionTitle}>Service Details</Text>
              <View style={styles.detailRow}>
                <MaterialIcons name="schedule" size={20} color={COLORS.primary} />
                <Text style={styles.detailText}>
                  Duration: {selectedService?.duration || '1-2 hours'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="access-time" size={20} color={COLORS.primary} />
                <Text style={styles.detailText}>Working Hours: 9:00 AM - 5:00 PM</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                <Text style={styles.detailText}>Service Center Location</Text>
              </View>

              <View style={styles.timeSelection}>
                <Text style={styles.timeLabel}>Preferred Time:</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="Start time"
                  />
                  <Text style={styles.timeSeparator}>-</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="End time"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Pre-Booked Service Details */}
          {selectedBookingType === 'prebook' && (
            <View style={styles.bookingDetails}>
              <Text style={styles.sectionTitle}>Select Date & Time</Text>

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}>
                <MaterialIcons name="date-range" size={20} color={COLORS.primary} />
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              <View style={styles.timeSelection}>
                <Text style={styles.timeLabel}>Preferred Time:</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="Start time"
                  />
                  <Text style={styles.timeSeparator}>-</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="End time"
                  />
                </View>
              </View>

              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>
                  Note: Pre-booked services require confirmation from our team. We'll contact you
                  shortly.
                </Text>
              </View>
            </View>
          )}

          {/* Book Service Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleAddtoCart}>
            <Text style={styles.bookButtonText}>
              {selectedBookingType === 'general' ? 'BOOK NOW' : 'PRE-BOOK SERVICE'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={[styles.container, { paddingVertical: 10 }]}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/home/LOGO.png')}
            style={{ width: 145, height: 25 }}
          />
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('BookingsScreen' as never)}>
              <Image
                source={icons.booking_icon}
                style={{ width: 23, height: 23 }}
                tintColor={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('BookingCartScreen' as never)}>
              <Ionicons name="cart-outline" size={26} color={COLORS.primary} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContainer}>
          {/* Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service Categories</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}>
            {serviceCategories?.map((category) => (
              <TouchableOpacity
                key={category.uuid}
                style={[
                  styles.categoryItem,
                  activeNavItem === category.category_name && styles.activeCategoryItem,
                ]}
                onPress={() => {
                  setActiveNavItem(category.category_name);
                  setSearchQuery('');
                }}>
                <Image
                  source={require('../../assets/service-images/generalservice.png')}
                  style={styles.categoryImage}
                />
                <Text
                  style={[
                    styles.categoryText,
                    activeNavItem === category.category_name && styles.activeCategoryText,
                  ]}
                  numberOfLines={1}>
                  {category.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Search Input */}
          <View style={{ marginVertical: 5, marginHorizontal: 15, marginBottom: 15 }}>
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <Ionicons name="search" size={22} color={COLORS.grey} />
              </View>
              <TextInput
                placeholder="Search for Services"
                placeholderTextColor={COLORS.grey}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearIcon}
                  onPress={clearSearch}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={20} color={COLORS.grey} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Services Grid */}
          <FlatList
            data={
              filteredParts.length > 0 || searchQuery.trim() !== ''
                ? filteredParts
                : currentCategory?.services || []
            }
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.servicesContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceCard}
                onPress={() => {
                  setSelectedService(item);
                  setModalVisible(true);
                }}>
                <ImageBackground
                  source={require('../../assets/service-images/generalservice.png')}
                  style={styles.serviceImage}
                  resizeMode="cover">
                  <View style={styles.serviceDuration}>
                    <Clock size={14} color="white" />
                    <Text style={styles.durationText}>{item.duration || '1-2 hours'}</Text>
                  </View>
                </ImageBackground>

                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {item.service_name}
                  </Text>
                  <Text style={styles.servicePrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                </View>
                {/* <View style={styles.bottomRow}>
                  {renderStars(item?.rating)}
                  <View
                    style={[styles.stockBadge, item?.isavailable ? styles.inStock : styles.outOfStock]}>
                    <Text style={styles.stockText}>
                      {item?.inStock ? 'In Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View> */}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.uuid}
            ListEmptyComponent={
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  {searchQuery.trim() !== ''
                    ? 'No services found matching your search'
                    : 'No services available in this category'}
                </Text>
              </View>
            }
          />
        </View>

        {/* Service Details Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <ScrollView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <Image
              source={require('../../assets/service-images/generalservice.png')}
              style={styles.modalImage}
              resizeMode="cover"
            />

            <View style={styles.modalContent}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle} numberOfLines={2}>
                  {selectedService?.service_name || 'N/A'}
                </Text>
                <Text style={styles.modalPrice}>
                  ₹{selectedService?.price.toLocaleString('en-IN') || '0'}
                </Text>
              </View>

              <Text style={styles.modalDescription}>
                Duration: {selectedService?.duration || '1-2 hours'}
              </Text>

              <View style={styles.modalRating}>
                {renderStars()}
                <View style={styles.inStockBadge}>
                  <Text style={styles.stockText}>Available</Text>
                </View>
              </View>

              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'description' && styles.activeTab]}
                  onPress={() => setActiveTab('description')}>
                  <Text
                    style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
                    Description
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, activeTab === 'delivery' && styles.activeTab]}
                  onPress={() => setActiveTab('delivery')}>
                  <Text style={[styles.tabText, activeTab === 'delivery' && styles.activeTabText]}>
                    Duration
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                  onPress={() => setActiveTab('reviews')}>
                  <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
                    Reviews
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tabContentContainer}>{renderTabContent()}</View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setModalVisible(false);
                  setBookingModalVisible(true);
                }}>
                <Text style={styles.addButtonText}>BOOK SERVICE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>

        {/* Booking Modal */}
        {renderBookingModal()}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  cartBadge: {
    width: 15,
    height: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    position: 'absolute',
    right: -2,
    top: -6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
  },
  mainContainer: {
    // flex: 1,
  },
  sectionHeader: {
    marginHorizontal: 15,
    marginBottom: 5,
    borderLeftColor: COLORS.primary_01,
    borderLeftWidth: 4,
  },
  sectionTitle: {
    ...FONTS.h4,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 3,
    marginBottom: 5,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryItem: {
    paddingHorizontal: 1,
    paddingVertical: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  activeCategoryItem: {},
  categoryImage: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginBottom: 5,
  },
  categoryText: {
    ...FONTS.h6,
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  servicesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  serviceCard: {
    width: '48%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceDuration: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  durationText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 5,
  },
  serviceDetails: {
    padding: 10,
  },
  serviceName: {
    ...FONTS.body4,
    fontWeight: '500',
    marginBottom: 5,
  },
  servicePrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.grey,
    ...FONTS.body4,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton1: {
    borderRadius: 20,
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalContent: {
    padding: 15,
  },
  modalContent1: {
    padding: 15,
    // marginTop: 35,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 15,
    marginBottom: 5,
  },
  modalPrice: {
    ...FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalDescription: {
    ...FONTS.body4,
    color: COLORS.primary_01,
    marginBottom: 12,
  },
  modalRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inStockBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success_lightgreen,
  },
  stockText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body3,
    color: COLORS.primary_01,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  tabContentContainer: {
    minHeight: 100,
    marginBottom: 24,
  },
  tabContent: {
    ...FONTS.body4,
    color: COLORS.primary_text,
    lineHeight: 22,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  quantityLabel: {
    ...FONTS.body3,
    color: COLORS.primary_text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey60,
  },
  quantityButtonText: {
    ...FONTS.h4,
    color: COLORS.primary_text,
  },
  quantityValue: {
    width: 40,
    textAlign: 'center',
    ...FONTS.body3,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
    marginTop: 15,
  },
  addedButton: {
    backgroundColor: 'green',
  },
  addButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.grey08,
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 15,
    paddingLeft: 40,
    paddingRight: 40,
  },
  searchIcon: {
    position: 'absolute',
    top: 15,
    left: 12,
    zIndex: 1,
  },
  clearIcon: {
    position: 'absolute',
    top: 15,
    right: 12,
    zIndex: 1,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    ...FONTS.body3,
    color: COLORS.grey,
    textAlign: 'center',
  },
  bookingTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bookingTypeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  selectedBookingType: {
    backgroundColor: COLORS.primary,
  },
  bookingTypeText: {
    ...FONTS.body4,
    color: COLORS.primary_text,
  },
  selectedBookingTypeText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  bookingDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    ...FONTS.body4,
    marginLeft: 10,
    color: COLORS.primary_text,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    ...FONTS.body4,
    marginLeft: 10,
    color: COLORS.primary_text,
  },
  timeSelection: {
    marginBottom: 20,
  },
  timeLabel: {
    ...FONTS.body4,
    marginBottom: 10,
    color: COLORS.primary_text,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 10,
    padding: 15,
    ...FONTS.body4,
  },
  timeSeparator: {
    marginHorizontal: 10,
    ...FONTS.body3,
  },
  noteContainer: {
    backgroundColor: COLORS.lightGrey60,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  noteText: {
    ...FONTS.body5,
    color: COLORS.grey,
    fontStyle: 'italic',
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: '50%',
    alignSelf: 'center',
  },
  bookButtonText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: 600,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
});

export default Services;
