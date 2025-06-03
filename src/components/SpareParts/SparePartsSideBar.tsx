import { StyleSheet, Text, TouchableOpacity, FlatList, Image, View } from 'react-native';
import React from 'react';
import sparePartsData, { SparePartCategory } from '../../components/SpareParts/sparePartsData';
import { COLORS } from '../../constants/index';

type Props = {
  onCategorySelect: (category: SparePartCategory) => void;
  selectedCategory: SparePartCategory | null;
};

const SparePartsSideBar = ({ onCategorySelect, selectedCategory }: Props) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={sparePartsData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        const isSelected = selectedCategory?.category === item.category;

        return (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              isSelected && styles.selectedItemContainer
            ]}
            onPress={() => onCategorySelect(item)}
            activeOpacity={0.7}
          >
            <View style={styles.contentContainer}>
              <Image 
                source={item.image} 
                style={styles.image} 
              />
              <Text style={styles.label}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.sidebar}
    />
  );
};

export default SparePartsSideBar;

const styles = StyleSheet.create({
  sidebar: {
    paddingVertical: 20,
    backgroundColor: COLORS.lightGrey,
    alignItems: 'center',
    width: 100,
    borderRightWidth: 1,
    borderRightColor: COLORS.primary_borders,
  },
  itemContainer: {
    width: 92, // Fixed width (100 - 8 padding)
    marginHorizontal: 4, // Center the item
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent', // Default transparent border
    borderRadius: 8,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  selectedItemContainer: {
    backgroundColor: COLORS.primary + '20',
  },
  image: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: COLORS.light,
    padding: 4,
   
  
  },
  label: {
    fontSize: 12,
    color: COLORS.primary_text,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 4,
  },
});