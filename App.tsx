import './global.css';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from '~/store';
import { NavigationContainer } from '@react-navigation/native';
import Routes from '~/routes';


export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Thin': require('./src/assets/fonts/Poppins-Thin.ttf'),
    'Poppins-Medium': require('./src/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Light': require('./src/assets/fonts/Poppins-Light.ttf'),
    'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-ExtraLight': require('./src/assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraBold': require('./src/assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Black': require('./src/assets/fonts/Poppins-Black.ttf'),
  });
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Routes />
          <Toast />
        </NavigationContainer>
      </Provider>
    </>
  );
}
