import React, { useState, ReactNode } from 'react';
import { View, Text, Image, ImageStyle, ViewStyle, StyleProp, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants';

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
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.black }}>
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            paddingHorizontal: SIZES.padding,
            backgroundColor: COLORS.white,
            ...(containerStyle as object),
          }}>
          {/* Left */}
          {leftComponent}

          {/* Title */}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!error && (
              <Image
                style={{
                  width: '65%',
                  height: 45,
                  resizeMode: 'contain', // Changed to 'contain' for better logo display
                }}
                source={require('../assets/logo.png')}
                onError={() => setError(true)}
              />
            )}
          </View>

          {/* Right */}
          {rightComponent}
        </View>
      </SafeAreaView>
      <View style={{ borderBottomWidth: 2, borderColor: COLORS.primary }}></View>
    </>
  );
};

export default Header;
