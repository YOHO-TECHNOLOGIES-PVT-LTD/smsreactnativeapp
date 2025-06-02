// slide show below search bar


import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

// 📦 Image Imports
import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';
import carbreak from '../../assets/Homepage/Car_brakes.jpg';
import carwash from '../../assets/Homepage/Car_wash.jpg';
import cardismantle from '../../assets/Homepage/Car_dismantle.jpg';

const { width } = Dimensions.get('window');

// 🖼️ Images + duplication to simulate infinite loop
const originalImages = [maintenance, carbattery, carpainting, carbreak, carwash, cardismantle];
const images = [...originalImages, ...originalImages]; // Duplicate

const AutoSlidingCarousel = () => {
    const scrollViewRef = useRef(null);
    const currentIndex = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            currentIndex.current += 1;

            // Smooth scroll to next image
            scrollViewRef.current?.scrollTo({
                x: currentIndex.current * width,
                animated: true,
            });

            // If at end of first set, reset index to beginning
            if (currentIndex.current >= originalImages.length * 2 - 1) {
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
                    currentIndex.current = 0;
                }, 500); // wait for smooth scroll to finish before resetting
            }
        }, 3000); // Every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false} // Disable manual scroll
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
        marginTop: 1,
        marginHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: width,
        height: 200,
        resizeMode: 'cover',
    },
});

export default AutoSlidingCarousel;
