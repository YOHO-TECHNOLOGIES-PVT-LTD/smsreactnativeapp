import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, icons, SIZES } from '~/constants';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDateMonthandYear } from '../../utils/formatDate';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';

type BookingCardProps = {
  data: any;
  onPress: () => void;
  delay?: number;
};

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
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  console.log('BookingCard', data);

  return (
    <Animated.View style={[animatedStyle, { marginVertical: 5 }]}>
      <View
        style={{
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
        }}>
        <View
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            alignItems: 'center',
            marginRight: 15,
            gap: 15,
            marginTop: 15,
          }}>
          <Image
            source={{ uri: data?.imageUrl }}
            style={{ width: 55, height: 55, resizeMode: 'cover', borderRadius: 50 }}
          />
          <View style={{ flexDirection: 'row', gap: 2 }}>
            <Image
              source={icons.tick}
              style={{ width: 10, height: 10 }}
              tintColor={COLORS.success_lightgreen}
            />
            <Text style={{ ...FONTS.h7, color: COLORS.success_lightgreen }}>Completed</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...FONTS.h4, color: COLORS.primary }}>{data?.name?.substring(0, 22)}</Text>
          <Text
            style={{
              ...FONTS.body6,
              color: COLORS.primary_01,
              width: '95%',
              textAlign: 'justify',
              marginTop: 5,
            }}>
            {data?.description}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 5 }}>
            <Text style={{ ...FONTS.body6, color: COLORS.primary_01 }}>
              Compatibility: {data?.compatibility}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 3, marginTop: 5 }}>
            <AntDesign name="calendar" size={12} color={COLORS.primary_text} />
            <Text style={{ ...FONTS.body6, color: COLORS.primary_text }}>
              {formatDateMonthandYear(data?.date)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.indigo[100],
              borderRadius: SIZES.small,
              width: 60,
              paddingVertical: 2,
              paddingHorizontal: 4,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 5,
            }}
            onPress={() => {}}>
            {data?.type === 'spare' ? (
              <Image
                source={icons.spare_filled}
                style={{ width: 15, height: 15 }}
                tintColor={COLORS.indigo[500]}
              />
            ) : (
              <Image
                source={icons.services_filled}
                style={{ width: 15, height: 15 }}
                tintColor={COLORS.indigo[500]}
              />
            )}
            <Text style={{ ...FONTS.h6, color: COLORS.indigo[500] }}>{data?.type}</Text>
          </TouchableOpacity>
          <Text style={{ ...FONTS.h4, color: COLORS.primary_text }}>₹{data?.price}</Text>
          <TouchableOpacity style={styles.viewBtn} onPress={() => {}}>
            <Text style={{ ...FONTS.h6, color: COLORS.white }}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  viewBtn: {
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
});
