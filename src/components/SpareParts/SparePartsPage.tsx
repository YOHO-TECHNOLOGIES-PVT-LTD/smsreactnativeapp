import React from 'react';
import { StyleSheet, View } from 'react-native';
import SparePartsSideBar from '../../components/SpareParts/SparePartsSideBar';
//import SparePartsCard from '../../components/SpareParts/SparePartsCard';

const SparePartsPage = () => {
  return (
    <View style={styles.container}>
      <SparePartsSideBar />
      <View style={styles.cardContainer}>
        {/* Later we'll add mapped SparePartsCard components here */}
      </View>
    </View>
  );
};

export default SparePartsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  cardContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
  },
});
