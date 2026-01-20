import { useEffect, useRef, useState } from 'react';
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
import { AntDesign, Fontisto } from '@expo/vector-icons';
import PhoneDialerButton from '~/components/PhoneDialerButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from '~/features/profile/reducers/selector';
import { selectToken } from '~/features/token/redux/selectors';
import { getToken } from '~/features/token/redux/thunks';
import { getProfileDetailsThunk } from '~/features/profile/reducers/thunks';
import { getAllSOS, getSos } from '~/features/sos/service';

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
  const [userSosList, setUserSosList] = useState<any[]>([]);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const profileData = useSelector(selectProfile);
  const tokenSelector = useSelector(selectToken);
  const didFetch = useRef(false);

  // Fetch user mobile number
  const fetchUser = async () => {
    try {
      if (profileData) {
        const mobileNumber = profileData?.contact_info?.phoneNumber || '';
        setValue(mobileNumber);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Fetch SOS records for current user
  const getSosByUser = async () => {
    try {
      if (!profileData?._id) return;

      const response = await getAllSOS();

      const filtered = response?.data?.filter(
        (sos: any) =>
          sos.customerId === profileData._id &&
          (sos.status === "In Progress" || sos.status === "notstarted")
      );

      setUserSosList(filtered || []);
      console.log("Filtered SOS list:", filtered);
    } catch (error) {
      console.error("Error fetching user SOS:", error);
    }
  };

  useEffect(() => {
    if (profileData?._id) {
      fetchUser();
      getSosByUser();
    }
  }, [profileData]);

  useEffect(() => {
    try {
      dispatch(getToken());
    } catch (error: any) {
      console.error(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    if (tokenSelector && !didFetch.current) {
      dispatch(getProfileDetailsThunk({}));
      didFetch.current = true;
    }
  }, [tokenSelector]);

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

  // Search issues filter
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

  // Pull-to-refresh
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setValue('');
      setError(false);
      setSearchText('');
      setFilteredIssues([]);
      setShowSearchBar(false);
      await fetchUser();
      await getSosByUser();
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
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={require('../../assets/home/LOGO.png')}
              style={{ width: 145, height: 25 }}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => setShowSearchBar((prev) => !prev)}>
              <Fontisto name="search" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8 }}>
              <PhoneDialerButton />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
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
              <AntDesign name="close" size={16} color={COLORS.primary} style={{ marginLeft: 10 }} />
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
              <Text style={styles.noServiceText}>No issues available</Text>
            )}
          </View>
        )}

        {/* Main Content */}
        <ScrollView
          style={[styles.container, { position: 'relative' }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }>
          <View style={styles.mapContainer}>
            <MarinaMap />
          </View>

          <View>
            <Text style={{ ...FONTS.body4, paddingTop: 20, paddingLeft: 10 }}>Mobile Number:</Text>
            <View style={styles.Textcontainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={value}
                onChangeText={handleChange}
                keyboardType="numeric"
                maxLength={10}
                editable={profileData?.contact_info?.phoneNumber ? false : true}
              />
            </View>
            <SosButtons />
          </View>


          <View style={{ padding: 15, marginBottom: 40 }}>
            <Text style={{ ...FONTS.body3, marginBottom: 10 }}>Active SOS Records:</Text>
            {userSosList.length > 0 ? (
              userSosList.map((sos, index) => {
                const partner = sos.partnerId;
                return (
                  <View
                    key={index}
                    style={{
                      padding: 15,
                      marginBottom: 10,
                      borderWidth: 0.3,
                      borderColor: COLORS.grey,
                      borderRadius: 8,
                      backgroundColor: '#fafafa',
                    }}
                  >

                    <Text style={{ ...FONTS.body4, fontWeight: 'bold' }}>SOS Name: {sos.name}</Text>
                    <Text style={{ ...FONTS.body4 }}>Location: {sos.location}</Text>
                    <Text style={{ ...FONTS.body4 }}>Status: {sos.status}</Text>


                    {partner && (
                      <View style={{ marginTop: 10, borderTopWidth: 0.3, borderTopColor: COLORS.grey, paddingTop: 10 }}>
                        <Text style={{ ...FONTS.body4, fontWeight: 'bold' }}>Partner Details:</Text>
                        <Text style={{ ...FONTS.body4 }}>Name: {partner.firstName} {partner.lastName}</Text>
                        <Text style={{ ...FONTS.body4 }}>Company: {partner.companyName}</Text>
                        <Text style={{ ...FONTS.body4 }}>Phone: {partner?.contact_info?.phoneNumber}</Text>
                        <Text style={{ ...FONTS.body4 }}>
                          Address: {partner?.contact_info?.address1}, {partner?.contact_info?.address2}, {partner?.contact_info?.city}, {partner?.contact_info?.state} - {partner?.contact_info?.pincode}
                        </Text>
                        <Text style={{ ...FONTS.body4 }}>Email: {partner.email}</Text>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={{ color: 'gray' }}>No SOS records found for you.</Text>
            )}
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
    // marginBottom: 10,
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
