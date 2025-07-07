import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '~/constants';

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
  const [selectedIssues, setSelectedIssues] = useState([]);

  const handleSelect = (id: any) => {
    if (selectedIssues.includes(id as never)) {
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

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>CONFIRM REQUEST</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity>
        <Text style={styles.callText}>CALL US?</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 135 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  heading: {
    ...FONTS.h4,
    marginBottom: 16,
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
    ...FONTS.h5,
  },
  orText: {
    marginTop: 10,
    ...FONTS.body5,
    color: '#666',
  },
  callText: {
    ...FONTS.h5,
    color: COLORS.indigo[500],
    textDecorationLine: 'underline',
  },
});
