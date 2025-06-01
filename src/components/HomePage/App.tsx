//our servises

import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

// 📦 Image Assets
import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';
import carbreak from '../../assets/Homepage/Car_brakes.jpg';
import carwash from '../../assets/Homepage/Car_wash.jpg';
import cardismantle from '../../assets/Homepage/Car_dismantle.jpg';
import { COLORS, FONTS } from '~/constants';

// 🔲 Card Component
const Card = ({ title, image }) => (
  <ImageBackground source={image} style={styles.card} imageStyle={styles.image}>
    <View style={styles.overlay}>
      <Text style={styles.cardText}>{title}</Text>
    </View>
  </ImageBackground>
);

// 📱 Main App
const App = () => {
  const cards = [
    { title: 'Annual Maintenance', image: maintenance },
    { title: 'Car Painting', image: carpainting },
    { title: 'Car Battery', image: carbattery },
    { title: 'Car Break', image: carbreak },
    { title: 'Car Wash', image: carwash },
    { title: 'Dismantle servise', image: cardismantle },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headingtext}>Our Services</Text>
      <View style={styles.cardGrid}>
        {cards.map((card, index) => (
          <Card key={index} title={card.title} image={card.image} />
        ))}
      </View>
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  headingtext: {
    ...FONTS.h2,
    marginBottom: 10,
    color: COLORS.primary_text,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: COLORS.white,
    textAlign: 'center',
    paddingHorizontal: 4,
    ...FONTS.h5,
  },
});

export default App;
