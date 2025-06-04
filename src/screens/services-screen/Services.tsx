import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import IconButton from '~/components/IconButton';
import { COLORS, FONTS, icons, screens, SIZES } from '~/constants';
import Header from '~/components/Header';
import { Ionicons } from '@expo/vector-icons';
import {
  Clock,
  Wrench,
  Battery,
  Zap,
  Car,
  Wind,
  Search,
  Droplet,
  Settings,
  FileText,
  Eye,
  Shield,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  Droplets,
  FileCheck,
} from 'lucide-react-native';
import { JSX } from 'react/jsx-runtime';
import { getAllServiceCategories, getAllServices } from '~/features/services-page/service';

const contentSections = {
  'Periodic Services': {
    title: 'Scheduled Packages',
    packages: [
      {
        id: 'basic',
        title: 'Basic Service',
        warranty: '1000 Kms or 1 Month Warranty',
        frequency: 'Every 5000 Kms or 3 Months (Recommended)',
        duration: '4 Hrs ',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          {
            name: 'Wiper Fluid Replacement',
            icon: <Droplets className="h-4 w-4" />,
          },
          {
            name: 'Battery Water Top Up',
            icon: <Battery className="h-4 w-4" />,
          },
          { name: 'Car Wash', icon: <Car className="h-4 w-4" /> },
          {
            name: 'Interior Vacuuming (Carpet & Seats)',
            icon: <Wind className="h-4 w-4" />,
          },
          {
            name: 'Engine Oil Replacement',
            icon: <Settings className="h-4 w-4" />,
          },
        ],
        additionalCount: 4,
        price: '₹2,500',
        discountPrice: '₹2,000',
        isRecommended: false,
      },
      {
        id: 'standard',
        title: 'Standard Service',
        warranty: '1000 Kms or 1 Month Warranty',
        frequency: 'Every 10,000 Kms or 6 Months (Recommended)',
        duration: '6 Hrs ',
        isRecommended: true,
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'Car Scanning', icon: <Search className="h-4 w-4" /> },
          {
            name: 'Wiper Fluid Replacement',
            icon: <Droplets className="h-4 w-4" />,
          },
          {
            name: 'Battery Water Top up',
            icon: <Battery className="h-4 w-4" />,
          },
          { name: 'Car Wash', icon: <Car className="h-4 w-4" /> },
          {
            name: 'Interior Vacuuming (Carpet & Seats)',
            icon: <Wind className="h-4 w-4" />,
          },
        ],
        additionalCount: 10,
        price: '₹4,500',
        discountPrice: '₹3,500',
      },
    ],
  },
  'AC Services & Repair': {
    title: 'AC Services & Repair',
    packages: [
      {
        id: 'ac-basic',
        title: 'AC Gas Refill',
        warranty: '6 Months Warranty',
        frequency: 'As Required',
        duration: '2 Hrs ',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'AC Gas Top Up', icon: <Zap className="h-4 w-4" /> },
          { name: 'AC Performance Check', icon: <Search className="h-4 w-4" /> },
          { name: 'Temperature Testing', icon: <Settings className="h-4 w-4" /> },
          { name: 'Cooling System Inspection', icon: <Wind className="h-4 w-4" /> },
        ],
        additionalCount: 3,
        price: '₹2,000',
        discountPrice: '₹1,500',
        isRecommended: false,
      },
      {
        id: 'ac-complete',
        title: 'Complete AC Service',
        warranty: '1 Year Warranty',
        frequency: 'Every 12 Months',
        duration: '4 Hrs ',
        isRecommended: true,
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'AC Deep Cleaning', icon: <Wind className="h-4 w-4" /> },
          { name: 'Filter Replacement', icon: <Settings className="h-4 w-4" /> },
          { name: 'Condenser Cleaning', icon: <Droplets className="h-4 w-4" /> },
          { name: 'Compressor Check', icon: <Zap className="h-4 w-4" /> },
          { name: 'AC Gas Refill', icon: <Battery className="h-4 w-4" /> },
        ],
        additionalCount: 5,
        price: '₹6,000',
        discountPrice: '₹4,500',
      },
    ],
  },
  Batteries: {
    title: 'Battery Services',
    packages: [
      {
        id: 'battery-check',
        title: 'Battery Health Check',
        warranty: '1 Month Warranty',
        frequency: 'Every 6 Months',
        duration: '1 Hrs ',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'Battery Voltage Test', icon: <Battery className="h-4 w-4" /> },
          { name: 'Terminal Cleaning', icon: <Settings className="h-4 w-4" /> },
          { name: 'Load Test', icon: <Zap className="h-4 w-4" /> },
          { name: 'Water Level Check', icon: <Droplets className="h-4 w-4" /> },
        ],
        additionalCount: 2,
        price: '₹1500',
        discountPrice: '₹1200',
        isRecommended: false,
      },
      {
        id: 'battery-replace',
        title: 'Battery Replacement',
        warranty: '2 Years Warranty',
        frequency: 'Every 3-4 Years',
        duration: '1 Hrs',
        isRecommended: true,
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'Old Battery Removal', icon: <Battery className="h-4 w-4" /> },
          { name: 'New Battery Installation', icon: <Settings className="h-4 w-4" /> },
          { name: 'Terminal Connection', icon: <Zap className="h-4 w-4" /> },
          { name: 'Performance Testing', icon: <Search className="h-4 w-4" /> },
        ],
        price: '₹5000',
        discountPrice: '₹4000',
      },
    ],
  },
  'Tyres and Wheel Care': {
    title: 'Tyres and Wheel Care',
    packages: [
      {
        id: 'tyre-rotation',
        title: 'Tyre Rotation & Balancing',
        warranty: '500 Kms Warranty',
        frequency: 'Every 10,000 Kms',
        duration: '2 Hrs ',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'Tyre Rotation', icon: <Car className="h-4 w-4" /> },
          { name: 'Wheel Balancing', icon: <Settings className="h-4 w-4" /> },
          { name: 'Pressure Check', icon: <Wind className="h-4 w-4" /> },
          { name: 'Tread Inspection', icon: <Eye className="h-4 w-4" /> },
        ],
        additionalCount: 3,
        price: '₹2000',
        discountPrice: '₹1500',
        isRecommended: false,
      },
    ],
  },
  'Detailing Services': {
    title: 'Car Detailing Packages',
    packages: [
      {
        id: 'exterior-detail',
        title: 'Premium Exterior Detailing',
        warranty: '1 Month Protection',
        frequency: 'Every 3 Months',
        duration: '6 Hrs ',
        isRecommended: true,
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          {
            name: 'Paint Protection Coating',
            icon: <Shield className="h-4 w-4" />,
          },
          { name: 'Deep Wash & Wax', icon: <Car className="h-4 w-4" /> },
          {
            name: 'Headlight Polishing',
            icon: <Lightbulb className="h-4 w-4" />,
          },
          {
            name: 'Tire Shine Application',
            icon: <Settings className="h-4 w-4" />,
          },
        ],
        additionalCount: 6,
        price: '₹8,000',
        discountPrice: '₹6,000',
      },
    ],
  },
  'Car Inspection': {
    title: 'Vehicle Inspection Services',
    packages: [
      {
        id: 'full-inspection',
        title: 'Comprehensive Vehicle Inspection',
        warranty: 'Detailed Report Provided',
        frequency: 'Before Purchase/Sale',
        duration: '3 Hrs',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          {
            name: 'Engine Diagnostics',
            icon: <Search className="h-4 w-4" />,
          },
          {
            name: 'Brake System Check',
            icon: <Settings className="h-4 w-4" />,
          },
          {
            name: 'Suspension Inspection',
            icon: <Car className="h-4 w-4" />,
          },
          {
            name: 'Electrical System Test',
            icon: <Zap className="h-4 w-4" />,
          },
        ],
        additionalCount: 12,
        price: '₹3,000',
        discountPrice: '₹2,500',
        isRecommended: false,
      },
    ],
  },
  'Windshields & Lights': {
    title: 'Glass & Lighting Services',
    packages: [
      {
        id: 'windshield-repair',
        title: 'Windshield Chip Repair',
        warranty: '6 Months Warranty',
        frequency: 'As Required',
        duration: '1 Hrs',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'Chip Assessment', icon: <Eye className="h-4 w-4" /> },
          {
            name: 'Resin Application',
            icon: <Droplets className="h-4 w-4" />,
          },
          {
            name: 'UV Curing Process',
            icon: <Lightbulb className="h-4 w-4" />,
          },
          { name: 'Quality Check', icon: <Search className="h-4 w-4" /> },
        ],
        additionalCount: 1,
        price: '₹1,500',
        discountPrice: '₹1,200',
        isRecommended: false,
      },
    ],
  },
  'Suspension & Fitments': {
    title: 'Suspension & Fitting Services',
    packages: [
      {
        id: 'suspension-check',
        title: 'Suspension System Check',
        warranty: '1000 Kms Warranty',
        frequency: 'Every 20,000 Kms',
        duration: '3 Hrs ',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          {
            name: 'Shock Absorber Test',
            icon: <Settings className="h-4 w-4" />,
          },
          { name: 'Spring Inspection', icon: <Car className="h-4 w-4" /> },
          { name: 'Alignment Check', icon: <Search className="h-4 w-4" /> },
          { name: 'Bushings Inspection', icon: <Eye className="h-4 w-4" /> },
        ],
        additionalCount: 5,
        price: '₹3,000',
        discountPrice: '₹2,500',
        isRecommended: false,
      },
    ],
  },
  'Clutch & Body Parts': {
    title: 'Clutch & Body Repair Services',
    packages: [
      {
        id: 'clutch-service',
        title: 'Clutch System Service',
        warranty: '5000 Kms Warranty',
        frequency: 'Every 50,000 Kms',
        duration: '8 Hrs ',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          {
            name: 'Clutch Plate Inspection',
            icon: <Settings className="h-4 w-4" />,
          },
          {
            name: 'Pressure Plate Check',
            icon: <Search className="h-4 w-4" />,
          },
          {
            name: 'Hydraulic System Test',
            icon: <Droplets className="h-4 w-4" />,
          },
          { name: 'Clutch Adjustment', icon: <Wrench className="h-4 w-4" /> },
        ],
        additionalCount: 4,
        price: '₹5,000',
        discountPrice: '₹4,000',
        isRecommended: false,
      },
      {
        id: 'claim-assistance',
        title: 'Complete Claim Assistance',
        warranty: 'Full Documentation Support',
        frequency: 'As Required',
        duration: '9 Hrs ',
        image: require('../../assets/service-images/generalservice.png'),
        services: [
          { name: 'Damage Assessment', icon: <Eye className="h-4 w-4" /> },
          {
            name: 'Documentation Support',
            icon: <FileCheck className="h-4 w-4" />,
          },
          {
            name: 'Insurance Coordination',
            icon: <Shield className="h-4 w-4" />,
          },
          {
            name: 'Repair Estimation',
            icon: <Settings className="h-4 w-4" />,
          },
        ],
        additionalCount: 6,
        price: '₹1,500',
        discountPrice: '₹1,200',
        isRecommended: false,
      },
    ],
  },
};

