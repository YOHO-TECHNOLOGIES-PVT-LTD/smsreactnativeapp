import { StyleSheet, Text, TouchableOpacity, FlatList, Image, View } from 'react-native';
import React from 'react';
import dummyimg from '../../../src/assets/spareParts-img/';

type Category = {
  label: string;
  image: any; // local images must be imported as a module
};

const categories: Category[] = [
  { label: 'Engine', image: dummyimg },
  { label: 'Tyres', image: dummyimg },
  { label: 'Brakes', image: dummyimg },
  { label: 'AC', image: dummyimg },
  { label: 'Battery', image: dummyimg },
  { label: 'Engine', image: dummyimg },
  { label: 'Tyres', image: dummyimg },
  { label: 'Brakes', image: dummyimg },
  { label: 'AC', image: dummyimg },
  { label: 'Battery', image: dummyimg },
];

const SparePartsSideBar = () => {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.itemContainer}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.sidebar}
    />
  );
};

export default SparePartsSideBar;

const styles = StyleSheet.create({
  sidebar: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: 100,
  },
  itemContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
