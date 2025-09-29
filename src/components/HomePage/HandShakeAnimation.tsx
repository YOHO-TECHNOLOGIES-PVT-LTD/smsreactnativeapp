import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const HandShakeAnimation = () => {
  const rotation = useSharedValue(0);
  const position = useSharedValue(0);

  // Configure the hand shake animation
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(20, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // infinite repeat
      true // reverse the animation
    );

    position.value = withRepeat(
      withTiming(10, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  // Left hand animation
  const leftHandStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(rotation.value, [0, 20], [0, -20])}deg` },
        { translateX: interpolate(position.value, [0, 10], [0, -5]) },
      ],
    };
  });

  // Right hand animation
  const rightHandStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { translateX: position.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.handsContainer}>
        {/* Left Hand */}
        <Animated.View style={[styles.hand, styles.leftHand, leftHandStyle]}>
          <MaterialIcons name="waving-hand" size={14} color="#FFD700" />
        </Animated.View>

        {/* Right Hand */}
        {/* <Animated.View style={[styles.hand, styles.rightHand, rightHandStyle]}>
          <MaterialIcons name="waving-hand" size={40} color="#FFD700" />
        </Animated.View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',
  },
  handsContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: 200,
    // height: 100,
  },
  hand: {
    // position: 'absolute',
  },
  // leftHand: {
  //   left: 36,
  //   top: -8
  // },
  // rightHand: {
  //   right: 60,
  // },
});

export default HandShakeAnimation;
