import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '~/constants';

const AnimatedSearch = () => {
  const searchContent = ['Warranty', 'Dent Paint', 'Periodic Services', 'Miles', 'Top Assist'];
  const [searchIndex, setSearchIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const currentSearch = useRef(searchContent[0]);
  const nextSearch = useRef(searchContent[1]);
  const animationInterval = useRef(null);
  const inputRef = useRef(null);

  const startAnimation = () => {
    if (animationInterval.current) clearInterval(animationInterval.current);

    animationInterval.current = setInterval(() => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
          delay: 100, // Small delay before resetting
        }),
      ]).start(() => {
        setSearchIndex((prev) => {
          const newIndex = (prev + 1) % searchContent.length;
          currentSearch.current = searchContent[newIndex];
          nextSearch.current = searchContent[(newIndex + 1) % searchContent.length];
          return newIndex;
        });
      });
    }, 3000); // Increased interval time
  };

  const stopAnimation = () => {
    if (animationInterval.current) {
      clearInterval(animationInterval.current);
      animationInterval.current = null;
    }
  };

  useEffect(() => {
    if (!isFocused && inputText === '') {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isFocused, inputText]);

  const currentTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const currentOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const nextTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  const nextOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleFocus = () => {
    setIsFocused(true);
    // Clear any existing text when focusing
    if (inputText === currentSearch.current || inputText === nextSearch.current) {
      setInputText('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.searchContainer}>
      <MaterialIcons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.searchText}
          placeholder=""
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={(text) => setInputText(text)}
          value={inputText}
        />
        {!isFocused && inputText === '' && (
          <View style={styles.placeholderWrapper} pointerEvents="none">
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 5,
    elevation: 5,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  searchText: {
    color: '#000',
    fontSize: 14,
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    height: '100%',
    textAlignVertical: 'center',
  },
  placeholderWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  animatedTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'center',
  },
});

export default AnimatedSearch;
