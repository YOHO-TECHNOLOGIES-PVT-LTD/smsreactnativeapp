import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  ActivityIndicator,
  Easing,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {
  User,
  Edit,
  Verified,
  Wrench,
  ShoppingCart,
  Car,
  Plus,
  Mail,
  Phone,
  MapPin,
  Bell,
  Clock,
  Truck,
  Tag,
  CreditCard,
  Shield,
  Settings,
  LogOut,
  X,
  Camera,
  ChevronRight,
  RotateCcw,
  Trash2,
  HelpCircle,
  FileText,
  MessageCircle,
  Star,
  ArrowLeft,
  ExternalLink,
  Lock,
  ChevronDown,
  ChevronUp,
  Calendar,
  Award,
  Zap,
  AlertCircle,
  Info,
  TrendingUp,
  Activity,
  Gauge,
  MoreVertical,
  MapPinHouse,
  Building2,
  BookUser,
  Fuel,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserProfileDetails, updateUserProfileDetails } from '~/features/profile/service';
import { COLORS, FONTS, icons, screens } from '~/constants';
import toast from '~/utils/toast';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedUserDummy from '~/components/profile/AnimatedUserDummy';
import LoadingAnimation from '~/components/LoadingAnimation';
import PhoneDialerButton from '~/components/PhoneDialerButton';
import { selectToken } from '~/features/token/redux/selectors';
import { getToken, logout } from '~/features/token/redux/thunks';
import { AppDispatch } from '~/store';
import CustomLogoutModal from '~/components/CustomLogoutModal';
import { getAllBookingsCartItems } from '~/features/bookings/service';
import { formatDate, formatDateandmonth, formatDateMonthandYear } from '../../utils/formatDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { Feather } from '@expo/vector-icons';
import { uploadSingleFileorImage } from '~/features/common/service';
import { getImageUrl } from '~/utils/imageUtils';

const { width, height } = Dimensions.get('window');

const COLORS1 = {
  // Primary colors1 - Refined Deep Crimson Theme
  primary: '#0050A5',
  primaryLight: '#4566de',
  primaryDark: '#0050A5',
  primaryUltraLight: '#d8e1ef',
  primaryBorder: '#BED0EC',

  // Background colors1
  background: '#0050A5',
  backgroundGradient: ['#0050A5', '#BED0EC'],

  // Card colors1 with sophisticated combinations
  cardPrimary: '#FFFFFF',
  cardSecondary: '#F8FAFC',
  cardTertiary: '#F1F5F9',
  cardprimary: '#FEF7FF',
  cardSuccess: '#F0FDF4',
  cardWarning: '#FFFBEB',
  cardError: '#FEF2F2',
  cardInfo: '#EFF6FF',

  primaryinfo: ['#2563EB', '#3B82F6'],

  // Status colors1
  success: '#82dd55',
  successLight: '#10B981',
  successDark: '#047857',
  warning: 'rgba(255, 132, 13, 1)',
  warningLight: '#F59E0B',
  error: '#DC2626',
  errorLight: '#EF4444',
  info: '#2563EB',
  infoLight: '#3B82F6',

  // Neutral colors1
  white: '#FFFFFF',
  black: '#000000',
  gray50: 'rgba(247, 247, 247, 1)',
  gray100: 'rgba(247, 247, 247, 0.9)',
  gray200: 'rgba(247, 247, 247, 0.8)',
  gray300: 'rgba(247, 247, 247, 0.7)',
  gray400: 'rgba(247, 247, 247, 0.5)',
  gray500: 'rgba(247, 247, 247, 0.4)',
  gray600: 'rgba(247, 247, 247, 0.3)',
  gray700: 'rgba(247, 247, 247, 0.2)',
  gray800: 'rgba(247, 247, 247, 0.08)',
  gray900: '#111827',

  // Shadow colors1
  shadow: 'rgba(255, 255, 255, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.7)',

  // Special gradient combinations
  gradientPrimary: ['#0050A5', '#BED0EC'] as [string, string],
  gradientprimary: ['#D97706', '#F59E0B'] as [string, string],
  gradientSuccess: ['#059669', '#10B981'] as [string, string],
  gradientInfo: ['#2563EB', '#3B82F6'] as [string, string],
  gradientNeutral: ['#F8FAFC', '#F1F5F9'] as [string, string],
};

// Enhanced Type Definitions
interface Vehicle {
  id: string | number;
  registerNumber: string;
  model: string;
  year: string;
  fuleType: string;
  company: string;
  make?: string;
}

interface Service {
  id: string;
  type: string;
  date: string;
  cost: string;
  description: string;
  status: 'completed' | 'pending' | 'scheduled';
  technician?: string;
  location?: string;
  duration?: string;
}

interface Order {
  _id: any;
  date: string;
  items: OrderItem[];
  products: [];
  services: [];
  amount: string;
  status: 'pending' | 'delivered';
  trackingNumber?: string;
  confirm_Date?: string;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  image: string;
  partNumber?: string;
  warranty?: string;
}

interface MenuItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface VehicleItemProps {
  vehicle: Vehicle;
  onPress: () => void;
}

