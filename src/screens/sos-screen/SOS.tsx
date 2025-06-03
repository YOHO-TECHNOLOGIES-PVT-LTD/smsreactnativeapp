import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
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
import { COLORS, icons, screens, SIZES } from '~/constants/index';
import Header from '~/components/Header';
import MarinaMap from '~/components/SosScreen/MarinaMap';
import SosButtons from '~/components/SosScreen/Buttons';

const SOS = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (text) => {
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
    <SafeAreaView style={styles.container}>
      <Header
        containerStyle={{
          height: 50,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
        }}
        leftComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: COLORS.grey60,
            }}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Image source={icons.menu} style={{ width: 20, height: 20 }} resizeMode="contain" />
          </TouchableOpacity>
        }
        rightComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon={icons.notification}
              containerStyle={{
                borderWidth: 0.5,
                borderRadius: 25,
                borderColor: COLORS.primary,
              }}
              onPress={() => {
                navigation.navigate('NotificationScreen');
              }}
            />

            <TouchableOpacity
              style={{
                borderRadius: SIZES.radius,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                dispatch(setSelectedTab(screens.profile));
              }}>
              <Image
                source={require('../../assets/images/profile_picture.jpg')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: SIZES.body2,
                }}
                onError={() => setError(true)}
              />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Display Google Map */}
      <ScrollView>
        <View style={styles.mapContainer}>
          <MarinaMap />
        </View>

        <View style={{ position: 'relative', top: -290 }}>
          <Text style={{ fontSize: SIZES.h3, paddingTop: 50, paddingLeft: 10 }}>
            Mobile Number:
          </Text>

          <View style={styles.Textcontainer}>
            <TextInput
              style={styles.input}
              placeholder=""
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
  );
};

export default SOS;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginTop: 35,
  },
  mapContainer: {
    height: 500,
  },
  Textcontainer: {
    padding: 5,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginTop: 15,
  },
});
