
//div------6



import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Dimensions,
    ScrollView,
} from 'react-native';

// 📦 Assets
import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';

// 🧩 Cards data
const cards = [
    { title: 'Annual Maintenance', image: maintenance },
    { title: 'Car Battery', image: carbattery },
    { title: 'Car Painting', image: carpainting },
    { title: 'Car Painting', image: carpainting },
];

// 💡 Blinking Image Component
const BlinkingImage = ({ source }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.Image source={source} style={[styles.image, { opacity }]} />
    );
};

// 📦 Card Component
const Card = ({ title, image }) => (
    <View style={styles.card}>
        <BlinkingImage source={image} />
        <Text style={styles.title}>{title}</Text>
    </View>
);

// 📦 Main Component
const BlinkingCardsContainer = () => {
    return (
        <ScrollView contentContainerStyle={styles.container} horizontal showsHorizontalScrollIndicator={false}>
            {cards.map((card, index) => (
                <Card key={index} title={card.title} image={card.image} />
            ))}
        </ScrollView>
    );
};

// 💅 Styles
const CARD_WIDTH = 100;
const CARD_HEIGHT = 180;
const CARD_SPACING = 16;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: CARD_SPACING,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    title: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});

export default BlinkingCardsContainer;
