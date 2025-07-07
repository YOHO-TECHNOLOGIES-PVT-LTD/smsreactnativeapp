import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import toast from '~/utils/toast';
import { COLORS, FONTS } from '~/constants';
import { ResetPassword } from '../service';

const SetNewPasswordScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ newPassword: string; confirmPassword: string }>();

  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { data } = route?.params || {};

  const onSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Error', 'Passwords do not match');
      return;
    }
    const response = await ResetPassword({
      newPassword: data.confirmPassword,
      oldPassword: data.newPassword,
    });
    if (response) {
      toast.success('Success', 'Password changed successfully');
      navigation.navigate('LoginScreen' as never);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Reset Password</Text>

        {/* New Password Field */}
        <Controller
          control={control}
          name="newPassword"
          rules={{ required: 'Enter new password' }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="New Password"
                placeholderTextColor="#999"
                secureTextEntry={!showNewPassword}
                style={[styles.input, { flex: 1 }]}
                onChangeText={onChange}
                value={value}
              />
              <TouchableOpacity onPress={() => setShowNewPassword((prev) => !prev)}>
                <Icon
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

        {/* Confirm Password Field */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: 'Confirm your password' }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { flex: 1 }]}
                onChangeText={onChange}
                value={value}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
                <Icon
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.loginButtonText}>Change Password</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', gap: 5 }}>
          <Text style={styles.signupText}>Back to</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen' as never)}>
            <Text style={{ color: COLORS.primary, ...FONTS.h4 }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SetNewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#334155',
    color: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    ...FONTS.body4,
  },
  loginButton: {
    backgroundColor: COLORS.primary_01,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    ...FONTS.h4,
  },
  errorText: {
    color: COLORS.error,
    ...FONTS.body5,
    marginBottom: 8,
    marginLeft: 4,
  },
  signupText: {
    color: '#94a3b8',
    ...FONTS.body4,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
});
