import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';


//pages
import TitleBar from '../../components/Bookings/TitleBar'
import Grid1 from '../../components/Bookings/Grid1'

const Settings = () => {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Booking Cart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Grid1/>
        
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    paddingHorizontal: '5%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '12%',
    paddingHorizontal: 16,
    backgroundColor: 'red',
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginLeft: 12,
    fontWeight: '600',
  },
});
