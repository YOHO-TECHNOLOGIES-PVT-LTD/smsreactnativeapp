import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ImageSourcePropType,
  RefreshControl,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import MainLayout from '../layout';
import { COLORS, FONTS, SIZES, screens, icons } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTab } from '../store/tab/tabSlice';
import { useNavigation } from '@react-navigation/native';
import toast from '../utils/toast';
import { RootState } from '../store';
import { getUserProfileDetails } from '~/features/profile/service';
import { getImageUrl } from '~/utils/imageUtils';
import CustomLogoutModal from '~/components/CustomLogoutModal';
import { logout } from '~/features/token/redux/thunks';
import { AppDispatch } from '~/store';
import { selectToken } from '~/features/token/redux/selectors';
import AnimatedUserDummy from '~/components/profile/AnimatedUserDummy';
import { selectProfile } from '~/features/profile/reducers/selector';
import { getProfileDetailsThunk } from '~/features/profile/reducers/thunks';
import { Ionicons } from '@expo/vector-icons';
import { selectCartItems } from '~/features/booking-cart/redux/selectors';
import { getBookingCartItems } from '~/features/booking-cart/redux/thunks';

type CustomDrawerItemProps = {
  label: string;
  icon: ImageSourcePropType;
  isFocused?: boolean;
  onPress: () => void;
  isDivider?: boolean;
  badgeCount?: number;
};

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({
  label,
  icon,
  isFocused,
  onPress,
  isDivider = false,
  badgeCount = 0,
}) => {
  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 48,
          marginBottom: SIZES.small,
          alignItems: 'center',
          paddingLeft: SIZES.padding,
          paddingRight: SIZES.base,
          borderRadius: SIZES.radius + 2,
          backgroundColor: isFocused ? COLORS.primary_03 : 'transparent',
          marginHorizontal: SIZES.small,
        }}
        onPress={onPress}
        activeOpacity={0.7}>
        {/* Icon */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isFocused ? COLORS.primary : COLORS.primary_04,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: SIZES.radius,
          }}>
          <Image
            source={icon}
            style={{
              width: 18,
              height: 18,
              tintColor: isFocused ? COLORS.light : COLORS.primary,
            }}
          />
        </View>

        {/* Label */}
        <Text
          style={{
            flex: 1,
            color: isFocused ? COLORS.primary : COLORS.primary_text,
            ...FONTS.h4,
            fontWeight: isFocused ? '600' : '400',
          }}>
          {label}
        </Text>

        {/* Cart badge (RIGHT END ONLY) */}
        {badgeCount > 0 && (
          <View
            style={{
              minWidth: 18,
              height: 18,
              paddingHorizontal: 5,
              borderRadius: 9,
              backgroundColor: COLORS.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 11,
                fontWeight: '600',
              }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {isDivider && (
        <View
          style={{
            height: 1,
            marginVertical: SIZES.base,
            marginHorizontal: SIZES.padding,
            backgroundColor: COLORS.primary_03,
          }}
        />
      )}
    </>
  );
};

type DrawerContentProps = {
  navigation: any;
};

const ServiceDrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTab = useSelector((state: RootState) => state.tabReducer.selectedTab);
  const [error, setError] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const tokenSelector = useSelector(selectToken);
  const didFetch = useRef(false);
  const profileData = useSelector(selectProfile);
  const cartItems = useSelector(selectCartItems);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (tokenSelector && !didFetch.current) {
      dispatch(getProfileDetailsThunk({}));
      dispatch(getBookingCartItems());
      didFetch.current = true;
    }
  }, [tokenSelector]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getProfileDetailsThunk({}));
    } catch (error) {
      toast.error('Refresh failed', 'Could not refresh profile data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await dispatch(logout());
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

  useEffect(() => {
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
    setCartCount(getCartCount() ?? 0);
  }, [dispatch, cartItems]);

  return (
    <DrawerContentScrollView
      scrollEnabled
      contentContainerStyle={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
          title="Pull to refresh"
          titleColor={COLORS.grey60}
        />
      }>
      <View style={{ flex: 1 }}>
        {/* Header Section */}
        <View
          style={{
            paddingHorizontal: SIZES.padding,
            paddingTop: SIZES.base,
            paddingBottom: SIZES.radius,
            backgroundColor: COLORS.primary_04,
          }}>
          {/* Close Button */}
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: COLORS.light,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: SIZES.base,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => navigation.closeDrawer()}
            activeOpacity={0.8}>
            <Image
              source={icons?.cross}
              style={{ height: 12, width: 12, tintColor: COLORS.primary }}
            />
          </TouchableOpacity>

          {/* Profile Section */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.light,
              borderRadius: SIZES.radius,
              padding: SIZES.base,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
            onPress={() => {
              dispatch(setSelectedTab(screens.profile));
              navigation.navigate('MainLayout');
            }}
            activeOpacity={0.9}>
            {tokenSelector && profileData?.image && !error ? (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  overflow: 'hidden',
                  backgroundColor: COLORS.primary_03,
                  borderWidth: 2,
                  borderColor: COLORS.primary_03,
                }}>
                <Image
                  source={{ uri: getImageUrl(profileData?.image) }}
                  onError={() => setError(true)}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 45,
                  backgroundColor: COLORS.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: COLORS.primary_03,
                }}>
                <AnimatedUserDummy />
              </View>
            )}
            <View style={{ marginLeft: SIZES.radius, flex: 1 }}>
              <Text
                style={{
                  color: COLORS.primary_text,
                  ...FONTS.h3,
                  fontWeight: '600',
                  marginBottom: 2,
                }}
                numberOfLines={1}>
                {tokenSelector && profileData?.firstName && profileData?.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : 'Customer'}
              </Text>
              <Text
                style={{
                  color: COLORS.grey60,
                  ...FONTS.h6,
                  textTransform: 'capitalize',
                }}
                numberOfLines={1}>
                {tokenSelector && profileData?.role}
              </Text>
            </View>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: COLORS.primary_03,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.right_arrow}
                style={{ width: 12, height: 12, tintColor: COLORS.primary }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Navigation Items */}
        <View style={{ flex: 1, paddingTop: SIZES.base }}>
          <CustomDrawerItem
            label={screens.home}
            icon={selectedTab === screens.home ? icons.home_filled : icons.home_outlined}
            isFocused={selectedTab === screens.home}
            onPress={() => {
              dispatch(setSelectedTab(screens.home));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.services}
            icon={
              selectedTab === screens.services ? icons.services_filled : icons.services_outlined
            }
            isFocused={selectedTab === screens.services}
            onPress={() => {
              dispatch(setSelectedTab(screens.services));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.spare_parts}
            icon={selectedTab === screens.spare_parts ? icons.spare_filled : icons.spare_outlined}
            isFocused={selectedTab === screens.spare_parts}
            onPress={() => {
              dispatch(setSelectedTab(screens.spare_parts));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.profile}
            icon={selectedTab === screens.profile ? icons.user_filled : icons.user_outlined}
            isFocused={selectedTab === screens.profile}
            onPress={() => {
              dispatch(setSelectedTab(screens.profile));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label="Bookings"
            icon={selectedTab === 'Bookings' ? icons.booking_icon : icons.booking_icon}
            isFocused={selectedTab === 'Bookings'}
            onPress={() => {
              dispatch(setSelectedTab('Bookings'));
              navigation.navigate('BookingsScreen');
            }}
          />

          <CustomDrawerItem
            label="Booking Cart"
            icon={selectedTab === 'BookingCart' ? icons.cart_filled : icons.cart_outlined}
            isFocused={selectedTab === 'BookingCart'}
            isDivider={true}
            badgeCount={cartCount || 0}
            onPress={() => {
              dispatch(setSelectedTab('BookingCart'));
              navigation.navigate('BookingCartScreen');
            }}
          />

          {/* Logout Section */}
          <View style={{ marginTop: SIZES.base }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 48,
                alignItems: 'center',
                paddingLeft: SIZES.padding,
                paddingRight: SIZES.base,
                borderRadius: SIZES.radius + 2,
                backgroundColor: COLORS.error08,
                marginHorizontal: SIZES.small,
                borderWidth: 1,
                borderColor: COLORS.error20,
              }}
              onPress={() =>
                tokenSelector ? setLogoutModalVisible(true) : navigation.navigate('LoginScreen')
              }
              activeOpacity={0.8}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: COLORS.error20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: SIZES.radius,
                }}>
                {tokenSelector ? (
                  <Image
                    source={icons.logout}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.error,
                    }}
                  />
                ) : (
                  <Ionicons name="log-in-outline" size={20} color={COLORS.error} />
                )}
              </View>
              <Text
                style={{
                  flex: 1,
                  color: COLORS.error,
                  ...FONTS.h4,
                  fontWeight: '500',
                }}>
                {tokenSelector ? 'Logout' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Logout Modal */}
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

        {/* Footer */}
        <View
          style={{
            paddingHorizontal: SIZES.padding,
            paddingVertical: SIZES.base,
            borderTopWidth: 1,
            borderTopColor: COLORS.primary_03,
            backgroundColor: COLORS.lightGrey08,
          }}>
          <Text
            style={{
              ...FONTS.h6,
              color: COLORS.grey60,
              textAlign: 'center',
            }}>
            Version 1.0.0
          </Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const ServiceDrawer: React.FC = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  useEffect(() => {
    // Handle any logout callback registration logic if needed
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Drawer.Navigator
        screenOptions={{
          overlayColor: COLORS.transparentBlack7,
          drawerType: 'slide',
          drawerStyle: {
            flex: 1,
            width: '85%',
            backgroundColor: COLORS.light,
            borderTopRightRadius: SIZES.radius + 4,
            borderBottomRightRadius: SIZES.radius + 4,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 4, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          },
          headerShown: false,
        }}
        initialRouteName="MainLayout"
        drawerContent={(props) => <ServiceDrawerContent navigation={props.navigation} />}>
        <Drawer.Screen name="MainLayout" component={MainLayout} />
      </Drawer.Navigator>
    </View>
  );
};

export default ServiceDrawer;
