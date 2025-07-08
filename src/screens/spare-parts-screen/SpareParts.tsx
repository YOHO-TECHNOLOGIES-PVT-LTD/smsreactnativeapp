import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import  { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, icons, } from '~/constants';
import SparePartsPage from '~/components/SpareParts/SparePartsPage';
import { getAllSpareParts } from '~/features/spare-parts/service';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  Ionicons } from '@expo/vector-icons';

const SpareParts = () => {
  const navigation = useNavigation();
  const [spareParts, setSpareParts] = useState([]);

  const getAllSparePartsDetails = async () => {
    try {
      const data = '';
      const response = await getAllSpareParts(data);
      if (response) {
        setSpareParts(response);
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error);
    }
  };

  useEffect(() => {
    getAllSparePartsDetails();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            marginBottom: 10,
          }}>
          <Image
            source={require('../../assets/home/LOGO.png')}
            style={{ width: 145, height: 25 }}
          />
          <View style={{ flexDirection: 'row', gap: 20, marginRight: 5 }}>
            {/* <TouchableOpacity>
              <AntDesign name="search1" size={24} color={COLORS.primary} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate('BookingsScreen' as never)}>
              <Image
                source={icons.booking_icon}
                style={{ width: 23, height: 23 }}
                tintColor={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('BookingCartScreen' as never)}>
              <Ionicons name="cart-outline" size={26} color={COLORS.primary} />
              {/* <View
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: COLORS.primary,
                  borderRadius: 25,
                  position: 'absolute',
                  right: -2,
                  top: -6,
                }}>
                <Text style={{ color: COLORS.white, textAlign: 'center', ...FONTS.body6 }}>1</Text>
              </View> */}
            </TouchableOpacity>
          </View>
        </View>
        <SparePartsPage spareParts={spareParts} />
      </SafeAreaView>
    </>
  );
};

export default SpareParts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
});
