import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

// Device Dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const icons = {
  magnify: require('../assets/icons/magnifying-glass.png'),
  voice: require('../assets/icons/voice.png'),
  close_mark: require('../assets/icons/close.png'),
  menu_dots: require('../assets/icons/menu-dots-vertical.png'),
  single_tick: require('../assets/icons/icons8-done-32.png'),
  double_tick: require('../assets/icons/[CITYPNG.COM]HD Grey Double Tick Check Mark Icon WhatsApp PNG - 2000x2000.png'),
  home_filled: require('../assets/icons/home-filled.png'),
  home_outlined: require('../assets/icons/home-outlined.png'),
  calendar_filled: require('../assets/icons/calendar-filled.png'),
  calendar_outlined: require('../assets/icons/calendar-outlined.png'),
  stats_filled: require('../assets/icons/stats-filled.png'),
  stats_outlined: require('../assets/icons/stats-outlined.png'),
  add_filled: require('../assets/icons/add-filled.png'),
  user_filled: require('../assets/icons/user-filled.png'),
  user_outlined: require('../assets/icons/user-outlined.png'),
  more_outlined: require('../assets/icons/more_outlined.png'),
  more_filled: require('../assets/icons/more_filled.png'),
  notification: require('../assets/icons/notification.png'),
  search: require('../assets/icons/search.png'),
  search_two: require('../assets/icons/search_two.png'),
  filter: require('../assets/icons/filter.png'),
  correct: require('../assets/icons/correct.png'),
  favourite_filled: require('../assets/icons/favourite_filled.png'),
  favourite_outlined: require('../assets/icons/favourite_outlined.png'),
  back: require('../assets/icons/back.png'),
  send: require('../assets/icons/send.png'),
  etherium: require('../assets/icons/etherium.png'),
  angle_up: require('../assets/icons/angle_up.png'),
  angle_down: require('../assets/icons/angle_down.png'),
  cross: require('../assets/icons/cross.png'),
  down: require('../assets/icons/down.png'),
  menu: require('../assets/icons/menu.png'),
  card_background: require('../assets/icons/card-background.png'),
  // logo: require('../assets/icons/logo.png'),
  girl: require('../assets/icons/girl.png'),
  background: require('../assets/icons/background.png'),
  profile_background: require('../assets/icons/attendance_baground.png'),
  left_arrow: require('../assets/icons/left_arrow.png'),
  right_arrow: require('../assets/icons/right_arrow.png'),
  spares_background: require('../assets/icons/activity_background.png'),
  services_background: require('../assets/icons/payment.png'),
  home_background: require('../assets/icons/class_background.png'),
  booking_background: require('../assets/icons/course_back.png'),
  cart_background: require('../assets/icons/ticket_back.png'),
  logs_outlined: require('../assets/icons/log-outlined.png'),
  logs_filled: require('../assets/icons/log-filled.png'),
  payment_outlined: require('../assets/icons/payment-outlined.png'),
  payment_filled: require('../assets/icons/payment-filled.png'),
  ticket_outlined: require('../assets/icons/ticket-outlined.png'),
  ticket_filled: require('../assets/icons/ticket-filled.png'),
  help_outlined: require('../assets/icons/help-center-outlined.png'),
  help_filled: require('../assets/icons/help-center-filled.png'),
  tick: require('../assets/icons/check.png'),
  pending: require('../assets/icons/pending.png'),
  logout: require('../assets/icons/logout.png'),
  calendar_color: require('../assets/icons/calendar.png'),
  course_fee: require('../assets/icons/course-fee.png'),
  amount_paid: require('../assets/icons/amount-paid.png'),
  status: require('../assets/icons/status.png'),
  payment_method: require('../assets/icons/payment-method.png'),
  notes: require('../assets/icons/notes.png'),
  video: require('../assets/icons/video.png'),
  message: require('../assets/icons/message.png'),
  scholarship: require('../assets/icons/scholarship.png'),
  library: require('../assets/icons/library.png'),
  teacher: require('../assets/icons/teacher.png'),
  sos: require('../assets/icons/sos.png'),
  services_filled: require('../assets/icons/services-filled.png'),
  services_outlined: require('../assets/icons/services-outlined.png'),
  spare_filled: require('../assets/icons/spare-filled.png'),
  spare_outlined: require('../assets/icons/spare-outlined.png'),
  booking_filled: require('../assets/icons/booking-filled.png'),
  booking_outlined: require('../assets/icons/booking-outlined.png'),
  cart_filled: require('../assets/icons/cart-filled.png'),
  cart_outlined: require('../assets/icons/cart-outlined.png'),
  faq: require('../assets/icons/conversation.png'),
  settings: require('../assets/icons/setting.png'),
};

