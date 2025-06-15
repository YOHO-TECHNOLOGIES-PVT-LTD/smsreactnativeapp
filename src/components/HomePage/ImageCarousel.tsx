import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from 'react-native';
import { COLORS } from '~/constants';

const { width: screenWidth } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  autoScrollInterval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, autoScrollInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const isManualScroll = useRef(false);

  // Reset to first image when images array changes
  useEffect(() => {
    setCurrentIndex(0);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: screenWidth, animated: false });
    }
  }, [images]);

  // Auto-scroll logic
  useEffect(() => {
    if (images.length <= 1) return;

    const scrollToNext = () => {
      if (isManualScroll.current) return;

      const nextIndex = (currentIndex + 1) % images.length;
      scrollToIndex(nextIndex, true);
    };

    intervalRef.current = setInterval(scrollToNext, autoScrollInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, images.length]);

  const scrollToIndex = (index: number, animated = true) => {
    if (!scrollViewRef.current) return;

    // For infinite scroll, adjust index for extended images array
    const adjustedIndex = index + 1;
    scrollViewRef.current.scrollTo({
      x: screenWidth * adjustedIndex,
      animated,
    });
    setCurrentIndex(index);
  };

  const handleScrollBegin = () => {
    isManualScroll.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleScrollEnd = () => {
    isManualScroll.current = false;
  };

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);

    // Handle infinite scroll edges
    if (pageNum === 0) {
      // Jump to last real image
      scrollViewRef.current?.scrollTo({
        x: screenWidth * images.length,
        animated: false,
      });
      setCurrentIndex(images.length - 1);
    } else if (pageNum === images.length + 1) {
      // Jump to first real image
      scrollViewRef.current?.scrollTo({
        x: screenWidth,
        animated: false,
      });
      setCurrentIndex(0);
    } else {
      setCurrentIndex(pageNum - 1);
    }

    handleScrollEnd();
  };

  // For infinite scroll, add clones of first and last images
  const extendedImages =
    images.length > 1 ? [images[images.length - 1], ...images, images[0]] : images;

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          onMomentumScrollBegin={handleScrollBegin}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollBeginDrag={handleScrollBegin}
          onScrollEndDrag={handleScrollEnd}
          contentOffset={{ x: images.length > 1 ? screenWidth : 0, y: 0 }}>
          {extendedImages.map((image, index) => (
            <View key={`image-${index}`} style={styles.slide}>
              <TouchableWithoutFeedback onPressIn={handleScrollBegin} onPressOut={handleScrollEnd}>
                <Image
                  source={typeof image === 'string' ? { uri: image } : image}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableWithoutFeedback>
            </View>
          ))}
        </ScrollView>
      </View>

      {images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={`indicator-${index}`}
              style={[
                styles.indicatorDot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  carousel: {
    width: screenWidth,
    height: 250,
  },
  slide: {
    width: screenWidth,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 6,
  },
  inactiveDot: {
    backgroundColor: '#CCCCCC',
  },
});

export default ImageCarousel;
