import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useEffect, useState } from 'react';
import { COLORS, FONTS } from '~/constants';
import { addBookingCartItem } from '~/features/booking-cart/service';
import toast from '~/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '~/features/token/redux/selectors';
import { getToken } from '~/features/token/redux/thunks';
import { AppDispatch } from '~/store';
import CustomLogoutModal from '../CustomLogoutModal';
import { getImageUrl } from '~/utils/imageUtils';
import { individualproductrating, individualratinggetting } from '~/features/Rating/rating';
import { getUserProfileDetails } from '~/features/profile/service';
type RootStackParamList = {
  BookingCartScreen: { activeTab?: 'Spare Parts' | 'Services' };
  LoginScreen: undefined;
};

type SparePart = {
  uuid: string;
  _id: string;
  productName: string;
  brand: string;
  price: string;
  inStock: boolean;
  stock: number;
  warrantyPeriod?: string;
  image?: string;
  description?: string;
  rating?: number;
};

const { width } = Dimensions.get('window');

const SparePartsCard = ({ part, onRefresh }: any) => {
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  // const navigation = useNavigation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const TokenSelector = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpConfirmModalVisible, setSignUpConfirmModalVisible] = useState(false);

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

  const handleAddtoCart = async (part: SparePart) => {
    // Prevent multiple calls
    if (isLoading) {
      return;
    }

    if (!part?.uuid || !part?.price) {
      console.error('Missing required part data');
      return;
    }

    try {
      setIsLoading(true);

      const data = {
        uuid: part.uuid,
        products: {
          productId: part._id,
          quantity: quantity,
          price: part.price,
        },
        type: 'spare',
      };

      const response = await addBookingCartItem(data);

      if (response) {
        toast.success('Added', `${part.productName} is added to cart`);
        setAdded(true);

        // Reset after success
        setTimeout(() => {
          setModalVisible(false);
          setQuantity(1);
          setAdded(false);
        }, 2000);
      } else {
        toast.error('Error', 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error', 'Failed to add to cart');
    } finally {
      setIsLoading(false);
      setModalVisible(false);
      setQuantity(1);
      setAdded(false);
      onRefresh();
    }
  };
  const handleBuyNow = async (part: SparePart) => {
    // Prevent multiple calls
    if (isLoading) {
      return;
    }

    if (!part?.uuid || !part?.price) {
      console.error('Missing required part data');
      return;
    }

    try {
      setIsLoading(true);

      const data = {
        uuid: part.uuid,
        products: {
          productId: part._id,
          quantity: quantity,
          price: part.price,
        },
        type: 'spare',
      };

      const response = await addBookingCartItem(data);

      if (response) {
        toast.success('Success', `${part.productName} added to cart`);
        setModalVisible(false);
        setQuantity(1);
        setAdded(false);
        navigation.navigate('BookingCartScreen', { activeTab: 'Spare Parts' });
      } else {
        toast.error('Error', 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error', 'Failed to add to cart');
    } finally {
      setIsLoading(false);
      onRefresh();
    }
  };
  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<MaterialIcons name="star" key={i} size={16} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<MaterialIcons name="star-half" key={i} size={16} color="#FFD700" />);
      } else {
        stars.push(<MaterialIcons name="star-outline" key={i} size={16} color="#FFD700" />);
      }
    }

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <Text style={styles.tabContent}>{part?.description || 'No description available'}</Text>
        );
      case 'delivery':
        return (
          <Text style={styles.tabContent}>
            {part?.inStock
              ? 'Available for immediate delivery. Standard shipping takes 2-3 business days.'
              : 'Currently out of stock. Expected restock in 1-2 weeks.'}
          </Text>
        );
      case 'reviews':
        return (
          <View style={{}}>
            {renderStars(part?.rating)}
            <Text style={{ marginTop: 10 }}>No reviews yet. Be the first to review!</Text>
          </View>
        );
      default:
        return null;
    }
  };

  // State for ratings
  const [rating, setRating] = useState<number>(0);
  const [existingRatings, setExistingRatings] = useState<Record<string, number>>({});
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [getUserId, setGetUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserProfileDetails({});
        setGetUserId(user?._id || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await individualratinggetting();
        console.log('data rating comming :', res);

        const list = res?.data || [];
        const map: Record<string, number> = {};
        list.forEach((item: any) => {
          if (item.partId && item.ratings?.length > 0) {
            const avg =
              item.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / item.ratings.length;
            map[item.partId] = Math.round(avg);
          }
        });
        setExistingRatings(map);
      } catch (err) {
        console.error('Rating API error', err);
      }
    };

    fetchRatings();
  }, []);

  const displayRating = existingRatings[part._id] || rating;

  const handleRate = (value: number) => {
    if (existingRatings[part._id]) return;

    setRating((prev) => {
      if (value === prev) return prev - 1;
      return value;
    });
  };

  const handleSubmitRating = async (partId: string) => {
    if (!rating || !getUserId) return;

    try {
      setIsSubmittingRating(true);
      await individualproductrating({
        productId: partId,
        userId: getUserId,
        rating: rating,
      });

      setExistingRatings((prev) => ({
        ...prev,
        [partId]: rating,
      }));
      setRating(0);
      toast.success('Success', 'Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating', error);
      toast.error('Error', 'Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <>
      {/* Product Card */}
      <Pressable style={styles.card} onPress={() => setModalVisible(true)}>
        {/* Image at the top */}
        <Image
          source={
            part?.image ? { uri: getImageUrl(part?.image) } : require('../../assets/spareparts.png')
          }
          style={styles.cardImage}
          resizeMode="cover"
          onError={() => setError(true)}
        />

        {/* Content below image */}
        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {part?.productName || 'N/A'}
            </Text>
            <Text style={styles.cardPrice}>
              ₹{parseInt(part?.price || '0').toLocaleString('en-IN')}
            </Text>
          </View>

          <Text style={styles.cardDescription} numberOfLines={1}>
            Brand : {part?.brand || 'N/A'}
          </Text>
          <Text style={styles.cardDescription}>
            Warranty Period: {part?.warrantyPeriod || 'No warranty'}
          </Text>

        <View style={{ alignItems: 'center', marginVertical: 4 }}>
  <View style={[styles.stockBadge, part?.inStock ? styles.inStock : styles.outOfStock]}>
    <Text style={styles.stockText}>{part?.inStock ? 'In Stock' : 'Out of Stock'}</Text>
  </View>
</View>

          <View style={styles.bottomRow}>
            {/* {renderStars(part?.rating)} */}
            <View style={styles.starsAndValueRow}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    disabled={!!existingRatings[part._id]}
                    onPress={() => handleRate(star)}>
                    <MaterialIcons
                      name={displayRating >= star ? 'star' : 'star-outline'}
                      size={15}
                      color={displayRating >= star ? '#FFD700' : '#CFCFCF'}
                    />
                  </Pressable>
                ))}
              </View>
              {displayRating > 0 && <Text style={styles.ratingValueText}>{displayRating} / 5</Text>}
            </View>
          </View>
        </View>
      </Pressable>

      {/* Product Modal - Remains the same as before */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          {/* Image with back button */}
          <View style={styles.modalImageContainer}>
            <Image
              source={
                part?.image
                  ? { uri: getImageUrl(part?.image) }
                  : require('../../assets/spareparts.png')
              }
              style={styles.modalImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Rest of the modal content */}
          <View style={styles.modalContent}>
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {part?.productName || 'N/A'}
              </Text>
              <Text style={styles.modalPrice}>
                ₹{parseInt(part?.price || '0').toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.modalDescription}>Brand: {part?.brand || 'N/A'}</Text>
              <Text style={styles.modalDescription}>
                Warranty Period: {part?.warrantyPeriod || 'No warranty'}
              </Text>
            </View>

            <View style={styles.modalRating}>
              <View
                style={[
                  styles.modalStockBadge,
                  part?.inStock ? styles.inStock : styles.outOfStock,
                ]}>
                <Text style={styles.stockText}>
                  {part?.inStock ? `In Stock (${part.stock})` : 'Out of Stock'}
                </Text>
              </View>

              <View style={styles.modalRatingRow}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      disabled={!!existingRatings[part._id]}
                      onPress={() => handleRate(star)}>
                      <MaterialIcons
                        name={displayRating >= star ? 'star' : 'star-outline'}
                        size={25}
                        color={displayRating >= star ? '#FFD700' : '#CFCFCF'}
                      />
                    </Pressable>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => handleSubmitRating(part._id)}
                  disabled={isSubmittingRating || !!existingRatings[part._id] || !rating}
                  style={[
                    styles.submitButton,
                    (isSubmittingRating || !!existingRatings[part._id] || !rating) && {
                      opacity: 0.5,
                    },
                  ]}>
                  <Text style={styles.submitButtonText}>
                    {isSubmittingRating
                      ? 'Submitting...'
                      : !!existingRatings[part._id]
                        ? 'Rated'
                        : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'description' && styles.activeTab]}
                onPress={() => setActiveTab('description')}>
                <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
                  Description
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'delivery' && styles.activeTab]}
                onPress={() => setActiveTab('delivery')}>
                <Text style={[styles.tabText, activeTab === 'delivery' && styles.activeTabText]}>
                  Delivery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                onPress={() => setActiveTab('reviews')}>
                <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
                  Reviews
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.tabContentContainer}>{renderTabContent()}</View>

            {/* Quantity Selector */}
            <View style={styles.modalQuantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  style={styles.quantityButton}
                  disabled={!part?.inStock}>
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity((q) => q + 1)}
                  style={styles.quantityButton}
                  disabled={!part?.inStock}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Add to Cart Button */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.modalAddButton,
                  (!part?.inStock || isLoading) && styles.disabledButton,
                ]}
                onPress={() => {
                  if (TokenSelector) {
                    handleAddtoCart(part);
                  } else {
                    setSignUpConfirmModalVisible(true);
                  }
                }}
                disabled={!part?.inStock || isLoading}>
                <Text style={styles.modalAddButtonText}>
                  {isLoading ? 'ADDING...' : part?.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buyNowButton,
                  (!part?.inStock || isLoading) && styles.disabledButton,
                ]}
                onPress={() => {
                  if (TokenSelector) {
                    handleBuyNow(part);
                  } else {
                    setSignUpConfirmModalVisible(true);
                  }
                }}
                disabled={!part?.inStock || isLoading}>
                <Text style={styles.buyNowButtonText}>
                  {isLoading ? 'BUYING...' : part?.inStock ? 'BUY NOW' : 'OUT OF STOCK'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <View>
        <CustomLogoutModal
          visible={signUpConfirmModalVisible}
          onConfirm={() => navigation.navigate('LoginScreen' as never)}
          onCancel={() => setSignUpConfirmModalVisible(false)}
          title="Please Login"
          message="You need to login to book a spare parts."
          confirmText="Login"
          cancelText="Cancel"
          confirmButtonColor={COLORS.primary}
          cancelButtonColor={COLORS.transparent}
          titleTextColor={COLORS.primary}
          messageTextColor={COLORS.grey}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // New Card Styles
  card: {
    width: width * 0.45,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalRatingSection: {
    backgroundColor: COLORS.grey08,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },

  ratingLabel: {
    ...FONTS.body3,
    color: COLORS.primary_text,
    fontWeight: '600',
    marginBottom: 12,
  },

  modalRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ratingValueText: {
    ...FONTS.body4,
    color: COLORS.primary_01,
    fontWeight: '500',
  },
  starsAndValueRow: {
  flexDirection: 'row',
  justifyContent: 'space-between', 
  alignItems: 'center',
  width: '100%', 
},

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    ...FONTS.body5,
    color: COLORS.primary_text,
    marginLeft: 6,
  },

  submitButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },

  submitButtonText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: '600',
  },

  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.primary_04,
  },
  cardContent: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    ...FONTS.body3,
    fontWeight: 'bold',
    color: COLORS.primary_text,
    flex: 1,
    marginRight: 8,
  },
  cardPrice: {
    ...FONTS.body3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardDescription: {
    ...FONTS.body5,
    color: COLORS.primary_01,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
     width: '100%', 
  alignItems: 'center',
  },
  stockText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },

  // Modal Styles (same as before)
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalImageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary_04,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    ...FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.primary_text,
    flex: 1,
    marginRight: 16,
  },
  modalPrice: {
    ...FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalDescription: {
    ...FONTS.body4,
    color: COLORS.primary_01,
  },
  modalRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalStockBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary_01,
    borderRadius: 10,
  },
  tabText: {
    ...FONTS.body3,
    color: COLORS.primary_01,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabContentContainer: {
    minHeight: 100,
    marginBottom: 24,
  },
  tabContent: {
    ...FONTS.body4,
    color: COLORS.primary_text,
    lineHeight: 22,
  },

  // Quantity Controls
  modalQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 2,
    borderColor: COLORS.grey20,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  quantityLabel: {
    ...FONTS.body3,
    color: COLORS.primary_text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey20,
    borderRadius: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grey08,
  },
  quantityButtonText: {
    ...FONTS.h3,
    color: COLORS.primary_text,
    fontWeight: 500,
  },
  quantityValue: {
    width: 40,
    textAlign: 'center',
    ...FONTS.body3,
  },

  // Add to Cart Button
  // modalAddButton: {
  //   backgroundColor: COLORS.primary,
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   width: '45%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 24,
  //   alignSelf: 'center',
  //   marginTop: 15,
  // },
  addedButton: {
    backgroundColor: 'green',
  },
  // modalAddButtonText: {
  //   ...FONTS.body4,
  //   color: COLORS.white,
  //   fontWeight: 'bold',
  // },
  disabledButton: {
    backgroundColor: COLORS.grey,
    opacity: 0.6,
  },

  inStock: {
    backgroundColor: COLORS.success_lightgreen,
  },
  outOfStock: {
    backgroundColor: COLORS.error,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    // marginBottom: 24,
    alignSelf: 'center',
    width: '100%',
    // marginTop: 15,
    flex: 1,
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAddButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default SparePartsCard;
