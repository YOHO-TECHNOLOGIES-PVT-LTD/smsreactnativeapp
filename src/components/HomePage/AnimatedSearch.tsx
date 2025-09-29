import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, screens } from '~/constants';
import { getAllServiceCategories } from '~/features/services-page/service';
import { useDispatch } from 'react-redux';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useNavigation } from '@react-navigation/native';

const AnimatedSearch = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const searchContent = ['Warranty', 'Dent Paint', 'Periodic Services', 'Miles', 'Top Assist'];

  const [searchIndex, setSearchIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const currentSearch = useRef(searchContent[0]);
  const nextSearch = useRef(searchContent[1]);
  const animationInterval = useRef<any>(null);
  const inputRef = useRef<TextInput>(null);

  /** Fetch categories */
  const fetchAllServices = async () => {
    try {
      const categories = await getAllServiceCategories({});
      if (categories) {
        setServiceCategories(categories);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  /** Start animation */
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
          delay: 100,
        }),
      ]).start(() => {
        setSearchIndex((prev) => {
          const newIndex = (prev + 1) % searchContent.length;
          currentSearch.current = searchContent[newIndex];
          nextSearch.current = searchContent[(newIndex + 1) % searchContent.length];
          return newIndex;
        });
      });
    }, 3000);
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
    return () => stopAnimation();
  }, [isFocused, inputText]);

  /** Filter when typing */
  useEffect(() => {
    if (inputText.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    const matches = serviceCategories.filter((cat) =>
  cat.category_name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .includes(inputText.toLowerCase().trim().replace(/\s+/g, ' '))
);

    setFilteredSuggestions(matches);
  }, [inputText, serviceCategories]);

  /** Animation values */
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
    if (inputText === currentSearch.current || inputText === nextSearch.current) {
      setInputText('');
    }
  };

  const handleBlur = () => {setIsFocused(false)}


 const handleSuggestionPress = (item: any) => {
  setInputText(item.category_name);
  setFilteredSuggestions([]);
  setIsFocused(false);
  
  dispatch(setSelectedTab(screens.services));
  // navigation.navigate('Services', { categoryId: item._id, categoryName: item.category_name });
};



  return (
    <View>
      {/* Search box */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.searchText}
            placeholder=""
            onFocus={handleFocus}
          
            onChangeText={(text) => setInputText(text)}
            value={inputText}
          />
          {!isFocused && inputText === '' && (
            <View style={styles.placeholderWrapper} pointerEvents="none">
              <Animated.View
                style={[
                  styles.animatedTextContainer,
                  { transform: [{ translateY: currentTranslateY }], opacity: currentOpacity },
                ]}>
                <Text style={styles.placeholderText}>Search {currentSearch.current}</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.animatedTextContainer,
                  { transform: [{ translateY: nextTranslateY }], opacity: nextOpacity },
                ]}>
                <Text style={styles.placeholderText}>Search {nextSearch.current}</Text>
              </Animated.View>
            </View>
          )}
        </View>
      </View>

      {isFocused && inputText !== '' && (
  <View style={styles.dropdown} pointerEvents="box-none">
    {filteredSuggestions.length > 0 ? (
      <FlatList
        data={filteredSuggestions}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        keyboardShouldPersistTaps="handled"  
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            activeOpacity={0.7}
            onPress={() => handleSuggestionPress(item)}
          >
            <Text style={styles.suggestionText}>{item.category_name}</Text>
          </TouchableOpacity>
        )}
      />
    ) : (
      <Text style={styles.noServiceText}>No services available</Text>
    )}
  </View>
)}

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
    height: 42,
  },
  searchIcon: { marginRight: 10 },
  inputWrapper: { flex: 1, height: '100%', justifyContent: 'center', position: 'relative' },
  searchText: {
    color: COLORS.primary,
    fontSize: 14,
    height: '100%',
    padding: 0,
    margin: 0,
    textAlignVertical: 'center',
  },
  placeholderWrapper: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center',
  },
  animatedTextContainer: { position: 'absolute', left: 0, right: 0 },
  placeholderText: { color: COLORS.primary_03, fontSize: 14, lineHeight: 20 },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    elevation: 4,
    maxHeight: 150,
  },
suggestionItem: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderBottomWidth: 0.5,
  borderBottomColor: '#ddd',
  backgroundColor: 'white',
},


  suggestionText: { fontSize: 14, color: COLORS.primary },
  noServiceText: { padding: 15, fontSize: 14, color: 'gray', textAlign: 'center' },
});

export default AnimatedSearch;
