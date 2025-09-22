import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ImageSourcePropType } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import MainLayout from '../layout';
import { COLORS, FONTS, SIZES, screens, icons } from '../constants';
import { useSharedValue } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTab } from '../store/tab/tabSlice';
import { useNavigation } from '@react-navigation/native';
import toast from '../utils/toast';
import { RootState } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfileDetails } from '~/features/profile/service';
import { getImageUrl } from '~/utils/imageUtils';

type CustomDrawerItemProps = {
  label: string;
  icon: ImageSourcePropType;
  isFocused?: boolean;
  onPress: () => void;
  isDivider?: boolean;
};

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({ 
  label, 
  icon, 
  isFocused, 
  onPress,
  isDivider = false 
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
          // Add subtle shadow for focused items
          ...(isFocused && {
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }),
        }}
        onPress={onPress}
        activeOpacity={0.7}>
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
        <Text
          style={{
            flex: 1,
            color: isFocused ? COLORS.primary : COLORS.primary_text,
            ...FONTS.h4,
            fontWeight: isFocused ? '600' : '400',
          }}>
          {label}
        </Text>
        {isFocused && (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.primary,
            }}
          />
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
  const dispatch = useDispatch();
  const selectedTab = useSelector((state: RootState) => state.tabReducer.selectedTab);
  const [error, setError] = useState(false);
  const [profileData, setProfileData] = useState<any>({});

  const fetchProfile = async () => {
    try {
      const response: any = await getUserProfileDetails({});
      setProfileData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              toast.success('', 'Logout Successfully.');
              navigation.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
            } catch (error) {
              toast.error('Error', 'An error occurred during logout. Please try again later.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <DrawerContentScrollView 
      scrollEnabled 
      contentContainerStyle={{ flex: 1 }}
      showsVerticalScrollIndicator={false}>
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
              style={{ height: 16, width: 16, tintColor: COLORS.primary }}
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
                source={
                  profileData?.image && !error
                    ? { uri: getImageUrl(profileData?.image) }
                    : require('../assets/images/profile_picture.jpg')
                }
                onError={() => setError(true)}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
            <View style={{ marginLeft: SIZES.radius, flex: 1 }}>
              <Text 
                style={{ 
                  color: COLORS.primary_text, 
                  ...FONTS.h3, 
                  fontWeight: '600',
                  marginBottom: 2,
                }}
                numberOfLines={1}>
                {profileData?.firstName && profileData?.lastName 
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : 'User Name'}
              </Text>
              <Text 
                style={{ 
                  color: COLORS.grey60, 
                  ...FONTS.h6,
                  textTransform: 'capitalize',
                }}
                numberOfLines={1}>
                {profileData?.role || 'Role'}
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
            icon={icons.booking_outlined}
            onPress={() => navigation.navigate('BookingsScreen')}
          />
          <CustomDrawerItem
            label="Booking Cart"
            icon={icons.cart_outlined}
            onPress={() => navigation.navigate('BookingCartScreen')}
            isDivider={true}
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
              onPress={handleLogout}
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
                <Image
                  source={icons.logout}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: COLORS.error,
                  }}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  color: COLORS.error,
                  ...FONTS.h4,
                  fontWeight: '500',
                }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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