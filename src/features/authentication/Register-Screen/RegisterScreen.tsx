import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '~/constants';
import toast from '~/utils/toast';
import { SignUpAuthentication } from '../service';

type SignUpForm = {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const RegisterScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onSubmit = async (data: SignUpForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Error', 'Passwords do not match');
      return;
    }
    const { email, phone, password } = data;
    const response: any = await SignUpAuthentication({ email, phone, password });
    if (response?.success) {
      toast.success('Registration Successful', 'You have successfully registered.');
      navigation.navigate('OtpVerificationScreen' as never, { data: response.data });
    } else {
      toast.error('Something went wrong', 'Please try again.');
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
        <View style={styles.formContainer}>
          <Text style={styles.title}>SignUp</Text>

          {/* Email */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          {/* Phone */}
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Phone number required',
              pattern: { value: /^[0-9]{10}$/, message: 'Phone must be 10 digits' },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

          {/* Password */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Password"
                  style={[styles.input, { flex: 1 }]}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: 'Please confirm your password' }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  style={[styles.input, { flex: 1 }]}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#999"
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
            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 20 }}>
            <Text style={styles.backText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen" as never)}>
              <Text style={[styles.backText, { color: COLORS.primary_01, ...FONTS.h4 }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center' },
  formContainer: { backgroundColor: '#1e293b', borderRadius: 16, padding: 24 },
  title: { ...FONTS.h2, color: COLORS.white, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#334155',
    color: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    ...FONTS.body4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingRight: 12,
    marginBottom: 10,
  },
  button: { backgroundColor: COLORS.primary_01, padding: 14, borderRadius: 10, marginTop: 10 },
  buttonText: { color: COLORS.white, ...FONTS.h4, textAlign: 'center' },
  error: { color: COLORS.error, marginBottom: 8, marginLeft: 4, ...FONTS.body5 },
  backText: { color: '#94a3b8', ...FONTS.body4, textAlign: 'center' },
  background: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
});
