'use client';

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
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserProfileDetails } from '~/features/profile/service';
import { FONTS } from '~/constants';

const { width, height } = Dimensions.get('window');

const COLORS = {
  // Primary colors - Refined Deep Crimson Theme
  primary: '#9b111e',
  primaryLight: '#c22d3e',
  primaryDark: '#40060c',
  primaryUltraLight: '#f8d4d8',
  primaryBorder: '#FFB3B3',

  // Background colors
  background: '#8B0000',
  backgroundGradient: ['#8B0000', '#660000'],

  // Card colors with sophisticated combinations
  cardPrimary: '#FFFFFF',
  cardSecondary: '#F8FAFC',
  cardTertiary: '#F1F5F9',
  cardAccent: '#FEF7FF',
  cardSuccess: '#F0FDF4',
  cardWarning: '#FFFBEB',
  cardError: '#FEF2F2',
  cardInfo: '#EFF6FF',

  // Accent colors - More professional amber/gold
  // accent: ['#D97706', '#F59E0B'],
  accentLight: ['#F8FAFC', '#F1F5F9'], // Refined lighter amber
  accentDark: 'rgba(255, 132, 13, 0.08)', // Deeper amber
  accentinfo: ['#2563EB', '#3B82F6'],

  // Status colors
  success: '#82dd55', // Deeper green
  successLight: '#10B981',
  successDark: '#047857',
  warning: 'rgba(255, 132, 13, 1)', // Matching accent
  warningLight: '#F59E0B',
  error: '#DC2626', // More professional red
  errorLight: '#EF4444',
  info: '#2563EB', // Deeper blue
  infoLight: '#3B82F6',

  // Neutral colors
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

  // Shadow colors
  shadow: 'rgba(255, 255, 255, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.7)',

  // Special gradient combinations
  gradientPrimary: ['#8B0000', '#B22222'],
  gradientAccent: ['#D97706', '#F59E0B'],
  gradientSuccess: ['#059669', '#10B981'],
  gradientInfo: ['#2563EB', '#3B82F6'],
  gradientNeutral: ['#F8FAFC', '#F1F5F9'],
};

// Enhanced Type Definitions
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  mileage: string;
  image360: string;
  services: Service[];
  lastService?: string;
  nextService?: string;
  healthScore?: number;
  fuelLevel?: number;
  batteryHealth?: number;
  tireHealth?: number;
  engineStatus?: 'excellent' | 'good' | 'fair' | 'poor';
}

