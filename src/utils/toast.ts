import Toast from 'react-native-toast-message';

const toast = {
    success: (message, description) => {
        Toast.show({
            type: 'success',
            text1: message || 'Success',
            text2: description,
            position: 'top',
        });
    },
    error: (message, description) => {
        Toast.show({
            type: 'error',
            text1: message || 'Error',
            text2: description,
            position: 'top',
        });
    },
    info: (message, description) => {
        Toast.show({
            type: 'info',
            text1: message || 'Info',
            text2: description,
            position: 'top',
        });
    },
};

export default toast;
