import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';







const Settings = () => {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        
      
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
    paddingTop: '15%',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginLeft: 12,
  },
});
