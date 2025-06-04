import React, { useRef, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 20) / 2;

const SparePartsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(sparePartsData[0]);
  const scrollRef = useRef<ScrollView>(null);
  const scrollStep = 120;
  const scrollX = useRef(0);

  const scrollLeft = () => {
    scrollX.current = Math.max(scrollX.current - scrollStep, 0);
    scrollRef.current?.scrollTo({ x: scrollX.current, animated: true });
  };

  const scrollRight = () => {
    scrollX.current += scrollStep;
    scrollRef.current?.scrollTo({ x: scrollX.current, animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.horizontalNavWrapper}>
        {/* Left Arrow */}
        <TouchableOpacity onPress={scrollLeft} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Scrollable Spare Parts Category Bar */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalNavContent1}>
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

        {/* Right Arrow */}
        <TouchableOpacity onPress={scrollRight} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
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
  horizontalNavWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  arrowButton: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 4,
    elevation: 2,
    zIndex: 10,
  },

  horizontalNavContent1: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
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
    width: 115,
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
