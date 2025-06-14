import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '~/constants';

const AnimatedSearch = () => {
  const searchContent = ['Warranty', 'Dent Paint', 'Periodic Services', 'Miles', 'Top Assist'];
  const [searchIndex, setSearchIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const currentSearch = useRef(searchContent[0]);
  const nextSearch = useRef(searchContent[1]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start animation out
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Update search terms after animation completes
        setSearchIndex((prev) => {
          const newIndex = (prev + 1) % searchContent.length;
          currentSearch.current = searchContent[newIndex];
          nextSearch.current = searchContent[(newIndex + 1) % searchContent.length];
          animatedValue.setValue(0);
          return newIndex;
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const currentOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const nextTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const nextOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.searchContainer}>
      <MaterialIcons name="search" size={20} color={COLORS.primary} />
      <View style={styles.textContainer}>
        <Animated.View
          style={[
            styles.animatedTextContainer,
            {
              transform: [{ translateY: currentTranslateY }],
              opacity: currentOpacity,
            },
          ]}>
          <Text style={styles.placeholderText}>Search {currentSearch.current}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedTextContainer,
            {
              transform: [{ translateY: nextTranslateY }],
              opacity: nextOpacity,
            },
          ]}>
          <Text style={styles.placeholderText}>Search {nextSearch.current}</Text>
        </Animated.View>
      </View>
      <TextInput style={styles.searchText} placeholder="" />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    paddingLeft: 15,
    marginVertical: 5,
    elevation: 5,
    height: 45,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  animatedTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
  },
  searchText: {
    position: 'absolute',
    left: 45,
    right: 10,
    top: 10,
    bottom: 10,
    color: '#000',
    fontSize: 14,
  },
});

export default AnimatedSearch;