interface CarStatusProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const Profile = () => {
  const TokenSelector = useSelector(selectToken);
  const dispatch = useDispatch<AppDispatch>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [profileImageLogo, setProfileImageLogo] = useState<any>('');
  const phoneNumber = '+91-9876543210';
  const didFetch = useRef(false);
  const [bookingOrders, setBookingOrders] = useState<{
    serviceConfirm?: any[];
    productConfirm?: any[];
    success?: boolean;
  } | null>(null);
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    contact_info: {
      city: '',
      state: '',
      phoneNumber: '',
      address1: '',
      address2: '',
    },
    vehicleInfo: [
      {
        registerNumber: '',
        model: '',
        company: '',
        fuleType: '',
        year: '',
      },
    ],
  });

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

  const fetchUserProfile = async () => {
    try {
      const response: any = await getUserProfileDetails({});
      if (response) {
        await AsyncStorage.setItem('userId', response?._id);
        setProfileImageLogo(response?.image);
        setFormData({
          firstName: response?.firstName,
          lastName: response?.lastName,
          email: response?.email,
          image: response?.image,
          contact_info: {
            city: response?.contact_info?.city,
            state: response?.contact_info?.state,
            phoneNumber: response?.contact_info?.phoneNumber,
            address1: response?.contact_info?.address1,
            address2: response?.contact_info?.address2,
          },
          vehicleInfo: response?.vehicleInfo || [
            {
              registerNumber: '',
              model: '',
              company: '',
              fuleType: '',
              year: '',
            },
          ],
        });
        setProfileData(response);
      }
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getAllBookingsCartItems({});
      if (response?.success) {
        const allOrders = [...(response.productConfirm || []), ...(response.serviceConfirm || [])];
        setOrders(allOrders);
        setBookingOrders(response);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (TokenSelector && !didFetch.current) {
      fetchUserProfile();
      fetchOrders();
      didFetch.current = true;
    }
  }, [TokenSelector]);

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    profileImage: null as string | null,
    notifications: '',
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [vehicleDetailModal, setVehicleDetailModal] = useState(false);
  const [orderDetailModal, setOrderDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [photoUploadModal, setPhotoUploadModal] = useState(false);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false);
  const [helpCentreModal, setHelpCentreModal] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [editForm, setEditForm] = useState({ ...userInfo });
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    vehicles: false,
    orders: false,
    settings: false,
  });

  const slideAnims = useRef(
    Array(8)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;
  const fadeAnims = useRef(
    Array(8)
      .fill(0)
      .map(() => new Animated.Value(1))
  ).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  // Side Menu Animation - Modified for left to right
  const sideMenuTranslateX = useRef(new Animated.Value(-width)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // 360 Degree Car Image State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  // Enhanced Pan Responder for 360° Car View
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const dx = gestureState.dx;
        const sensitivity = 5;

        if (Math.abs(dx) > sensitivity) {
          const direction = dx > 0 ? -1 : 1;
          const newIndex = (currentImageIndex + direction + 36) % 36;
          setCurrentImageIndex(newIndex);
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const termsData = [
    {
      id: 1,
      title: 'Acceptance of Terms',
      content:
        'By accessing or using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.',
    },
    {
      id: 2,
      title: 'Service Description',
      content:
        'Our platform provides vehicle maintenance and repair services, including but not limited to scheduling appointments, ordering parts, and tracking service history.',
    },
    {
      id: 3,
      title: 'User Responsibilities',
      content:
        'You are responsible for providing accurate vehicle information, maintaining the confidentiality of your account credentials, and ensuring your vehicle is available at scheduled service times.',
    },
    {
      id: 4,
      title: 'Payments and Fees',
      content:
        'All services must be paid in full at the time of service unless otherwise agreed. We accept various payment methods as listed in our payment section. Late payments may incur additional fees.',
    },
    {
      id: 5,
      title: 'Cancellation Policy',
      content:
        'Appointments may be cancelled or rescheduled up to 24 hours in advance without penalty. Late cancellations may be subject to a fee equal to 50% of the service cost.',
    },
    {
      id: 6,
      title: 'Limitation of Liability',
      content:
        'We are not liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
    },
  ];

  useEffect(() => {
    const savedImage = getUserProfileImage();
    if (savedImage) {
      setUserInfo((prev) => ({ ...prev, profileImage: savedImage }));
      setEditForm((prev) => ({ ...prev, profileImage: savedImage }));
    }
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission required',
            'Sorry, we need camera roll permissions to upload photos.'
          );
        }
      }
    })();

    slideAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  // Side Menu Functions - Modified for left to right animation
  const openSideMenu = () => {
    setSideMenuVisible(true);
    setExpandedSections({
      vehicles: false,
      orders: false,
      settings: false,
    });
    Animated.parallel([
      Animated.timing(sideMenuTranslateX, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSideMenu = () => {
    Animated.parallel([
      Animated.timing(sideMenuTranslateX, {
        toValue: -width,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSideMenuVisible(false);
      setExpandedSections({
        vehicles: false,
        orders: false,
        settings: false,
      });
    });
  };

  // Toggle individual sections
  const toggleSection = (section: 'vehicles' | 'orders' | 'settings') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Utility Functions
  const saveUserProfileImage = (imageUri: string) => {};

  const getUserProfileImage = () => {
    return null;
  };

  const animateCardPress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => callback && callback());
  };

  const handleEditProfile = () => {
    if (TokenSelector) {
      setEditForm({ ...userInfo });
      setEditProfileModal(true);
    } else {
      setLogoutModalVisible(true);
    }
  };

  const handleSaveProfile = async () => {
    Animated.sequence([
      Animated.timing(headerOpacity, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const response: any = await updateUserProfileDetails(formData);
      if (response) {
        setEditProfileModal(false);
        fetchUserProfile();
        toast.success('Success', 'Profile updated successfully!');
      }
      fetchUserProfile();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddVehicle = async () => {
    try {
      if (!formData.newVehicle) {
        toast.error('Error', 'Please fill all required fields');
        return;
      }
      const newVehicle = {
        registerNumber: formData.newVehicle.registerNumber,
        model: formData.newVehicle.model,
        company: formData.newVehicle.company,
        fuleType: formData.newVehicle.fuleType,
        year: formData.newVehicle.year,
      };

      const response: any = await updateUserProfileDetails({
        ...formData,
        vehicleInfo: [...(formData.vehicleInfo || []), newVehicle],
      });
      if (response) {
        setAddVehicleModal(false);
        setFormData((prev: any) => ({
          ...prev,
          newVehicle: undefined,
        }));
        fetchUserProfile();
        toast.success('Success', 'Vehicle added successfully!');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error', 'Failed to add vehicle');
    }
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setVehicleDetailModal(true);
  };

  const handleDeleteVehicle = (vehicleId: any) => {
    Alert.alert('Delete Vehicle', 'Are you sure you want to delete this vehicle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // setVehicles(vehicles.filter((v) => v.id !== vehicleId));
          setVehicleDetailModal(false);
          toast.success('Success', 'Vehicle deleted successfully');
        },
      },
    ]);
  };

  const OBJECT_ID = profileData._id;

  const pickImage = async () => {
    setPhotoUploadModal(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        // prepare FormData
        const formData = new FormData();
        formData.append('file', {
          uri: localUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);

        const uploadResponse = await uploadSingleFileorImage({ userId: OBJECT_ID }, formData);
        if (uploadResponse?.data.image) {
          const uploadedUrl = uploadResponse.data.image;

          setFormData((prev: any) => ({ ...prev, image: uploadedUrl }));
          saveUserProfileImage(uploadedUrl);
        } else {
          Alert.alert('Upload Failed', 'Could not upload image.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setPhotoUploadModal(false);
    }
  };

  const handlePhotoUpload = () => {
    if (TokenSelector) {
      Alert.alert('Upload Photo', 'Choose photo source', [
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel', onPress: () => setPhotoUploadModal(false) },
      ]);
      // const response = uploadSingleFileorImage(currentImage,'ewkfmo')
      // setUploadedImage(response)
    } else {
      setLogoutModalVisible(true);
    }
  };

  const handleLogout = () => {
    try {
      setIsLoading(true);
      dispatch(logout());
      toast.success('Logged out', 'You have been successfully logged out');
      setIsLoading(false);
      setLogoutModalVisible(false);
    } catch (error) {
      toast.error('Logout failed', 'Could not complete logout. Please try again.');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
      setLogoutModalVisible(false);
    }
  };
  const handleEmailPress = () => {
    const email = 'support@example.com';
    const subject = 'Support Request';
    const body = 'Hello, I need help with...';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl).catch((err) => console.error('Failed to open email app:', err));
  };

  const MenuItem: React.FC<MenuItemProps> = ({
    title,
    subtitle,
    onPress,
    rightElement,
    icon,
    badge,
  }) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => onPress && animateCardPress(onPress)}
        activeOpacity={0.8}>
        <View style={styles.menuItemContent}>
          {icon && <View style={styles.menuItemIcon}>{icon}</View>}
          <View style={styles.menuItemText}>
            <View style={styles.menuItemTitleContainer}>
              <Text style={styles.menuItemTitle}>{title}</Text>
              {badge && (
                <View style={styles.menuItemBadge}>
                  <Text style={styles.menuItemBadgeText}>{badge}</Text>
                </View>
              )}
            </View>
            {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const VehicleItem = ({ vehicle, onPress }: any) => {
    if (!vehicle || !Array.isArray(vehicle)) {
      return null;
    }

    return (
      <>
        {vehicle?.map((v, index) => (
          <View style={styles.menuItem} key={index}>
            <TouchableOpacity style={styles.menuItemContent} onPress={() => {}} activeOpacity={0.8}>
              <View style={[styles.menuItemIcon, styles.vehicleIconContainer]}>
                <Car size={20} color={COLORS.primary} />
              </View>
              <View style={styles.menuItemText}>
                <View style={styles.vehicleItemHeader}>
                  <Text style={styles.menuItemTitle}>
                    {v.year} {v.company} {v.model}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </>
    );
  };

  const OrderItem = ({ order }: { order: Order }) => {
    const getStatusColor = () => {
      switch (order.status) {
        case 'pending':
          return COLORS1.warning;
        case 'delivered':
          return COLORS1.success;
        default:
          return COLORS1.gray500;
      }
    };

    return (
      <View style={styles.menuItem}>
        <TouchableOpacity
          style={styles.menuItemContent}
          onPress={() => {
            navigation.navigate('BookingsScreen' as never);
          }}
          activeOpacity={0.8}>
          <View style={[styles.menuItemIcon, styles.orderIconContainer]}>
            <ShoppingCart size={18} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemTitle}>Order #{order?._id?.substring(0, 8)}</Text>
            <Text style={styles.menuItemSubtitle}>
              {order?.products ? order?.products?.length : order?.services?.length} items - &#8377;{' '}
              {order?.amount}
            </Text>
            {order?.confirm_Date && (
              <Text style={styles.estimatedDeliveryText}>
                Date: {formatDateMonthandYear(order?.confirm_Date)}
              </Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{order?.status}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ServiceItem = ({ service }: { service: Service }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed':
          return COLORS1.success;
        case 'pending':
          return COLORS1.warning;
        case 'scheduled':
          return COLORS1.info;
        default:
          return COLORS1.gray500;
      }
    };

    return (
      <View style={styles.serviceItem}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceType}>{service.type}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service.status) }]}>
            <Text style={styles.statusText}>{service.status}</Text>
          </View>
        </View>
        <Text style={styles.serviceDescription}>{service.description}</Text>

        {/* Enhanced service details */}
        <View style={styles.serviceDetailsContainer}>
          {service.technician && (
            <View style={styles.serviceDetailItem}>
              <User size={12} color={'gray'} />
              <Text style={styles.serviceDetailText}>{service.technician}</Text>
            </View>
          )}
          {service.location && (
            <View style={styles.serviceDetailItem}>
              <MapPin size={12} color={'gray'} />
              <Text style={styles.serviceDetailText}>{service.location}</Text>
            </View>
          )}
          {service.duration && (
            <View style={styles.serviceDetailItem}>
              <Clock size={12} color={'gray'} />
              <Text style={styles.serviceDetailText}>{service.duration}</Text>
            </View>
          )}
        </View>

        <View style={styles.serviceFooter}>
          <Text style={styles.serviceDate}>{service.date}</Text>
          <Text style={styles.serviceCost}>{service.cost}</Text>
        </View>
      </View>
    );
  };

  const TermsItem = ({
    term,
    isExpanded,
    onToggle,
  }: {
    term: any;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity style={styles.faqItem} onPress={onToggle} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{term.title}</Text>
        {isExpanded ? (
          <ChevronUp size={20} color={COLORS.primary} />
        ) : (
          <ChevronDown size={20} color={COLORS.primary} />
        )}
      </View>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{term.content}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Enhanced Car Status Component
  const CarStatusBar = ({ label, value, color, icon }: CarStatusProps) => {
    return (
      <View style={styles.carStatusBarContainer}>
        <View style={styles.carStatusLabelContainer}>
          <View style={styles.carStatusIconContainer}>
            {icon}
            <Text style={styles.carStatusLabel}>{label}</Text>
          </View>
          <Text style={styles.carStatusValue}>{value}%</Text>
        </View>
        <View style={styles.carStatusBarBackground}>
          <View style={[styles.carStatusBarFill, { width: `${value}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  const DropdownSection = ({
    title,
    icon,
    isExpanded,
    onToggle,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <View style={styles.dropdownSection}>
      <TouchableOpacity style={styles.dropdownSectionHeader} onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.dropdownSectionTitleContainer}>
          <View style={styles.dropdownSectionIconContainer}>{icon}</View>
          <Text style={styles.dropdownSectionTitle}>{title}</Text>
        </View>
        <View style={styles.dropdownChevronContainer}>
          {isExpanded ? (
            <ChevronUp size={20} color={'gray'} />
          ) : (
            <ChevronDown size={20} color={'gray'} />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && <View style={styles.dropdownSectionContent}>{children}</View>}
    </View>
  );

  // Side Menu Content Render Functions
  const renderVehiclesContent = () => (
    <>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <Car size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>My Vehicles</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, styles.fullWidthButton]}
          onPress={() => setAddVehicleModal(true)}
          activeOpacity={0.8}>
          <Plus size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        {formData?.vehicleInfo ? (
          <View>
            <VehicleItem
              vehicle={formData?.vehicleInfo}
              onPress={() => handleVehiclePress(formData?.vehicleInfo)}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Car size={48} color={COLORS.primary_03} />
            </View>
            <Text style={styles.emptyStateText}>No vehicles added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first vehicle to track services and maintenance
            </Text>
            <TouchableOpacity
              style={[styles.addButton, styles.fullWidthButton]}
              onPress={() => setAddVehicleModal(true)}
              activeOpacity={0.8}>
              <Plus size={16} color={COLORS1.white} />
              <Text style={styles.addButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Enhanced Vehicle Tips Section */}
      {formData?.vehicleInfo?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIconContainer}>
              <Info size={20} color={COLORS1.primary} />
            </View>
            <Text style={styles.sectionTitle}>Maintenance Tips</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Gauge size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.tipTitle}>Check Tire Pressure</Text>
              <Text style={styles.tipDescription}>
                Maintain proper tire pressure to improve fuel efficiency and extend tire life.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Zap size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.tipTitle}>Battery Health</Text>
              <Text style={styles.tipDescription}>
                Check battery terminals for corrosion and ensure connections are tight.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Wrench size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.tipTitle}>Regular Oil Changes</Text>
              <Text style={styles.tipDescription}>
                Change your oil every 5,000-7,500 miles for optimal engine performance.
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );

  const renderOrdersContent = () => (
    <View style={styles.section}>
      <View style={styles.sectionTitleContainer}>
        <View style={styles.sectionIconContainer}>
          <ShoppingCart size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.sectionTitle}>My Orders</Text>
      </View>
      <View style={styles.card}>
        {orders ? (
          orders.map((order, index) => (
            <View key={index}>
              <OrderItem order={order} />
              <View style={styles.separator} />
            </View>
          ))
        ) : (
          // <></>
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <ShoppingCart size={48} color={COLORS1.gray300} />
            </View>
            <Text style={styles.emptyStateText}>No orders yet</Text>
            <Text style={styles.emptyStateSubtext}>Your order history will appear here</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderSettingsContent = () => (
    <>
      {/* <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <Bell size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        <View style={styles.card}>
          {TokenSelector && (
            <>
              <MenuItem
                title="Service Reminders"
                subtitle="Get notified about upcoming maintenance"
                icon={<Clock size={20} color={COLORS.primary} />}
                rightElement={
                  <Switch
                    checked={notifications.serviceReminders}
                    onChange={(value) =>
                      setNotifications((prev) => ({ ...prev, serviceReminders: value }))
                    }
                  />
                }
                showArrow={false}
                onPress={() => {
                  toast.info('No updates', 'Features not available right now');
                }}
              />
              <View style={styles.separator} />
              <MenuItem
                title="Order Updates"
                subtitle="Track your spare parts orders"
                icon={<Truck size={20} color={COLORS.primary} />}
                rightElement={
                  <Switch
                    checked={notifications.orderUpdates}
                    onChange={(value) =>
                      setNotifications((prev) => ({ ...prev, orderUpdates: value }))
                    }
                  />
                }
                showArrow={false}
                onPress={() => {
                  toast.info('No updates', 'Features not available right now');
                }}
              />
              <View style={styles.separator} />
            </>
          )}
          <MenuItem
            title="Promotions & Offers"
            subtitle="Receive special deals and discounts"
            icon={<Tag size={20} color={COLORS.primary} />}
            rightElement={
              <Switch
                checked={notifications.promotions}
                onChange={(value) => setNotifications((prev) => ({ ...prev, promotions: value }))}
              />
            }
            showArrow={false}
            onPress={() => {
              toast.info('No updates', 'Features not available right now');
            }}
          />
          <View style={styles.separator} />
          <MenuItem
            title="App Updates"
            subtitle="Get notified about new features"
            icon={<Settings size={20} color={COLORS.primary} />}
            rightElement={
              <Switch
                checked={notifications.appUpdates}
                onChange={(value) => setNotifications((prev) => ({ ...prev, appUpdates: value }))}
              />
            }
            showArrow={false}
            onPress={() => {
              toast.info('No updates', 'Features not available right now');
            }}
          />
        </View>
      </View> */}

      {/* <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <Settings size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>App Settings</Text>
        </View>
        <View style={styles.card}>
          {TokenSelector && (
            <>
              <MenuItem
                title="Payment Methods"
                subtitle="Manage your payment options"
                icon={<CreditCard size={20} color={COLORS.primary} />}
                onPress={() => {
                  toast.info('No updates', 'Features not available right now');
                }}
              />
              <View style={styles.separator} />
            </>
          )}
          <MenuItem
            title="App Preferences"
            subtitle="Customize your app experience"
            icon={<Settings size={20} color={COLORS.primary} />}
            onPress={() => {
              toast.info('No updates', 'Features not available right now');
            }}
          />
        </View>
      </View> */}

      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <HelpCircle size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
        </View>
        <View style={styles.card}>
          <MenuItem
            title="Help Centre"
            subtitle="Get support and find answers"
            icon={<MessageCircle size={20} color={COLORS1.primary} />}
            onPress={() => setHelpCentreModal(true)}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Terms & Conditions"
            subtitle="Read our terms of service"
            icon={<FileText size={20} color={COLORS1.primary} />}
            onPress={() => setTermsModal(true)}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            icon={<Lock size={20} color={COLORS1.primary} />}
            onPress={() => setPrivacyPolicyModal(true)}
          />
          {/* <View style={styles.separator} />
          <MenuItem
            title="Rate Our App"
            subtitle="Share your feedback"
            icon={<Star size={20} color={COLORS1.primary} />}
            onPress={() => {
              toast.info('No updates', 'Features not available right now');
            }}
          /> */}
        </View>
      </View>

      {TokenSelector && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIconContainer}>
              <User size={20} color={COLORS1.primary} />
            </View>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <View style={styles.card}>
            <MenuItem
              title="Account Information"
              subtitle="View and edit your account details"
              icon={<User size={20} color={COLORS1.primary} />}
              onPress={handleEditProfile}
            />
            <View style={styles.separator} />
            {/* <MenuItem
              title="Delete Account"
              subtitle="Permanently delete your account"
              icon={<Trash2 size={20} color={COLORS1.primary} />}
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'Are you sure you want to permanently delete your account?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        toast.success('Deleted', 'Account deleted successfully!');
                      },
                    },
                  ]
                );
              }}
            /> */}
            <View style={styles.separator} />
            <MenuItem
              title="Logout"
              subtitle="Sign out of your account"
              icon={<LogOut size={20} color={COLORS1.primary} />}
              onPress={() => setLogoutModalVisible(true)}
            />
          </View>
        </View>
      )}
      <View style={{ marginTop: 45 }}></View>
    </>
  );

  // Add this state variable near your other useState declarations
  const [refreshing, setRefreshing] = useState(false);

  // Add this refresh function after your existing functions
  const onRefresh = async () => {
    try {
      setRefreshing(true);

      // Refresh user profile data
      if (TokenSelector) {
        await fetchUserProfile();
        await fetchOrders();
      }

      // Optional: Add a small delay for better UX
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setRefreshing(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS1.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{}}></View>
        <View style={styles.container}>
          <LoadingAnimation visible={isLoading} />
          {/* Enhanced Header with Professional Gradient */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={require('../../assets/home/LOGO.png')}
                style={{ width: 145, height: 25 }}
              />
            </TouchableOpacity>
          </View>
          <Animated.View style={{ opacity: headerOpacity, marginTop: 10, paddingHorizontal: 15 }}>
            <LinearGradient
              colors={COLORS1.gradientPrimary}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <View style={styles.profileSection}>
                <TouchableOpacity
                  onPress={() => {
                    if (formData?.image) {
                      setImageModalVisible(true);
                    }
                  }}
                  activeOpacity={0.8}>
                  <View style={styles.profileImageContainer}>
                    {formData?.image ? (
                      <Image
                        source={{ uri: getImageUrl(profileImageLogo) }}
                        accessibilityLabel={`${formData?.firstName + ' ' + formData?.lastName || 'Customer'}`}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          borderWidth: 0.5,
                          borderColor: COLORS.white,
                        }}
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <AnimatedUserDummy />
                      </View>
                    )}
                    {/* <View style={styles.cameraIcon}>
                      <Camera size={12} color={COLORS1.white} />
                    </View> */}
                  </View>
                </TouchableOpacity>
                <View style={styles.profileInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.profileName}>
                      {(TokenSelector
                        ? formData?.firstName != null &&
                          formData?.firstName + ' ' + formData?.lastName
                        : '') || 'Customer'}
                    </Text>
                    {TokenSelector && <Verified size={16} color={COLORS1.success} />}
                  </View>
                  <Text style={styles.profileEmail}>{userInfo.email}</Text>
                  <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
                    <Edit size={14} color={COLORS1.primary} />
                    <Text style={styles.editProfileText}>
                      {TokenSelector ? 'Edit Profile' : 'Add Profile'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Three Dot Menu Button */}
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={openSideMenu}
                  activeOpacity={0.8}>
                  <MoreVertical size={24} color={COLORS1.white} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Profile Information Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS1.primary]} // Android
                tintColor={COLORS1.primary} // iOS
                title="Refreshing..." // iOS
                titleColor={COLORS1.primary} // iOS
              />
            }>
            {TokenSelector ? (
              <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                  <View style={styles.sectionIconContainer}>
                    <User size={20} color={COLORS1.primary} />
                  </View>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>

                <View style={styles.card}>
                  <MenuItem
                    title="Full Name"
                    subtitle={
                      TokenSelector &&
                      profileData?.firstName != null &&
                      profileData?.firstName + ' ' + profileData?.lastName
                    }
                    icon={<User size={20} color={COLORS1.primary} />}
                  />
                  <View style={styles.separator} />
                  <MenuItem
                    title="Email Address"
                    subtitle={profileData?.email}
                    icon={<Mail size={20} color={COLORS1.primary} />}
                  />
                  <View style={styles.separator} />
                  <MenuItem
                    title="Phone Number"
                    subtitle={profileData?.contact_info?.phoneNumber}
                    icon={<Phone size={20} color={COLORS1.primary} />}
                  />
                  <View style={styles.separator} />
                  <MenuItem
                    title="Address 1"
                    subtitle={profileData?.contact_info?.address1}
                    icon={<MapPinHouse size={20} color={COLORS1.primary} />}
                  />
                  <View style={styles.separator} />
                  <MenuItem
                    title="Address 2"
                    subtitle={profileData?.contact_info?.address2}
                    icon={<MapPinHouse size={20} color={COLORS1.primary} />}
                  />
                  <View style={styles.separator} />
                  <MenuItem
                    title="City"
                    subtitle={profileData?.contact_info?.city}
                    icon={<Building2 size={20} color={COLORS1.primary} />}
                  />
                  <View style={styles.separator} />
                  <MenuItem
                    title="State"
                    subtitle={profileData?.contact_info?.state}
                    icon={<MapPin size={20} color={COLORS1.primary} />}
                  />
                  <View style={styles.separator} />
                  {TokenSelector && (
                    <>
                      <MenuItem
                        title="Notifications"
                        subtitle="View all notifications"
                        onPress={() => {
                          navigation.navigate('NotificationScreen' as never);
                        }}
                        icon={<Bell size={20} color={COLORS1.primary} />}
                        badge={userInfo.notifications}
                      />
                    </>
                  )}
                </View>
              </View>
            ) : (
              <View style={{}}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 450 }}>
                  <Text style={{ ...FONTS.body4, color: COLORS.grey80 }}>
                    Add Profile details to book services/spare parts.{' '}
                  </Text>
                </View>
              </View>
            )}

            {TokenSelector && (
              <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                  <View style={styles.sectionIconContainer}>
                    <Car size={20} color={COLORS1.primary} />
                  </View>
                  <Text style={styles.sectionTitle}>Vehicle Information</Text>
                </View>

                <View style={styles.card}>
                  {Array.isArray(formData?.vehicleInfo) && formData?.vehicleInfo?.length > 0 ? (
                    <VehicleItem
                      vehicle={formData?.vehicleInfo}
                      onPress={(vehicle: any) => {
                        setSelectedVehicle(vehicle);
                        setVehicleDetailModal(true);
                      }}
                    />
                  ) : (
                    <View style={styles.emptyState}>
                      <View style={styles.emptyIconContainer}>
                        <Car size={48} color={COLORS1.gray300} />
                      </View>
                      <Text style={styles.emptyStateText}>No vehicles added yet</Text>
                      <TouchableOpacity
                        style={[styles.addButton, styles.fullWidthButton]}
                        onPress={() => setAddVehicleModal(true)}
                        activeOpacity={0.8}>
                        <Plus size={16} color={COLORS1.white} />
                        <Text style={styles.addButtonText}>Add Vehicle</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            {TokenSelector && (
              <View style={styles.statsContainer}>
                <View style={[styles.statCard, styles.statCardPrimary]}>
                  <View style={styles.statIconContainer}>
                    <Wrench size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statNumber}>{bookingOrders?.serviceConfirm?.length}</Text>
                  <Text style={styles.statLabel}>Services booked</Text>
                </View>
                <View style={[styles.statCard, styles.statCardPrimary]}>
                  <View style={styles.statIconContainer}>
                    <ShoppingCart size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statNumber}>{bookingOrders?.productConfirm?.length}</Text>
                  <Text style={styles.statLabel}>Parts Ordered</Text>
                </View>
                <View style={[styles.statCard, styles.statCardPrimary]}>
                  <View style={styles.statIconContainer}>
                    <Car size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statNumber}>{profileData?.vehicleInfo?.length}</Text>
                  <Text style={styles.statLabel}>
                    {profileData?.vehicleInfo?.length === 1 ? 'My Vehicle' : 'My Vehicles'}
                  </Text>
                </View>
              </View>
            )}

            {/* Enhanced Recent Activity Section */}
            {/* {TokenSelector && (
              <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                  <View style={styles.sectionIconContainer}>
                    <Activity size={20} color={COLORS1.primary} />
                  </View>
                  <Text style={styles.sectionTitle}>Recent Activity</Text>
                </View>
                <View style={styles.card}>
                  <View style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: COLORS1.cardInfo }]}>
                      <Wrench size={16} color={COLORS.primary} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>Oil Change Completed</Text>
                      <Text style={styles.activitySubtitle}>Toyota Camry • 3 days ago</Text>
                    </View>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: COLORS1.cardInfo }]}>
                      <ShoppingCart size={16} color={COLORS.primary} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>Order Delivered</Text>
                      <Text style={styles.activitySubtitle}>Order #1 • 5 days ago</Text>
                    </View>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: COLORS1.cardInfo }]}>
                      <Calendar size={16} color={COLORS.primary} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>Service Scheduled</Text>
                      <Text style={styles.activitySubtitle}>Tire Rotation • June 1, 2024</Text>
                    </View>
                  </View>
                </View>
              </View>
            )} */}
            <View style={{ marginTop: 60 }}></View>
          </ScrollView>

          {/* Enhanced Side Menu with Individual Dropdowns - Left to Right */}
          {sideMenuVisible && (
            <View style={styles.sideMenuContainer}>
              {/* Overlay */}
              <Animated.View style={[styles.sideMenuOverlay, { opacity: overlayOpacity }]}>
                <TouchableOpacity
                  style={styles.overlayTouchable}
                  onPress={closeSideMenu}
                  activeOpacity={1}
                />
              </Animated.View>

              {/* Side Menu Panel - Modified for left positioning */}
              <Animated.View
                style={[styles.sideMenuPanel, { transform: [{ translateX: sideMenuTranslateX }] }]}>
                {/* Side Menu Header */}
                <LinearGradient
                  colors={COLORS1.gradientPrimary}
                  style={styles.sideMenuHeader}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <Text style={styles.sideMenuTitle}>Menu</Text>
                  <TouchableOpacity onPress={closeSideMenu} style={styles.closeButton}>
                    <X size={22} color={COLORS1.white} />
                  </TouchableOpacity>
                </LinearGradient>

                {/* Individual Dropdown Sections */}
                <ScrollView style={styles.sideMenuContent} showsVerticalScrollIndicator={false}>
                  {/* Vehicles Dropdown */}
                  {TokenSelector && (
                    <>
                      <DropdownSection
                        title="Vehicles"
                        icon={<Car size={22} color={COLORS1.primary} />}
                        isExpanded={expandedSections.vehicles}
                        onToggle={() => toggleSection('vehicles')}>
                        {renderVehiclesContent()}
                      </DropdownSection>

                      {/* Orders Dropdown */}
                      <DropdownSection
                        title="Orders"
                        icon={<ShoppingCart size={22} color={COLORS.primary} />}
                        isExpanded={expandedSections.orders}
                        onToggle={() => toggleSection('orders')}>
                        {renderOrdersContent()}
                      </DropdownSection>
                    </>
                  )}

                  {/* Settings Dropdown */}
                  <DropdownSection
                    title="Settings"
                    icon={<Settings size={22} color={COLORS.primary} />}
                    isExpanded={expandedSections.settings}
                    onToggle={() => toggleSection('settings')}>
                    {renderSettingsContent()}
                  </DropdownSection>
                </ScrollView>
              </Animated.View>
            </View>
          )}

          {/* All Enhanced Modals */}
          {/* Edit Profile Modal */}
          <Modal
            visible={editProfileModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setEditProfileModal(false)}>
            <View style={styles.modalContainer}>
              <LinearGradient colors={COLORS1.gradientPrimary} style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setEditProfileModal(false);
                    setFormData({ ...formData, image: profileImageLogo });
                  }}>
                  <X size={24} color={COLORS1.white} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Edit Profile</Text>
              </LinearGradient>

              <ScrollView style={styles.modalContent}>
                <View style={styles.photoSection}>
                  <TouchableOpacity onPress={handlePhotoUpload} activeOpacity={0.8}>
                    <View style={styles.editProfileImageContainer}>
                      <Image src={getImageUrl(formData?.image)} style={styles.editProfileImage} />
                      <View style={styles.editCameraIcon}>
                        <Camera size={16} color={COLORS1.white} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.photoHint}>Tap to change photo</Text>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>First Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.firstName}
                    onChangeText={(name) => setFormData({ ...formData, firstName: name })}
                    placeholder="Enter your first name"
                    placeholderTextColor={COLORS.primary_03}
                  />
                </View>
                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Last Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.lastName}
                    onChangeText={(name) => setFormData({ ...formData, lastName: name })}
                    placeholder="Enter your last name"
                    placeholderTextColor={COLORS.primary_03}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.primary_03}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.contact_info?.phoneNumber}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        contact_info: { ...formData?.contact_info, phoneNumber: text },
                      })
                    }
                    placeholder="Enter your phone number"
                    placeholderTextColor={COLORS.primary_03}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Address 1</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.contact_info?.address1}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        contact_info: { ...formData.contact_info, address1: text },
                      })
                    }
                    placeholder="Enter your address 1"
                    placeholderTextColor={COLORS.primary_03}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Address 2</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.contact_info?.address2}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        contact_info: { ...formData.contact_info, address2: text },
                      })
                    }
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.primary_03}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.contact_info?.city}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        contact_info: { ...formData.contact_info, city: text },
                      })
                    }
                    placeholder="Enter your city"
                    placeholderTextColor={COLORS.primary_03}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>State</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData?.contact_info?.state}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        contact_info: { ...formData.contact_info, state: text },
                      })
                    }
                    placeholder="Enter your state"
                    placeholderTextColor={COLORS.primary_03}
                  />
                </View>
                {Array.isArray(formData?.vehicleInfo) &&
                  formData?.vehicleInfo?.map((vehicle: any, index: any) => (
                    <View key={index}>
                      <View
                        style={{
                          borderTopWidth: 1,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.primary_04,
                          borderTopColor: COLORS.primary_04,
                          paddingVertical: 7,
                          backgroundColor: COLORS.grey08,
                          marginVertical: 5,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            ...FONTS.body4,
                            fontWeight: 500,
                            color: COLORS.primary_text,
                          }}>
                          Vehicle {index + 1}
                        </Text>
                      </View>
                      <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Register Number</Text>
                        <TextInput
                          style={styles.textInput}
                          value={vehicle.registerNumber}
                          onChangeText={(text) => {
                            const updatedVehicleInfo = [...formData.vehicleInfo];
                            updatedVehicleInfo[index].registerNumber = text;
                            setFormData({
                              ...formData,
                              vehicleInfo: updatedVehicleInfo,
                            });
                          }}
                          placeholder="Enter your register number"
                          placeholderTextColor={COLORS.primary_03}
                        />
                      </View>

                      <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Car Company</Text>
                        <TextInput
                          style={styles.textInput}
                          value={vehicle.company}
                          onChangeText={(text) => {
                            const updatedVehicleInfo = [...formData.vehicleInfo];
                            updatedVehicleInfo[index].company = text;
                            setFormData({
                              ...formData,
                              vehicleInfo: updatedVehicleInfo,
                            });
                          }}
                          placeholder="Enter your car company"
                          placeholderTextColor={COLORS.primary_03}
                        />
                      </View>

                      <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Car Model</Text>
                        <TextInput
                          style={styles.textInput}
                          value={vehicle.model}
                          onChangeText={(text) => {
                            const updatedVehicleInfo = [...formData.vehicleInfo];
                            updatedVehicleInfo[index].model = text;
                            setFormData({
                              ...formData,
                              vehicleInfo: updatedVehicleInfo,
                            });
                          }}
                          placeholder="Enter your car model"
                          placeholderTextColor={COLORS.primary_03}
                        />
                      </View>
                      <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Model Year</Text>
                        <TextInput
                          style={styles.textInput}
                          value={vehicle.year}
                          onChangeText={(text) => {
                            const updatedVehicleInfo = [...formData.vehicleInfo];
                            updatedVehicleInfo[index].year = text;
                            setFormData({
                              ...formData,
                              vehicleInfo: updatedVehicleInfo,
                            });
                          }}
                          placeholder="Enter your model year"
                          placeholderTextColor={COLORS.primary_03}
                        />
                      </View>
                      <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Fuel Type</Text>
                        <TextInput
                          style={styles.textInput}
                          value={vehicle.fuleType}
                          onChangeText={(text) => {
                            const updatedVehicleInfo = [...formData.vehicleInfo];
                            updatedVehicleInfo[index].fuleType = text;
                            setFormData({
                              ...formData,
                              vehicleInfo: updatedVehicleInfo,
                            });
                          }}
                          placeholder="Enter your car fuel type"
                          placeholderTextColor={COLORS.primary_03}
                        />
                      </View>
                    </View>
                  ))}

                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={{
                    backgroundColor: COLORS.primary,
                    width: '25%',
                    padding: 10,
                    borderRadius: 10,
                    marginVertical: 15,
                    marginBottom: 35,
                    alignSelf: 'center',
                  }}>
                  <Text style={[styles.saveButton, { textAlign: 'center' }]}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>

          {/* Add Vehicle Modal */}
          <Modal
            visible={addVehicleModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setAddVehicleModal(false)}>
            <View style={styles.modalContainer}>
              <LinearGradient colors={COLORS1.gradientPrimary} style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setAddVehicleModal(false)}>
                  <X size={24} color={COLORS1.white} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Add Vehicle</Text>
              </LinearGradient>

              <ScrollView style={styles.modalContent}>
                {/* Create a new vehicle form instead of mapping existing ones */}
                <View>
                  <View style={styles.formSection}>
                    <Text style={styles.fieldLabel}>Register Number *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.newVehicle?.registerNumber || ''}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          newVehicle: {
                            ...(formData.newVehicle || {}),
                            registerNumber: text,
                          },
                        })
                      }
                      placeholder="Enter your register number"
                      placeholderTextColor={COLORS.primary_03}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.fieldLabel}>Car Company *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.newVehicle?.company || ''}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          newVehicle: {
                            ...(formData.newVehicle || {}),
                            company: text,
                          },
                        })
                      }
                      placeholder="Enter your car company"
                      placeholderTextColor={COLORS.primary_03}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.fieldLabel}>Car Model *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.newVehicle?.model || ''}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          newVehicle: {
                            ...(formData.newVehicle || {}),
                            model: text,
                          },
                        })
                      }
                      placeholder="Enter your car model"
                      placeholderTextColor={COLORS.primary_03}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.fieldLabel}>Model Year *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.newVehicle?.year || ''}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          newVehicle: {
                            ...(formData.newVehicle || {}),
                            year: text,
                          },
                        })
                      }
                      placeholder="Enter your model year"
                      placeholderTextColor={COLORS.primary_03}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.fieldLabel}>Fuel Type *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.newVehicle?.fuleType || ''}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          newVehicle: {
                            ...(formData.newVehicle || {}),
                            fuleType: text,
                          },
                        })
                      }
                      placeholder="Enter your car fuel type"
                      placeholderTextColor={COLORS.primary_03}
                    />
                  </View>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={handleAddVehicle}
                    style={{
                      backgroundColor: COLORS1.primary,
                      padding: 12,
                      width: '25%',
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginTop: 25,
                    }}>
                    <Text
                      style={{
                        ...FONTS.body5,
                        color: COLORS.white,
                        fontWeight: 500,
                        textAlign: 'center',
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>

          {/* Vehicle Detail Modal */}
          <Modal
            visible={vehicleDetailModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setVehicleDetailModal(false)}>
            {selectedVehicle && (
              <View style={styles.modalContainer}>
                <LinearGradient colors={COLORS1.gradientPrimary} style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setVehicleDetailModal(false)}>
                    <ArrowLeft size={24} color={COLORS1.white} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, { marginLeft: -25 }]}>
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </Text>
                  <TouchableOpacity onPress={() => handleDeleteVehicle(selectedVehicle.id)}>
                    <Trash2 size={20} color={COLORS1.error} />
                  </TouchableOpacity>
                </LinearGradient>

                <ScrollView style={styles.modalContent}>
                  {/* Enhanced 360 Degree Car View */}
                  <View style={styles.car360Container}>
                    <View style={styles.car360View} {...panResponder.panHandlers}>
                      <Image
                        source={{ uri: selectedVehicle.image360 }}
                        style={styles.car360Image}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.car360Controls}>
                      <TouchableOpacity style={styles.rotateButton} activeOpacity={0.8}>
                        <RotateCcw size={20} color={COLORS1.white} />
                        <Text style={styles.rotateButtonText}>360° View</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.car360Hint}>Swipe to rotate</Text>
                  </View>

                  {/* Enhanced Vehicle Health Dashboard */}
                  <View style={styles.vehicleHealthSection}>
                    <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Vehicle Health</Text>
                    <View style={styles.healthDashboard}>
                      <CarStatusBar
                        label="Overall Health"
                        value={selectedVehicle.healthScore || 0}
                        color={COLORS1.success}
                        icon={<TrendingUp size={16} color={COLORS1.success} />}
                      />
                      <CarStatusBar
                        label="Fuel Level"
                        value={selectedVehicle.fuelLevel || 0}
                        color={COLORS1.info}
                        icon={<Gauge size={16} color={COLORS1.info} />}
                      />
                      <CarStatusBar
                        label="Battery Health"
                        value={selectedVehicle.batteryHealth || 0}
                        color={COLORS1.primary}
                        icon={<Zap size={16} color={COLORS1.primary} />}
                      />
                      <CarStatusBar
                        label="Tire Health"
                        value={selectedVehicle.tireHealth || 0}
                        color={COLORS1.warning}
                        icon={<AlertCircle size={16} color={COLORS1.warning} />}
                      />
                    </View>
                  </View>

                  {/* Vehicle Information */}
                  <View style={styles.vehicleInfoSection}>
                    <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Vehicle Details</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>License Plate</Text>
                      <Text style={styles.infoValue}>{selectedVehicle.plate}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Color</Text>
                      <Text style={styles.infoValue}>{selectedVehicle.color}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Mileage</Text>
                      <Text style={styles.infoValue}>{selectedVehicle.mileage} miles</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Engine Status</Text>
                      <Text style={[styles.infoValue, { textTransform: 'capitalize' }]}>
                        {selectedVehicle.engineStatus}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Last Service</Text>
                      <Text style={styles.infoValue}>{selectedVehicle.lastService}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Next Service</Text>
                      <Text style={styles.infoValue}>{selectedVehicle.nextService}</Text>
                    </View>
                  </View>

                  {/* Service History */}
                  <View style={styles.serviceHistorySection}>
                    <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Service History</Text>
                    {selectedVehicle.services.length > 0 ? (
                      selectedVehicle.services.map((service: any) => (
                        <ServiceItem key={service.id} service={service} />
                      ))
                    ) : (
                      <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                          <Wrench size={48} color={COLORS1.gray300} />
                        </View>
                        <Text style={styles.emptyStateText}>No service history</Text>
                        <Text style={styles.emptyStateSubtext}>
                          Service records will appear here once you book services
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
          </Modal>

          {/* Order Detail Modal */}
          <Modal
            visible={orderDetailModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setOrderDetailModal(false)}>
            {selectedOrder && (
              <View style={styles.modalContainer}>
                <LinearGradient colors={COLORS1.gradientPrimary} style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setOrderDetailModal(false)}>
                    <ArrowLeft size={24} color={COLORS1.white} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
                  <View />
                </LinearGradient>

                <ScrollView style={styles.modalContent}>
                  {/* Order Summary */}
                  <View style={styles.orderSummarySection}>
                    <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Order Summary</Text>
                    <View style={styles.orderSummaryRow}>
                      <Text style={styles.orderSummaryLabel}>Order Date</Text>
                      <Text style={styles.orderSummaryValue}>{selectedOrder.date}</Text>
                    </View>
                    <View style={styles.orderSummaryRow}>
                      <Text style={styles.orderSummaryLabel}>Status</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              selectedOrder.status === 'delivered'
                                ? COLORS1.success
                                : selectedOrder.status === 'shipped'
                                  ? COLORS1.info
                                  : COLORS1.warning,
                          },
                        ]}>
                        <Text style={styles.statusText}>{selectedOrder.status}</Text>
                      </View>
                    </View>
                    {selectedOrder.trackingNumber && (
                      <View style={styles.orderSummaryRow}>
                        <Text style={styles.orderSummaryLabel}>Tracking</Text>
                        <TouchableOpacity style={styles.trackingButton}>
                          <Text style={styles.trackingText}>{selectedOrder.trackingNumber}</Text>
                          <ExternalLink size={16} color={COLORS1.primary} />
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={styles.orderSummaryRow}>
                      <Text style={styles.orderSummaryLabel}>Total</Text>
                      <Text style={styles.orderTotal}>{selectedOrder.total}</Text>
                    </View>
                    {selectedOrder.estimatedDelivery && (
                      <View style={styles.orderSummaryRow}>
                        <Text style={styles.orderSummaryLabel}>Delivery</Text>
                        <Text style={[styles.orderSummaryValue, { color: COLORS1.primary }]}>
                          {selectedOrder.estimatedDelivery}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Order Items */}
                  <View style={styles.orderItemsSection}>
                    <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Items Ordered</Text>
                    {selectedOrder.items.map((item: any) => (
                      <View key={item.id} style={styles.orderItemCard}>
                        <Image source={{ uri: item.image }} style={styles.orderItemImage} />
                        <View style={styles.orderItemDetails}>
                          <Text style={styles.orderItemName}>{item.name}</Text>
                          <Text style={styles.orderItemPrice}>{item.price}</Text>
                          <Text style={styles.orderItemQuantity}>Quantity: {item.quantity}</Text>
                          {item.partNumber && (
                            <Text style={styles.orderItemPartNumber}>
                              Part #: {item.partNumber}
                            </Text>
                          )}
                          {item.warranty && (
                            <Text style={styles.orderItemWarranty}>Warranty: {item.warranty}</Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </Modal>

          {/* Photo Upload Loading Modal */}
          <Modal visible={photoUploadModal} transparent={true} animationType="fade">
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS1.primary} />
                <Text style={styles.loadingText}>Processing photo...</Text>
              </View>
            </View>
          </Modal>

          {/* Privacy Policy Modal */}
          <Modal
            visible={privacyPolicyModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setPrivacyPolicyModal(false)}>
            <View style={styles.modalContainer}>
              <LinearGradient colors={COLORS1.gradientPrimary} style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setPrivacyPolicyModal(false)}>
                  <X size={24} color={COLORS1.white} />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { marginLeft: -15 }]}>Privacy Policy</Text>
                <View />
              </LinearGradient>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.privacyText}>
                  Last updated: January 2025{'\n\n'}
                  We respect your privacy and are committed to protecting your personal data. This
                  privacy policy explains how we collect, use, and safeguard your information when
                  you use our services.{'\n\n'}
                  <Text style={styles.privacySectionTitle}>Information We Collect{'\n'}</Text>•
                  Personal identification information (name, email, phone number){'\n'}• Vehicle
                  information (make, model, year, license plate)
                  {'\n'}• Service history and preferences{'\n'}• Payment information (securely
                  processed by third-party providers){'\n\n'}
                  <Text style={styles.privacySectionTitle}>How We Use Your Information{'\n'}</Text>•
                  To provide and maintain our services{'\n'}• To process transactions and send
                  notifications{'\n'}• To improve our services and user experience{'\n'}• To
                  communicate with you about your account and services
                  {'\n\n'}
                  <Text style={styles.privacySectionTitle}>Data Security{'\n'}</Text>
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.{'\n\n'}
                  <Text style={styles.privacySectionTitle}>Contact Us{'\n'}</Text>
                  If you have questions about this privacy policy, please contact us at
                  privacy@autoservice.com.
                </Text>
              </ScrollView>
            </View>
          </Modal>

          {/* Help Centre Modal */}
          <Modal
            visible={helpCentreModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setHelpCentreModal(false)}>
            <View style={styles.modalContainer}>
              <LinearGradient colors={COLORS1.gradientPrimary} style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setHelpCentreModal(false)}>
                  <X size={24} color={COLORS1.white} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Help Center</Text>
                <View />
              </LinearGradient>

              <ScrollView style={styles.modalContent}>
                <View style={styles.helpSection}>
                  <Text style={styles.helpSectionTitle}>Frequently Asked Questions</Text>

                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How do I book a service?</Text>
                    <Text style={styles.faqAnswer}>
                      You can book a service by navigating to the Services tab and selecting the
                      type of service you need. Choose your preferred date and time, and confirm
                      your booking.
                    </Text>
                  </View>

                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How can I track my parts order?</Text>
                    <Text style={styles.faqAnswer}>
                      Go to the Orders tab in your profile to view all your orders. Click on any
                      order to see detailed tracking information and current status.
                    </Text>
                  </View>

                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>
                      Can I cancel or reschedule my appointment?
                    </Text>
                    <Text style={styles.faqAnswer}>
                      Yes, you can cancel or reschedule your appointment up to 24 hours before the
                      scheduled time without any penalty. Contact us or use the app to make changes.
                    </Text>
                  </View>

                  <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
                    <Text style={styles.faqAnswer}>
                      We accept all major credit cards, debit cards, and digital payment methods
                      including Apple Pay and Google Pay.
                    </Text>
                  </View>
                </View>

                <View style={styles.helpSection}>
                  <Text style={styles.helpSectionTitle}>Contact Support</Text>
                  {/* <TouchableOpacity style={styles.contactButton}>
                    <MessageCircle size={22} color={COLORS.primary} />
                    <Text style={styles.contactButtonText}>Live Chat</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
                    <Feather name="phone-call" size={22} color={COLORS.primary} />
                    <Text style={styles.contactButtonText}>Call Support</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
                    <Mail size={22} color={COLORS.primary} />
                    <Text style={styles.contactButtonText}>Email Us</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>

          {/* Terms & Conditions Modal */}
          <Modal
            visible={termsModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setTermsModal(false)}>
            <View style={styles.modalContainer}>
              <LinearGradient colors={COLORS1.gradientPrimary} style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setTermsModal(false)}>
                  <X size={24} color={COLORS1.white} />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { marginLeft: -25 }]}>Terms & Conditions</Text>
                <View />
              </LinearGradient>

              <ScrollView style={styles.modalContent}>
                <Text style={styles.termsHeader}>
                  Last updated: January 2024{'\n\n'}
                  Please read these Terms and Conditions carefully before using our service.
                </Text>

                {termsData.map((term) => (
                  <TermsItem
                    key={term.id}
                    term={term}
                    isExpanded={expandedTerm === term.id}
                    onToggle={() => setExpandedTerm(expandedTerm === term.id ? null : term.id)}
                  />
                ))}
              </ScrollView>
            </View>
          </Modal>

          {/* Full Image Modal */}
          <Modal
            visible={imageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImageModalVisible(false)}>
            <View style={styles.modalContainer1}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton1}
                onPress={() => setImageModalVisible(false)}
                activeOpacity={0.7}>
                <View style={styles.closeIconContainer}>
                  <Image source={icons.cross} style={styles.closeIcon} />
                </View>
              </TouchableOpacity>

              {/* Full Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: getImageUrl(profileImageLogo) }}
                  style={styles.fullImage}
                  resizeMode="contain"
                  accessibilityLabel={`Full size profile image of ${formData?.firstName + ' ' + formData?.lastName || 'Customer'}`}
                />
              </View>

              {/* Background Overlay - Click to close */}
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setImageModalVisible(false)}
              />
            </View>
          </Modal>

          <View>
            <CustomLogoutModal
              visible={logoutModalVisible}
              onConfirm={
                TokenSelector ? handleLogout : () => navigation.navigate('LoginScreen' as never)
              }
              onCancel={() => setLogoutModalVisible(false)}
              title={TokenSelector ? 'Confirm Logout' : 'Please Login'}
              message={
                TokenSelector
                  ? 'Are you sure, you want to log out?'
                  : 'You need to login to edit your profile.'
              }
              confirmText={TokenSelector ? 'Yes, Logout' : 'Login'}
              cancelText={TokenSelector ? 'No, Stay' : 'Cancel'}
              confirmButtonColor={COLORS.primary}
              cancelButtonColor={COLORS.transparent}
              titleTextColor={COLORS.primary}
              messageTextColor={COLORS.grey}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

// Enhanced Professional Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS1.white,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
    paddingBottom: 35,
    paddingHorizontal: 10,
    shadowColor: COLORS1.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? -60 : -40,
    marginHorizontal: -20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS1.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: COLORS1.primary,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS1.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS1.primary,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS1.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS1.white,
    shadowColor: COLORS1.shadowStrong,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  profileName: {
    ...FONTS.h3,
    color: COLORS1.white,
    marginRight: 8,
  },
  profileEmail: {
    color: COLORS1.white,
    marginBottom: 12,
    ...FONTS.body6,
    opacity: 0.9,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS1.primaryUltraLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: COLORS1.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editProfileText: {
    color: COLORS1.primary,
    ...FONTS.h5,
    marginLeft: 6,
    fontWeight: 500,
  },
  menuButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: COLORS1.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS1.gray50,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 6,
    marginTop: 3,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    ...FONTS.h4,
    fontWeight: '500',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: COLORS1.cardPrimary,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: COLORS1.shadowMedium,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS1.gray100,
    overflow: 'hidden',
  },
  menuItem: {
    backgroundColor: 'transparent',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    minHeight: 70,
  },
  menuItemIcon: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleIconContainer: {
    backgroundColor: COLORS1.cardInfo,
  },
  orderIconContainer: {
    backgroundColor: COLORS1.cardInfo,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuItemTitle: {
    ...FONTS.h5,
    fontWeight: '500',
    color: COLORS.primary_text,
  },
  menuItemBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  menuItemBadgeText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    ...FONTS.body5,
    color: COLORS.black,
    lineHeight: 15,
  },
  vehicleItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  healthBadgeText: {
    color: COLORS.white,
    ...FONTS.body6,
    fontWeight: 500,
  },
  nextServiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  nextServiceText: {
    ...FONTS.body6,
    color: COLORS.primary,
    marginLeft: 3,
    fontStyle: 'italic',
  },
  estimatedDeliveryText: {
    ...FONTS.body6,
    color: COLORS.primary,
    marginTop: 3,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS1.gray100,
    marginLeft: 82,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS1.shadowMedium,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statCardPrimary: {
    backgroundColor: COLORS1.cardPrimary,
    borderLeftWidth: 4,
    borderLeftColor: COLORS1.primary,
  },
  statCardSecondary: {
    backgroundColor: COLORS1.cardInfo,
    borderLeftWidth: 4,
    borderLeftColor: COLORS1.info,
  },
  statCardTertiary: {
    backgroundColor: COLORS1.cardWarning,
    borderLeftWidth: 4,
    borderLeftColor: COLORS1.primary,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    ...FONTS.h1,
    fontWeight: 600,
    color: COLORS.primary_text,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.body5,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 500,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS1.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 26,
    shadowColor: COLORS1.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: COLORS.grey80,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    color: COLORS.white,
    ...FONTS.body6,
    textTransform: 'capitalize',
  },
  serviceItem: {
    backgroundColor: COLORS1.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS1.primary,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    ...FONTS.h4,
    fontWeight: '500',
    color: COLORS.primary_text,
  },
  serviceDescription: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 10,
    lineHeight: 22,
  },
  serviceDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 12,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetailText: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginLeft: 3,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDate: {
    ...FONTS.body5,
    color: COLORS.primary_01,
    fontWeight: '500',
  },
  serviceCost: {
    ...FONTS.h3,
    fontWeight: '700',
    color: COLORS1.primary,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS1.white,
    shadowColor: COLORS1.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // Enhanced Side Menu Styles with Individual Dropdowns - Left to Right
  sideMenuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  sideMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS1.black,
  },
  overlayTouchable: {
    flex: 1,
  },
  sideMenuPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.85,
    backgroundColor: COLORS1.white,
    shadowColor: COLORS1.shadowStrong,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sideMenuTitle: {
    ...FONTS.h3,
    fontWeight: 500,
    color: COLORS.white,
    marginLeft: 16,
  },
  // Individual Dropdown Section Styles - Reduced height
  dropdownSection: {
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS1.gray100,
  },
  dropdownSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS1.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS1.gray100,
  },
  dropdownSectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownSectionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownSectionTitle: {
    ...FONTS.h4,
    fontWeight: '500',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  dropdownChevronContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownSectionContent: {
    backgroundColor: COLORS1.gray50,
    paddingVertical: 8,
  },
  sideMenuContent: {
    flex: 1,
    backgroundColor: COLORS1.gray50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS1.cardPrimary,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  closeButton1: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  closeIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary_02,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary_02,
  },
  closeIcon: {
    width: 10,
    height: 10,
    tintColor: COLORS.white,
  },
  imageContainer: {
    width: width * 0.9,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    shadowColor: COLORS1.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 100,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: '500',
    color: COLORS1.white,
  },
  saveButton: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS1.white,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  editProfileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  editProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS1.primary,
  },
  editPlaceholderImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary_04,
  },
  editCameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS1.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS1.white,
    shadowColor: COLORS1.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  photoHint: {
    ...FONTS.body5,
    color: COLORS.grey,
  },
  formSection: {
    marginBottom: 10,
  },
  fieldLabel: {
    ...FONTS.body4,
    fontWeight: 500,
    color: COLORS.primary_text,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.primary_04,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...FONTS.body5,
    color: COLORS.primary,
    backgroundColor: COLORS1.white,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  car360Container: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: COLORS1.cardSecondary,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  car360View: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  car360Image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  car360Controls: {
    marginTop: 16,
  },
  rotateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS1.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: COLORS1.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rotateButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: '500',
    marginLeft: 10,
  },
  car360Hint: {
    ...FONTS.body5,
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: 12,
  },
  vehicleHealthSection: {
    marginBottom: 24,
  },
  healthDashboard: {
    backgroundColor: COLORS1.cardSecondary,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  carStatusBarContainer: {
    marginBottom: 16,
  },
  carStatusLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  carStatusIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carStatusLabel: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginLeft: 5,
  },
  carStatusValue: {
    ...FONTS.body5,
    fontWeight: 500,
    color: COLORS.primary_text,
  },
  carStatusBarBackground: {
    height: 8,
    backgroundColor: COLORS1.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  carStatusBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  vehicleInfoSection: {
    backgroundColor: COLORS1.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    ...FONTS.h5,
    color: COLORS.grey,
  },
  infoValue: {
    ...FONTS.h5,
    color: COLORS.primary_text,
  },
  serviceHistorySection: {
    marginBottom: 64,
  },
  orderSummarySection: {
    backgroundColor: COLORS1.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  orderSummaryLabel: {
    ...FONTS.body5,
    color: COLORS.grey,
  },
  orderSummaryValue: {
    ...FONTS.body5,
    color: COLORS.primary,
  },
  orderTotal: {
    ...FONTS.h3,
    fontWeight: 600,
    color: COLORS.primary,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingText: {
    ...FONTS.body5,
    color: COLORS.primary,
    marginRight: 5,
  },
  orderItemsSection: {
    marginBottom: 24,
  },
  orderItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.grey08,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS1.primary,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    ...FONTS.h5,
    fontWeight: '500',
    color: COLORS.primary_text,
    marginBottom: 5,
  },
  orderItemPrice: {
    ...FONTS.h3,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 3,
  },
  orderItemQuantity: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 5,
  },
  orderItemPartNumber: {
    ...FONTS.body6,
    color: COLORS.primary,
    marginBottom: 3,
  },
  orderItemWarranty: {
    ...FONTS.body6,
    color: COLORS.success_lightgreen,
    fontStyle: 'italic',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS1.white,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: COLORS1.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    minWidth: 200,
  },
  loadingText: {
    fontSize: 17,
    color: COLORS1.primary,
    marginTop: 16,
    fontWeight: '600',
  },
  privacyText: {
    ...FONTS.body4,
    lineHeight: 22,
    color: COLORS.primary_text,
    textAlign: 'justify',
  },
  privacySectionTitle: {
    fontWeight: '500',
    color: COLORS.primary,
    ...FONTS.h4,
  },
  helpSection: {
    marginBottom: 32,
  },
  helpSectionTitle: {
    ...FONTS.h3,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: COLORS1.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...FONTS.h4,
    fontWeight: '500',
    color: COLORS.primary_text,
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    ...FONTS.body5,
    lineHeight: 22,
    color: COLORS.grey,
    marginTop: 8,
  },
  faqAnswerText: {
    ...FONTS.body5,
    color: COLORS.grey,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS1.cardInfo,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS1.primary,
  },
  contactButtonText: {
    ...FONTS.h4,
    fontWeight: '500',
    color: COLORS.primary_text,
    marginLeft: 10,
  },
  termsHeader: {
    ...FONTS.h4,
    lineHeight: 22,
    color: COLORS.grey,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...FONTS.h5,
    fontWeight: 500,
    color: COLORS.primary_text,
    marginBottom: 5,
  },
  activitySubtitle: {
    ...FONTS.body6,
    color: COLORS.grey,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tipCard: {
    width: 200,
    backgroundColor: COLORS1.cardPrimary,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS1.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS1.primary,
  },
  tipIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: COLORS1.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    ...FONTS.body5,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 5,
  },
  tipDescription: {
    ...FONTS.body6,
    color: COLORS.grey,
    lineHeight: 15,
  },
  fullWidthButton: {},
});

export default Profile;
