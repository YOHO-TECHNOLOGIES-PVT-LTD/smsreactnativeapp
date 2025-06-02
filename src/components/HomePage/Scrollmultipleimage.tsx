

// div----5 confirm


import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Animated,
    Dimensions,
    ImageBackground,
} from 'react-native';

import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';
import backgroundimage from '../../assets/Homepage/BACKGROUND_IMAGE/Background image red.jpg';

const screenWidth = Dimensions.get('window').width;

// Blinking Label Component
const BlinkingLabel = ({ label }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const getLabelColor = () => {
        if (label === 'New') return 'green';
        if (label === 'Offer') return 'yellow';
        return 'gray';
    };

    return (
        <Animated.View style={[styles.labelWrapper, { opacity, backgroundColor: getLabelColor() }]}>
            
            <Text style={styles.label}>{label}</Text>
        </Animated.View>
    );
};

// Sliding Image Component
const SlidingImage = ({ source, duration }) => {
    const translateX = useRef(new Animated.Value(-screenWidth)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: screenWidth,
                duration,
                useNativeDriver: true,
            })
        ).start();
    }, [duration]);

    return (
        <Animated.View style={{ transform: [{ translateX }] }}>
            <Image source={source} style={styles.image} />
        </Animated.View>
    );
};

// Card Component
const Card = ({ title, image, label, duration }) => (
    <View style={styles.card}>
        <View style={styles.imageWrapper}>
            <SlidingImage source={image} duration={duration} />
        </View>
        {label && <BlinkingLabel label={label} />}
        <Text style={styles.cardText}>{title}</Text>
    </View>
);

// Main screen
const Scrollmultipleimage = () => {
    const cards = [
        { title: 'Annual Maintenance', image: maintenance, label: 'New', duration: 4000 },
        { title: 'Car Battery', image: carbattery, duration: 5500 },
        { title: 'Car Painting', image: carpainting, duration: 6000 },
        { title: 'Tyre Services', image: maintenance, duration: 4800 },
        { title: 'Oil Change', image: carbattery, label: 'Offer', duration: 5200 },
        { title: 'AC Repair', image: carpainting, duration: 4700 },
    ];

    return (
        
        <ImageBackground source={backgroundimage} style={styles.background} resizeMode="cover">
            <View>
                <Text style={styles.headingtext}>Our Product World</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalContainer}
            >
                
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        title={card.title}
                        image={card.image}
                        label={card.label}
                        duration={card.duration}
                    />
                ))}
            </ScrollView>
        </ImageBackground>
    );
};

// Styles
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    horizontalContainer: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        flexDirection: 'row',
    },
    card: {
        width: 200,
        marginRight: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        position: 'relative',
    },
    imageWrapper: {
        width: '100%',
        height: 100,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    labelWrapper: {
        position: 'absolute',
        top: 6,
        right: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    label: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardText: {
        padding: 6,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    headingtext: {
        fontWeight: 'bold',
        fontSize: 20,
        color:'white'

    }
});

export default Scrollmultipleimage;
