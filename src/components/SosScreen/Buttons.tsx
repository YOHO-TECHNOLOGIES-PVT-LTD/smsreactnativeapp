import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONTS } from '~/constants';
import * as ImagePicker from 'expo-image-picker';
import { postSOSData } from '~/features/sos/service';
import toast from '~/utils/toast';
import CustomLogoutModal from '../CustomLogoutModal';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { AppDispatch } from '~/store';
import { selectToken } from '~/features/token/redux/selectors';
import { getToken } from '~/features/token/redux/thunks';
import { uploadSingleFileorImage } from '~/features/common/service';
import { getImageUrl } from '~/utils/imageUtils';
import { selectProfile } from '~/features/profile/reducers/selector';
import { getProfileDetailsThunk } from '~/features/profile/reducers/thunks';

interface Issues {
  id: String;
  label: String;
  icon: any;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  relationship?: string;
  location?: string;
  additionalNotes?: string;
  general?: string;
}

const issues = [
  {
    id: 'battery',
    label: 'Battery Discharged',
    icon: require('../../assets/icons/images/sosimages/battery.png'),
  },
  {
    id: 'accident',
    label: 'Accident',
    icon: require('../../assets/icons/images/sosimages/fender-bender.png'),
  },
  {
    id: 'fuel',
    label: 'Fuel Problem',
    icon: require('../../assets/icons/images/sosimages/gasoline-pump.png'),
  },
  {
    id: 'keys',
    label: 'Lost / Locked Keys',
    icon: require('../../assets/icons/images/sosimages/key.png'),
  },
  { id: 'tyre', label: 'Flat Tyre', icon: require('../../assets/icons/images/sosimages/tyre.png') },
  {
    id: 'breakdown',
    label: 'Breakdown',
    icon: require('../../assets/icons/images/sosimages/break.png'),
  },
  {
    id: 'engine',
    label: 'Engine Overtheating',
    icon: require('../../assets/icons/images/sosimages/car-engine.png'),
  },
  {
    id: 'coolant',
    label: 'Coolant Leakage',
    icon: require('../../assets/icons/images/sosimages/coolant.png'),
  },
  {
    id: 'brake',
    label: 'Brake Problem',
    icon: require('../../assets/icons/images/sosimages/car-wash.png'),
  },
  {
    id: 'clutch',
    label: 'Clutch Problem',
    icon: require('../../assets/icons/images/sosimages/carbreak.png'),
  },
];

