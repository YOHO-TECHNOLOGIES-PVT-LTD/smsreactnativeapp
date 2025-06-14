import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import IconButton from '~/components/IconButton';
import { COLORS, FONTS, icons, screens, SIZES } from '~/constants/index';
import Header from '~/components/Header';
import MarinaMap from '~/components/SosScreen/MarinaMap';
import SosButtons from '~/components/SosScreen/Buttons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Foundation, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';

const SOS = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (text: any) => {
    if (/^\d*$/.test(text)) {
      setValue(text);
      const num = parseInt(text);
      if (!isNaN(num) && num >= 10 && num <= 100) {
        setError(false);
      } else if (text !== '') {
        setError(true);
      } else {
        setError(false);
      }
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={[styles.container, { paddingVertical: 10 }]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            paddingHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Image
            source={require('../../assets/home/LOGO.png')}
            style={{ width: 145, height: 25 }}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity>
              <AntDesign name="search1" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8 }}>
              <Feather name="phone-call" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Display Google Map */}
        <ScrollView style={[styles.container, { position: 'relative' }]}>
          <View style={styles.mapContainer}>
            <MarinaMap />
          </View>
          <View style={{}}>
            <Text style={{ ...FONTS.body4, paddingTop: 20, paddingLeft: 10 }}>Mobile Number:</Text>
            <View style={styles.Textcontainer}>
              <TextInput
                style={styles.input}
                placeholder="+91-1234567890"
                value={value}
                onChangeText={handleChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <SosButtons />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SOS;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  mapContainer: {
    height: 250,
  },
  Textcontainer: {
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 0.3,
    borderColor: COLORS.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    ...FONTS.body4,
    marginTop: 10,
  },
});
