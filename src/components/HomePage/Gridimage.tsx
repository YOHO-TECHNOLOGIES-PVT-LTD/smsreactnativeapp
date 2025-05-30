
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';

const Card = ({ title }) => (
    <ImageBackground source={maintenance} style={styles.card} imageStyle={styles.image}>
        <View style={styles.overlay}>
            <Text style={styles.cardText}>{title}</Text>
        </View>
    </ImageBackground>
);

const App = () => {
    return (
        <View style={styles.container}>
            <Card title="Card 1" />
            <Card title="Card 2" />
            <Card title="Card 3" />
            <Card title="Card 4" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#F0F0F0',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


export default App;