export const Styles = {
  item: {
    padding: 10,
    fontSize: 18,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  searchBackground: {
    marginBottom: 12,
    padding: 2,
    borderRadius: 8,
  },
};

export const screens = {
  main_layout: 'MainLayout',
  home: 'Home',
  services: 'Services',
  sos: 'SOS',
  spare_parts: 'Spare Parts',
  profile: 'Profile',
};

export const bottom_tabs = [
  {
    id: 0,
    label: screens.home,
    icon: icons.home_outlined,
    activeIcon: icons.home_filled,
  },
  {
    id: 1,
    label: screens.services,
    icon: icons.services_outlined,
    activeIcon: icons.services_filled,
  },
  {
    id: 2,
    label: screens.sos,
    icon: icons.sos,
    activeIcon: icons.sos,
  },
  {
    id: 3,
    label: screens.spare_parts,
    icon: icons.spare_outlined,
    activeIcon: icons.spare_filled,
  },
  {
    id: 4,
    label: screens.profile,
    icon: icons.user_outlined,
    activeIcon: icons.user_filled,
  },
];

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Error
  error: 'rgba(246, 86, 93, 1)',
  error80: 'rgba(246, 86, 93, 0.8)',
  error60: 'rgba(246, 86, 93, 0.6)',
  error20: 'rgba(246, 86, 93, 0.2)',
  error08: 'rgba(246, 86, 93, 0.08)',

  // Warning
  warning: 'rgba(255, 199, 46, 1)',
  warning80: 'rgba(255, 199, 46, 0.8)',
  warning60: 'rgba(255, 199, 46, 0.6)',
  warning40: 'rgba(255, 199, 46, 0.4)',
  warning20: 'rgba(255, 199, 46, 0.2)',
  warning08: 'rgba(255, 199, 46, 0.08)',

  indigo: {
    100: '#d0d9f7',
    200: '#a2b3ef',
    300: '#738ce6',
    400: '#4566de',
    500: '#1640d6',
    600: '#1233ab',
    700: '#0d2680',
    800: '#091a56',
    900: '#040d2b',
  },
  // Primary
  primary: '#9b111e',
  primary_01: '#c22d3e',
  primary_02: '#e0646f',
  primary_03: '#f09ca3',
  primary_04: '#f8d4d8',
  primary_text: '#600912',
  primary_borders: '#7f0d18',
  primary_active: '#40060c',

  // Secondary
  secondary: 'rgba(161, 219, 245)',
  secondary80: 'rgba(161, 219, 245, 0.8)',
  secondary60: 'rgba(161, 219, 245, 0.6)',
  secondary40: 'rgba(161, 219, 245, 0.4)',
  secondary30: 'rgba(161, 219, 245, 0.3)',
  secondary20: 'rgba(161, 219, 245, 0.2)',
  secondary08: 'rgba(161, 219, 245, 0.08)',

  // Success
  sucesss_darkgreen: '#218c75',
  success_lightgreen: '#82dd55',
  success_lightgreen_01: 'rgba(220, 252, 231, 0.8)',
  success: 'rgba(253, 212, 70, 1)',
  success80: 'rgba(253, 212, 70, 0.8)',
  success60: 'rgba(253, 212, 70, 0.6)',
  success20: 'rgba(253, 212, 70, 0.2)',
  success08: 'rgba(253, 212, 70, 0.08)',

  // Dark
  dark: 'rgba(13, 15, 35, 1)',
  dark80: 'rgba(13, 15, 35, 0.8)',
  dark60: 'rgba(13, 15, 35, 0.6)',
  dark40: 'rgba(13, 15, 35, 0.4)',
  dark20: 'rgba(13, 15, 35, 0.2)',
  dark08: 'rgba(13, 15, 35, 0.08)',

  // Grey
  grey: 'rgba(160, 161, 180, 1)',
  grey80: 'rgba(160, 161, 180, 0.8)',
  grey60: 'rgba(160, 161, 180, 0.6)',
  grey40: 'rgba(160, 161, 180, 0.4)',
  grey20: 'rgba(160, 161, 180, 0.2)',
  grey08: 'rgba(160, 161, 180, 0.08)',

  // Light Grey
  lightGrey: 'rgba(247, 247, 247, 1)',
  lightGrey80: 'rgba(247, 247, 247, 0.8)',
  lightGrey60: 'rgba(247, 247, 247, 0.6)',
  lightGrey20: 'rgba(247, 247, 247, 0.2)',
  lightGrey08: 'rgba(247, 247, 247, 0.08)',
  lightGrey05:'#f2f2f2',

  // Light
  light: 'rgba(255, 255, 255, 1)',
  light80: 'rgba(255, 255, 255, 0.8)',
  light60: 'rgba(255, 255, 255, 0.6)',
  light20: 'rgba(255, 255, 255, 0.2)',
  light08: 'rgba(255, 255, 255, 0.08)',

  // Support 1
  support1: 'rgba(110, 162, 255, 1)',
  support1_08: 'rgba(110, 162, 255, 0.08)',

  // Support 2
  support2: 'rgba(249, 161, 218, 1)',
  support2_08: 'rgba(249, 161, 218, 0.08)',

  // Support 3
  support3: 'rgba(0, 210, 224, 1)',
  support3_08: 'rgba(0, 210, 224, 0.08)',

  // Support 4
  support4: 'rgba(255, 132, 13, 1)',
  support4_04: 'rgb(242, 163, 83)',
  support4_08: 'rgba(255, 132, 13, 0.08)',

  // Support 5
  support5: 'rgba(123, 96, 238, 1)',
  support5_4: 'rgba(123, 96, 238, 0.4)',
  support5_08: 'rgba(123, 96, 238, 0.08)',

  // Shadow
  shadow: 'rgba(138, 149, 158, 1)',
  shadow08: 'rgba(138, 149, 158, 0.08)',

  lightGray1: '#DDDDDD',
  lightGray2: '#F5F5F8',
  white2: '#FBFBFB',
  white: '#FFFFFF',
  black: '#000000',

  buttonbg1: '#4CAF50',

  transparent: 'transparent',
  transparentWhite1: 'rgba(255, 255, 255, 0.1)',
  transparentBlack1: 'rgba(0, 0, 0, 0.1)',
  transparentBlack7: 'rgba(0, 0, 0, 0.7)',
};

