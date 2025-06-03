import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Group items into sets of 3 for each card
const cardsData = [
    [
        { title: 'Annual Maintenance ', image: maintenance },
        { title: 'Car Battery', image: carbattery },
        { title: 'Car Wash', image: carwash },
    ],
    [
        { title: 'Car Dismantle', image: cardismantle },
        { title: 'Car Brakes', image: carbreak },
        { title: 'Car Painting', image: carpainting },
    ],
    [
        { title: 'Steering', image: steering },
        { title: 'Suspension', image: carsuspension },
        { title: 'Gear', image: cargear },
    ],
];

const CardItem = ({ title, image }) => (
    <View style={styles.cardItem}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
    </View>
);

const HorizontalPagedCards = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headingtext}>VIEW</Text>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {cardsData.map((group, index) => (
                    <View key={index} style={styles.pageCard}>
                        {group.map((item, idx) => (
                            <CardItem key={idx} title={item.title} image={item.image} />
                        ))}
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 1,
       
    },
    headingtext: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    pageCard: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        marginVertical:1,
        justifyContent: 'space-between',
        // backgroundColor:'black'
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 9,
        marginBottom: 9,
        height: 80,
        borderWidth: 3,
        borderColor: '#ccc',
    },
    image: {
        width: '25%',
        height: '100%',
        borderRadius: 12,
        marginRight: 16,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        flexShrink: 1,
        width:'50%',
        padding:'1%'
    },
});

export default HorizontalPagedCards;