export default function RoadsideAssistanceScreen() {
  const [selectedIssues, setSelectedIssues] = useState<Issues[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState('own');
  const [images, setImages] = useState<string[]>([]);
  const navigation = useNavigation();
  const [otherDetails, setOtherDetails] = useState({
    name: '',
    phone: '',
    relationship: '',
    location: '',
    additionalNotes: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const dispatch = useDispatch<AppDispatch>();
  const TokenSelector = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpConfirmModalVisible, setSignUpConfirmModalVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [locationText, setLocationText] = useState('Fetching location...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setuserId] = useState<any>('');
  const [isUploadImages, setIsUploadImages] = useState(false);
  const didFetch = useRef(false);
  const profileData = useSelector(selectProfile);

  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      setuserId(profileData?._id);
      if (profileData?.vehicleInfo?.length > 0) {
        setVehicleList(profileData?.vehicleInfo);
        setSelectedVehicle(profileData?.vehicleInfo?.[0]);
      }
    }
  }, [profileData]);

  useEffect(() => {
    if (TokenSelector && !didFetch.current) {
      dispatch(getProfileDetailsThunk({}));
      didFetch.current = true;
    }
  }, [TokenSelector]);

  useEffect(() => {
    try {
      setIsLoading(true);
      dispatch(getToken());
      setIsLoading(false);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (modalVisible) {
      fetchLocation();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (modalVisible) {
      setOtherDetails({
        name: '',
        phone: '',
        relationship: '',
        location: '',
        additionalNotes: '',
      });
      setImages([]);
      setActiveTab('own');
      setLocationText('Fetching location...');
      setCoords(null);
      setValidationErrors({});
    }
  }, [modalVisible]);

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Location permission denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCoords({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      let formatted = `${address.name || ''}, ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`;
      setLocationText(formatted);
    } catch (err) {
      console.error('Error fetching location', err);
      setLocationText('Unable to fetch location');
    }
  };

  const handleSelect = (id: any) => {
    setSelectedIssue(id);
    setModalVisible(true);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (activeTab === 'own') {
      // Validate Own tab
      if (!user) {
        errors.general = 'User details not available';
      }
      if (!selectedVehicle) {
        errors.general = 'Please select a vehicle';
      }
      if (
        !locationText ||
        locationText === 'Fetching location...' ||
        locationText === 'Unable to fetch location'
      ) {
        errors.general = 'Please wait for location to be fetched or refresh location';
      }
    } else {
      // Validate Others tab
      if (!otherDetails.name.trim()) {
        errors.name = 'Full name is required';
      } else if (otherDetails.name.trim().length < 2) {
        errors.name = 'Full name must be at least 2 characters';
      }

      if (!otherDetails.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(otherDetails.phone.trim())) {
        errors.phone = 'Phone number must be 10 digits';
      }

      if (!otherDetails.relationship.trim()) {
        errors.relationship = 'Relationship is required';
      }

      if (!otherDetails.location.trim()) {
        errors.location = 'Location is required';
      }

      if (!otherDetails.additionalNotes.trim()) {
        errors.additionalNotes = 'Additional notes are required';
      } else if (otherDetails.additionalNotes.trim().length < 10) {
        errors.additionalNotes = 'Please provide more details (at least 10 characters)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const pickImage = async () => {
    try {
      let result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        // Take only first 3 images
        const selected = result.assets.slice(0, 3);
        const uploadedUrls: string[] = [];
        setIsUploadImages(true);

        for (let i = 0; i < selected.length; i++) {
          const file = selected[i];
          try {
            const formData = new FormData();
            formData.append('file', {
              uri: file.uri,
              type: file.mimeType || 'image/jpeg',
              name: file.fileName || `image_${i + 1}.jpg`,
            } as any);

            const uploadResponse = await uploadSingleFileorImage({ userId: userId }, formData);

            if (uploadResponse?.data?.image) {
              uploadedUrls.push(uploadResponse?.data?.image);
            } else {
              console.log(`Upload failed for image ${i + 1}:`, file.fileName);
            }
          } catch (error) {
            console.log(`Error uploading image ${i + 1}:`, error);
          }
        }
        setIsUploadImages(false);
        // Set the array of uploaded URLs to state
        if (uploadedUrls?.length > 0) {
          setImages(uploadedUrls);

          if (uploadedUrls?.length === selected.length) {
            toast.success('Success', `All ${uploadedUrls.length} images uploaded successfully!`);
          } else {
            toast.error(
              'Error',
              `Uploaded ${uploadedUrls.length} out of ${selected.length} images.`
            );
          }
        } else {
          toast.error('Upload Failed', 'Could not upload any images.');
        }
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      toast.error('Error', 'Failed to select images. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (images.length >= 3) {
      alert(`You already have ${images.length} images. Maximum allowed is 3.`);
      return;
    }

    let result: any = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prev) => {
        const updated = [...prev, result.assets[0].uri];
        if (updated.length > 3) {
          toast.error(
            'Upload Limit',
            `You selected ${updated.length} images, but only 3 are allowed.`
          );
          return updated.slice(0, 3);
        }
        return updated;
      });
    }
  };

  const removeImage = (index: any) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleOtherDetailsChange = (field: any, value: any) => {
    setOtherDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedIssue) {
      toast.error('Error', 'Please select an issue.');
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error('Validation Error', 'Please fill all required fields correctly.');
      return;
    }

    setIsLoading(true);

    const payload: any = {
      problem: selectedIssue,
      type: activeTab,
      image: images,
    };

    if (activeTab === 'own') {
      payload.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      payload.phone = user.contact_info?.phoneNumber || '';
      // payload.bloodGroup = user.bloodGroup || '';
      payload.carModel = selectedVehicle
        ? `${selectedVehicle.company || ''} - ${selectedVehicle.model || ''}`
        : '';
      payload.licensePlate = selectedVehicle?.registerNumber || '';
      payload.vehicleId = selectedVehicle?._id || '';
      payload.location = locationText || '';
    } else {
      payload.name = otherDetails.name;
      payload.phone = otherDetails.phone;
      payload.relationship = otherDetails.relationship;
      payload.additionalNotes = otherDetails.additionalNotes;
      payload.location = otherDetails.location;
    }

    try {
      const response = await postSOSData(payload);

      if (response) {
        toast.success('Success', response?.message || 'SOS details sent successfully!');
        setModalVisible(false);

        // Reset form
        setOtherDetails({
          name: '',
          phone: '',
          relationship: '',
          location: '',
          additionalNotes: '',
        });
        setImages([]);
        setSelectedIssue(null);
        setSelectedVehicle(null);
        setValidationErrors({});
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error('Error', error.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      if (TokenSelector && !didFetch.current) {
        dispatch(getProfileDetailsThunk({}));
        didFetch.current = true;
      }
      if (profileData) {
        setUser(profileData);
        if (profileData?.vehicleInfo?.length > 0) {
          setVehicleList(profileData?.vehicleInfo);
          setSelectedVehicle(profileData?.vehicleInfo[0]);
        } else {
          setVehicleList([]);
          setSelectedVehicle(null);
        }
      }
      if (modalVisible) {
        await fetchLocation();
      }
      setRefreshing(false);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Select an Issue</Text>

      <View style={styles.grid}>
        {issues.map((issue: any) => (
          <TouchableOpacity
            key={issue.id}
            style={[styles.issueButton, selectedIssues.includes(issue.id) && styles.selectedButton]}
            onPress={() => {
              if (TokenSelector) {
                handleSelect(issue.id);
              } else {
                setSignUpConfirmModalVisible(true);
              }
            }}
            activeOpacity={0.8}>
            {selectedIssues.includes(issue.id) && (
              <Ionicons name="checkmark-circle" size={20} color="green" style={styles.checkIcon} />
            )}
            <Image source={issue.icon} style={styles.issueIcon} />
            <Text style={styles.label}>{issue.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Request Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView
          contentContainerStyle={styles.modalContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Request Assistance</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'own' && styles.activeTab]}
              onPress={() => setActiveTab('own')}>
              <Text style={[styles.tabText, activeTab === 'own' && styles.activeTabText]}>Own</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'others' && styles.activeTab]}
              onPress={() => setActiveTab('others')}>
              <Text style={[styles.tabText, activeTab === 'others' && styles.activeTabText]}>
                Others
              </Text>
            </TouchableOpacity>
          </View>

          {/* General validation error */}
          {validationErrors.general && (
            <View style={styles.generalErrorContainer}>
              <Text style={styles.generalErrorText}>{validationErrors.general}</Text>
            </View>
          )}

          {/* Own Tab Content */}
          {activeTab === 'own' && user && (
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Your Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>
                  {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{user.contact_info?.phoneNumber || 'N/A'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Blood Group:</Text>
                <Text style={styles.detailValue}>{user.bloodGroup || 'N/A'}</Text>
              </View>

              <Text style={styles.sectionTitle}>Vehicle Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Car Model:</Text>
                <Text style={styles.detailValue}>
                  {selectedVehicle
                    ? `${selectedVehicle.company || 'N/A'} - ${selectedVehicle.model || 'N/A'}`
                    : 'N/A'}
                </Text>
              </View>

              <View
                style={[
                  styles.detailRow,
                  { justifyContent: 'space-between', alignItems: 'center' },
                ]}>
                <Text style={styles.detailLabel}>License Plate:</Text>
                <View style={{ width: 220 }}>
                  <Picker
                    selectedValue={selectedVehicle?._id}
                    onValueChange={(value) => {
                      const vehicle = vehicleList.find((v) => v._id === value);
                      setSelectedVehicle(vehicle);
                    }}>
                    {vehicleList.map((vehicle) => (
                      <Picker.Item
                        key={vehicle._id}
                        label={`${vehicle.registerNumber} (${vehicle.model})`}
                        value={vehicle._id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Vehicle Problem</Text>
              <Text style={styles.selectedIssue}>
                {issues.find((i) => i.id === selectedIssue)?.label}
              </Text>

              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.locationBox}>
                <Ionicons name="location" size={24} color={COLORS.primary} />
                <Text style={styles.locationValue}>{locationText}</Text>
              </View>
              <TouchableOpacity onPress={fetchLocation}>
                <Text style={{ color: COLORS.primary, marginTop: 10 }}>Refresh Location</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Upload Photos</Text>
              <Text style={styles.uploadSubtitle}>Add photos of the problem (max 3)</Text>

              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Ionicons name="image" size={20} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={20} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.imagePreviewContainer}>
                {images.map((img, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={
                        img ? { uri: getImageUrl(img) } : require('../../assets/loading1.png')
                      }
                      style={styles.previewImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}>
                      <Ionicons name="close" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Others Tab Content */}
          {activeTab === 'others' && (
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
              {/* Person Details */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={[styles.input, validationErrors.name && styles.inputError]}
                  value={otherDetails.name}
                  onChangeText={(text) => handleOtherDetailsChange('name', text)}
                  placeholder="Enter full name"
                />
                {validationErrors.name && (
                  <Text style={styles.errorText}>{validationErrors.name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={[styles.input, validationErrors.phone && styles.inputError]}
                  value={otherDetails.phone}
                  onChangeText={(text) => handleOtherDetailsChange('phone', text)}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {validationErrors.phone && (
                  <Text style={styles.errorText}>{validationErrors.phone}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Relationship *</Text>
                <View
                  style={[
                    styles.pickerContainer,
                    validationErrors.relationship && styles.inputError,
                  ]}>
                  <Picker
                    selectedValue={otherDetails.relationship}
                    onValueChange={(value) => {
                      handleOtherDetailsChange('relationship', value);
                    }}>
                    <Picker.Item label="Select Relationship" value="" />
                    <Picker.Item label="Friend" value="Friend" />
                    <Picker.Item label="Family" value="Family" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
                {validationErrors.relationship && (
                  <Text style={styles.errorText}>{validationErrors.relationship}</Text>
                )}
              </View>

              <Text style={styles.sectionTitle}>Vehicle Problem</Text>
              <Text style={styles.selectedIssue}>
                {issues.find((i) => i.id === selectedIssue)?.label}
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Additional Notes *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { height: 100, textAlignVertical: 'top' },
                    validationErrors.additionalNotes && styles.inputError,
                  ]}
                  value={otherDetails.additionalNotes}
                  onChangeText={(text) => handleOtherDetailsChange('additionalNotes', text)}
                  placeholder="Describe the problem in detail"
                  multiline
                />
                {validationErrors.additionalNotes && (
                  <Text style={styles.errorText}>{validationErrors.additionalNotes}</Text>
                )}
              </View>

              {/* Location with button */}
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 15 }}>
                {/* Location input */}
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={[styles.input, validationErrors.location && styles.inputError]}
                    value={otherDetails.location}
                    onChangeText={(text) => handleOtherDetailsChange('location', text)}
                    placeholder="Enter location or address"
                  />
                  {validationErrors.location && (
                    <Text style={styles.errorText}>{validationErrors.location}</Text>
                  )}
                </View>

                {/* Button with text on top */}
                <View style={{ alignItems: 'center', marginLeft: 10 }}>
                  <Text
                    style={{
                      ...FONTS.body5,
                      marginBottom: 4,
                      color: COLORS.primary,
                      fontWeight: 500,
                    }}>
                    Current
                  </Text>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                      backgroundColor: COLORS.primary,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={async () => {
                      try {
                        let { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                          toast.error('Permission Denied', 'Location permission denied');
                          return;
                        }

                        let currentLocation = await Location.getCurrentPositionAsync({
                          accuracy: Location.Accuracy.High,
                        });

                        const [address] = await Location.reverseGeocodeAsync({
                          latitude: currentLocation.coords.latitude,
                          longitude: currentLocation.coords.longitude,
                        });

                        let formatted = `${address.name || ''}${address.street ? ', ' + address.street : ''}${
                          address.city ? ', ' + address.city : ''
                        }${address.region ? ', ' + address.region : ''}`;

                        handleOtherDetailsChange('location', formatted);
                      } catch (err) {
                        console.error(err);
                        toast.error('Error', 'Unable to fetch location');
                      }
                    }}>
                    <Ionicons name="location" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Upload Photos */}
              <Text style={styles.sectionTitle}>Upload Photos</Text>
              <Text style={styles.uploadSubtitle}>Add photos of the problem (max 3)</Text>

              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Ionicons name="image" size={20} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={20} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.imagePreviewContainer}>
                {images.map((img, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={
                        img ? { uri: getImageUrl(img) } : require('../../assets/loading1.png')
                      }
                      style={styles.previewImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}>
                      <Ionicons name="close" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isUploadImages}>
            <Text style={styles.submitButtonText}>
              {isUploadImages ? 'SUBMITTING...' : 'REQUEST ASSISTANCE'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      <View>
        <CustomLogoutModal
          visible={signUpConfirmModalVisible}
          onConfirm={() => navigation.navigate('LoginScreen' as never)}
          onCancel={() => setSignUpConfirmModalVisible(false)}
          title="Please Login"
          message="You need to login to request assistance."
          confirmText="Login"
          cancelText="Cancel"
          confirmButtonColor={COLORS.primary}
          cancelButtonColor={COLORS.transparent}
          titleTextColor={COLORS.primary}
          messageTextColor={COLORS.grey}
        />
      </View>
      <View style={{ marginTop: 90 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  heading: {
    ...FONTS.h3,
    marginBottom: 15,
    fontWeight: 500,
    color: COLORS.primary,
    alignSelf: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  issueButton: {
    width: '47%',
    backgroundColor: COLORS.lightGrey05,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#e6f9f0',
    borderColor: 'green',
    borderWidth: 1,
  },
  issueIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 8,
    tintColor: COLORS.primary_text,
  },
  label: {
    ...FONTS.body5,
    textAlign: 'center',
    color: COLORS.primary_borders,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 15,
  },
  confirmText: {
    color: COLORS.white,
    ...FONTS.h6,
    fontWeight: 500,
  },
  orText: {
    marginTop: 10,
    ...FONTS.body5,
    color: '#666',
  },
  callText: {
    ...FONTS.h5,
    color: COLORS.primary,
    fontWeight: 500,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: 500,
    color: COLORS.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    marginBottom: 3,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body4,
    color: COLORS.primary_01,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 500,
  },
  tabContent: {
    marginBottom: 15,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: 500,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.grey,
  },
  detailValue: {
    ...FONTS.body4,
    color: COLORS.primary_text,
  },
  locationText: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 10,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
  },
  locationValue: {
    ...FONTS.body4,
    marginLeft: 10,
    color: COLORS.primary_text,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: 12,
    ...FONTS.body4,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  errorText: {
    ...FONTS.body5,
    color: COLORS.error,
    marginTop: 5,
    marginLeft: 5,
  },
  generalErrorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  generalErrorText: {
    ...FONTS.body5,
    color: COLORS.error,
    fontWeight: '500',
  },
  selectedIssue: {
    ...FONTS.body4,
    color: COLORS.primary,
    padding: 12,
    backgroundColor: COLORS.lightGrey05,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  submitButtonText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: 500,
  },
  uploadSubtitle: {
    ...FONTS.body5,
    color: COLORS.grey,
    marginBottom: 10,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGrey05,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  uploadButtonText: {
    ...FONTS.body5,
    marginLeft: 8,
    color: COLORS.primary,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    marginTop: 5,
  },
});
