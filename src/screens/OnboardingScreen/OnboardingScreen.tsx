import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '~/routes';
import { COLORS, FONTS, icons } from '~/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const slides = [
  require('../../assets/ob_1.png'),
  require('../../assets/ob_2.png'),
  require('../../assets/ob_3.png'),
];

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleGetStarted = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainStack' }],
    });
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.container}>
          <Image source={slides[currentIndex]} style={styles.image} resizeMode="cover" />

          {/* Back Button */}
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Image
                source={icons.back}
                style={{ width: 25, height: 25 }}
                tintColor={COLORS.primary}
              />
            </TouchableOpacity>
          )}

          {/* Next / Get Started Button */}
          {currentIndex < slides.length - 1 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.buttonText}>Next</Text>
                <MaterialIcons name="navigate-next" size={18} color={COLORS.primary_text} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    // backgroundColor: COLORS.error20,
    paddingVertical: 3,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 25,
  },
  getStartedButton: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 56,
    borderRadius: 25,
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.primary_text,
    fontWeight: 500,
  },
  getStartedText: {
    color: COLORS.white,
    fontWeight: 500
  },
});

export default OnboardingScreen;
