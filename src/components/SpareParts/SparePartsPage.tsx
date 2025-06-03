import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import SparePartsSideBar from '../../components/SpareParts/SparePartsSideBar';
import SparePartsCard from '../../components/SpareParts/SparePartsCard';
import sparePartsData from '../../components/SpareParts/sparePartsData';
import { COLORS, } from '../../constants/index';

const SparePartsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(sparePartsData[0]);

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <SparePartsSideBar 
          selectedCategory={selectedCategory} 
          onCategorySelect={setSelectedCategory} 
        />
      </View>

      <View style={styles.cardContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectedCategory.parts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <SparePartsCard part={item} />}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
  },
  sidebar: {
    width: 100,
    backgroundColor: COLORS.lightGray1,
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  cardsList: {
   
    paddingBottom: 20, 
    gap: 16,
  },
  cardWrapper: {
    
    marginBottom: 16, 
  }
});


export default SparePartsPage;