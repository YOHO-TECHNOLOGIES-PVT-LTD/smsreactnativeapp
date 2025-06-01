import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
} from 'react-native';
import { Styles } from '~/constants';

const DATA = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Cherry' },
    { id: '4', name: 'Date' },
    { id: '5', name: 'Elderberry' },
];

const SearchBarExample = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = DATA.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={Styles.safeArea}>
            <View style={Styles.container}>
                <TextInput
                    style={Styles.searchBar}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                {/* IF WE USE DATA TO FILTER WE CAN USE */}
                {/* <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Text style={styles.item}>{item.name}</Text>
                    )}
                /> */}
            </View>
        </SafeAreaView>
    );
};



export default SearchBarExample;
