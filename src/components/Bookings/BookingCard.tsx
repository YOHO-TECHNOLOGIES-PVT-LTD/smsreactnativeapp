import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, icons, SIZES } from '~/constants';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { formatDateandTime, formatDateMonthandYear } from '../../utils/formatDate';
import { getinvoiceProduct, getinvoiceService } from '~/features/bookings/service';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';
import toast from '~/utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudSnow } from 'lucide-react-native';
import { getImageUrl } from '~/utils/imageUtils';

type BookingType = 'spare' | 'service';
type OrderStatus = 'pending' | 'completed' | 'Dispatched to Courier';

interface Product {
  id: string;
  name: string;
  productId: {
    productName: string;
    brand: string;
    warrantyPeriod: string;
    price: string;
    imageUrl?: string;
  };
  quantity: number;
  price: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
  service_name: string;
}

interface BookingCardData {
  id: string;
  uuid: string;
  orderId: string;
  name: string;
  image?: string;
  description?: string;
  date: string;
  price: number;
  warranty?: string;
  quantity: number;
  status: OrderStatus;
  type: BookingType;
  confirm_Date: string;
  products?: Product[];
  services?: Service[];
  amount: number;
  track_id?: string;
  trackslip_image?: string;
  schedule_date?: string;
  preferedTime?: {
    startTime: string;
    endTime: string;
  };
  createdAt: string;
}

interface BookingCardProps {
  data: BookingCardData;
  delay?: number;
}

const OrderDetailsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  order: BookingCardData;
}> = ({ visible, onClose, order }) => {
  const isService = !!order?.services;
  const isDispatched = order?.status === 'Dispatched to Courier' || order?.status === 'completed';

  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadInvoice = async () => {
    try {
      if (!order?.uuid) {
        throw new Error('No order UUID available');
      }

      let response;
      if (order?.services?.length) {
        response = await getinvoiceService({ uuid: order?.uuid });
      } else if (order?.products?.length) {
        response = await getinvoiceProduct({ uuid: order?.uuid });
      } else {
        throw new Error('Invalid order type');
      }
      const blob = response?.data;
      const base64Data = await blobToBase64(blob);

      // 4. Create file and share
      const fileName = `invoice_${order?.uuid}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Invoice',
        UTI: 'com.adobe.pdf',
      });
      toast.success('Success', 'Invoice downloaded successfully!');
    } catch (error) {
      toast.error('Error', 'Failed to download invoice');
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleViewTrackSlip = async () => {
    setIsLoading(true);
    try {
      Alert.alert('Track Order', `Tracking slip ID for this order: ${order?.track_id}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error: any) {
      Alert.alert('Failed to view track slip:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={false}>
      <SafeAreaView style={styles.modalFullscreenContainer} edges={['top']}>
        {/* Fixed Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Order Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Fixed Order Summary Section */}
        <View style={styles.fixedOrderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order Date:</Text>
            <Text style={styles.summaryValue}>{formatDateandTime(order?.createdAt)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isDispatched ? COLORS.success_lightgreen : COLORS.error },
              ]}>
              <Text style={styles.statusText}>{order?.status?.toLowerCase()}</Text>
            </View>
          </View>
          {isDispatched && order?.track_id && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tracking ID:</Text>
              <TextInput
                style={styles.trackingInput}
                value={order?.track_id}
                editable={false}
                numberOfLines={1}
              />
            </View>
          )}
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollableContentContainer}
          showsVerticalScrollIndicator={false}>
          {/* Items Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isService ? 'Service Details' : 'Product Details'}
            </Text>

            {isService
              ? order?.services?.map((service, index) => (
                  <View key={`service-${index}`} style={styles.itemContainer}>
                    <View style={styles.itemImageContainer}>
                      <Image
                        source={{ uri: getImageUrl(service?.image) }}
                        style={styles.itemImage}
                      />
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {service?.service_name}
                      </Text>
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {service?.description}
                      </Text>
                      <View style={styles.itemMeta}>
                        <Text style={styles.itemPrice}>₹{service?.price.toFixed(2)}</Text>
                        <Text style={styles.itemDuration}>Duration: {service?.duration} hours</Text>
                      </View>
                    </View>
                  </View>
                ))
              : order?.products?.map((product: any, index) => (
                  <View key={`product-${index}`} style={styles.itemContainer}>
                    <View style={styles.itemImageContainer}>
                      <Image
                        source={
                          product?.productId?.image
                            ? { uri: getImageUrl(product?.productId?.image) }
                            : require('../../assets/spareparts.png')
                        }
                        style={styles.itemImage}
                      />
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {product?.productId?.productName}
                      </Text>
                      <Text style={styles.itemDescription} numberOfLines={1}>
                        Brand: {product?.productId?.brand}
                      </Text>
                      <Text style={styles.itemDescription} numberOfLines={1}>
                        Warranty: {product?.productId?.warrantyPeriod}
                      </Text>
                      <View style={styles.itemMeta}>
                        <Text style={styles.itemPrice}>
                          ₹
                          {(Number(product?.price) || Number(product?.productId?.price)).toFixed(2)}
                        </Text>
                        <Text style={styles.itemQuantity}>Qty: {product?.quantity}</Text>
                      </View>
                    </View>
                  </View>
                ))}
          </View>

          {/* Schedule Info (for services) */}
          {isService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule Information</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Scheduled Date:</Text>
                <Text style={styles.summaryValue}>
                  {order?.schedule_date
                    ? formatDateMonthandYear(order?.schedule_date)
                    : 'Not scheduled'}
                </Text>
              </View>
              {order?.preferedTime && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Preferred Time:</Text>
                  <Text style={styles.summaryValue}>
                    {order?.preferedTime?.startTime || '00:00'} -{' '}
                    {order?.preferedTime?.endTime || '00:00'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Payment Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>₹{order?.amount?.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>₹0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalAmountRow]}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={[styles.summaryValue, styles.totalAmountText]}>
                ₹{order?.amount?.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {(order.status === 'completed' || order.status === 'Dispatched to Courier') && (
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={handleDownloadInvoice}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <MaterialIcons name="file-download" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Download Invoice</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {isDispatched && !isService && (
              <TouchableOpacity
                style={[styles.actionButton, styles.trackButton]}
                onPress={handleViewTrackSlip}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <FontAwesome name="truck" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>
                      {order?.trackslip_image ? 'View Track Slip' : 'Track Order'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const BookingCard: React.FC<BookingCardProps> = ({ data, delay = 0 }) => {
  const [showDetails, setShowDetails] = useState(false);
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, { duration: 1500 });
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const statusColor =
    data?.status.toLowerCase() === 'completed' ||
    data.status.toLowerCase() === 'dispatched to courier'
      ? COLORS.success_lightgreen
      : COLORS.error;
  const statusText =
    data?.status === 'Dispatched to Courier'
      ? data?.status.substring(0, 10)
      : data?.status.toLowerCase();

  const itemCount = data?.products?.length || data?.services?.length || 0;
  const itemText = itemCount === 1 ? 'item' : 'items';

  return (
    <>
      <Animated.View style={[animatedStyle, styles.container]}>
        <View style={styles.card}>
          {/* Image and Status Section */}
          <View style={styles.imageContainer}>
            <Image
              source={
                data?.products?.length
                  ? require('../../assets/spareOrder.jpg')
                  : require('../../assets/serviceOrder.jpg')
              }
              style={styles.image}
            />
            <View style={styles.statusContainer}>
              {data.status.toLowerCase() === 'completed' ||
              data.status.toLowerCase() === 'dispatched to courier' ? (
                <Image source={icons.tick} style={styles.statusIcon} tintColor={statusColor} />
              ) : (
                <Image source={icons.clock} style={styles.statusIcon} tintColor={statusColor} />
              )}
              <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
            </View>
          </View>

          {/* Main Content Section */}
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {data?.products ? 'Products Order' : 'Service Order'}
            </Text>
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              Order containing {itemCount} {itemText}
            </Text>

            <View style={styles.detailRow}>
              <AntDesign name="calendar" size={12} color={COLORS.black} />
              <Text style={[styles.detailText, { color: COLORS.black }]}>
                {formatDateMonthandYear(data?.confirm_Date)}
              </Text>
            </View>
          </View>

          {/* Right Side Section */}
          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={[styles.typeBadge, data.services ? styles.serviceBadge : styles.spareBadge]}>
              {data?.services ? (
                <Image
                  source={icons.services_filled}
                  style={styles.typeIcon}
                  tintColor={COLORS.indigo[500]}
                />
              ) : (
                <Image
                  source={icons.spare_filled}
                  style={styles.typeIcon}
                  tintColor={COLORS.indigo[500]}
                />
              )}
              <Text style={styles.typeText}>{data?.services ? 'Service' : 'Spare Part'}</Text>
            </TouchableOpacity>

            <Text style={styles.price}>₹ {data?.amount?.toFixed(2)}</Text>

            <TouchableOpacity style={styles.viewButton} onPress={() => setShowDetails(true)}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <OrderDetailsModal visible={showDetails} onClose={() => setShowDetails(false)} order={data} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: COLORS.white2,
    borderRadius: SIZES.radius,
    padding: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
  },
  imageContainer: {
    width: 65,
    height: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 7,
    gap: 10,
  },
  image: {
    width: 65,
    height: 65,
    resizeMode: 'cover',
    borderRadius: 5,
    backgroundColor: COLORS.primary_04,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  statusIcon: {
    width: 10,
    height: 10,
  },
  statusText: {
    ...FONTS.h7,
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: '500',
  },
  description: {
    ...FONTS.body6,
    color: COLORS.black,
    marginTop: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 5,
  },
  detailText: {
    ...FONTS.body6,
    color: COLORS.primary_01,
  },
  rightContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    borderRadius: SIZES.small,
    paddingVertical: 2,
    paddingHorizontal: 5,
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  spareBadge: {
    backgroundColor: COLORS.indigo[100],
  },
  serviceBadge: {
    backgroundColor: COLORS.indigo[100],
  },
  typeIcon: {
    width: 10,
    height: 10,
  },
  typeText: {
    ...FONTS.h6,
    fontWeight: '500',
    color: COLORS.indigo[500],
  },
  price: {
    ...FONTS.h4,
    color: COLORS.primary_text,
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: COLORS.primary_borders,
    borderRadius: 6,
    width: 60,
    paddingVertical: 6,
    paddingHorizontal: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
  modalFullscreenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 0,
    marginBottom: 0,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  backButton: {
    padding: 4,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 24,
  },
  fixedOrderSummary: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGrey,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollableContent: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollableContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    ...FONTS.body4,
    color: COLORS.primary_01,
  },
  summaryValue: {
    ...FONTS.body4,
    color: COLORS.primary_text,
    flexShrink: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trackingInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 4,
    padding: 8,
    ...FONTS.body5,
    color: COLORS.primary_text,
    width: '60%',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary_04,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...FONTS.body3,
    fontWeight: '500',
    color: COLORS.primary_text,
    marginBottom: 4,
  },
  itemDescription: {
    ...FONTS.body5,
    color: COLORS.primary_01,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  itemPrice: {
    ...FONTS.body4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemQuantity: {
    ...FONTS.body5,
    color: COLORS.primary_01,
  },
  itemDuration: {
    ...FONTS.body5,
    color: COLORS.primary_01,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
  },
  trackButton: {
    backgroundColor: COLORS.success_lightgreen,
  },
  actionButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    marginLeft: 8,
  },
  totalAmountRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  totalAmountText: {
    fontWeight: 'bold',
  },
});

export default BookingCard;