interface Service {
  id: number;
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
  id: number;
  date: string;
  items: OrderItem[];
  total: string;
  status: 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  estimatedDelivery?: string;
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
  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfileDetails({});
      if (response) {
        setUserInfo((prev) => ({
          ...prev,
          name: response.firstName || prev.name,
          email: response.email || prev.email,
          phone: response.phone || prev.phone,
          location: response.location || prev.location,
          profileImage: response.profileImage || prev.profileImage,
          memberSince: response.memberSince || prev.memberSince,
          loyaltyPoints: response.loyaltyPoints || prev.loyaltyPoints,
          preferredServiceCenter: response.preferredServiceCenter || prev.preferredServiceCenter,
          notifications: response.notifications || prev.notifications,
        }));
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Enhanced State Management
  const [userInfo, setUserInfo] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    profileImage: null as string | null,
    memberSince: 'January 2022',
    loyaltyPoints: 450,
    preferredServiceCenter: 'Downtown Auto Service',
    notifications: 3,
  });

  const [notifications, setNotifications] = useState({
    serviceReminders: true,
    promotions: false,
    orderUpdates: true,
    appUpdates: true,
    specialOffers: false,
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      plate: 'ABC-123',
      color: 'Silver',
      mileage: '45,000',
      image360: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400',
      services: [
        {
          id: 1,
          type: 'Oil Change',
          date: '2024-01-15',
          cost: '$45',
          description: 'Regular oil change and filter replacement',
          status: 'completed',
          technician: 'Mike Johnson',
          location: 'Downtown Auto Service',
          duration: '45 min',
        },
        {
          id: 2,
          type: 'Brake Service',
          date: '2024-02-20',
          cost: '$180',
          description: 'Brake pad replacement and fluid check',
          status: 'completed',
          technician: 'Sarah Williams',
          location: 'Downtown Auto Service',
          duration: '2 hours',
        },
        {
          id: 3,
          type: 'Tire Rotation',
          date: '2024-06-01',
          cost: '$35',
          description: 'Scheduled tire rotation service',
          status: 'scheduled',
          technician: 'David Miller',
          location: 'Downtown Auto Service',
          duration: '30 min',
        },
      ],
      lastService: '2024-02-20',
      nextService: '2024-06-01',
      healthScore: 92,
      fuelLevel: 75,
      batteryHealth: 95,
      tireHealth: 88,
      engineStatus: 'excellent',
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: '2019',
      plate: 'XYZ-789',
      color: 'Blue',
      mileage: '32,000',
      image360: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
      services: [
        {
          id: 4,
          type: 'Engine Tune-up',
          date: '2024-01-10',
          cost: '$200',
          description: 'Complete engine diagnostic and tune-up',
          status: 'completed',
          technician: 'Robert Chen',
          location: 'Eastside Auto Care',
          duration: '3 hours',
        },
      ],
      lastService: '2024-01-10',
      nextService: '2024-07-10',
      healthScore: 87,
      fuelLevel: 45,
      batteryHealth: 82,
      tireHealth: 90,
      engineStatus: 'good',
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      date: '2024-03-15',
      total: '$245.99',
      status: 'delivered',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: 'Delivered on March 18, 2024',
      items: [
        {
          id: 101,
          name: 'Synthetic Engine Oil 5W-30',
          quantity: 2,
          price: '$39.99',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
          partNumber: 'OIL-5W30-SYN',
          warranty: '30 days',
        },
        {
          id: 102,
          name: 'Oil Filter',
          quantity: 1,
          price: '$12.99',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
          partNumber: 'FLT-OIL-1234',
          warranty: '90 days',
        },
      ],
    },
    {
      id: 2,
      date: '2024-04-22',
      total: '$189.50',
      status: 'shipped',
      trackingNumber: 'TRK987654321',
      estimatedDelivery: 'Expected by April 26, 2024',
      items: [
        {
          id: 201,
          name: 'Brake Pads Set',
          quantity: 1,
          price: '$89.50',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
          partNumber: 'BRK-PAD-2022',
          warranty: '1 year',
        },
      ],
    },
  ]);

  // Modal States
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [vehicleDetailModal, setVehicleDetailModal] = useState(false);
  const [orderDetailModal, setOrderDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [photoUploadModal, setPhotoUploadModal] = useState(false);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false);
  const [helpCentreModal, setHelpCentreModal] = useState(false);
  const [termsModal, setTermsModal] = useState(false);

  // Side Menu State - Modified for individual dropdowns
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    vehicles: false,
    orders: false,
    settings: false,
  });

  // Form States
  const [editForm, setEditForm] = useState({ ...userInfo });
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    color: '',
    mileage: '',
  });

  // Enhanced Animation References
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

  // Terms and Conditions Data
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

  // Enhanced Effects
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

    // Simple entrance animations
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
    // Reset all dropdowns when opening
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
  const saveUserProfileImage = (imageUri: string) => {
    console.log('Saving profile image to local storage:', imageUri);
  };

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

  // Enhanced Event Handlers
  const handleEditProfile = () => {
    setEditForm({ ...userInfo });
    setEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    setUserInfo({ ...editForm });
    if (editForm.profileImage) {
      saveUserProfileImage(editForm.profileImage);
    }
    setEditProfileModal(false);

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

    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleAddVehicle = () => {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.year || !vehicleForm.plate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      ...vehicleForm,
      image360: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400',
      services: [],
      healthScore: 100,
      fuelLevel: 100,
      batteryHealth: 100,
      tireHealth: 100,
      engineStatus: 'excellent',
    };

    setVehicles([...vehicles, newVehicle]);
    setVehicleForm({ make: '', model: '', year: '', plate: '', color: '', mileage: '' });
    setAddVehicleModal(false);

    Alert.alert('Success', 'Vehicle added successfully!');
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setVehicleDetailModal(true);
  };

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailModal(true);
  };

  const handleDeleteVehicle = (vehicleId: number) => {
    Alert.alert('Delete Vehicle', 'Are you sure you want to delete this vehicle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setVehicles(vehicles.filter((v) => v.id !== vehicleId));
          setVehicleDetailModal(false);
          Alert.alert('Success', 'Vehicle deleted successfully');
        },
      },
    ]);
  };

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
        const newImageUri = result.assets[0].uri;
        setEditForm({ ...editForm, profileImage: newImageUri });
        saveUserProfileImage(newImageUri);
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setPhotoUploadModal(false);
    }
  };

  const takePhoto = async () => {
    setPhotoUploadModal(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        setEditForm({ ...editForm, profileImage: newImageUri });
        saveUserProfileImage(newImageUri);
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setPhotoUploadModal(false);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert('Upload Photo', 'Choose photo source', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel', onPress: () => setPhotoUploadModal(false) },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => Alert.alert('Success', 'You have been logged out successfully'),
      },
    ]);
  };

  // Enhanced Component Definitions
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

  const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle, onPress }) => {
    const getHealthColor = (score: number) => {
      if (score >= 90) return COLORS.success;
      if (score >= 70) return COLORS.accent;
      return COLORS.error;
    };

    return (
      <View style={styles.menuItem}>
        <TouchableOpacity
          style={styles.menuItemContent}
          onPress={() => animateCardPress(onPress)}
          activeOpacity={0.8}>
          <View style={[styles.menuItemIcon, styles.vehicleIconContainer]}>
            <Car size={22} color={COLORS.accent} />
          </View>
          <View style={styles.menuItemText}>
            <View style={styles.vehicleItemHeader}>
              <Text style={styles.menuItemTitle}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
              {vehicle.healthScore && (
                <View
                  style={[
                    styles.healthBadge,
                    { backgroundColor: getHealthColor(vehicle.healthScore) },
                  ]}>
                  <Text style={styles.healthBadgeText}>{vehicle.healthScore}%</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuItemSubtitle}>
              License: {vehicle.plate} • {vehicle.color} • {vehicle.mileage} miles
            </Text>
            {vehicle.nextService && (
              <View style={styles.nextServiceContainer}>
                <Calendar size={12} color={COLORS.accent} />
                <Text style={styles.nextServiceText}>Next service: {vehicle.nextService}</Text>
              </View>
            )}
          </View>
          <ChevronRight size={20} color={COLORS.gray400} />
        </TouchableOpacity>
      </View>
    );
  };

  const OrderItem = ({ order }: { order: Order }) => {
    const getStatusColor = () => {
      switch (order.status) {
        case 'processing':
          return COLORS.warning;
        case 'shipped':
          return COLORS.info;
        case 'delivered':
          return COLORS.success;
        default:
          return COLORS.gray500;
      }
    };

    return (
      <View style={styles.menuItem}>
        <TouchableOpacity
          style={styles.menuItemContent}
          onPress={() => animateCardPress(() => handleOrderPress(order))}
          activeOpacity={0.8}>
          <View style={[styles.menuItemIcon, styles.orderIconContainer]}>
            <ShoppingCart size={22} color={COLORS.info} />
          </View>
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemTitle}>Order #{order.id}</Text>
            <Text style={styles.menuItemSubtitle}>
              {order.date} • {order.items.length} items • {order.total}
            </Text>
            {order.estimatedDelivery && (
              <Text style={styles.estimatedDeliveryText}>{order.estimatedDelivery}</Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ServiceItem = ({ service }: { service: Service }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed':
          return COLORS.success;
        case 'pending':
          return COLORS.warning;
        case 'scheduled':
          return COLORS.info;
        default:
          return COLORS.gray500;
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
              <User size={12} color={COLORS.textSecondary} />
              <Text style={styles.serviceDetailText}>{service.technician}</Text>
            </View>
          )}
          {service.location && (
            <View style={styles.serviceDetailItem}>
              <MapPin size={12} color={COLORS.textSecondary} />
              <Text style={styles.serviceDetailText}>{service.location}</Text>
            </View>
          )}
          {service.duration && (
            <View style={styles.serviceDetailItem}>
              <Clock size={12} color={COLORS.textSecondary} />
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

  const Switch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <TouchableOpacity
      style={[styles.switch, { backgroundColor: checked ? COLORS.accent : COLORS.gray300 }]}
      onPress={() => onChange(!checked)}
      activeOpacity={0.8}>
      <View style={[styles.switchThumb, { transform: [{ translateX: checked ? 20 : 2 }] }]} />
    </TouchableOpacity>
  );

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
          <ChevronUp size={20} color={COLORS.gray500} />
        ) : (
          <ChevronDown size={20} color={COLORS.gray500} />
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

  // Individual Dropdown Section Component - Reduced height
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
            <ChevronUp size={20} color={COLORS.textSecondary} />
          ) : (
            <ChevronDown size={20} color={COLORS.textSecondary} />
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
            <Car size={20} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.sectionTitle}>My Vehicles</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, styles.fullWidthButton]}
          onPress={() => setAddVehicleModal(true)}
          activeOpacity={0.8}>
          <Plus size={16} color={COLORS.white} />
          <Text style={styles.addButtonText}></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        {vehicles.length > 0 ? (
          vehicles.map((vehicle, index) => (
            <View key={vehicle.id}>
              <VehicleItem vehicle={vehicle} onPress={() => handleVehiclePress(vehicle)} />
              {index < vehicles.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Car size={48} color={COLORS.gray300} />
            </View>
            <Text style={styles.emptyStateText}>No vehicles added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first vehicle to track services and maintenance
            </Text>
            <TouchableOpacity
              style={[styles.addButton, styles.fullWidthButton]}
              onPress={() => setAddVehicleModal(true)}
              activeOpacity={0.8}>
              <Plus size={16} color={COLORS.white} />
              <Text style={styles.addButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Enhanced Vehicle Tips Section */}
      {vehicles.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIconContainer}>
              <Info size={20} color={COLORS.textPrimary} />
            </View>
            <Text style={styles.sectionTitle}>Maintenance Tips</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Gauge size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.tipTitle}>Check Tire Pressure</Text>
              <Text style={styles.tipDescription}>
                Maintain proper tire pressure to improve fuel efficiency and extend tire life.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Zap size={24} color={COLORS.info} />
              </View>
              <Text style={styles.tipTitle}>Battery Health</Text>
              <Text style={styles.tipDescription}>
                Check battery terminals for corrosion and ensure connections are tight.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Wrench size={24} color={COLORS.success} />
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
          <ShoppingCart size={20} color={COLORS.textPrimary} />
        </View>
        <Text style={styles.sectionTitle}>My Orders</Text>
      </View>
      <View style={styles.card}>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <View key={order.id}>
              <OrderItem order={order} />
              {index < orders.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <ShoppingCart size={48} color={COLORS.gray300} />
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
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <Bell size={20} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        <View style={styles.card}>
          <MenuItem
            title="Service Reminders"
            subtitle="Get notified about upcoming maintenance"
            icon={<Clock size={20} color={COLORS.accent} />}
            rightElement={
              <Switch
                checked={notifications.serviceReminders}
                onChange={(value) =>
                  setNotifications((prev) => ({ ...prev, serviceReminders: value }))
                }
              />
            }
            showArrow={false}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Order Updates"
            subtitle="Track your spare parts orders"
            icon={<Truck size={20} color={COLORS.accent} />}
            rightElement={
              <Switch
                checked={notifications.orderUpdates}
                onChange={(value) => setNotifications((prev) => ({ ...prev, orderUpdates: value }))}
              />
            }
            showArrow={false}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Promotions & Offers"
            subtitle="Receive special deals and discounts"
            icon={<Tag size={20} color={COLORS.accent} />}
            rightElement={
              <Switch
                checked={notifications.promotions}
                onChange={(value) => setNotifications((prev) => ({ ...prev, promotions: value }))}
              />
            }
            showArrow={false}
          />
          <View style={styles.separator} />
          <MenuItem
            title="App Updates"
            subtitle="Get notified about new features"
            icon={<Settings size={20} color={COLORS.accent} />}
            rightElement={
              <Switch
                checked={notifications.appUpdates}
                onChange={(value) => setNotifications((prev) => ({ ...prev, appUpdates: value }))}
              />
            }
            showArrow={false}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Special Offers"
            subtitle="Exclusive member discounts"
            icon={<Star size={20} color={COLORS.accent} />}
            rightElement={
              <Switch
                checked={notifications.specialOffers}
                onChange={(value) =>
                  setNotifications((prev) => ({ ...prev, specialOffers: value }))
                }
              />
            }
            showArrow={false}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <Settings size={20} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.sectionTitle}>App Settings</Text>
        </View>
        <View style={styles.card}>
          <MenuItem
            title="Payment Methods"
            subtitle="Manage your payment options"
            icon={<CreditCard size={20} color={COLORS.accent} />}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Privacy & Security"
            subtitle="Control your data and security settings"
            icon={<Shield size={20} color={COLORS.accent} />}
            onPress={() => setPrivacyPolicyModal(true)}
          />
          <View style={styles.separator} />
          <MenuItem
            title="App Preferences"
            subtitle="Customize your app experience"
            icon={<Settings size={20} color={COLORS.accent} />}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <HelpCircle size={20} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
        </View>
        <View style={styles.card}>
          <MenuItem
            title="Help Centre"
            subtitle="Get support and find answers"
            icon={<MessageCircle size={20} color={COLORS.accent} />}
            onPress={() => setHelpCentreModal(true)}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Terms & Conditions"
            subtitle="Read our terms of service"
            icon={<FileText size={20} color={COLORS.accent} />}
            onPress={() => setTermsModal(true)}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            icon={<Lock size={20} color={COLORS.accent} />}
            onPress={() => setPrivacyPolicyModal(true)}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Rate Our App"
            subtitle="Share your feedback"
            icon={<Star size={20} color={COLORS.accent} />}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <User size={20} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
        <View style={styles.card}>
          <MenuItem
            title="Account Information"
            subtitle="View and edit your account details"
            icon={<User size={20} color={COLORS.accent} />}
            onPress={handleEditProfile}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Subscription"
            subtitle="Manage your premium membership"
            icon={<Award size={20} color={COLORS.accent} />}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Data Export"
            subtitle="Download your data"
            icon={<ExternalLink size={20} color={COLORS.accent} />}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Delete Account"
            subtitle="Permanently delete your account"
            icon={<Trash2 size={20} color={COLORS.error} />}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to permanently delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => Alert.alert('Account deleted'),
                  },
                ]
              );
            }}
          />
          <View style={styles.separator} />
          <MenuItem
            title="Logout"
            subtitle="Sign out of your account"
            icon={<LogOut size={20} color={COLORS.accent} />}
            onPress={handleLogout}
          />
        </View>
      </View>
    </>
  );

  // Main Render
  return (
    <View style={styles.container}>
      {/* Enhanced Header with Professional Gradient */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={handlePhotoUpload} activeOpacity={0.8}>
              <View style={styles.profileImageContainer}>
                {userInfo.profileImage ? (
                  <Image
                    source={require('../../assets/images/profile_picture.jpg')}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Image
                      source={require('../../assets/images/profile_picture.jpg')}
                      style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Camera size={12} color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{userInfo.name}</Text>
                <Verified size={16} color={COLORS.success} />
              </View>
              <Text style={styles.profileEmail}>{userInfo.email}</Text>
              <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
                <Edit size={14} color={COLORS.white} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            {/* Three Dot Menu Button */}
            <TouchableOpacity style={styles.menuButton} onPress={openSideMenu} activeOpacity={0.8}>
              <MoreVertical size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Profile Information Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIconContainer}>
              <User size={20} color={COLORS.textPrimary} />
            </View>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.card}>
            <MenuItem
              title="Full Name"
              subtitle={userInfo.name}
              icon={<User size={20} color={COLORS.primary} />}
            />
            <View style={styles.separator} />
            <MenuItem
              title="Email Address"
              subtitle={userInfo.email}
              icon={<Mail size={20} color={COLORS.primary} />}
            />
            <View style={styles.separator} />
            <MenuItem
              title="Phone Number"
              subtitle={userInfo.phone}
              icon={<Phone size={20} color={COLORS.primary} />}
            />
            <View style={styles.separator} />
            <MenuItem
              title="Location"
              subtitle={userInfo.location}
              icon={<MapPin size={20} color={COLORS.primary} />}
            />
            <View style={styles.separator} />
            <MenuItem
              title="Preferred Service Center"
              subtitle={userInfo.preferredServiceCenter}
              icon={<Wrench size={20} color={COLORS.primary} />}
            />
            {/* <View style={styles.separator} />
            <MenuItem
              title="Notifications"
              subtitle="View all notifications"
              onPress={() => {}}
              icon={<Bell size={20} color={COLORS.accent} />}
              badge={userInfo.notifications}
            /> */}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <Wrench size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSecondary]}>
            <View style={styles.statIconContainer}>
              <ShoppingCart size={24} color={COLORS.info} />
            </View>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Parts Ordered</Text>
          </View>
          <View style={[styles.statCard, styles.statCardTertiary]}>
            <View style={styles.statIconContainer}>
              <Car size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.statNumber}>{vehicles.length}</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
        </View>

        {/* Enhanced Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIconContainer}>
              <Activity size={20} color={COLORS.textPrimary} />
            </View>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: COLORS.cardInfo }]}>
                <Wrench size={16} color={COLORS.info} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Oil Change Completed</Text>
                <Text style={styles.activitySubtitle}>Toyota Camry • 3 days ago</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: COLORS.cardSuccess }]}>
                <ShoppingCart size={16} color={COLORS.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Order Delivered</Text>
                <Text style={styles.activitySubtitle}>Order #1 • 5 days ago</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: COLORS.cardWarning }]}>
                <Calendar size={16} color={COLORS.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Service Scheduled</Text>
                <Text style={styles.activitySubtitle}>Tire Rotation • June 1, 2024</Text>
              </View>
            </View>
          </View>
        </View>
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
              colors={COLORS.gradientPrimary}
              style={styles.sideMenuHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Text style={styles.sideMenuTitle}>Menu</Text>
              <TouchableOpacity onPress={closeSideMenu} style={styles.closeButton}>
                <X size={24} color={COLORS.white} />
              </TouchableOpacity>
            </LinearGradient>

            {/* Individual Dropdown Sections */}
            <ScrollView style={styles.sideMenuContent} showsVerticalScrollIndicator={false}>
              {/* Vehicles Dropdown */}
              <DropdownSection
                title="Vehicles"
                icon={<Car size={22} color={COLORS.accent} />}
                isExpanded={expandedSections.vehicles}
                onToggle={() => toggleSection('vehicles')}>
                {renderVehiclesContent()}
              </DropdownSection>

              {/* Orders Dropdown */}
              <DropdownSection
                title="Orders"
                icon={<ShoppingCart size={22} color={COLORS.info} />}
                isExpanded={expandedSections.orders}
                onToggle={() => toggleSection('orders')}>
                {renderOrdersContent()}
              </DropdownSection>

              {/* Settings Dropdown */}
              <DropdownSection
                title="Settings"
                icon={<Settings size={22} color={COLORS.textSecondary} />}
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
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditProfileModal(false)}>
              <X size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.photoSection}>
              <TouchableOpacity onPress={handlePhotoUpload} activeOpacity={0.8}>
                <View style={styles.editProfileImageContainer}>
                  {editForm.profileImage ? (
                    <Image
                      source={{ uri: editForm.profileImage }}
                      style={styles.editProfileImage}
                    />
                  ) : (
                    <View style={styles.editPlaceholderImage}>
                      <Image
                        source={require('../../assets/images/profile_picture.jpg')}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                      />
                      {/* <User size={40} color={COLORS.gray400} /> */}
                    </View>
                  )}
                  <View style={styles.editCameraIcon}>
                    <Camera size={16} color={COLORS.white} />
                  </View>
                </View>
              </TouchableOpacity>
              <Text style={styles.photoHint}>Tap to change photo</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.gray400}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.phone}
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.gray400}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.location}
                onChangeText={(text) => setEditForm({ ...editForm, location: text })}
                placeholder="Enter your location"
                placeholderTextColor={COLORS.gray400}
              />
            </View>
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
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddVehicleModal(false)}>
              <X size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Vehicle</Text>
            <TouchableOpacity onPress={handleAddVehicle}>
              <Text style={styles.saveButton}>Add</Text>
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Make *</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleForm.make}
                onChangeText={(text) => setVehicleForm({ ...vehicleForm, make: text })}
                placeholder="e.g., Toyota"
                placeholderTextColor={COLORS.gray400}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Model *</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleForm.model}
                onChangeText={(text) => setVehicleForm({ ...vehicleForm, model: text })}
                placeholder="e.g., Camry"
                placeholderTextColor={COLORS.gray400}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Year *</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleForm.year}
                onChangeText={(text) => setVehicleForm({ ...vehicleForm, year: text })}
                placeholder="e.g., 2020"
                placeholderTextColor={COLORS.gray400}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>License Plate *</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleForm.plate}
                onChangeText={(text) => setVehicleForm({ ...vehicleForm, plate: text })}
                placeholder="e.g., ABC-123"
                placeholderTextColor={COLORS.gray400}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Color</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleForm.color}
                onChangeText={(text) => setVehicleForm({ ...vehicleForm, color: text })}
                placeholder="e.g., Silver"
                placeholderTextColor={COLORS.gray400}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Mileage</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleForm.mileage}
                onChangeText={(text) => setVehicleForm({ ...vehicleForm, mileage: text })}
                placeholder="e.g., 45,000"
                placeholderTextColor={COLORS.gray400}
                keyboardType="numeric"
              />
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
            <LinearGradient colors={COLORS.gradientPrimary} style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setVehicleDetailModal(false)}>
                <ArrowLeft size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </Text>
              <TouchableOpacity onPress={() => handleDeleteVehicle(selectedVehicle.id)}>
                <Trash2 size={20} color={COLORS.error} />
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
                    <RotateCcw size={20} color={COLORS.white} />
                    <Text style={styles.rotateButtonText}>360° View</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.car360Hint}>Swipe to rotate</Text>
              </View>

              {/* Enhanced Vehicle Health Dashboard */}
              <View style={styles.vehicleHealthSection}>
                <Text style={styles.sectionTitle}>Vehicle Health</Text>
                <View style={styles.healthDashboard}>
                  <CarStatusBar
                    label="Overall Health"
                    value={selectedVehicle.healthScore || 0}
                    color={COLORS.success}
                    icon={<TrendingUp size={16} color={COLORS.success} />}
                  />
                  <CarStatusBar
                    label="Fuel Level"
                    value={selectedVehicle.fuelLevel || 0}
                    color={COLORS.info}
                    icon={<Gauge size={16} color={COLORS.info} />}
                  />
                  <CarStatusBar
                    label="Battery Health"
                    value={selectedVehicle.batteryHealth || 0}
                    color={COLORS.accent}
                    icon={<Zap size={16} color={COLORS.accent} />}
                  />
                  <CarStatusBar
                    label="Tire Health"
                    value={selectedVehicle.tireHealth || 0}
                    color={COLORS.warning}
                    icon={<AlertCircle size={16} color={COLORS.warning} />}
                  />
                </View>
              </View>

              {/* Vehicle Information */}
              <View style={styles.vehicleInfoSection}>
                <Text style={styles.sectionTitle}>Vehicle Details</Text>
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
                  <Text style={[styles.infoValue, { color: COLORS.accent }]}>
                    {selectedVehicle.nextService}
                  </Text>
                </View>
              </View>

              {/* Service History */}
              <View style={styles.serviceHistorySection}>
                <Text style={styles.sectionTitle}>Service History</Text>
                {selectedVehicle.services.length > 0 ? (
                  selectedVehicle.services.map((service) => (
                    <ServiceItem key={service.id} service={service} />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                      <Wrench size={48} color={COLORS.gray300} />
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
            <LinearGradient colors={COLORS.gradientPrimary} style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setOrderDetailModal(false)}>
                <ArrowLeft size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
              <View />
            </LinearGradient>

            <ScrollView style={styles.modalContent}>
              {/* Order Summary */}
              <View style={styles.orderSummarySection}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
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
                            ? COLORS.success
                            : selectedOrder.status === 'shipped'
                              ? COLORS.info
                              : COLORS.warning,
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
                      <ExternalLink size={16} color={COLORS.accent} />
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
                    <Text style={[styles.orderSummaryValue, { color: COLORS.accent }]}>
                      {selectedOrder.estimatedDelivery}
                    </Text>
                  </View>
                )}
              </View>

              {/* Order Items */}
              <View style={styles.orderItemsSection}>
                <Text style={styles.sectionTitle}>Items Ordered</Text>
                {selectedOrder.items.map((item) => (
                  <View key={item.id} style={styles.orderItemCard}>
                    <Image source={{ uri: item.image }} style={styles.orderItemImage} />
                    <View style={styles.orderItemDetails}>
                      <Text style={styles.orderItemName}>{item.name}</Text>
                      <Text style={styles.orderItemPrice}>{item.price}</Text>
                      <Text style={styles.orderItemQuantity}>Quantity: {item.quantity}</Text>
                      {item.partNumber && (
                        <Text style={styles.orderItemPartNumber}>Part #: {item.partNumber}</Text>
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
            <ActivityIndicator size="large" color={COLORS.accent} />
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
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setPrivacyPolicyModal(false)}>
              <X size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <View />
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.privacyText}>
              Last updated: January 2024{'\n\n'}
              We respect your privacy and are committed to protecting your personal data. This
              privacy policy explains how we collect, use, and safeguard your information when you
              use our services.{'\n\n'}
              <Text style={styles.privacySectionTitle}>Information We Collect{'\n'}</Text>• Personal
              identification information (name, email, phone number){'\n'}• Vehicle information
              (make, model, year, license plate)
              {'\n'}• Service history and preferences{'\n'}• Payment information (securely processed
              by third-party providers){'\n\n'}
              <Text style={styles.privacySectionTitle}>How We Use Your Information{'\n'}</Text>• To
              provide and maintain our services{'\n'}• To process transactions and send
              notifications{'\n'}• To improve our services and user experience{'\n'}• To communicate
              with you about your account and services
              {'\n\n'}
              <Text style={styles.privacySectionTitle}>Data Security{'\n'}</Text>
              We implement appropriate security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.{'\n\n'}
              <Text style={styles.privacySectionTitle}>Contact Us{'\n'}</Text>
              If you have questions about this privacy policy, please contact us at
              privacy@autoservice.com
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
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setHelpCentreModal(false)}>
              <X size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Help Centre</Text>
            <View />
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Frequently Asked Questions</Text>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How do I book a service?</Text>
                <Text style={styles.faqAnswer}>
                  You can book a service by navigating to the Services tab and selecting the type of
                  service you need. Choose your preferred date and time, and confirm your booking.
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How can I track my parts order?</Text>
                <Text style={styles.faqAnswer}>
                  Go to the Orders tab in your profile to view all your orders. Click on any order
                  to see detailed tracking information and current status.
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Can I cancel or reschedule my appointment?</Text>
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
              <TouchableOpacity style={styles.contactButton}>
                <MessageCircle size={20} color={COLORS.accent} />
                <Text style={styles.contactButtonText}>Live Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={20} color={COLORS.accent} />
                <Text style={styles.contactButtonText}>Call Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Mail size={20} color={COLORS.accent} />
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
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setTermsModal(false)}>
              <X size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Terms & Conditions</Text>
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
    </View>
  );
};