const navigationItems = [
  { name: 'Periodic Services', icon: <Wrench className="h-6 w-6" /> },
  { name: 'AC Services & Repair', icon: <Zap className="h-6 w-6" /> },
  { name: 'Batteries', icon: <Battery className="h-6 w-6" /> },
  { name: 'Tyres and Wheel Care', icon: <Car className="h-6 w-6" /> },
  { name: 'Detailing Services', icon: <Battery className="h-6 w-6" /> },
  { name: 'Car Inspection', icon: <Eye className="h-6 w-6" /> },
  { name: 'Windshields & Lights', icon: <Lightbulb className="h-6 w-6" /> },
  { name: 'Suspension & Fitments', icon: <Settings className="h-6 w-6" /> },
  { name: 'Clutch & Body Parts', icon: <FileCheck className="h-6 w-6" /> },
  { name: 'Insurance Claims', icon: <Shield className="h-6 w-6" /> },
];

type ServiceCategory = {
  uuid: string;
  category_name: string;
  services: Service[];
  is_active: boolean;
  is_deleted: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type Service = {
  uuid: string;
  service_name: string;
  description: string;
  price: number;
  category_id: string;
  partner_id: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
};

const Services = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string>('');
  const [expandedServices, setExpandedServices] = useState<{ [key: string]: boolean }>({});
  const [cart, setCart] = useState<Service[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const currentX = useRef(0);
  const scrollStep = 120;
  const scrollViewRef = useRef<ScrollView>(null);

  const currentCategory =
    serviceCategories.find((cat) => cat.category_name === activeNavItem) || serviceCategories[0];

  const fetchAllServices = async () => {
    try {
      const categories = await getAllServiceCategories({});
      if (categories) {
        setServiceCategories(categories);
        if (categories.length > 0) {
          setActiveNavItem(categories[0].category_name);
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

  const scrollLeft = () => {
    currentX.current = Math.max(currentX.current - scrollStep, 0);
    scrollViewRef.current?.scrollTo({ x: currentX.current, animated: true });
  };

  const scrollRight = () => {
    currentX.current += scrollStep;
    scrollViewRef.current?.scrollTo({ x: currentX.current, animated: true });
  };

  const toggleExpandServices = (serviceId: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const addToCart = (service: Service) => {
    if (addedItems[service.uuid]) {
      setCart(cart.filter((item) => item.uuid !== service.uuid));
      setAddedItems((prev) => ({ ...prev, [service.uuid]: false }));
    } else {
      setCart([...cart, service]);
      setAddedItems((prev) => ({ ...prev, [service.uuid]: true }));
    }
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceText}>{item.service_name}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <Text style={styles.servicePrice}>₹{item.price}</Text>
    </View>
  );

  // Transform services into a format similar to your original packages
  const transformServicesToPackages = (services: Service[]) => {
    return services.map((service) => ({
      id: service.uuid,
      title: service.service_name,
      warranty: 'Standard Warranty', 
      frequency: 'As needed', 
      duration: '1-2 Hours', 
      image: require('../../assets/service-images/generalservice.png'),
      services: [{ name: service.description, icon: <Wrench className="h-4 w-4" /> }],
      price: `₹${service.price + 500}`,
      discountPrice: `₹${service.price || 0}`,
      isRecommended: false, 
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
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

            <TouchableOpacity>
              {cart.length > 0 && (
                <TouchableOpacity
                  style={styles.cartButton}
                  onPress={() => navigation.navigate('BookingCartScreen' as never)}>
                  <ShoppingCart size={24} color="white" />
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cart.length}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.mainContainer}>
        {/* Horizontal Navigation with Arrows */}
        <View style={styles.horizontalNavWrapper}>
          <TouchableOpacity onPress={scrollLeft} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalNavContent}>
            {serviceCategories?.map((category) => (
              <TouchableOpacity
                key={category.uuid}
                style={[
                  styles.horizontalNavItem,
                  activeNavItem === category.category_name && styles.activeHorizontalNavItem,
                ]}
                onPress={() => setActiveNavItem(category.category_name)}>
                <View style={styles.horizontalNavIcon}>
                  <Car className="h-6 w-6" />
                </View>
                <Text
                  style={[
                    styles.horizontalNavText,
                    activeNavItem === category.category_name && styles.activeHorizontalNavText,
                  ]}
                  numberOfLines={1}>
                  {category.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={scrollRight} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          {currentCategory && (
            <>
              <View style={styles.contentHeader}>
                <Text style={styles.contentTitle}>{currentCategory.category_name || 'N/A'}</Text>
                <Text style={styles.contentSubtitle}>
                  Choose the perfect service for your vehicle
                </Text>
              </View>

              {currentCategory.services.length > 0 ? (
                transformServicesToPackages(currentCategory.services).map((pkg) => (
                  <View key={pkg.id} style={styles.packageCard}>
                    <View style={styles.durationBadge}>
                      <Clock size={14} color="white" />
                      <Text style={styles.durationText}>{pkg.duration}</Text>
                    </View>

                    <View style={styles.packageContent}>
                      <View style={styles.imageContainer}>
                        <Image source={pkg.image} style={styles.serviceImage} resizeMode="cover" />
                      </View>

                      <View style={styles.detailsContainer}>
                        <View style={styles.titleRow}>
                          <Text style={styles.packageTitle}>{pkg.title || 'N/A'}</Text>
                        </View>

                        <View style={styles.warrantyRow}>
                          <Text style={styles.warrantyText}>{pkg.warranty || 'N/A'}</Text>
                          <Text style={styles.warrantyText}>{pkg.frequency || 'N/A'}</Text>
                        </View>

                        <FlatList
                          data={pkg.services}
                          renderItem={renderServiceItem}
                          keyExtractor={(item, index) => index.toString()}
                        />

                        <View style={styles.priceRow}>
                          <View>
                            <Text style={styles.originalPrice}>{pkg.price || 'N/A'}</Text>
                            <Text style={styles.discountPrice}>{pkg.discountPrice || 'N/A'}</Text>
                          </View>

                          <TouchableOpacity
                            style={[
                              styles.addToCartButton,
                              addedItems[pkg.id] && styles.addedButton,
                            ]}
                            onPress={() =>
                              addToCart(currentCategory.services.find((s) => s.uuid === pkg.id)!)
                            }>
                            <Text style={styles.buttonText}>
                              {addedItems[pkg.id] ? 'ADDED' : 'ADD TO CART'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No services available in this category</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>
      <View style={{ paddingBottom: 50 }}></View>
    </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContainer: {
    flex: 1,
    marginBottom: 10,
  },
  horizontalNavContainer: {
    height: 70,
    backgroundColor: COLORS.lightGrey,
    borderBottomWidth: 1,
    borderTopWidth: 3,
    borderBottomColor: '#e0e0e0',
    borderTopColor: COLORS.primary,
    elevation: 1,
  },
  horizontalNavWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  arrowButton: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginHorizontal: 4,
    elevation: 2,
    zIndex: 1,
  },

  horizontalNavContent: {
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  horizontalNavItem: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.2,
    borderColor: COLORS.grey40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  activeHorizontalNavItem: {
    backgroundColor: '#fde8e8',
  },
  horizontalNavIcon: {
    marginBottom: 5,
  },
  horizontalNavText: {
    ...FONTS.h7,
    textAlign: 'center',
    color: '#666',
    width: 105,
  },
  activeHorizontalNavText: {
    color: COLORS.primary,
    ...FONTS.h7,
  },
  content: {
    flex: 1,
    padding: SIZES.body3,
  },
  contentHeader: {
    marginBottom: SIZES.h2_03,
  },
  contentTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 5,
  },
  contentSubtitle: {
    color: '#666',
    ...FONTS.body5,
  },
  packageCard: {
    backgroundColor: '#FAF3EB',
    borderRadius: SIZES.h5,
    marginBottom: SIZES.h2_03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLORS.buttonbg1,
    paddingHorizontal: SIZES.body7,
    paddingVertical: SIZES.body9,
    borderTopLeftRadius: SIZES.body5,
    borderBottomRightRadius: SIZES.body5,
    zIndex: 1,
  },
  recommendedText: {
    color: COLORS.white,
    ...FONTS.body6,
  },
  packageContent: {
    flexDirection: 'column',
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: SIZES.body5,
    borderTopRightRadius: SIZES.body5,
    overflow: 'hidden',
  },
  serviceImage: {
    width: SIZES.full,
    height: '100%',
  },
  detailsContainer: {
    padding: SIZES.body3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.body7,
  },
  packageTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    flex: 1,
  },
  durationBadge: {
    position: 'absolute',
    top: 165,
    right: 3,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.h2_01,
    paddingHorizontal: SIZES.body5,
    paddingVertical: SIZES.body8,
  },
  durationText: {
    color: COLORS.white,
    ...FONTS.body6,
    marginLeft: SIZES.body9,
  },
  warrantyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.body3,
  },
  warrantyText: {
    ...FONTS.body5,
    color: COLORS.primary_text,
    marginRight: SIZES.body7,
    marginBottom: SIZES.body9,
  },
  servicesGrid: {
    justifyContent: 'space-between',
    marginBottom: SIZES.body8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: SIZES.body7,
  },
  serviceIconContainer: {
    width: SIZES.h2_03,
    height: SIZES.h2_03,
    borderRadius: SIZES.body5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.body7,
  },
  serviceText: {
    ...FONTS.body6,
    color: '#333',
    flexShrink: 1,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.body3,
  },
  showMoreText: {
    color: COLORS.primary,
    ...FONTS.body5,
    marginLeft: SIZES.body9,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.body7,
  },
  originalPrice: {
    ...FONTS.body4,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.body7,
    paddingHorizontal: SIZES.body3,
    paddingVertical: SIZES.body6,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h5,
  },
  cartButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.primary,
    fontSize: SIZES.body5,
    fontWeight: 'bold',
  },
  addedButton: {
    backgroundColor: COLORS.buttonbg1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 210,
    color: COLORS.grey,
    ...FONTS.body4,
  },
  serviceDescription: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginTop: 4,
  },
  servicePrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginTop: 8,
  },
});
