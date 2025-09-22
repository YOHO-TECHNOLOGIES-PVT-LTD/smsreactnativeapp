import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS, FONTS, icons, SPACING } from '~/constants';
import {
  addBookingCartItem,
  deleteBookingCartProduct,
  deleteBookingCartService,
} from '~/features/booking-cart/service';
import { addServiceCartItems, addSparePartCartItems } from '~/features/bookings/service';
import toast from '~/utils/toast';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getImageUrl } from '~/utils/imageUtils';

type CartItem = {
  _id: string;
  service_name: string;
  description?: string;
  productId?: {
    _id: string;
    productName: string;
    price: any;
    image: string;
    stock: string;
    inStock: boolean;
    category: string;
    warrantyPeriod: string;
  };
  serviceId?: {
    _id: string;
    service_name: string;
    price: number;
    description: string;
    image: string;
  };
  price: string;
  quantity: number;
  type: 'spare' | 'service';
};

type CartProps = {
  bookingCarts: {
    products: CartItem[];
    services: CartItem[];
    totalAmount: number;
    _id: string;
    type?: 'spare' | 'service';
  }[];
  onChangeCart: () => void;
  token: string;
};

const BookingCartScreen: React.FC<CartProps> = ({ bookingCarts, onChangeCart, token }) => {
  const [activeTab, setActiveTab] = useState<'Spare Parts' | 'Services'>('Spare Parts');
  const [cartItems, setCartItems] = useState<{
    products: CartItem[];
    services: CartItem[];
  }>({ products: [], services: [] });
  const [cartId, setCartId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);

  // Fix: Proper cart items extraction
  useEffect(() => {
    if (bookingCarts && bookingCarts?.length > 0) {
      // Get all products and services from all carts
      const allProducts = bookingCarts.reduce((acc, cart) => {
        if (cart.products && cart.products.length > 0) {
          return [...acc, ...cart.products];
        }
        return acc;
      }, [] as CartItem[]);

      const allServices = bookingCarts.reduce((acc, cart) => {
        if (cart.services && cart.services.length > 0) {
          return [...acc, ...cart.services];
        }
        return acc;
      }, [] as CartItem[]);

      setCartItems({
        products: allProducts,
        services: allServices,
      });

      console.log('Cart items updated:', {
        products: allProducts.length,
        services: allServices.length,
      });
    } else {
      // Reset cart items if no booking carts
      setCartItems({ products: [], services: [] });
    }
  }, [bookingCarts]);
  console.log('Bookin', bookingCarts);

  // Fix: Proper cart ID extraction
  useEffect(() => {
    if (bookingCarts && bookingCarts?.length > 0) {
      // Find spare parts cart
      const spareCart = bookingCarts.find(
        (cart) => cart.type === 'spare' || (cart.products && cart.products.length > 0)
      );

      // Find services cart
      const serviceCart = bookingCarts.find(
        (cart) => cart.type === 'service' || (cart.services && cart.services.length > 0)
      );

      setCartId(spareCart?._id ?? null);
      setServiceId(serviceCart?._id ?? null);

      console.log('Cart IDs updated:', {
        spareCartId: spareCart?._id,
        serviceCartId: serviceCart?._id,
      });
    }
  }, [bookingCarts]);

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'Spare Parts':
        return cartItems.products || [];
      case 'Services':
        return cartItems.services || [];
      default:
        return [...(cartItems.products || []), ...(cartItems.services || [])];
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => {
      const itemPrice = parseInt(item?.price) || 0;
      const quantity = item?.quantity || 1;
      return sum + itemPrice * quantity;
    }, 0);
  };

  const filteredItems = getFilteredItems();
  const totalAmount = calculateTotal(filteredItems);

  const handleConfirmOrder = useCallback(async () => {
    console.log('Confirm order called for tab:', activeTab);
    console.log('Filtered items:', filteredItems);
    console.log('Booking carts:', bookingCarts);

    if (filteredItems?.length === 0) {
      toast.error('Empty Cart', 'Your cart is empty. Please add items to proceed.');
      return;
    }

    try {
      if (activeTab === 'Spare Parts') {
        // Find the cart that has products
        const spareCart = bookingCarts.find((cart) => cart.products && cart.products.length > 0);

        if (!spareCart) {
          toast.error('Error', 'No spare parts cart found.');
          return;
        }

        console.log('Confirming spare parts order with cart ID:', spareCart._id);

        const data = { cartId: spareCart._id };
        const response = await addSparePartCartItems(data);
        console.log('REspo', response);

        if (response) {
          token && onChangeCart();
          toast.success(
            'Success',
            response.message || 'Successfully placed your spare parts order!'
          );
        } else {
          toast.error('Order Failed', 'There was an issue placing your order. Please try again.');
        }
      } else if (activeTab === 'Services') {
        // Find the cart that has services
        const serviceCart = bookingCarts.find((cart) => cart.services && cart.services.length > 0);

        if (!serviceCart) {
          toast.error('Error', 'No services cart found.');
          return;
        }

        console.log('Confirming services order with cart ID:', serviceCart._id);

        const data = { cartId: serviceCart._id };
        const response = await addServiceCartItems(data);

        if (response) {
          token && onChangeCart();
          toast.success('Success', response.message || 'Successfully placed your services order!');
        } else {
          toast.error('Order Failed', 'There was an issue placing your order. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Error', 'An error occurred while placing your order.');
    }
  }, [activeTab, bookingCarts, filteredItems, token, onChangeCart]);

  const handleDelete = useCallback(
    async (itemId: string) => {
      console.log('Deleting item:', itemId, 'from tab:', activeTab);

      try {
        if (activeTab === 'Spare Parts') {
          if (!cartId) {
            toast.error('Error', 'Cart ID not found for spare parts.');
            return;
          }

          const response = await deleteBookingCartProduct({
            cartId: cartId,
            productId: itemId,
          });

          if (response) {
            token && onChangeCart();
            toast.success('Success', 'Product removed from the cart');
          }
        } else if (activeTab === 'Services') {
          if (!serviceId) {
            toast.error('Error', 'Cart ID not found for services.');
            return;
          }

          const response = await deleteBookingCartService({
            cartId: serviceId,
            serviceId: itemId,
          });

          if (response) {
            token && onChangeCart();
            toast.success('Success', 'Service removed from the cart');
          }
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Error', 'Failed to remove item from cart.');
      }
    },
    [activeTab, cartId, serviceId, token, onChangeCart]
  );

  const renderItem = (item: CartItem, index: number) => {
    const name =
      item?.productId?.productName ||
      item?.service_name ||
      item?.serviceId?.service_name ||
      'Unknown Item';
    const price = parseInt(item?.price) || 0;
    const quantity = item?.quantity || 1;
    const totalPrice = price * quantity;

    let imageUri = '';
    if (item?.productId?.image) {
      imageUri = getImageUrl(item.productId.image);
    } else if (item?.serviceId?.image) {
      imageUri = getImageUrl(item.serviceId.image);
    } else {
      imageUri = 'https://via.placeholder.com/80x80?text=No+Image';
    }

    return (
      <View key={`${item._id}-${index}`} style={styles.itemContainer}>
        <Image source={{ uri: imageUri }} style={styles.itemImage} resizeMode="cover" />

        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.itemPrice}>₹ {price} each</Text>

          {item?.productId && (
            <>
              <Text style={styles.itemInfo}>{item.productId?.warrantyPeriod} warranty</Text>
              <Text
                style={[
                  styles.stockStatus,
                  item.productId?.inStock ? styles.inStock : styles.outOfStock,
                ]}>
                {item.productId?.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </>
          )}

          {(item?.description || item?.serviceId?.description) && (
            <Text style={styles.itemInfo} numberOfLines={2}>
              {item?.description || item?.serviceId?.description}
            </Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <FontAwesome5 name="trash" size={20} color={COLORS.error80} />
          </TouchableOpacity>
          <Text style={styles.totalPrice}>₹ {totalPrice}</Text>
          <View style={styles.quantityBox}>
            <Text style={styles.quantityText}>Qty: {quantity}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={icons.booking_background}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.tabContainer}>
            {(['Spare Parts', 'Services'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                  {/* Add item count indicator */}
                  {tab === 'Spare Parts' &&
                    cartItems.products?.length > 0 &&
                    ` (${cartItems.products.length})`}
                  {tab === 'Services' &&
                    cartItems.services?.length > 0 &&
                    ` (${cartItems.services.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            {filteredItems?.length > 0 ? (
              <View style={styles.itemsContainer}>
                {filteredItems.map((item, index) => renderItem(item, index))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {activeTab === 'Spare Parts'
                    ? 'No products in your cart'
                    : 'No services in your cart'}
                </Text>
                <Text style={styles.emptySubText}>Add some items to get started!</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          {filteredItems.length > 0 && (
            <View style={[styles.footer]}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total ({filteredItems.length} items):</Text>
                <Text style={styles.totalAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              </View>

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
                <Text style={styles.confirmButtonText}>
                  Confirm Order ({filteredItems.length} items)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: SPACING.huge,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: COLORS.primary_04,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: COLORS.primary_03,
    borderWidth: 1,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.h4,
    color: COLORS.black,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
  },
  itemsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: COLORS.primary_04,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...FONTS.h4,
    fontWeight: '500',
    color: COLORS.primary_text,
    marginBottom: 5,
  },
  itemPrice: {
    ...FONTS.body5,
    color: COLORS.primary,
    marginBottom: 5,
  },
  itemInfo: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 2,
  },
  stockStatus: {
    ...FONTS.h5,
  },
  inStock: {
    color: COLORS.success_lightgreen,
  },
  outOfStock: {
    color: COLORS.error,
  },
  quantityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    gap: 10,
  },
  quantityBox: {
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quantityText: {
    ...FONTS.h5,
    color: COLORS.dark60,
  },
  totalPrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    ...FONTS.body4,
    color: COLORS.grey,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    ...FONTS.h3,
    color: COLORS.primary_text,
  },
  totalAmount: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.grey,
  },
  confirmButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default BookingCartScreen;
