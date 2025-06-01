//div------6

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';

// image
import person1 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_1.jpg';
import person2 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_2.jpg';
import person3 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_3.jpg';
import person4 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_4.jpg';
import { COLORS, FONTS } from '~/constants';

const cards = [
  { title: 'ABC Delivery company, Chennai', image: person1 },
  { title: 'TVS company, Chennai', image: person2 },
  { title: 'Good Mechanics, Chennai', image: person3 },
  { title: 'Car Service Industry, Chennai', image: person4 },
];

// 💡 Blinking Image Component
const BlinkingImage = ({ source }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.Image source={source} style={[styles.image, { opacity }]} />;
};

// 📦 Card Component
const Card = ({ title, image }) => (
  <View style={styles.card}>
    <BlinkingImage source={image} />
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity style={styles.cardButton} onPress={() => {}}>
      <Text style={styles.buttonText}>View</Text>
    </TouchableOpacity>
  </View>
);

// 📦 Main Component
const BlinkingCardsContainer = () => {
  return (
    <View>
      <View>
        <Text style={styles.headingtext}>Our Delivery Company</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {cards.map((card, index) => (
          <Card key={index} title={card.title} image={card.image} label={card.label} />
        ))}
      </ScrollView>
    </View>
  );
};

// 💅 Styles
const CARD_WIDTH = 100;
const CARD_HEIGHT = 160;
const CARD_SPACING = 16;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
    marginBottom: 11,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_SPACING,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 8,
    ...FONTS.body6,
    color: COLORS.primary_text,
    lineHeight: 12,
    textAlign: 'center',
  },
  headingtext: {
    ...FONTS.h2,
    marginVertical: 5,
    padding: 10,
    color: COLORS.primary_text,
  },
  cardButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h6,
    textAlign: 'center',
  },
});

export default BlinkingCardsContainer;
