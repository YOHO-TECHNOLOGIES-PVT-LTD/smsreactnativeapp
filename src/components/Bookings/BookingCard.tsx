import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SIZES } from '~/constants';

type BookingCardProps = {
  title: string;
  description: string;
  icon: any;
  onPress: () => void;
  delay?: number;
};

const BookingCard: React.FC<BookingCardProps> = ({
  title,
  description,
  icon,
  onPress,
  delay = 0,
}) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 600,
      delay,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, { duration: 500, delay });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, { marginVertical: 10 }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: SIZES.radius,
          padding: 20,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: COLORS.lightGray1,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}>
          <Image source={icon} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...FONTS.h5, color: COLORS.primary }}>{title}</Text>
          <Text style={{ ...FONTS.body4, color: COLORS.grey }}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BookingCard;
