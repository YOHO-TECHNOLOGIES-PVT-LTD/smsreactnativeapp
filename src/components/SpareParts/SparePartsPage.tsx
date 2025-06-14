import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  ImageBackground,
} from 'react-native';
import SparePartsCard from '../../components/SpareParts/SparePartsCard';
import sparePartsData, { SparePartCategory } from '../../components/SpareParts/sparePartsData';
import { COLORS, FONTS, icons } from '../../constants/index';
import { Ionicons } from '@expo/vector-icons';
import { ConstructionIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 20) / 2;

type SparePartsPageProps = {
  spareParts: SparePartCategory[];
};

const SparePartsPage: React.FC<SparePartsPageProps> = ({ spareParts }) => {
  const scrollRef = useRef<ScrollView>(null);
  const scrollStep = 120;
  const scrollX = useRef(0);
  const [error, setError] = React.useState(false);

  const scrollLeft = () => {
    scrollX.current = Math.max(scrollX.current - scrollStep, 0);
    scrollRef.current?.scrollTo({ x: scrollX.current, animated: true });
  };

  const scrollRight = () => {
    scrollX.current += scrollStep;
    scrollRef.current?.scrollTo({ x: scrollX.current, animated: true });
  };

  const categories = [...new Set(spareParts.map((item) => item.category))];
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const filteredParts = spareParts.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    if (spareParts.length > 0 && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [spareParts, categories]);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginHorizontal: 15,
          marginBottom: 5,
          borderLeftColor: COLORS.primary_01,
          borderLeftWidth: 4,
        }}>
        <Text style={{ ...FONTS.h5, fontWeight: 500, color: COLORS.primary, marginLeft: 3 }}>
          Spare Categories
        </Text>
      </View>
      <View style={styles.horizontalNavWrapper}>
        {/* Left Arrow */}
        {/* <TouchableOpacity onPress={scrollLeft} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity> */}

        {/* Scrollable Spare Parts Category Bar */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalNavContent1}>
          {categories.map((item, index) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.horizontalNavItem, isSelected && styles.activeHorizontalNavItem]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.7}>
                <View style={styles.horizontalNavIcon}>
                  <Image
                    source={require('../../assets/sparepartsimage/parts/brakepads.jpg')}
                    style={styles.image}
                    onError={() => setError(true)}
                  />
                </View>
                <Text
                  style={[styles.horizontalNavText, isSelected && styles.activeHorizontalNavText]}
                  numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Right Arrow */}
        {/* <TouchableOpacity onPress={scrollRight} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity> */}
      </View>

      <ImageBackground
        source={icons.home_background}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover">
        {/* Main Content - Grid Layout */}
        <View style={styles.cardContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredParts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.cardWrapper} key={index}>
                <SparePartsCard part={item} />
              </View>
            )}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.cardsList}
          />
        </View>
        <View style={{ marginTop: 35 }}></View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalNavContainer: {
    height: 85,
    backgroundColor: COLORS.error60,
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
    padding: 5,
    backgroundColor: COLORS.primary_04,
    borderRadius: 50,
    marginHorizontal: 4,
    elevation: 1,
    zIndex: 10,
  },

  horizontalNavContent1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalNavContent: {
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  horizontalNavItem: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeHorizontalNavItem: {
    // backgroundColor: '#fde8e8',
  },
  horizontalNavIcon: {
    // marginBottom: 5,
  },
  horizontalNavText: {
    ...FONTS.h6,
    fontWeight: 500,
    textAlign: 'center',
    color: '#666',
    width: '100%',
  },
  activeHorizontalNavText: {
    color: COLORS.primary,
    ...FONTS.h6,
    textDecorationLine: 'underline',
  },
  image: {
    width: 100,
    height: 65,
    borderRadius: 4,
    marginBottom: 5,
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
    width: '50%',
  },
});

export default SparePartsPage;
