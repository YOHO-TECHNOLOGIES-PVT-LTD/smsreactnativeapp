import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import toast from '~/utils/toast';
import { COLORS, FONTS } from '~/constants';
import { VerifyOtp } from '../service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpVerificationScreen = ({ route }) => {
  const navigation = useNavigation();
  const [otp, setOtp] = React.useState(Array(6).fill(''));
  const inputsRef = React.useRef<Array<TextInput | null>>([]);
  const { data, method } = route?.params || {};

  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);

      // Move to next input
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace') {
      const updated = [...otp];
      if (updated[index] !== '') {
        updated[index] = '';
      } else if (index > 0) {
        updated[index - 1] = '';
        inputsRef.current[index - 1]?.focus();
      }
      setOtp(updated);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      const response: any = await VerifyOtp({ otp: otpValue, AuthToken: data?.token });
      if (response) {
        if (method === 'forgotPassword-OtpVerify') {
          navigation.navigate('SetNewPasswordScreen' as never, {
            data: response,
          });
        } else {
          await AsyncStorage.setItem('authToken', response);
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack' }],
          });
          toast.success('OTP Verified', 'You have successfully verified your OTP.');
        }
      }
    } else {
      toast.error('Error', 'Enter all 6 digits');
    }
  };

  const handleResendOtp = async () => {
    // const response = await VerifyOtp({ otp: '', AuthToken: data?.token });
    toast.success('Success', 'OTP has been resent.');
    // Resend OTP API call
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Enter OTP</Text>
        {data?.otp && (
          <View style={{ marginVertical: 10, width: '100%' }}>
            <Text style={{ ...FONTS.body5, color: COLORS.white, textAlign: 'center' }}>
              OTP: {data?.otp}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputsRef.current[index] = ref)}
              value={digit}
              onChangeText={(val) => handleChange(index, val)}
              onKeyPress={(e) => handleKeyPress(index, e)}
              keyboardType="number-pad"
              maxLength={1}
              style={[styles.input, { textAlign: 'center', width: 40 }]}
              returnKeyType="next"
            />
          ))}
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleVerifyOtp}>
          <Text style={styles.loginButtonText}>Verify OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 20, flexDirection: 'column', alignItems: 'flex-end' }}
          onPress={() => handleResendOtp()}>
          <Text
            style={{ ...FONTS.body5, color: COLORS.primary_01, textDecorationLine: 'underline' }}>
            Resend OTP
          </Text>
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

export default OtpVerificationScreen;

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
  signupText: {
    color: '#94a3b8',
    ...FONTS.body4,
    textAlign: 'center',
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
});
