//OUR PERIODIC WORK

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated } from 'react-native';

import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';
import carbreak from '../../assets/Homepage/Car_brakes.jpg';
import carwash from '../../assets/Homepage/Car_wash.jpg';
import cardismantle from '../../assets/Homepage/Car_dismantle.jpg';
import steering from '../../assets/Homepage/Car_steering.jpg';
import carsuspension from '../../assets/Homepage/Car_suspension.jpg';
import cargear from '../../assets/Homepage/car_gear.jpg';
import { COLORS, FONTS } from '~/constants';

// Blinking Label Component
const BlinkingLabel = ({ label }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getLabelColor = () => {
    if (label === 'New') return 'green';
    if (label === 'Offer') return 'blue';
    return 'gray';
  };

  return (
    <Animated.View style={[styles.labelWrapper, { opacity, backgroundColor: getLabelColor() }]}>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
};

// Card component
const Card = ({ title, image, label }) => (
  <View style={styles.card}>
    <View style={styles.imageWrapper}>
      <Image source={image} style={styles.image} />
    </View>
    {label && <BlinkingLabel label={label} />}
    <Text style={styles.cardText}>{title}</Text>
  </View>
);

// Main screen
const OfferCard = () => {
  const cards = [
    { title: 'Engine Checking', image: maintenance, label: 'New' },
    { title: 'Battery Checking', image: carbattery },
    { title: 'Bodypainting', image: carpainting },
    { title: 'Break Checking', image: carbreak },
    { title: 'Car wash', image: carwash, label: 'Offer' },
    { title: 'Dismantle ', image: cardismantle },
    { title: 'Steering checking', image: steering },
    { title: 'Suspension ', image: carsuspension },
    { title: 'Gear Check', image: cargear },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headingtext}>Our Periodic Work</Text>
      <View style={styles.cardGrid}>
        {cards.map((card, index) => (
          <Card key={index} title={card.title} image={card.image} label={card.label} />
        ))}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#B6B09F',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
  card: {
    flexBasis: '30%',
    marginRight: '3.33%',
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: 60,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  labelWrapper: {
    position: 'absolute',
    top: 2,
    right: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 10,
  },
  label: {
    color: COLORS.white,
    ...FONTS.body6
  },
  cardText: {
    ...FONTS.h6,
    color: COLORS.primary_01,
    textAlign: 'center',
  },
  headingtext: {
    marginVertical: 10,
    ...FONTS.h2,
    color: COLORS.primary_text,
  },
});

export default OfferCard;
