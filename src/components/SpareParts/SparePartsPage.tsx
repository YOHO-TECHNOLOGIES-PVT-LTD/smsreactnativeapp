import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import SparePartsCard from '../../components/SpareParts/SparePartsCard';
import sparePartsData, { SparePartCategory } from '../../components/SpareParts/sparePartsData';
import { COLORS, FONTS } from '../../constants/index';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 20) / 2;

const SparePartsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(sparePartsData[0]);

  return (
    <View style={styles.container}>
      {/* Horizontal Navigation Bar */}
      <View style={styles.horizontalNavContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalNavContent}>
          {sparePartsData.map((item, index) => {
            const isSelected = selectedCategory?.category === item.category;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.horizontalNavItem, isSelected && styles.activeHorizontalNavItem]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.7}>
                <View style={styles.horizontalNavIcon}>
                  <Image source={item.image} style={styles.image} />
                </View>
                <Text
                  style={[styles.horizontalNavText, isSelected && styles.activeHorizontalNavText]}
                  numberOfLines={1}>
                  {item.category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content - Grid Layout */}
      <View style={styles.cardContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectedCategory.parts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <SparePartsCard part={item} />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.cardsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  horizontalNavContainer: {
    height: 85,
    backgroundColor: COLORS.lightGrey,
    borderBottomWidth: 1,
    borderTopWidth: 3,
    borderBottomColor: '#e0e0e0',
    borderTopColor: COLORS.primary,
    elevation: 1,
  },
  horizontalNavContent: {
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  horizontalNavItem: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.2,
    borderColor: COLORS.grey40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: 105,
  },
  activeHorizontalNavItem: {
    backgroundColor: '#fde8e8',
  },
  horizontalNavIcon: {
    marginBottom: 5,
  },
  horizontalNavText: {
    ...FONTS.h6,
    textAlign: 'center',
    color: '#666',
  },
  activeHorizontalNavText: {
    color: COLORS.primary,
    ...FONTS.h6,
  },
  image: {
    width: 65,
    height: 40,
    borderRadius: 4,
  },
  cardContainer: {
    flex: 1,
    padding: 5,
  },
  cardsList: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
});

export default SparePartsPage;
