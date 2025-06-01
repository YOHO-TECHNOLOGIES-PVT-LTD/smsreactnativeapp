
//DELIVERY COMPANY



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
import { TouchableOpacity } from 'react-native';

// image
import person1 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_1.jpg';
import person2 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_2.jpg';
import person3 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_3.jpg';
import person4 from '../../assets/Homepage/DELIVERY COMPANY/PERSON_4.jpg';




const cards = [
    { title: 'ABC Delivery company,chennai', image: person1 },
    { title: 'ABC Delivery company,chennai', image: person2 },
    { title: 'ABC Delivery company,chennai', image: person3 },
    { title: 'ABC Delivery company,chennai', image: person4 },
];

// 💡 Blinking Image Component
const BlinkingImage = ({ source }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
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
// 📦 Card Component
const Card = ({ title, image }) => (
    <View style={styles.card}>
        <BlinkingImage source={image} />
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.cardButton} onPress={() => console.log(`${title} button pressed`)}>
            <Text style={styles.buttonText}>UseMe</Text>
        </TouchableOpacity>
    </View>
);


// 📦 Main Component
const DELIVERY_COMPANY = () => {
    return (
        <View>
            <View>
                <Text style={styles.headingtext}>Our Delivery Company</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.container}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {cards.map((card, index) => (
                    <Card key={index} title={card.title} image={card.image} label={card.label} />
                ))}
            </ScrollView>


        </View>
            );
};

// 💅 Styles
const CARD_WIDTH = 100;
const CARD_HEIGHT = 150;
const CARD_SPACING = 16;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 1,
        marginBottom:11
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
        height: 80,
        resizeMode: 'cover',
    },
    title: {
        marginTop: 8,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    headingtext: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 3,
        padding:9
    },
    cardButton: {
        marginTop: 8,
        backgroundColor: '#9b111e',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DELIVERY_COMPANY;
