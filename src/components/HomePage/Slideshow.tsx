

//OUTSTATION


import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Dimensions,
    ImageBackground,
} from 'react-native';

// 📦 Assets
import Replacing_Tyre from '../../assets/Homepage/Roadside_assistant.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';
import backgroundimage from '../../assets/Homepage/BACKGROUND_IMAGE/Green (1).png';
import headlight from '../../assets/Homepage/HEAD_LIGHT_LED.jpg'

// 🖥 Screen & layout constants
const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = 200;
const CARD_SPACING = 20;
const TOTAL_WIDTH = CARD_WIDTH + CARD_SPACING;
const START_POS = -TOTAL_WIDTH;
const END_POS = screenWidth + TOTAL_WIDTH;
const DURATION = 9000;

const cards = [
    { title: 'Tyre Replace', image: Replacing_Tyre },
    { title: 'Battery Replace', image: carbattery },
    { title: 'Headlight Replace', image: headlight },
];

// 🃏 Card Component with animation
const AnimatedCard = ({ title, image, delay }) => {
    const translateX = useRef(new Animated.Value(START_POS)).current;

    useEffect(() => {
        const animate = () => {
            translateX.setValue(START_POS);
            Animated.timing(translateX, {
                toValue: END_POS,
                duration: DURATION,
                useNativeDriver: true,
            }).start(() => animate()); // Loop the animation
        };

        const timeout = setTimeout(animate, delay); // delay for staggered start

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    transform: [{ translateX }],
                },
            ]}
        >
            <Image source={image} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
        </Animated.View>
    );
};

// 🎞️ Main Slider
const Slideshow = () => {
    return (
        <ImageBackground source={backgroundimage} style={styles.background} resizeMode="cover">
            <View>
                <Text style={styles.headingtext}> Outstation Work</Text>
            </View>
            <View style={styles.track}>
                {cards.map((card, index) => (
                    <AnimatedCard
                        key={index}
                        title={card.title}
                        image={card.image}
                        delay={index * 3000} // spacing between cards
                    />
                ))}
            </View>
        </ImageBackground>
    );
};

// 💅 Styles
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      
    },
    track: {
        height: 170,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    card: {
        position: 'absolute',
        width: CARD_WIDTH,
        height: 155,
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingTop: 8,
        textAlign: 'center',
        color: '#333',
    },
    headingtext: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 10,
    },
});

export default Slideshow;
