import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Alert,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { COLORS, FONTS } from '~/constants';
import toast from '~/utils/toast';
import Icon from 'react-native-vector-icons/Ionicons';
import { LoginAuthentication, SignUpAuthentication } from '../service';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginFormData = {
  phone: string;
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response: any = await SignUpAuthentication({ phoneNumber: data?.phone });
      if (response?.success === true) {
        navigation.navigate('OtpVerificationScreen' as never, {
          data: response?.data,
          method: 'login',
        });
      }
    } catch (error: any) {
      console.log('Login Error:', error.message);
      toast.error('Error', 'Failed to log in');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../../assets/car.jpg')}
        resizeMode="cover"
        style={styles.background}
        blurRadius={2}>
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.formContainer}>
          <Text style={styles.title}>User Login</Text>
          {/* Identifier Input */}
          <Controller
            control={control}
            rules={{ required: 'Phone Number is required' }}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#999"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

          {/* Password Input */}
          {/* <Controller
            control={control}
            rules={{ required: 'Password is required' }}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  style={[styles.input, { flex: 1 }]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>} */}
          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Links */}
          {/* <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen' as never)}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 20, gap: 5, justifyContent: 'center' }}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen' as never)}>
                <Text style={{ color: COLORS.primary, ...FONTS.h4 }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </Animated.View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
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
  bottomLinks: {
    marginTop: 16,
  },
  forgotText: {
    color: COLORS.warning80,
    ...FONTS.body4,
    textAlign: 'right',
  },
  signupText: {
    color: '#94a3b8',
    ...FONTS.body4,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.error,
    ...FONTS.body5,
    marginBottom: 8,
    marginLeft: 4,
  },
  background: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    marginBottom: 10,
    paddingRight: 10,
  },
});
