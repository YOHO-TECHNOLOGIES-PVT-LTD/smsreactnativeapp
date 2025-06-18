import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, icons, screens } from '~/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ImageCarousel from '~/components/HomePage/ImageCarousel';
import AnimatedSearch from '~/components/HomePage/AnimatedSearch';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import HandShakeAnimation from '~/components/HomePage/HandShakeAnimation';
import toast from '~/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const services = [
  { id: '1', name: 'Car Services', icon: 'directions-car' },
  { id: '2', name: 'AC Service & Repair', icon: 'ac-unit' },
  { id: '3', name: 'Batteries', icon: 'battery-charging-full' },
  { id: '4', name: 'Tyres & Wheel Care', icon: 'settings' },
  { id: '5', name: 'Denting & Painting', icon: 'build' },
  { id: '6', name: 'Insurance Claims', icon: 'security' },
  { id: '7', name: 'Clutch & Body Parts', icon: 'view-in-ar' },
  { id: '8', name: 'Suspension & Fitments', icon: 'plumbing' },
  { id: '9', name: 'Car Inspections', icon: 'car-repair' },
  { id: '10', name: 'Windshield & Lights', icon: 'highlight' },
  { id: '11', name: 'Car Spa & Cleaning', icon: 'local-car-wash' },
  { id: '12', name: 'Detailing Services', icon: 'policy' },
];

const offers = [
  { id: '1', title: 'Free Pickup & Drop', discount: 'On all services above ₹2000' },
  { id: '2', title: 'Refer & Earn', discount: 'Get ₹500 for every referral' },
  { id: '3', title: 'Festive Special', discount: 'Extra 10% off this week' },
  { id: '4', title: 'Membership Combo', discount: 'Get ₹800 for every referral' },
];

const spareParts = [
  {
    id: '1',
    name: 'Battery',
    price: '₹450',
    oem: 'Bosch',
    image: require('../../assets/sparepartsimage/parts/battery.jpg'),
  },
  {
    id: '2',
    name: 'Brake Pads',
    price: '₹1200',
    oem: 'Brembo',
    image: require('../../assets/sparepartsimage/parts/brakepads.jpg'),
  },
  {
    id: '3',
    name: 'Exhaust System',
    price: '₹600',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/exhaust.jpg'),
  },
  {
    id: '4',
    name: 'Engine',
    price: '₹750',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/engine.jpg'),
  },
  {
    id: '5',
    name: 'Interior',
    price: '₹470',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/interior.jpg'),
  },
  {
    id: '6',
    name: 'Suspension',
    price: '₹300',
    oem: 'Mahle',
    image: require('../../assets/sparepartsimage/parts/suspension.jpg'),
  },
];

const blogs = [
  {
    id: '1',
    title: '5 Signs Your Car Needs Service',
    date: '15 May 2023',
    content:
      'Regular car maintenance is crucial for vehicle longevity. Here are 5 signs your car needs service: 1) Strange noises coming from engine, 2) Warning lights on dashboard, 3) Decreased fuel efficiency, 4) Unusual vibrations, and 5) Difficulty starting the engine. Ignoring these signs can lead to costly repairs.',
  },
  {
    id: '2',
    title: 'How to Maintain Your Car Battery',
    date: '22 May 2023',
    content:
      "Car battery maintenance tips: 1) Keep terminals clean and free of corrosion, 2) Ensure proper fluid levels, 3) Check voltage regularly, 4) Avoid short trips that don't allow full charging, 5) Disconnect battery if not using car for extended periods. A well-maintained battery can last 3-5 years.",
  },
  {
    id: '3',
    title: 'Choosing the Right Engine Oil',
    date: '30 May 2023',
    content:
      'Selecting the correct engine oil: 1) Check manufacturer recommendations, 2) Consider viscosity grade (like 5W-30), 3) Synthetic vs conventional oils, 4) Climate considerations, 5) Driving conditions. Using the wrong oil can reduce engine life and performance.',
  },
  {
    id: '4',
    title: 'Tire Maintenance Guide',
    date: '10 June 2023',
    content:
      "Proper tire care: 1) Check pressure monthly, 2) Rotate tires every 8,000 km, 3) Inspect for wear and damage, 4) Maintain proper alignment, 5) Don't overload your vehicle. Well-maintained tires improve safety and fuel efficiency.",
  },
  {
    id: '5',
    title: 'AC System Maintenance',
    date: '18 June 2023',
    content:
      'Keep your car AC running smoothly: 1) Run AC regularly, 2) Replace cabin air filter, 3) Check for refrigerant leaks, 4) Clean condenser, 5) Service compressor as needed. Regular maintenance prevents costly repairs and ensures comfort.',
  },
];

