import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTS, icons, SIZES, SPACING } from '~/constants';
import { useNavigation } from '@react-navigation/native';
import BookingCard from '~/components/Bookings/BookingCard';

const Bookings = () => {
  const navigate = useNavigation();
  const [tab, setTab] = useState('All Orders');

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={icons.home_background} style={styles.container}>
        <View style={styles.bookingsContainer}>
          <TouchableOpacity style={{}} onPress={() => navigate.goBack()}>
            <Image source={icons.back} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <View style={{}}>
            <Text style={{ ...FONTS.h1, color: COLORS.primary_text }}>My Orders</Text>
          </View>
          <Text
            style={{ ...FONTS.body4, color: COLORS.primary_01, marginVertical: SIZES.extraSmall }}>
            Track and manage all your orders in one place
          </Text>

          {/* countcard */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: SIZES.radius,
            }}>
            <View style={styles.countCard}>
              <Text style={{ ...FONTS.h4, color: COLORS.support1 }}>11</Text>
              <Text style={styles.text}>Total Orders</Text>
            </View>
            <View style={styles.countCard}>
              <Text style={{ color: COLORS.success_green, ...FONTS.h4 }}>9</Text>
              <Text style={styles.text}>Completed</Text>
            </View>
            <View style={styles.countCard}>
              <Text style={{ ...FONTS.h4, color: COLORS.primary }}>2</Text>
              <Text style={styles.text}>Pending</Text>
            </View>
          </View>

          <View style={styles.tabContainer}>
            {/* search bar */}
            <View>
              <TextInput style={styles.searchInput} placeholder="Search for your orders..." />
              <TouchableOpacity style={styles.searchButton}>
                <Image
                  source={icons.search}
                  style={{ width: 15, height: 15 }}
                  tintColor={COLORS.grey}
                />
              </TouchableOpacity>
            </View>

            {/* ordertabs */}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[
                    styles.tabs,
                    { backgroundColor: tab === 'All Orders' ? COLORS.primary_01 : COLORS.white },
                  ]}
                  onPress={() => setTab('All Orders')}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: tab === 'All Orders' ? COLORS.white : COLORS.primary_text,
                      textAlign: 'center',
                    }}>
                    All Orders
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabs,
                    { backgroundColor: tab === 'Spare Parts' ? COLORS.primary_01 : COLORS.white },
                  ]}
                  onPress={() => setTab('Spare Parts')}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: tab === 'Spare Parts' ? COLORS.white : COLORS.primary_text,
                      textAlign: 'center',
                    }}>
                    Spare Parts
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabs,
                    { backgroundColor: tab === 'Services' ? COLORS.primary_01 : COLORS.white },
                  ]}
                  onPress={() => setTab('Services')}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      color: tab === 'Services' ? COLORS.white : COLORS.primary_text,
                      textAlign: 'center',
                    }}>
                    Services
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* orderlist */}
          <View style={{ marginVertical: SIZES.radius }}>
            <BookingCard
              title="Car Service"
              description="Schedule a complete service"
              icon={icons.services_filled}
              onPress={() => {}}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Bookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookingsContainer: {
    flex: 1,
    marginBlockStart: SPACING.medium_01,
    paddingHorizontal: SPACING.small,
  },
  countCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    backgroundColor: COLORS.white,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    elevation: 1,
  },
  text: {
    ...FONTS.body4,
    color: COLORS.primary_text,
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey20,
    paddingLeft: 45,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
    height: 45,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    color: COLORS.primary_text,
    ...FONTS.body4,
  },
  searchButton: {
    position: 'absolute',
    left: 5,
    top: 5,
    width: 30,
    height: 30,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.small,
    elevation: 1,
    ...FONTS.body4,
    width: '32%',
  },
  tabContainer: {
    paddingHorizontal: 5,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    borderRadius: SIZES.radius,
  },
});
