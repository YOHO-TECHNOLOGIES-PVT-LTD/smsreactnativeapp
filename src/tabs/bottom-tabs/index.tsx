import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, ProfileScreen, ServicesScreen, SosScreen } from '~/screens';
import SpareParts from '~/screens/spare-parts-screen/SpareParts';

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="SOS" component={SosScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Spare Parts" component={SpareParts} />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({});
