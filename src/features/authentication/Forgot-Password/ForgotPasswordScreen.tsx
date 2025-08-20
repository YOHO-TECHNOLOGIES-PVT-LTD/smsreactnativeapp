import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '~/constants';
import toast from '~/utils/toast';
import { ForgotPassword } from '../service';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ emailOrPhone: string }>();

  const onSubmit = async (data: { emailOrPhone: string }) => {
    const response = await ForgotPassword({ email: data.emailOrPhone });
    console.log('Forgot Password Response:', response);
    if (response) {
      navigation.navigate('OtpVerificationScreen' as never, {
        data: response,
        method: 'forgotPassword-OtpVerify',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Verify Account</Text>
        <Controller
          control={control}
          name="emailOrPhone"
          rules={{ required: 'Email or phone number is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email or Phone Number"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.emailOrPhone && <Text style={styles.errorText}>{errors.emailOrPhone.message}</Text>}

        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.loginButtonText}>Verify</Text>
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

export default ForgotPasswordScreen;

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
});
