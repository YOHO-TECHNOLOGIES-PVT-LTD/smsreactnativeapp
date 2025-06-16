import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '~/constants';
import * as ImagePicker from 'expo-image-picker';

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

const userDetails = {
  name: 'Customer',
  phone: '+91 9876543210',
  bloodGroup: 'A1+',
  carModel: 'Toyota Camry 2020',
  licensePlate: 'AP L1234',
};

export default function RoadsideAssistanceScreen() {
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState('own');
  const [images, setImages] = useState([]);
  const [otherDetails, setOtherDetails] = useState({
    name: '',
    phone: '',
    relationship: '',
    location: '',
    additionalNotes: '',
  });

  const handleSelect = (id: any) => {
    setSelectedIssue(id);
    setModalVisible(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleOtherDetailsChange = (field: any, value: any) => {
    setOtherDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const requestData = {
      issue: selectedIssue,
      type: activeTab,
      ...(activeTab === 'own' ? userDetails : otherDetails),
    };
    console.log('Request Data:', requestData);
    setModalVisible(false);
    setOtherDetails({
      name: '',
      phone: '',
      relationship: '',
      location: '',
      additionalNotes: '',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Select an Issue</Text>

      <View style={styles.grid}>
        {issues.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            style={[styles.issueButton, selectedIssues.includes(issue.id) && styles.selectedButton]}
            onPress={() => handleSelect(issue.id)}
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
        <ScrollView style={styles.modalContainer}>
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

          {/* Own Tab Content */}
          {activeTab === 'own' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Your Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{userDetails.name}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{userDetails.phone}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Blood Group:</Text>
                <Text style={styles.detailValue}>{userDetails.bloodGroup}</Text>
              </View>

              <Text style={styles.sectionTitle}>Vehicle Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Car Model:</Text>
                <Text style={styles.detailValue}>{userDetails.carModel}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>License Plate:</Text>
                <Text style={styles.detailValue}>{userDetails.licensePlate}</Text>
              </View>

              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.locationText}>Using your current location...</Text>
              <View style={styles.locationBox}>
                <Ionicons name="location" size={24} color={COLORS.primary} />
                <Text style={styles.locationValue}>Fetching location...</Text>
              </View>
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
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}>
                      <Ionicons name="close" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Others Tab Content */}
          {activeTab === 'others' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Person Details</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={otherDetails.name}
                  onChangeText={(text) => handleOtherDetailsChange('name', text)}
                  placeholder="Enter full name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={otherDetails.phone}
                  onChangeText={(text) => handleOtherDetailsChange('phone', text)}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  value={otherDetails.relationship}
                  onChangeText={(text) => handleOtherDetailsChange('relationship', text)}
                  placeholder="Friend, family, etc."
                />
              </View>

              <Text style={styles.sectionTitle}>Vehicle Problem</Text>
              <Text style={styles.selectedIssue}>
                {issues.find((i) => i.id === selectedIssue)?.label}
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Additional Notes</Text>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  value={otherDetails.additionalNotes}
                  onChangeText={(text) => handleOtherDetailsChange('additionalNotes', text)}
                  placeholder="Describe the problem in detail"
                  multiline
                />
              </View>

              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Where is the vehicle?</Text>
                <TextInput
                  style={styles.input}
                  value={otherDetails.location}
                  onChangeText={(text) => handleOtherDetailsChange('location', text)}
                  placeholder="Enter location or address"
                />
              </View>
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
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}>
                      <Ionicons name="close" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={images.length === 0}>
            <Text style={styles.submitButtonText}>REQUEST ASSISTANCE</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
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
    marginBottom: 20,
  },
  modalTitle: {
    ...FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    marginBottom: 20,
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
    ...FONTS.body3,
    color: COLORS.primary_01,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  tabContent: {
    marginBottom: 20,
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
    marginBottom: 40,
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
});
