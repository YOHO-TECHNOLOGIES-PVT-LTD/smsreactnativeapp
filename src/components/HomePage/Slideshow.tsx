

  //OUTSTATION WORK


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

import Replacing_Tyre from '../../assets/Homepage/Roadside_assistant.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import headlight from '../../assets/Homepage/HEAD_LIGHT_LED.jpg';
import backgroundimage from '../../assets/Homepage/BACKGROUND_IMAGE/Green (1).png';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = 200;
const CARD_SPACING = 20;
const TOTAL_WIDTH = CARD_WIDTH + CARD_SPACING;

const cards = [
    { title: 'Tyre Replace', image: Replacing_Tyre },
    { title: 'Battery Replace', image: carbattery },
    { title: 'Headlight Replace', image: headlight },
];

const loopCards = [...cards, ...cards];

const Slideshow = () => {
    const translateX1 = useRef(new Animated.Value(0)).current;
    const translateX2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateLeftToRight = () => {
            translateX1.setValue(-loopCards.length * TOTAL_WIDTH / 2);
            Animated.timing(translateX1, {
                toValue: 0,
                duration: 20000,
                useNativeDriver: true,
            }).start(() => animateLeftToRight());
        };

        const animateRightToLeft = () => {
            translateX2.setValue(0);
            Animated.timing(translateX2, {
                toValue: -loopCards.length * TOTAL_WIDTH / 2,
                duration: 22000,
                useNativeDriver: true,
            }).start(() => animateRightToLeft());
        };

        animateLeftToRight();
        animateRightToLeft();
    }, []);

    return (
        // <ImageBackground source={backgroundimage} style={styles.background} resizeMode="cover">
        <ImageBackground  style={styles.background} resizeMode="cover">
            <Text style={styles.headingtext}>Outstation Work</Text>

            {/* First Row: Left to Right */}
            <View style={styles.track}>
                <Animated.View style={[styles.sliderRow, { transform: [{ translateX: translateX1 }] }]}>
                    {loopCards.map((card, index) => (
                        <View key={`row1-${index}`} style={styles.card}>
                            <Image source={card.image} style={styles.image} />
                            <Text style={styles.title}>{card.title}</Text>
                        </View>
                    ))}
                </Animated.View>
            </View>

            {/* Second Row: Right to Left */}
            <View style={styles.track}>
                <Animated.View style={[styles.sliderRow, { transform: [{ translateX: translateX2 }] }]}>
                    {loopCards.map((card, index) => (
                        <View key={`row2-${index}`} style={styles.card}>
                            <Image source={card.image} style={styles.image} />
                            <Text style={styles.title}>{card.title}</Text>
                        </View>
                    ))}
                </Animated.View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        paddingVertical: 5,
    },
    headingtext: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 10,
        paddingTop: 1,
        paddingLeft: 10,
    },
    track: {
        height: 170,
        width: '100%',
        overflow: 'hidden',
        marginBottom: 20,
    },
    sliderRow: {
        flexDirection: 'row',
    },
    card: {
        width: CARD_WIDTH,
        height: 155,
        marginRight: CARD_SPACING,
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
        color: '#333',
        textAlign: 'center',
        paddingTop: 5,
    },
});

export default Slideshow;
