import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Header from '~/components/Header';
import { COLORS, icons, screens, SIZES } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import IconButton from '~/components/IconButton';
import  TitleSearchBar  from '../../components/HomePage/SearchBar'


// cpmponent pages
import App from '../../components/HomePage/App'
import AutoSlidingCarousel from '../../components/HomePage/AutoSlidingCarousel'
import Offercard from '../../components/HomePage/offercard'
import Scrollmultipleimage from '../../components/HomePage/Scrollmultipleimage'
import Slideshow from '../../components/HomePage/Slideshow'
import BlinkingImage from '../../components/HomePage/BlinkingCardsContainer'
import Differentsize from '../../components/HomePage/Differentsize'

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        containerStyle={{
          height: 50,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
        }}
        logo={icons.logo}
        leftComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: COLORS.grey60,
            }}
            onPress={() => {navigation.openDrawer()}}>
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
              onPress={() => {}}
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
                source={{
                  uri: 'https://avatar.iran.liara.run/public/boy?username=Ash',
                }}
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
      <ScrollView>
        <View>

          <Text>Home Page</Text>
          <TitleSearchBar />
          < AutoSlidingCarousel />
          <App />
          < Offercard/>
          <Slideshow />
          {/* <Scrollmultipleimage /> */}
          <Differentsize/>
          <BlinkingImage />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: 35,
  },
});
