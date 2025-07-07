import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import { Clock, Wrench, Car, ShoppingCart } from 'lucide-react-native';
import { getAllServiceCategories } from '~/features/services-page/service';
import { addBookingCartItem } from '~/features/booking-cart/service.ts';

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

  const addToCart = async (service: Service) => {
    try {
      const data = {
        service: service?._id,
        type: 'service',
      };
      const response = await addBookingCartItem(data);
      console.log('Add to cart response:', response);
      if (response) {
        setCart((prev) => {
          const exists = prev.some((item) => item.uuid === service.uuid);
          return exists ? prev.filter((item) => item.uuid !== service.uuid) : [...prev, service];
        });
        setAddedItems((prev) => ({
          ...prev,
          [service.uuid]: !prev[service.uuid],
        }));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return;
    }
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceText}>{item.service_name}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <Text style={styles.servicePrice}>
        {item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : '₹0'}
      </Text>
    </View>
  );

  const transformServicesToPackages = (services: Service[]) => {
    return services.map((service) => ({
      id: service.uuid,
      title: service.service_name,
      warranty: 'Standard Warranty',
      frequency: 'As needed',
      duration: '1-2 Hours',
      image: require('../../assets/service-images/generalservice.png'),
      services: [
        {
          name: service.description || 'Comprehensive service',
          icon: <Wrench className="h-4 w-4" />,
        },
      ],
      price: service.price > 0 ? `₹${service.price + 500}` : '₹0',
      discountPrice: service.price > 0 ? `₹${service.price}` : '₹0',
      isRecommended: false,
      originalData: service,
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
                            accessible={true}
                            accessibilityLabel={`Add ${pkg.title} to cart`}
                            accessibilityHint={`Adds ${pkg.title} service to your booking cart`}
                            accessibilityRole="button"
                            style={[
                              styles.addToCartButton,
                              addedItems[pkg.id] && styles.addedButton,
                            ]}
                            onPress={() => addToCart(pkg.originalData)}>
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
