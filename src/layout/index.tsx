import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useDrawerProgress } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTab } from '../store/tab/tabSlice';
import { COLORS, FONTS, SIZES, icons, screens, bottom_tabs, SPACING } from '../constants';
import { HomeScreen, ServicesScreen, SosScreen, SparePartsScreen, ProfileScreen } from '~/screens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP } from 'react-native-responsive-screen';

type TabButtonProps = {
  label: string;
  icon: any;
  isFocused: boolean;
  onPress: () => void;
  outerContainerStyle?: any;
  innerContainerStyle?: any;
  isScanButton?: boolean;
};

const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isFocused,
  onPress,
  outerContainerStyle,
  innerContainerStyle,
  isScanButton = false,
}) => {
  const radialPulse = useSharedValue(0);

  useEffect(() => {
    if (isScanButton) {
      radialPulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
    }
  }, [isScanButton]);

  const radialGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: radialPulse.value }],
    opacity: interpolate(radialPulse.value, [0.9, 1], [0.5, 0]),
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    borderRadius: 100,
  }));

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={[
          {
            flex: isScanButton ? 0 : 1,
            alignItems: 'center',
            justifyContent: 'center',
            top: isScanButton ? -8 : 0,
          },
          outerContainerStyle,
        ]}>
        {isScanButton && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 80,
                height: 80,
                zIndex: -1,
              },
              radialGlowStyle,
            ]}
          />
        )}

        <Animated.View
          style={[
            {
              flexDirection: 'column',
              width: isScanButton ? 45 : '100%',
              height: isScanButton ? 45 : SPACING.small,
              borderRadius: isScanButton ? 32.5 : 25,
              backgroundColor: isScanButton ? COLORS.primary_04 : '',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: isScanButton ? 5 : 0,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isScanButton ? 0.3 : 0,
              shadowRadius: 6,
            },
            innerContainerStyle,
          ]}>
          <View
            style={{
              backgroundColor: isScanButton ? '' : isFocused ? COLORS.primary_04 : COLORS.white,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 50,
            }}>
            <Image
              source={icon}
              style={{
                width: isScanButton ? 35 : 25,
                height: isScanButton ? 35 : 25,
                tintColor: isScanButton
                  ? undefined
                  : isFocused
                    ? COLORS.primary_borders
                    : undefined,
              }}
            />
          </View>
          {!isScanButton && (
            <Text numberOfLines={1} style={{ color: COLORS.primary_text, ...FONTS.h7 }}>
              {label}
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const progress = useDrawerProgress();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const selectedTab = useSelector((state: any) => state.tabReducer.selectedTab);

  const sosAnimation = useSharedValue(1);
  // const radialPulse = useSharedValue(0);

  const sosAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(sosAnimation.value, [0, 1], [1, 1.2]);
    const opacity = interpolate(sosAnimation.value, [0, 1], [0.8, 1]);
    const backgroundColor = interpolateColor(
      sosAnimation.value,
      [0, 0.5, 1],
      ['rgba(255,0,0,0.2)', 'rgba(255,0,0,0.6)', 'rgba(255,0,0,1)']
    );

    return {
      transform: [{ scale }],
      opacity,
      backgroundColor,
      borderRadius: 999,
    };
  });

  // const radialGlowStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: radialPulse.value }],
  //   opacity: interpolate(radialPulse.value, [0.9, 1], [0.5, 0]),
  //   backgroundColor: 'rgba(255, 0, 0, 0.4)',
  //   borderRadius: 100,
  // }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      {
        scale: interpolate(progress.value, [0, 1], [1, 0.8], 'clamp'),
      },
      {
        rotateY: `${interpolate(progress.value, [0, 1], [0, -10], 'clamp')}deg`,
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, Platform.OS === 'android' ? width - 130 : -60],
          'clamp'
        ),
      },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, 20], 'clamp'),
    overflow: 'hidden',
  }));

  useEffect(() => {
    sosAnimation.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);

    // radialPulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
  }, [sosAnimation]);

  useEffect(() => {
    if (!selectedTab) dispatch(setSelectedTab(screens.home));
  }, [dispatch, selectedTab]);

  useEffect(() => {
    const index = bottom_tabs.findIndex((t) => t.label === selectedTab);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: false });
    }
  }, [selectedTab]);

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: COLORS.white }, animatedStyle]}>
      <View style={{ backgroundColor: COLORS.white }}>
        <FlatList
          ref={flatListRef}
          onScrollToIndexFailed={({ index }) => {
            flatListRef.current?.scrollToOffset({
              offset: index * SIZES.width,
              animated: true,
            });
          }}
          horizontal
          scrollEnabled={false}
          pagingEnabled
          snapToAlignment="center"
          snapToInterval={SIZES.width}
          showsHorizontalScrollIndicator={false}
          data={bottom_tabs}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <View style={{ width: SIZES.width, height: SIZES.height }}>
              {item.label === screens.home && <HomeScreen />}
              {item.label === screens.services && <ServicesScreen />}
              {item.label === screens.sos && <SosScreen />}
              {item.label === screens.spare_parts && <SparePartsScreen />}
              {item.label === screens.profile && <ProfileScreen />}
            </View>
          )}
        />
      </View>

      <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.white }}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.white,
            paddingHorizontal: SIZES.radius,
            paddingTop: 5,
            paddingBottom: Platform.OS === 'android' ? 10 : 20, // Adjust for nav bar height
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 10,
          }}>
          {bottom_tabs.map((tab) => {
            const isScanButton = tab.label === screens.sos;
            const isFocused = selectedTab === tab.label;

            return (
              <View
                key={tab.id}
                style={{
                  flex: isScanButton ? 0 : 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: isScanButton ? -20 : 0,
                }}>
                <TabButton
                  label={tab.label}
                  icon={isScanButton ? tab.icon : isFocused ? tab.activeIcon : tab.icon}
                  isFocused={isFocused}
                  onPress={() => dispatch(setSelectedTab(tab.label))}
                  isScanButton={isScanButton}
                  outerContainerStyle={isScanButton ? sosAnimatedStyle : {}}
                />
              </View>
            );
          })}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default MainLayout;