export const SIZES = {
  // global sizes
  full: wp('100%'), // Responsive full width
  extraSmall: wp('1%'), // Responsive base size
  small: wp('2%'), // Responsive base size
  radius: wp('3%'), // Responsive radius
  base: wp('4%'), // Responsive base size
  padding: wp('5%'), // Responsive padding
  margin: wp('6%'), // Responsive margin
  extra: wp('7%'),
  font: RFValue(14), // Responsive font size

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h2_01: 20,
  h2_02: 18,
  h2_03: 24,
  h3: 16,
  h4: 14,
  h5: 12,
  h6: 10,
  h7: 8,
  h8: 6,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  body6: 10,
  body7: 8,
  body8: 6,
  body9: 4,
  newbody: 35,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontFamily: 'Poppins-Black', fontSize: SIZES.largeTitle },
  h1: {
    fontFamily: 'Poppins-Bold',
    fontSize: SIZES.h1,
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'Poppins-Bold',
    fontSize: SIZES.h2,
    lineHeight: 30,
  },
  h2_01: {
    fontFamily: 'Poppins-Bold',
    fontSize: SIZES.h2_01,
    lineHeight: 30,
  },
  h2_02: {
    fontFamily: 'Poppins-Bold',
    fontSize: SIZES.h2_02,
    lineHeight: 30,
  },
  h3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: SIZES.h3,
    lineHeight: 22,
  },
  h4: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: SIZES.h4,
    lineHeight: 22,
  },
  h5: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: SIZES.h5,
    lineHeight: 22,
  },
  h6: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: SIZES.h6,
    lineHeight: 22,
  },
  h7: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: SIZES.h7,
  },
  h8: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: SIZES.h8,
  },
  body1: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body5,
    // lineHeight: RFValue(12),
  },
  body6: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body6,
  },
  body7: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body7,
  },
  body8: {
    fontFamily: 'Poppins-Regular',
    fontSize: SIZES.body8,
  },
};

// Spacing
export const SPACING = {
  small: wp('4%'), // Responsive small spacing
  medium: wp('8%'), // Responsive medium spacing
  medium_01: wp('9%'), // Responsive medium spacing
  medium_02: wp('10%'), // Responsive medium spacing
  large: wp('12%'), // Responsive large spacing
  xl: wp('16%'), // Responsive extra large spacing
  xl_01: wp('18%'), // Responsive extra large spacing
  xl_02: wp('20%'), // Responsive extra large spacing
  xl_03: wp('22%'), // Responsive extra large spacing
  xxl: wp('24%'), // Responsive extra extra large spacing
  xxxl: wp('32%'), // Responsive extra extra extra large spacing
};

// Elevation
export const ELEVATION = {
  low: wp('1%'), // Responsive low elevation
  medium: wp('2%'), // Responsive medium elevation
  high: wp('4%'), // Responsive high elevation
};
