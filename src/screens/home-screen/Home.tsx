import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home Page</Text>
      <Text style={styles.dummytext}>hii,vigneshwari</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  dummytext:{
    color:"red",
    textAlign:"center",
    borderWidth:20,
  }
});
