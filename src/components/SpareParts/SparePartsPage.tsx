import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from 'react-native';
import SparePartsCard from '../../components/SpareParts/SparePartsCard';
import { SparePartCategory } from '../../components/SpareParts/sparePartsData';
import { COLORS, FONTS } from '../../constants/index';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { getImageUrl } from '~/utils/imageUtils';

type SparePartsPageProps = {
  spareParts: SparePartCategory[];
  onRefresh?: () => void;
};

const SparePartsPage: React.FC<SparePartsPageProps> = ({ spareParts, onRefresh }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [error, setError] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredParts, setFilteredParts] = useState<SparePartCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const categories = [...new Set(spareParts.map((item) => item.category))];
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        onRefresh();
      } catch (error) {
        console.error('Error refreshing spare parts:', error);
      } finally {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    if (spareParts?.length > 0 && categories?.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [spareParts, categories]);

  useEffect(() => {
    filterParts();
  }, [searchQuery, selectedCategory, spareParts]);

  const filterParts = () => {
    let result = spareParts;

    if (selectedCategory) {
      result = result?.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result?.filter(
        (item: any) =>
          item?.productName.toLowerCase().includes(query) ||
          item?.brand.toLowerCase().includes(query)
      );
    }

    setFilteredParts(result);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

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
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalNavContent1}>
          {categories?.map((item: any, index) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.horizontalNavItem, isSelected && styles.activeHorizontalNavItem]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.7}>
                <View style={styles.horizontalNavIcon}>
                  <Image
                    source={
                      item?.image
                        ? { uri: getImageUrl(item?.image) }
                        : require('../../assets/spareparts.png')
                    }
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
      </View>

      {/* Search Input with Clear Button */}
      <View style={{ marginVertical: 5, marginHorizontal: 15 }}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={22} color={COLORS.grey} />
          </View>
          <TextInput
            placeholder="Search for Products"
            placeholderTextColor={COLORS.grey}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          {searchQuery?.length > 0 && (
            <TouchableOpacity
              style={styles.clearIcon}
              onPress={clearSearch}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={20} color={COLORS.grey} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content - Grid Layout */}
      <View style={styles.cardContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredParts?.length > 0 || searchQuery.trim() !== '' ? filteredParts : []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper} key={index}>
              <SparePartsCard part={item} />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.cardsList}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {searchQuery.trim() !== ''
                  ? 'No products found matching your search'
                  : 'No products available in this category'}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]} 
              tintColor={COLORS.primary}
            />
          }
        />
      </View>
      <View style={{ marginTop: 35 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalNavWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  horizontalNavContent1: {
    flexDirection: 'row',
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
    paddingVertical:2,
   
  },
  activeHorizontalNavText: {
    color:"white",
    ...FONTS.h6,
    // textDecorationLine: 'underline',
     backgroundColor:COLORS.primary_01,
    paddingHorizontal:4,
    paddingVertical:2,
    borderRadius:10
  
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginBottom: 5,
    borderColor: COLORS.primary_04,
    borderWidth: 1,
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
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.grey08,
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 15,
    paddingLeft: 40,
    paddingRight: 40, // Add padding for the clear icon
  },
  searchIcon: {
    position: 'absolute',
    top: 15,
    left: 12,
    zIndex: 1,
  },
  clearIcon: {
    position: 'absolute',
    top: 15,
    right: 12,
    zIndex: 1,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 180,
  },
  noResultsText: {
    ...FONTS.body3,
    color: COLORS.grey,
    textAlign: 'center',
  },
});

export default SparePartsPage;
