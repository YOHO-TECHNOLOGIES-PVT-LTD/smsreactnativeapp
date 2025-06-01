import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView, View, TextInput } from 'react-native';
import { COLORS, FONTS, icons, Styles } from '~/constants';

const SearchBarExample = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Image source={icons.search} style={styles.searchIcon} />
      </View>
    </SafeAreaView>
  );
};

export default SearchBarExample;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // optional, to set background
  },
  container: {
    padding: 15,
  },
  searchBar: {
    height: 45,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.error08,
    ...FONTS.body4,
  },
  searchIcon: {
    width: 15,
    height: 15,
    tintColor: COLORS.primary_text,
    position: 'absolute',
    right: 25,
    top: 30,
    resizeMode: 'contain',
  },
});
