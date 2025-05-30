import React, { useState, ReactNode } from 'react';
import { View, Text, Image, ImageStyle, ViewStyle, StyleProp } from 'react-native';
import { FONTS, SIZES } from '../constants';

interface HeaderProps {
  containerStyle?: StyleProp<ViewStyle>;
  logo?: string;
  titleStyle?: StyleProp<Text>;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  containerStyle,
  logo,
  titleStyle,
  leftComponent,
  rightComponent,
}) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        ...(containerStyle as object),
      }}>
      {/* Left */}
      {leftComponent}

      {/* Title */}
      <View
        style={{
          flex: 1,
          marginHorizontal: SIZES.padding,
          opacity: 0.9,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {!error && (
          <Image
            style={
              {
                width: '100%',
                height: 45,
                borderRadius: 3,
                resizeMode: 'cover',
              } as ImageStyle
            }
            source={{
              uri: 'https://img.freepik.com/free-vector/harvard-hall-university-buildings-vector-cartoon-style_1308-160402.jpg',
            }}
            onError={() => setError(true)}
          />
        )}
      </View>

      {/* Right */}
      {rightComponent}
    </View>
  );
};

export default Header;
