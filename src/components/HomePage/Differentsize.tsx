import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ScrollView,
    TouchableOpacity,
} from 'react-native';


import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';
import carbreak from '../../assets/Homepage/Car_brakes.jpg';
import carwash from '../../assets/Homepage/Car_wash.jpg';
import cardismantle from '../../assets/Homepage/Car_dismantle.jpg';
import steering from '../../assets/Homepage/Car_steering.jpg';
import carsuspension from '../../assets/Homepage/Car_suspension.jpg';
import cargear from '../../assets/Homepage/car_gear.jpg';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const rows = [
    [
        { title: 'Annual Maintenance', image: maintenance, width: 200, height: 100, textColor: '#FFFDF6' },
        { title: 'Car Battery', image: carbattery, width: 120, height: 100, textColor: '#FFFDF6' },
    ],
    [
        { title: 'Car Wash', image: carwash, width: 70, height: 100, textColor: '#FFFDF6', textColor: '#FFFDF6' },
        { title: 'Car Dismantle', image: cardismantle, width: 70, height: 100, textColor: '#FFFDF6' },
        { title: 'Car Brakes', image: carbreak, width: 70, height: 100, textColor: '#FFFDF6' },
        { title: 'Car Painting', image: carpainting, width: 70, height: 100, textColor: '#FFFDF6' },
    ],
    [
        { title: 'Car Painting', image: carpainting, width: '100%', height: 100, textColor: '#FFFDF6' },
           ],
    [
       
        { title: 'Car Dismantle', image: steering, width: 100, height: 100, textColor: '#FFFDF6'},
        { title: 'Car Brakes', image: carsuspension, width: 100, height: 100, textColor: '#FFFDF6', textColor: '#FFFDF6' },
        { title: 'Car Painting', image: cargear, width: 100, height: 100, textColor: '#FFFDF6' },
        ],
   
];


const BlinkingImage = ({ source, style }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 4000, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 4000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return <Animated.Image source={source} style={[style, { opacity }]} />;
};


const Card = ({ title, image, width, height, shadow, textColor }) => (
    <View
        style={[
            styles.card,
            {
                width,
                height,
                shadowRadius: shadow || 4,
                shadowOpacity: 0.15,
            },
        ]}
    >
        <BlinkingImage
            source={image}
            style={{ width: '100%', height: height - 50 }}
        />
        <Text style={[styles.title, { color: textColor || '#333' }]}>{title}</Text>

    </View>
);
  




const DifferentSize = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headingtext}>VIEW</Text>

            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            image={card.image}
                            width={card.width}
                            height={card.height}
                            shadow={card.shadow}
                            textColor={card.textColor} 
                       />
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
    },
    headingtext: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#948979',
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        padding: 8,
    },
    title: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DifferentSize;
