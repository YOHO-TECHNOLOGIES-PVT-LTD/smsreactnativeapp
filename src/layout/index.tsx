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
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Animated.View
      style={[
        {
          flex: isScanButton ? 0 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          top: isScanButton ? -30 : 0,
        },
        outerContainerStyle,
      ]}>
      <Animated.View
        style={[
          {
            flexDirection: 'column',
            width: isScanButton ? 60 : '100%',
            height: isScanButton ? SPACING.xl : SPACING.small,
            borderRadius: isScanButton ? 32.5 : 25,
            backgroundColor: isScanButton ? COLORS.primary : '',
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
              width: isScanButton ? 45 : 25,
              height: isScanButton ? 45 : 25,
              tintColor: isScanButton ? '' : isFocused ? COLORS.primary_borders : '',
            }}
          />
        </View>
        {!isScanButton && (
          <Text numberOfLines={1} style={{ color: COLORS.primary_text, ...FONTS.h6 }}>
            {label}
          </Text>
        )}
      </Animated.View>
    </Animated.View>
  </TouchableWithoutFeedback>
);

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const progress = useDrawerProgress();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const selectedTab = useSelector((state: any) => state.tabReducer.selectedTab);

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

  const tabColors = {
    [screens.home]: useSharedValue(COLORS.white),
    [screens.services]: useSharedValue(COLORS.white),
    [screens.sos]: useSharedValue(COLORS.white),
    [screens.spare_parts]: useSharedValue(COLORS.white),
    [screens.profile]: useSharedValue(COLORS.white),
  };

  const tabColorStyles = Object.keys(tabColors).reduce(
    (acc, key) => {
      acc[key] = useAnimatedStyle(() => ({ backgroundColor: tabColors[key].value }));
      return acc;
    },
    {} as Record<string, any>
  );

  useEffect(() => {
    if (!selectedTab) dispatch(setSelectedTab(screens.home));
  }, []);

  useEffect(() => {
    const index = bottom_tabs.findIndex((t) => t.label === selectedTab);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: false });
    }
    for (const screen of Object.keys(tabColors)) {
      tabColors[screen].value = withTiming(screen === selectedTab ? COLORS.white : COLORS.white, {
        duration: 200,
      });
    }
  }, [selectedTab]);

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: COLORS.white }, animatedStyle]}>
      <View style={{ backgroundColor: COLORS.white }}>
        <FlatList
          ref={flatListRef}
          onScrollToIndexFailed={({ index, averageItemLength }) => {
            flatListRef.current?.scrollToOffset({
              offset: index * averageItemLength,
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

      <SafeAreaView
        edges={['bottom']}
        style={{ backgroundColor: COLORS.white, marginTop: widthPercentageToDP(-8) }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 4 }}
          colors={[COLORS.transparent, COLORS.grey]}
          style={{
            position: 'absolute',
            top: -20,
            left: 0,
            right: 0,
            height: 100,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: SIZES.radius,
            paddingBottom: Platform.OS === 'android' ? 10 : 0,
            paddingTop: 5,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: COLORS.white,
            elevation: 10,
          }}>
          {bottom_tabs.map((tab) => {
            const isScanButton = tab.label === screens.sos;
            const isFocused = selectedTab === tab.label;
            return (
              <TabButton
                key={tab.id}
                label={tab.label}
                icon={isScanButton ? tab.icon : isFocused ? tab.activeIcon : tab.icon}
                isFocused={isFocused}
                innerContainerStyle={tabColorStyles[tab.label]}
                onPress={() => dispatch(setSelectedTab(tab.label))}
                isScanButton={isScanButton}
              />
            );
          })}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default MainLayout;
