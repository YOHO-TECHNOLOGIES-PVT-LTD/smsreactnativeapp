import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '~/constants';

const issues = [
  { id: 'battery', label: 'Battery Discharged', icon: require('../../assets/icons/images/sosimages/battery.png') },
  { id: 'accident', label: 'Accident', icon: require('../../assets/icons/images/sosimages/fender-bender.png') },
  { id: 'fuel', label: 'Fuel Problem', icon: require('../../assets/icons/images/sosimages/gasoline-pump.png') },
  { id: 'keys', label: 'Lost / Locked Keys', icon: require('../../assets/icons/images/sosimages/key.png') },
  { id: 'tyre', label: 'Flat Tyre', icon: require('../../assets/icons/images/sosimages/tyre.png') },
  { id: 'breakdown', label: 'Breakdown', icon: require('../../assets/icons/images/sosimages/break.png') },
  { id: 'engine', label: 'Engine Overtheating', icon: require('../../assets/icons/images/sosimages/car-engine.png') },
  { id: 'coolant', label: 'Coolant Leakage', icon: require('../../assets/icons/images/sosimages/coolant.png') },
  { id: 'brake', label: 'Brake Problem', icon: require('../../assets/icons/images/sosimages/car-wash.png') },
  { id: 'clutch', label: 'Clutch Problem', icon: require('../../assets/icons/images/sosimages/carbreak.png') },
];

export default function RoadsideAssistanceScreen() {
  const [selectedIssues, setSelectedIssues] = useState([]);

  const handleSelect = (id) => {
    if (selectedIssues.includes(id)) {
      setSelectedIssues((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedIssues((prev) => [...prev, id]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Select an Issue</Text>

      <View style={styles.grid}>
        {issues.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            style={[
              styles.issueButton,
              selectedIssues.includes(issue.id) && styles.selectedButton,
            ]}
            onPress={() => handleSelect(issue.id)}
          >
            {selectedIssues.includes(issue.id) && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="green"
                style={styles.checkIcon}
              />
            )}
            <View style={styles.rowWithImage}>
              <Image source={issue.icon} style={styles.issueIcon} />
              <Text style={styles.label}>{issue.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>CONFIRM REQUEST</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity>
        <Text style={styles.callText}>CALL US?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  issueButton: {
    width: '47%',
    backgroundColor:COLORS.lightGrey05,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedButton: {
    backgroundColor: '#e6f9f0',
    borderColor: 'green',
    borderWidth: 1,
  },
  rowWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  issueIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  confirmButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  callText: {
    marginTop: 4,
    fontSize: 16,
    color: '#0000cc',
    fontWeight: 'bold',
  },
});
