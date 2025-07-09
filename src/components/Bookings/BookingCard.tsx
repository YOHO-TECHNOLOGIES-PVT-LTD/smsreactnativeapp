import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, icons, SIZES } from '~/constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDateMonthandYear } from '../../utils/formatDate';

type BookingType = 'spare' | 'service';

interface BookingCardData {
  id: string;
  orderId: string;
  name: string;
  imageUrl: string;
  description: string;
  date: string;
  price: number;
  warranty?: string;
  quantity: number;
  status: 'pending' | 'completed';
  type: BookingType;
}

interface BookingCardProps {
  data: BookingCardData;
  onPress: () => void;
  delay?: number;
}
const DEFAULT_SPARE_IMAGE = require('../../assets/sparepartsimage/parts/brakepads.jpg');
const DEFAULT_SERVICE_IMAGE = require('../../assets/service-images/generalservice.png');

const BookingCard: React.FC<BookingCardProps> = ({ data, onPress, delay = 0 }) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 1000,
      delay,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, { duration: 1500, delay });
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const statusColor = data.status === 'pending' ? COLORS.error : COLORS.success_lightgreen;
  const statusText = data.status === 'pending' ? 'Pending' : 'Completed';
  const imageSource = data.imageUrl ? { uri: data.imageUrl } : '';

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      <View style={styles.card}>
        {/* Image and Status Section */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
          <View style={styles.statusContainer}>
            {data.status !== 'pending' && (
              <Image source={icons.tick} style={styles.statusIcon} tintColor={statusColor} />
            )}
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>

        {/* Main Content Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {data.name}
          </Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {data.description}
          </Text>

          {data.warranty && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Warranty: {data.warranty}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <AntDesign name="calendar" size={12} color={COLORS.black} />
            <Text style={[styles.detailText, { color: COLORS.black }]}>
              {formatDateMonthandYear(data.date)}
            </Text>
          </View>
        </View>

        {/* Right Side Section */}
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={[
              styles.typeBadge,
              data.type === 'spare' ? styles.spareBadge : styles.serviceBadge,
            ]}
            onPress={() => {}}>
            {data.type === 'spare' ? (
              <Image
                source={icons.spare_filled}
                style={styles.typeIcon}
                tintColor={COLORS.indigo[500]}
              />
            ) : (
              <Image
                source={icons.services_filled}
                style={styles.typeIcon}
                tintColor={COLORS.indigo[500]}
              />
            )}
            <Text
              style={[
                styles.typeText,
                data.type === 'spare'
                  ? { color: COLORS.indigo[500] }
                  : { color: COLORS.indigo[500] },
              ]}>
              {data.type === 'spare' ? 'Spare' : 'Service'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.price}>₹ {data.price.toFixed(2)}</Text>

          {/* <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Animated.View>
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
    // alignItems: 'center',
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
    // marginTop: 15,
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
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: 500,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    borderRadius: SIZES.small,
    width: 50,
    paddingVertical: 2,
    paddingHorizontal: 4,
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
    fontWeight: 500,
  },
  price: {
    ...FONTS.h4,
    color: COLORS.primary_text,
    fontWeight: 500,
  },
  viewButton: {
    backgroundColor: COLORS.primary_borders,
    borderRadius: SIZES.small,
    width: 60,
    paddingVertical: 2,
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
});

export default BookingCard;