const contacts = [
  { id: '1', name: 'John Doe', phone: '+91 9876543210' },
  { id: '2', name: 'Jane Smith', phone: '+91 8765432109' },
  { id: '3', name: 'Robert Johnson', phone: '+91 7654321098' },
  { id: '4', name: 'Emily Davis', phone: '+91 6543210987' },
  { id: '5', name: 'Michael Wilson', phone: '+91 9432109876' },
];

const chatMessages = [
  { id: '1', sender: 'admin', text: 'Hello! How can I help you today?', time: '10:30 AM' },
  { id: '2', sender: 'user', text: 'I need help with my car AC service', time: '10:32 AM' },
  {
    id: '3',
    sender: 'admin',
    text: 'Sure, we can help with that. What model is your car?',
    time: '10:33 AM',
  },
  {
    id: '4',
    sender: 'admin',
    text: 'We have special offers on AC service this week',
    time: '10:34 AM',
  },
  { id: '5', sender: 'user', text: "It's a Honda City 2018 model", time: '10:36 AM' },
];

const HomePage = () => {
  const searchContent = ['Warranty', 'Dent Paint', 'Periodic Services', 'Miles', 'Top Assist'];
  const [searchIndex, setSearchIndex] = useState(0);
  const [search, setSearch] = useState(searchContent[0]);
  const dispatch = useDispatch();
  const [showAddress, setShowAddress] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const scrollInterval = useRef<NodeJS.Timeout>(null);
  const navigation = useNavigation();
  const [Token, setToken] = useState<any>('');
  const blogsImage = [
    require('../../assets/sparepartsimage/category/lighting.jpg'),
    require('../../assets/sparepartsimage/category/battery.jpg'),
    require('../../assets/sparepartsimage/category/engine.jpg'),
    require('../../assets/sparepartsimage/category/tyres.jpg'),
    require('../../assets/sparepartsimage/category/ac.jpg'),
  ];

  // State for modals and functionality
  const [showOfferApplied, setShowOfferApplied] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    setToken(token);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    // Set up interval to rotate through search terms
    const interval = setInterval(() => {
      setSearchIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % searchContent.length;
        setSearch(searchContent[newIndex]);
        return newIndex;
      });
    }, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleClaimOffer = () => {
    setShowOfferApplied(true);
    setTimeout(() => {
      setShowOfferApplied(false);
    }, 3000);
    toast.success('Offer Applied', 'Your offer has been successfully applied!');
  };

  const handleViewAllBlogs = () => {
    setShowAllBlogs(true);
  };

  const handleReadMore = (blog: any) => {
    setSelectedBlog(blog);
    setShowAllBlogs(false);
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
  };

  const handleInviteFriends = () => {
    setShowInviteModal(true);
  };

  const toggleContactSelection = (contact: any) => {
    setSelectedContacts((prev: any) => {
      if (prev.some((c: any) => c.id === contact.id)) {
        return prev.filter((c: any) => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleSendInvites = () => {
    if (selectedContacts.length > 0) {
      toast.success('Invites Sent', `${selectedContacts.length} invites sent successfully!`);
      setShowInviteModal(false);
      setSelectedContacts([]);
    }
  };

  const handleChatNow = () => {
    setShowChatModal(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      Keyboard.dismiss();
      setTimeout(() => {
        const replyMessage = {
          id: String(messages.length + 2),
          sender: 'admin',
          text: 'Thanks for your message. Our team will get back to you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 1000);
    }
  };

  const images = [icons.promo1, icons.promo2, icons.promo3];

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 1,
            }}>
            <Image
              source={require('../../assets/home/LOGO.png')}
              style={{ width: 145, height: 25, position: 'relative', top: Token ? 10 : 0 }}
            />
            <View style={{ position: 'relative' }}>
              <View style={{ position: 'absolute', right: Token ? 90 : 55 }}>
                <HandShakeAnimation />
              </View>
              <Text style={styles.title}>Hi, {Token ? 'Customer' : 'User'}</Text>
            </View>
          </View>
          {Token && (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'flex-end',
              }}>
              <FontAwesome name="location-arrow" size={16} color={COLORS.grey} />
              <Text style={[styles.subtitle, { textAlign: 'right' }]}>Keelkattalai</Text>
            </TouchableOpacity>
          )}

          {/* Search Bar */}
          <AnimatedSearch />
        </View>
        <ScrollView>
          {/* Image Carousel */}
          <View style={{ backgroundColor: COLORS.grey08, paddingVertical: 10 }}>
            <ImageCarousel images={images} />
          </View>

          {/* Services */}
          <View style={styles.section}>
            <View style={styles.servicesGrid}>
              {services.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.serviceItem1}
                  onPress={() => dispatch(setSelectedTab(screens.services))}>
                  <MaterialIcons name={item.icon} size={28} color={COLORS.primary_02} />
                  <Text style={styles.serviceText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Available Spare Parts */}
          <View style={[styles.section, { padding: 15, backgroundColor: COLORS.grey20 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Spare Parts</Text>
              <TouchableOpacity onPress={() => dispatch(setSelectedTab(screens.spare_parts))}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Original OEM parts with warranty</Text>

            <ScrollView
              style={styles.partsContainer1}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}>
              {spareParts.map((item) => (
                <View key={item.id} style={[styles.partCard1, { width: 120 }]}>
                  <Image source={item.image} style={styles.partImage} />
                  <View style={styles.partDetails}>
                    <Text style={styles.partName}>{item.name}</Text>
                    <Text style={styles.partOem}>{item.oem}</Text>
                    <Text style={styles.partPrice}>{item.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Special Offers */}
          <View style={[styles.section, { padding: 15, backgroundColor: COLORS.grey08 }]}>
            <Text style={[styles.sectionTitle, {}]}>Special Offers</Text>
            <View style={styles.offersContainer}>
              {offers.map((offer) => (
                <Animated.View key={offer.id} style={[styles.offerCard, { opacity: fadeAnim }]}>
                  <View style={styles.offerBadge}>
                    <FontAwesome name="tag" size={14} color={COLORS.white} />
                  </View>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDiscount}>{offer.discount}</Text>
                  <TouchableOpacity style={styles.offerButton} onPress={handleClaimOffer}>
                    <Text style={styles.offerButtonText}>Claim Offer</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Offer Applied Toast */}
          {showOfferApplied && (
            <View style={[styles.toastContainer, { top: 100 }]}>
              <Text style={styles.toastText}>Offer Applied Successfully!</Text>
            </View>
          )}

          {/* Guarantee Terms */}
          <View style={styles.guaranteeContainer}>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="verified" size={28} color="#8B0000" />
              <Text style={styles.guaranteeText}>100% Genuine Parts</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="security" size={28} color="#8B0000" />
              <Text style={styles.guaranteeText}>6 Months Warranty</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <MaterialIcons name="money-off" size={28} color="#8B0000" />
              <Text style={styles.guaranteeText}>Price Match Guarantee</Text>
            </View>
          </View>

          {/* Blog Posts */}
          <View style={[styles.section, { padding: 15 }]}>
            <View style={[styles.sectionHeader, { marginBottom: 5 }]}>
              <Text style={styles.sectionTitle}>Blog & Articles</Text>
              <TouchableOpacity onPress={handleViewAllBlogs}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.blogsContainer}>
              {blogs.slice(0, 3).map((blog, index) => (
                <TouchableOpacity
                  key={blog.id}
                  style={styles.blogCard}
                  onPress={() => handleReadMore(blog)}>
                  <Image source={blogsImage[index]} style={styles.blogImage} />
                  <View style={styles.blogContent}>
                    <Text style={styles.blogTitle}>{blog.title}</Text>
                    <Text style={styles.blogDate}>{blog.date}</Text>
                    <Text style={styles.blogReadMore}>Read More →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Refer & Earn */}
          <View style={styles.referContainer}>
            <Image
              source={require('../../assets/service-images/generalservice.png')}
              style={styles.referBg}
            />
            <View style={styles.referContent}>
              <Text style={styles.referTitle}>Refer & Earn</Text>
              <Text style={styles.referText}>Get ₹500 for every friend who books a service</Text>
              <TouchableOpacity style={styles.referButton} onPress={handleInviteFriends}>
                <Text style={styles.referButtonText}>Invite Friends</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer CTA */}
          <View style={styles.footerCta}>
            <Text style={styles.footerCtaText}>Need help? Chat with our experts</Text>
            <TouchableOpacity style={styles.footerCtaButton} onPress={handleChatNow}>
              <Text style={styles.footerCtaButtonText}>Chat Now</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 65 }}></View>
        </ScrollView>

        {/* All Blogs Modal */}
        <Modal
          visible={showAllBlogs}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowAllBlogs(false)}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Blog Posts</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAllBlogs(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={blogs}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity style={styles.blogCardModal} onPress={() => handleReadMore(item)}>
                  <Image source={blogsImage[index]} style={styles.blogImageModal} />
                  <View style={styles.blogContentModal}>
                    <Text style={styles.blogTitleModal}>{item.title}</Text>
                    <Text style={styles.blogDateModal}>{item.date}</Text>
                    <Text style={styles.blogReadMore}>Read More →</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.modalContent}
            />
          </SafeAreaView>
        </Modal>

        {/* Single Blog Modal */}
        <Modal
          visible={!!selectedBlog}
          animationType="slide"
          transparent={false}
          onRequestClose={handleCloseBlog}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.backButton} onPress={handleCloseBlog}>
                <Ionicons name="arrow-back" size={24} color={COLORS.black} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Blog Details</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedBlog && (
              <ScrollView style={styles.blogDetailContainer}>
                <Image
                  source={blogsImage[blogs.findIndex((b) => b.id === selectedBlog.id)]}
                  style={styles.blogDetailImage}
                />
                <Text style={styles.blogDetailTitle}>{selectedBlog.title}</Text>
                <Text style={styles.blogDetailDate}>{selectedBlog.date}</Text>
                <Text style={styles.blogDetailContent}>{selectedBlog.content}</Text>
              </ScrollView>
            )}
          </SafeAreaView>
        </Modal>

        {/* Invite Friends Modal */}
        <Modal
          visible={showInviteModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowInviteModal(false)}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Friends</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowInviteModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.inviteContent}>
              <Text style={styles.inviteText}>Select contacts to invite:</Text>

              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.contactItem,
                      selectedContacts.some((c: any) => c.id === item.id) && styles.selectedContact,
                    ]}
                    onPress={() => toggleContactSelection(item)}>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactPhone}>{item.phone}</Text>
                    </View>
                    {selectedContacts.some((c: any) => c.id === item.id) && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.contactList}
              />

              <TouchableOpacity
                style={[
                  styles.sendInvitesButton,
                  selectedContacts.length === 0 && styles.disabledButton,
                ]}
                onPress={handleSendInvites}
                disabled={selectedContacts.length === 0}>
                <Text style={styles.sendInvitesText}>Send Invites ({selectedContacts.length})</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Chat Modal */}
        <Modal
          visible={showChatModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowChatModal(false)}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowChatModal(false)}>
                <Ionicons name="arrow-back" size={24} color={COLORS.black} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Customer Support</Text>
              <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.chatContainer}
              keyboardVerticalOffset={80}>
              <FlatList
                data={[...messages].reverse()} // Show newest at bottom
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.messageBubble,
                      item.sender === 'admin' ? styles.adminMessage : styles.userMessage,
                    ]}>
                    <Text
                      style={[
                        styles.messageText,
                        item.sender === 'user' && styles.userMessageText,
                      ]}>
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        styles.messageTime,
                        item.sender === 'user' && styles.userMessageTime,
                      ]}>
                      {item.time}
                    </Text>
                  </View>
                )}
                contentContainerStyle={styles.chatMessages}
                inverted={false}
              />

              <View style={styles.messageInputContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type your message..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Ionicons name="send" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 5,
    paddingLeft: 10,
    marginTop: 10,
    elevation: 5,
  },
  searchText: {
    marginLeft: 7,
    color: '#666',
    fontSize: 12,
  },
  promoBanner: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  promoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoText: {
    color: '#fff',
    fontSize: 16,
  },
  promoDiscount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  bookNowButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  bookNowText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  discountTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.primary_text,
    fontWeight: '500',
  },
  sectionSubtitle: {
    ...FONTS.body6,
    color: COLORS.grey80,
    marginVertical: 5,
  },
  servicesContainer: {
    paddingVertical: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  serviceItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceItem1: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  seeAll: {
    color: COLORS.primary_text,
    ...FONTS.h6,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  offerCard: {
    width: '48%',
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offerBadge: {
    position: 'absolute',
    top: -10,
    right: -8,
    backgroundColor: COLORS.primary,
    width: 25,
    height: 25,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTitle: {
    ...FONTS.h5,
    color: COLORS.primary_text,
    fontWeight: '500',
  },
  offerDiscount: {
    ...FONTS.body6,
    color: COLORS.grey,
    marginBottom: 10,
  },
  offerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: 5,
  },
  offerButtonText: {
    color: COLORS.white,
    ...FONTS.h6,
    fontWeight: '500',
  },
  referContainer: {
    height: 160,
    position: 'relative',
  },
  referBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  referContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 24,
    justifyContent: 'center',
  },
  referTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: 8,
  },
  referText: {
    ...FONTS.body5,
    color: COLORS.white,
    marginBottom: 16,
  },
  referButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  referButtonText: {
    color: COLORS.white,
    ...FONTS.h5,
    marginRight: 8,
  },
  partsContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  partCard: {
    width: 180,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  partImage: {
    width: '100%',
    height: 80,
    borderRadius: 5,
    resizeMode: 'cover',
    backgroundColor: '#F5F5F5',
  },
  partDetails: {
    padding: 5,
  },
  partName: {
    ...FONTS.h6,
    color: COLORS.primary_text,
    fontWeight: '500',
    lineHeight: 12,
    marginTop: 5,
  },
  partOem: {
    ...FONTS.body7,
    color: '#666',
    marginVertical: 4,
  },
  partPrice: {
    ...FONTS.h6,
    color: COLORS.primary,
    fontWeight: '500',
  },
  partButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  partButtonText: {
    color: COLORS.white,
    ...FONTS.h5,
  },
  guaranteeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 5,
    backgroundColor: COLORS.grey20,
    borderRadius: 8,
  },
  guaranteeItem: {
    alignItems: 'center',
    width: '30%',
  },
  guaranteeText: {
    ...FONTS.body6,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  blogsContainer: {
    marginTop: 10,
  },
  blogCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blogImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  blogContent: {
    flex: 1,
    padding: 12,
  },
  blogTitle: {
    ...FONTS.h5,
    color: '#333',
    marginBottom: 4,
  },
  blogDate: {
    ...FONTS.body6,
    color: '#666',
    marginBottom: 8,
  },
  blogReadMore: {
    color: COLORS.primary,
    ...FONTS.h6,
  },
  footerCta: {
    padding: 15,
    backgroundColor: COLORS.warning08,
    alignItems: 'center',
    borderRadius: 5,
  },
  footerCtaText: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: 8,
  },
  footerCtaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  footerCtaButtonText: {
    color: COLORS.white,
    ...FONTS.h5,
    fontWeight: '500',
  },
  partsContainer1: {
    marginTop: 10,
  },
  partCard1: {
    backgroundColor: COLORS.white,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 10,
    borderRadius: 8,
  },

  // Toast styles
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
    elevation: 5,
  },
  toastText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey20,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: '600',
    color: COLORS.primary_text,
  },
  closeButton: {
    padding: 5,
  },
  backButton: {
    padding: 5,
  },
  modalContent: {
    padding: 15,
  },

  // Blog modal styles
  blogCardModal: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blogImageModal: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  blogContentModal: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  blogTitleModal: {
    ...FONTS.h5,
    color: COLORS.primary_text,
    marginBottom: 4,
  },
  blogDateModal: {
    ...FONTS.body6,
    color: COLORS.grey,
  },

  // Blog detail styles
  blogDetailContainer: {
    padding: 15,
  },
  blogDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  blogDetailTitle: {
    ...FONTS.h2,
    color: COLORS.primary_text,
    marginBottom: 5,
  },
  blogDetailDate: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 15,
  },
  blogDetailContent: {
    ...FONTS.body4,
    color: COLORS.primary_text,
    lineHeight: 22,
  },

  // Invite modal styles
  inviteContent: {
    flex: 1,
    padding: 15,
  },
  inviteText: {
    ...FONTS.body4,
    color: COLORS.primary_text,
    marginBottom: 15,
  },
  contactList: {
    paddingBottom: 80,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey20,
  },
  selectedContact: {
    backgroundColor: COLORS.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...FONTS.h5,
    color: COLORS.primary_text,
  },
  contactPhone: {
    ...FONTS.body6,
    color: COLORS.grey,
    marginTop: 3,
  },
  sendInvitesButton: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.grey,
  },
  sendInvitesText: {
    ...FONTS.h5,
    color: COLORS.white,
    fontWeight: '500',
  },

  // Chat modal styles
  chatContainer: {
    flex: 1,
  },
  chatMessages: {
    padding: 15,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  adminMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.grey20,
    borderBottomLeftRadius: 0,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 0,
  },
  messageText: {
    ...FONTS.body4,
    color: COLORS.primary_text,
  },
  userMessageText: {
    color: COLORS.white,
  },
  messageTime: {
    ...FONTS.body7,
    color: COLORS.grey,
    marginTop: 5,
    textAlign: 'right',
  },
  userMessageTime: {
    color: COLORS.grey60,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey20,
    backgroundColor: COLORS.white,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.grey20,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomePage;
