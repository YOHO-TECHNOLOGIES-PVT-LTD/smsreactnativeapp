import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS, FONTS } from '~/constants';

interface LoadingProps {
  visible: boolean;
}

const LoadingAnimation: FC<LoadingProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <LottieView
          source={{
            uri: 'https://assets1.lottiefiles.com/packages/lf20_raiw2hpe.json',
          }}
          autoPlay
          loop
          style={styles.animation}
          cacheStrategy="strong"
          speed={1.5}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    // backgroundColor: 'white',
    // padding: 20,
    // borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  animation: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 500
  },
});

export default LoadingAnimation;
