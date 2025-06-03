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

type CustomDrawerItemProps = {
  label: string;
  icon: ImageSourcePropType;
  isFocused?: boolean;
  onPress: () => void;
};

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({ label, icon, isFocused, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 40,
        marginBottom: SIZES.base,
        alignItems: 'center',
        paddingLeft: SIZES.radius,
        borderRadius: SIZES.small,
        backgroundColor: isFocused ? COLORS.error08 : undefined,
      }}
      onPress={onPress}>
      <Image
        source={icon}
        style={{
          width: 20,
          height: 20,
          tintColor: COLORS.primary,
        }}
      />
      <Text
        style={{
          marginLeft: SIZES.radius,
          color: COLORS.primary,
          ...FONTS.h4,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

type DrawerContentProps = {
  navigation: DrawerNavigationProp<any>;
};

const ServiceDrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state: RootState) => state.tabReducer.selectedTab);
  const [error, setError] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure, you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = '';
              if (response) {
                toast.success('', 'Logout Successfully.');
                navigation.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
              } else {
                toast.error(
                  'Logout Failed',
                  'There was an issue logging you out. Please try again.'
                );
              }
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
    <DrawerContentScrollView scrollEnabled contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: SIZES.radius }}>
        <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              width: '100%',
              paddingTop: SIZES.small,
            }}
            onPress={() => navigation.closeDrawer()}>
            <Image
              source={icons?.cross}
              style={{ height: 20, width: 20, tintColor: COLORS.primary }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: SIZES.radius, alignItems: 'center' }}
          onPress={() => {
            dispatch(setSelectedTab(screens.profile));
            navigation.navigate('MainLayout');
          }}>
          <Image
            source={require('../assets/images/profile_picture.jpg')}
            onError={() => setError(true)}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <View style={{ marginLeft: SIZES.radius, flex: 1 }}>
            <Text style={{ color: COLORS.primary_text, ...FONTS.h2_01, flexShrink: 1 }}>
              YM User
            </Text>
            <Text style={{ color: COLORS.primary_text, ...FONTS.h5 }}>ID: #YMU_1234</Text>
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1, marginTop: SIZES.padding }}>
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
          />
          {/* <CustomDrawerItem
            label="Settings"
            icon={icons.settings}
            onPress={() => navigation.navigate('SettingsScreen')}
          />
          <CustomDrawerItem
            label="Help Center"
            icon={icons.help_outlined}
            onPress={() => navigation.navigate('HelpCenterScreen')}
          />
          <CustomDrawerItem
            label="FAQs"
            icon={icons.faq}
            onPress={() => navigation.navigate('FAQsScreen')}
          /> */}
          <View
            style={{
              height: 1,
              marginVertical: SIZES.radius,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.primary_text,
            }}
          />
          <View style={{ marginTop: SIZES.radius }}>
            <CustomDrawerItem label="Logout" icon={icons.logout} onPress={handleLogout} />
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const ServiceDrawer: React.FC = () => {
  const Drawer = createDrawerNavigator();
  const animatedValue = useSharedValue(0);
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  useEffect(() => {
    // Handle any logout callback registration logic if needed
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Drawer.Navigator
        screenOptions={{
          overlayColor: 'transparent',
          drawerType: 'back',
          drawerStyle: {
            flex: 1,
            width: '100%',
            paddingRight: 20,
            backgroundColor: COLORS.primary_04,
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
