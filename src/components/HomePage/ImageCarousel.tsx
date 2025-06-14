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

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, autoScrollInterval = 2000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto-scroll logic
  useEffect(() => {
    if (images.length <= 1 || isAutoScrollPaused) return;

    const scrollToNext = () => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollToIndex(nextIndex, true);
    };

    intervalRef.current = setInterval(scrollToNext, autoScrollInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, isAutoScrollPaused, images.length]);

  const scrollToIndex = (index: number, animated = true) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: screenWidth * index,
        animated,
      });
    }
    setCurrentIndex(index);
  };

  const handleTouchStart = () => {
    setIsAutoScrollPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleTouchEnd = () => {
    setIsAutoScrollPaused(false);
  };

  // Handle infinite scroll
  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);

    if (index === images.length) {
      // Immediately jump to first item without animation
      scrollToIndex(0, false);
    } else if (index === -1) {
      // Immediately jump to last item without animation
      scrollToIndex(images.length - 1, false);
    } else {
      setCurrentIndex(index);
    }
  };

  // For infinite scroll, we add an extra item at start and end
  const extendedImages = [images[images.length - 1], ...images, images[0]];

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <TouchableWithoutFeedback onPressIn={handleTouchStart} onPressOut={handleTouchEnd}>
          <View style={styles.scrollViewContainer}>
            <Animated.ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                useNativeDriver: true,
              })}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleScrollEnd}
              onScrollBeginDrag={handleTouchStart}
              onScrollEndDrag={handleTouchEnd}>
              {extendedImages.map((image, index) => (
                <View key={index} style={styles.slide}>
                  <Image
                    source={typeof image === 'string' ? { uri: image } : image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Animated.ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Indicator dots */}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    width: screenWidth,
    height: 250,
    position: 'relative',
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
  },
  inactiveDot: {
    backgroundColor: '#CCCCCC',
  },
});

export default ImageCarousel;
