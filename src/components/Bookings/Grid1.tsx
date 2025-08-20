import React, { useState, useEffect } from 'react';
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
import { COLORS, FONTS, icons } from '~/constants';
import {
  addBookingCartItem,
  deleteBookingCartProduct,
  deleteBookingCartService,
} from '~/features/booking-cart/service.ts';
import { addServiceCartItems, addSparePartCartItems } from '~/features/bookings/service';
import toast from '~/utils/toast';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
  }[];
};

const BookingCartScreen: React.FC<CartProps> = ({ bookingCarts }) => {
  const [activeTab, setActiveTab] = useState<'Spare Parts' | 'Services'>('Spare Parts');
  const [cartItems, setCartItems] = useState<{
    products: CartItem[];
    services: CartItem[];
  }>({ products: [], services: [] });
  const [cartId, setCartId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (bookingCarts && bookingCarts.length > 0) {
      const products = bookingCarts.flatMap((cart) => cart.products || []);
      const services = bookingCarts.flatMap((cart) => cart.services || []);
      setCartItems({ products, services });
    }
  }, [bookingCarts]);

  useEffect(() => {
    if (bookingCarts && bookingCarts.length > 0) {
      const filterSpareCartId = bookingCarts?.find((item: any) => item?.type === 'spare');
      const filterServiceCartId = bookingCarts?.find((item: any) => item?.type === 'service');
      setCartId(filterSpareCartId?._id ?? null);
      setServiceId(filterServiceCartId?._id ?? null);
    }
  }, [bookingCarts]);

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'Spare Parts':
        return cartItems.products;
      case 'Services':
        return cartItems.services;
      default:
        return [...cartItems.products, ...cartItems.services];
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce(
      (sum, item) => sum + parseInt(item?.price) * (item?.quantity ? item?.quantity : 1),
      0
    );
  };

  const totalAmount = calculateTotal(getFilteredItems());
  const filteredItems = getFilteredItems();

  const handleConfirmOrder = async () => {
    if (filteredItems?.length === 0) {
      toast.error('Empty Cart', 'Your cart is empty. Please add items to proceed.');
      return;
    }
    try {
      if (activeTab === 'Spare Parts') {
        const data = { cartId: bookingCarts[0]?._id };
        const response = await addSparePartCartItems(data);
        if (response) {
          toast.success('Success', response.message || 'Successfully placed your order!');
        } else {
          toast.error('Order Failed', 'There was an issue placing your order. Please try again.');
        }
      } else if (activeTab === 'Services') {
        const data = { cartId: bookingCarts[0]?._id };
        const response = await addServiceCartItems(data);
        if (response) {
          toast.success('Success', response.message || 'Successfully placed your order!');
        } else {
          toast.error('Order Failed', 'There was an issue placing your order. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const handleDelete = async (id: any) => {
    if (activeTab === 'Spare Parts') {
      const response = await deleteBookingCartProduct({ cartId: cartId, productId: id });
      if (response) {
        toast.success('Product removed successfully', { autoClose: 2000 });
      }
    } else if (activeTab === 'Services') {
      const response = await deleteBookingCartService({ cartId: serviceId, serviceId: id });
      if (response) {
        toast.success('Service removed successfully', { autoClose: 2000 });
      }
    }
  };

  const renderItem = (item: CartItem, index?: any) => {
    console.log('Rendering item:', item);
    const name = item?.productId?.productName || item?.service_name || 'Unknown Item';
    const price = parseInt(item?.price);
    const totalPrice = item?.productId ? item?.productId?.price * item?.quantity : price;
    const imageSource = item?.productId
      ? { uri: item?.productId?.image }
      : { uri: item?.serviceId?.image };

    return (
      <View key={index} style={styles.itemContainer}>
        <Image source={imageSource} style={styles.itemImage} resizeMode="cover" />

        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{name}</Text>
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

          {item?.description && (
            <Text style={styles.itemInfo} numberOfLines={2}>
              {item?.description}
            </Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDelete(item?._id)}>
            <FontAwesome5 name="trash" size={20} color={COLORS.error80} />
          </TouchableOpacity>
          <Text style={styles.totalPrice}>₹ {totalPrice}</Text>
          {item?.productId && (
            <View style={styles.quantityBox}>
              <Text style={styles.quantityText}>Qty: {item?.quantity || 1}</Text>
            </View>
          )}
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
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            {filteredItems?.length > 0 ? (
              <View style={styles.itemsContainer}>
                {filteredItems?.map((item, index) => renderItem(item, index))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {activeTab === 'Spare Parts'
                    ? 'No products in your cart'
                    : 'No services in your cart'}
                </Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>₹{totalAmount}</Text>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, filteredItems.length === 0 && styles.disabledButton]}
              onPress={handleConfirmOrder}
              disabled={filteredItems.length === 0}>
              <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
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
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
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
    fontWeight: 500,
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
    height: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: COLORS.primary_04
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...FONTS.h4,
    fontWeight: 500,
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
    fontWeight: 500,
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
    marginBottom: 15,
  },
  totalLabel: {
    ...FONTS.h3,
    color: COLORS.primary_text,
  },
  totalAmount: {
    ...FONTS.h3,
    color: COLORS.primary,
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
  },
});

export default BookingCartScreen;
