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
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import IconButton from '~/components/IconButton';
import { COLORS, icons, screens, SIZES } from '~/constants';
import Header from '~/components/Header';
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

const contentSections = {
  'Periodic Services': {
    title: 'Scheduled Packages',
    packages: [
      {
        id: `basic `,
        title: `Basic Service `,
        warranty: `1000 Kms or 1 Month Warranty `,
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

type ContentSectionKey = keyof typeof contentSections;

const Services = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<ContentSectionKey>('Periodic Services');
  const [expandedServices, setExpandedServices] = useState<{ [key: string]: boolean }>({});
  // type PackageType = (typeof contentSections)[ContentSectionKey]['packages'][number];
  const [cart, setCart] = useState<PackageType[]>([]);

  const currentContent = contentSections[activeNavItem] || contentSections['Periodic Services'];

  const toggleExpandServices = (packageId: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [packageId]: !prev[packageId],
    }));
  };

  type PackageType = {
    id: string;
    title: string;
    warranty: string;
    frequency: string;
    duration: string;
    image: any;
    services: { name: string; icon: JSX.Element }[];
    price: string;
    discountPrice: string;
    additionalCount?: number;
    isRecommended?: boolean;
  };

  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [product, setProduct] = useState(false);

  const addToCart = (pkg: PackageType) => {
    if (addedItems[pkg.id]) {
      // Item is already in cart - remove it
      setCart(cart.filter((item) => item.id !== pkg.id));
      setAddedItems((prev) => ({ ...prev, [pkg.id]: false }));
    } else {
      // Item not in cart - add it
      setCart([...cart, pkg]);
      setAddedItems((prev) => ({ ...prev, [pkg.id]: true }));
    }
  };

  const renderServiceItem = ({ item }: { item: { name: string; icon: JSX.Element } }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceIconContainer}>{item.icon}</View>
      <Text style={styles.serviceText}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        containerStyle={{
          height: 50,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
        }}
        logo={icons.logo}
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
                navigation.navigate('NotificationScreen');
              }}
            />

            <TouchableOpacity>
              {cart.length > 0 && (
                <TouchableOpacity
                  style={styles.cartButton}
                  onPress={() => navigation.navigate('BookingCartScreen')}>
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

      {/* Main content start */}
      <StatusBar backgroundColor="#9b111e" barStyle="light-content" />

      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Car Services</Text>
      </View> */}

      <View style={styles.mainContainer}>
        {/* Sidebar Navigation */}
        <View style={styles.sidebar}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={navigationItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.navItem, activeNavItem === item.name && styles.activeNavItem]}
                onPress={() => setActiveNavItem(item.name as ContentSectionKey)}>
                <View style={styles.navIcon}>{item.icon}</View>
                <Text style={[styles.navText, activeNavItem === item.name && styles.activeNavText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>{currentContent.title}</Text>
            <Text style={styles.contentSubtitle}>Choose the perfect package for your vehicle</Text>
          </View>

          {currentContent.packages.map((pkg) => (
            <View key={pkg.id} style={styles.packageCard}>
              {pkg.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>RECOMMENDED</Text>
                </View>
              )}

              <View style={styles.durationBadge}>
                <Clock size={16} color="white" />
                <Text style={styles.durationText}>{pkg.duration}</Text>
              </View>

              <View style={styles.packageContent}>
                {/* Service Image */}
                <View style={styles.imageContainer}>
                  <Image source={pkg.image} style={styles.serviceImage} resizeMode="cover" />
                </View>

                {/* Service Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.packageTitle}>{pkg.title}</Text>
                  </View>

                  <View style={styles.warrantyRow}>
                    <Text style={styles.warrantyText}>{pkg.warranty}</Text>
                    <Text style={styles.warrantyText}>{pkg.frequency}</Text>
                  </View>

                  {/* Services List */}
                  <FlatList
                    data={pkg.services.slice(0, expandedServices[pkg.id] ? pkg.services.length : 4)}
                    renderItem={renderServiceItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.servicesGrid}
                  />

                  {/* Show More/Less */}
                  {pkg.additionalCount && (
                    <TouchableOpacity
                      onPress={() => toggleExpandServices(pkg.id)}
                      style={styles.showMoreButton}>
                      {expandedServices[pkg.id] ? (
                        <>
                          <ChevronUp size={16} color="#9b111e" />
                          <Text style={styles.showMoreText}>Show Less</Text>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} color="#9b111e" />
                          <Text style={styles.showMoreText}>View more</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}

                  {/* Price and Button */}
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.originalPrice}>{pkg.price}</Text>
                      <Text style={styles.discountPrice}>{pkg.discountPrice}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.addToCartButton,
                        addedItems[pkg.id] && styles.addedButton, // Optional: different style for "ADDED" state
                      ]}
                      onPress={() => addToCart(pkg)}>
                      <Text style={styles.buttonText}>
                        {addedItems[pkg.id] ? 'ADDED' : 'ADD TO CART'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
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
    marginTop: 35,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.h3,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.light,
    fontSize: SIZES.h2_01,
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    backgroundColor: COLORS.light,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  navItem: {
    padding: SIZES.body3,
    alignItems: 'center',
  },
  activeNavItem: {
    backgroundColor: '#fde8e8',
  },
  navIcon: {
    marginBottom: SIZES.h7,
  },
  navText: {
    fontSize: SIZES.h5,
    textAlign: 'center',
    color: '#666',
  },
  activeNavText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: SIZES.body3,
  },
  contentHeader: {
    marginBottom: SIZES.h2_03,
  },
  contentTitle: {
    fontSize: SIZES.h2_03,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.h7,
  },
  contentSubtitle: {
    color: '#666',
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
    fontSize: SIZES.body5,
    fontWeight: 'bold',
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
    fontSize: SIZES.h2_02,
    fontWeight: 'bold',
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
    fontSize: SIZES.body5,
    marginLeft: SIZES.body9,
  },
  warrantyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.body3,
  },
  warrantyText: {
    fontSize: SIZES.body5,
    color: COLORS.primary,
    marginRight: SIZES.body7,
    marginBottom: SIZES.body9,
  },
  servicesGrid: {
    justifyContent: 'space-between',
    marginBottom: SIZES.body7,
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
    fontSize: SIZES.body5,
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
    fontSize: SIZES.body5,
    marginLeft: SIZES.body9,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.body7,
  },
  originalPrice: {
    fontSize: SIZES.body4,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.body7,
    paddingHorizontal: SIZES.body3,
    paddingVertical: SIZES.body6,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
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
});