// Enhanced Professional Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: COLORS.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
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
    shadowColor: COLORS.shadowStrong,
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
    borderColor: COLORS.primary,
  },
  placeholderImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.shadowStrong,
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
    color: COLORS.white,
    marginRight: 8,
  },
  profileEmail: {
    color: COLORS.white,
    marginBottom: 12,
    ...FONTS.body6,
    opacity: 0.9,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editProfileText: {
    color: COLORS.white,
    ...FONTS.h5,
    marginLeft: 6,
  },
  menuButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  section: {
    marginBottom: 32,
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
    marginBottom: 20,
    marginTop: 12,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: COLORS.cardPrimary,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    overflow: 'hidden',
  },
  menuItem: {
    backgroundColor: 'transparent',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    minHeight: 76,
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleIconContainer: {
    backgroundColor: COLORS.cardWarning,
  },
  orderIconContainer: {
    backgroundColor: COLORS.cardInfo,
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
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    letterSpacing: 0.2,
  },
  menuItemBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  menuItemBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
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
    marginLeft: 8,
  },
  healthBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  nextServiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  nextServiceText: {
    fontSize: 13,
    color: COLORS.accent,
    marginLeft: 4,
    fontWeight: '500',
  },
  estimatedDeliveryText: {
    fontSize: 13,
    color: COLORS.info,
    marginTop: 2,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginLeft: 82,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statCardPrimary: {
    backgroundColor: COLORS.cardPrimary,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  statCardSecondary: {
    backgroundColor: COLORS.cardInfo,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  statCardTertiary: {
    backgroundColor: COLORS.cardWarning,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 26,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 5,
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
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  serviceItem: {
    backgroundColor: COLORS.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  serviceDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 12,
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
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDate: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  serviceCost: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.accent,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadowMedium,
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
    backgroundColor: COLORS.black,
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
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadowStrong,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 16,
  },
  // Individual Dropdown Section Styles - Reduced height
  dropdownSection: {
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  dropdownSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
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
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  dropdownChevronContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownSectionContent: {
    backgroundColor: COLORS.gray50,
    paddingVertical: 8,
  },
  sideMenuContent: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.cardPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.accent,
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
    borderColor: COLORS.accent,
  },
  editPlaceholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  editCameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  photoHint: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    fontWeight: '500',
  },
  car360Container: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.shadow,
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
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rotateButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  car360Hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  vehicleHealthSection: {
    marginBottom: 24,
  },
  healthDashboard: {
    backgroundColor: COLORS.cardSecondary,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
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
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: 6,
  },
  carStatusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  carStatusBarBackground: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  carStatusBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  vehicleInfoSection: {
    backgroundColor: COLORS.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  serviceHistorySection: {
    marginBottom: 64,
  },
  orderSummarySection: {
    backgroundColor: COLORS.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderSummaryLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  orderSummaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.accent,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingText: {
    fontSize: 14,
    color: COLORS.accent,
    marginRight: 4,
    fontWeight: '500',
  },
  orderItemsSection: {
    marginBottom: 24,
  },
  orderItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
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
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 2,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  orderItemPartNumber: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  orderItemWarranty: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: COLORS.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    minWidth: 200,
  },
  loadingText: {
    fontSize: 17,
    color: COLORS.textPrimary,
    marginTop: 16,
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  privacySectionTitle: {
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontSize: 17,
  },
  helpSection: {
    marginBottom: 32,
  },
  helpSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: COLORS.cardSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
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
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardWarning,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  contactButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 16,
  },
  termsHeader: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 24,
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tipCard: {
    width: 200,
    backgroundColor: COLORS.cardPrimary,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  fullWidthButton: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default Profile;
