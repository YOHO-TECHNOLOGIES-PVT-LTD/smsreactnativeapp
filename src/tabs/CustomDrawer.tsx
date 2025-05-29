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
        backgroundColor: isFocused ? COLORS.transparentBlack1 : undefined,
      }}
      onPress={onPress}>
      <Image
        source={icon}
        style={{
          width: 20,
          height: 20,
          tintColor: COLORS.white,
        }}
      />
      <Text
        style={{
          marginLeft: 15,
          color: COLORS.white,
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

const StudentDrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => {
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
              style={{ height: 20, width: 20, tintColor: COLORS.white }}
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
            source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Ash' }}
            onError={() => setError(true)}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <View style={{ marginLeft: SIZES.radius, flex: 1 }}>
            <Text style={{ color: COLORS.white, ...FONTS.h4, flexShrink: 1 }}>Username</Text>
            <Text style={{ color: COLORS.lightGrey80, ...FONTS.h6 }}>ID: N/A</Text>
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
            icon={selectedTab === screens.services ? icons.course_filled : icons.course_outlined}
            isFocused={selectedTab === screens.services}
            onPress={() => {
              dispatch(setSelectedTab(screens.services));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.sos}
            icon={selectedTab === screens.sos ? icons.class_filled : icons.class_outlined}
            isFocused={selectedTab === screens.sos}
            onPress={() => {
              dispatch(setSelectedTab(screens.sos));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.spare_parts}
            icon={
              selectedTab === screens.spare_parts ? icons.calendar_filled : icons.calendar_outlined
            }
            isFocused={selectedTab === screens.spare_parts}
            onPress={() => {
              dispatch(setSelectedTab(screens.spare_parts));
              navigation.navigate('MainLayout');
            }}
          />
          <CustomDrawerItem
            label={screens.profile}
            icon={selectedTab === screens.profile ? icons.account_filled : icons.account_outlined}
            isFocused={selectedTab === screens.profile}
            onPress={() => {
              dispatch(setSelectedTab(screens.profile));
              navigation.navigate('MainLayout');
            }}
          />

          <View
            style={{
              height: 1,
              marginVertical: SIZES.radius,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.lightGray1,
            }}
          />

          <CustomDrawerItem
            label="Activity Logs"
            icon={icons.logs_outlined}
            onPress={() => navigation.navigate('ActivityLogScreen')}
          />
          <CustomDrawerItem
            label="Bookings"
            icon={icons.payment_outlined}
            onPress={() => navigation.navigate('PaymentScreen')}
          />
          <CustomDrawerItem
            label="Booking Cart"
            icon={icons.ticket_outlined}
            onPress={() => navigation.navigate('TicketsScreen')}
          />
          <CustomDrawerItem
            label="Help Center"
            icon={icons.help_outlined}
            onPress={() => navigation.navigate('HelpcenterScreen')}
          />
          <CustomDrawerItem
            label="FAQs"
            icon={icons.help_outlined}
            onPress={() => navigation.navigate('HelpcenterScreen')}
          />
        </View>

        <View style={{ marginBottom: SIZES.padding }}>
          <CustomDrawerItem label="Logout" icon={icons.logout} onPress={handleLogout} />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const StudentDrawer: React.FC = () => {
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
            backgroundColor: COLORS.primary,
          },
          headerShown: false,
        }}
        initialRouteName="MainLayout"
        drawerContent={(props) => <StudentDrawerContent navigation={props.navigation} />}>
        <Drawer.Screen name="MainLayout" component={MainLayout} />
      </Drawer.Navigator>
    </View>
  );
};

export default StudentDrawer;
