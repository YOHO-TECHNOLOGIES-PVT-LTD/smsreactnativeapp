import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { COLORS, FONTS } from '~/constants/index';
import MarinaMap from '~/components/SosScreen/MarinaMap';
import SosButtons from '~/components/SosScreen/Buttons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import PhoneDialerButton from '~/components/PhoneDialerButton';
import { getUserProfileDetails } from '~/features/profile/service';

const issuesList = [
  'Battery Discharged',
  'Accident',
  'Fuel Problem',
  'Lost/Locked Keys',
  'Flat tyre',
  'Engine Overtheating',
  'Coolant Leakage',
  'Brake Problem',
  'Clutch Problem',
];

const SOS = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredIssues, setFilteredIssues] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    try {
      const userResponse = await getUserProfileDetails();
      // console.log('userResponse', userResponse);
      if (userResponse) {
        const mobileNumber = userResponse?.contact_info?.phoneNumber || '';
        setValue(mobileNumber);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

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

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredIssues([]);
    } else {
      const filtered = issuesList.filter((issue) =>
        issue.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredIssues(filtered);
    }
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      // Reset form state
      setValue('');
      setError(false);
      setSearchText('');
      setFilteredIssues([]);
      setShowSearchBar(false);

      await fetchUser();
      // Optionally re-fetch data if you have API calls for issues or location
      // await fetchIssues();
      // await fetchLocation();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <SafeAreaView edges={['top']} style={[styles.container, { paddingVertical: 10 }]}>
        {/* Navbar */}
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
            <TouchableOpacity onPress={() => setShowSearchBar((prev) => !prev)}>
              <AntDesign name="search1" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8 }}>
              <PhoneDialerButton />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar below Navbar */}
        {showSearchBar && (
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search issues..."
              value={searchText}
              onChangeText={handleSearchTextChange}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setShowSearchBar(false);
                setSearchText('');
                setFilteredIssues([]);
              }}>
              <AntDesign name="close" size={20} color={COLORS.primary} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        )}

        {showSearchBar && (
          <View style={styles.filteredList}>
            {filteredIssues.length > 0 ? (
              filteredIssues.map((item, index) => (
                <Text key={index} style={styles.issueText}>
                  {item}
                </Text>
              ))
            ) : (
              <Text style={styles.noServiceText}>No service available</Text>
            )}
          </View>
        )}

        {/* Main Content */}
        <ScrollView
          style={[styles.container, { position: 'relative' }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.mapContainer}>
            <MarinaMap />
          </View>

          <View>
            <Text style={{ ...FONTS.body4, paddingTop: 20, paddingLeft: 10 }}>Mobile Number:</Text>
            <View style={styles.Textcontainer}>
              <TextInput
                style={styles.input}
                placeholder="+91-9876543210"
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    borderWidth: 0.3,
    borderColor: COLORS.grey,
  },
  searchInput: {
    flex: 1,
    height: 40,
    ...FONTS.body4,
    color: COLORS.primary,
  },
  filteredList: {
    marginHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  issueText: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 14,
    color: COLORS.primary,
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.grey,
  },
  noServiceText: {
    paddingVertical: 8,
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});
