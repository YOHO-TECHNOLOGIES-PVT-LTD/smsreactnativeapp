import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setSelectedTab } from '~/store/tab/tabSlice';
import { useDispatch } from 'react-redux';
import IconButton from '~/components/IconButton';
import { COLORS, icons, screens, SIZES } from '~/constants';
import Header from '~/components/Header';

interface ServiceItem {
  name: string;
  icon?: string; 
}

interface ServicePackage {
    id: string;
    title: string;
    warranty: string;
    frequency: string;
    isRecommended?: boolean;
    duration: string;
    services: ServiceItem[];
    additionalCount?: number;
    image: string;
    price: string;
    discountPrice: string;
  }

interface ContentSection {
		title: string;
		packages: ServicePackage[];
	}

const Services = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  // Dummy data for service packages
  const contentSections: { [key: string]: ContentSection } = {
			'Periodic Services': {
				title: 'Scheduled Packages',
				packages: [
					{
						id: `basic `,
						title: `Basic Service `,
						warranty: `1000 Kms or 1 Month Warranty `,
						frequency: 'Every 5000 Kms or 3 Months (Recommended)',
						duration: '4 Hrs Taken',
						image: 'Services',
						services: [
							{
								name: 'Wiper Fluid Replacement',
								icon:'',
							},
							{
								name: 'Battery Water Top Up',
								icon: '',
							},
							{ name: 'Car Wash', icon: ''},
							{
								name: 'Interior Vacuuming (Carpet & Seats)',
								icon: '',
							},
							{
								name: 'Engine Oil Replacement',
								icon: '',
							},
						],
						additionalCount: 4,
						price: '₹2,500',
						discountPrice: '₹2,000',
					},
              ],
            },
          };
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

            {/* Service Page */}
            <View style={{flex:1}} > 
            <View style={{ 
                            width : SIZES.half,
                            height : SIZES.half,
                            backgroundColor: COLORS.dark,
                            margin: SIZES.base}}>
            </View>                 
                        

               <View style={{
                borderTopWidth : SIZES.base, 
                width : SIZES.half,
                height : SIZES.half,
                backgroundColor: COLORS.grey
               }} > 

            </View>   
            </View>
          </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: 35,
  },
});
