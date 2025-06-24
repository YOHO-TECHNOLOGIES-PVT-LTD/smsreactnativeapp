import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '~/constants';

interface CustomLogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  titleTextColor?: string;
  messageTextColor?: string;
}

const CustomLogoutModal: React.FC<CustomLogoutModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title = 'Logout',
  message = 'Are you sure you want to logout?',
  confirmText = 'Logout',
  cancelText = 'Cancel',
  confirmButtonColor = COLORS.primary,
  cancelButtonColor = COLORS.transparent,
  titleTextColor = COLORS.primary,
  messageTextColor = COLORS.grey,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { color: titleTextColor }]}>{title}</Text>
          <Text style={[styles.modalMessage, { color: messageTextColor }]}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: cancelButtonColor }]}
              onPress={onCancel}>
              <Text style={[styles.buttonText, { color: COLORS.primary }]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: confirmButtonColor }]}
              onPress={onConfirm}>
              <Text style={[styles.buttonText, { color: COLORS.white }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    ...FONTS.h2_02,
    fontWeight: 500,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    ...FONTS.body3,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: '45%',
    alignItems: 'center',
    marginBottom: 6,
  },
  cancelButton: {
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  confirmButton: {
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: 500,
    ...FONTS.h4,
  },
});

export default CustomLogoutModal;
