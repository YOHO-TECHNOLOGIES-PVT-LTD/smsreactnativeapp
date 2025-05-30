import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';

const { width } = Dimensions.get('window');
const images = [maintenance, maintenance, maintenance, maintenance];

const AutoSlidingCarousel = () => {
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
            setCurrentIndex(nextIndex);
        }, 3000); // every 3 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
                scrollEnabled={false} // user can't manually scroll
            >
                {images.map((img, index) => (
                    <Image key={index} source={img} style={styles.image} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
    },
    image: {
        width: width,
        height: 200,
        resizeMode: 'cover',
    },
});

export default AutoSlidingCarousel;
