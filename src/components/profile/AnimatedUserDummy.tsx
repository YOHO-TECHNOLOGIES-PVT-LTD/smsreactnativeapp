import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const AnimatedUserDummy = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animated-avatar.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 45,
    height: 45,
  },
});

export default AnimatedUserDummy;
