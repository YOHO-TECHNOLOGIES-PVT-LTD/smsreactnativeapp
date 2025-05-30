import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';
import { useSelector } from 'react-redux';

// Define the shape of a notification if not already defined elsewhere
interface Notification {
  id: string;
  title: string;
  status: 'unread' | 'read';
  [key: string]: any;
}

interface IconButtonProps {
  icon: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, containerStyle, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZES.extraSmall,
        backgroundColor: COLORS.white,
        padding: SIZES.small,
        marginRight: SIZES.radius,
        ...(containerStyle as object),
      }}
      onPress={onPress}>
      <Image style={{ width: 15, height: 15 }} resizeMode="contain" source={icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notifyContainer: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 15,
    height: 15,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
