import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Snackbar } from 'react-native-paper';
import { 
  useFonts,
  PressStart2P_400Regular, 
} from '@expo-google-fonts/press-start-2p';
import { SERVER_URL } from '../constants';

export default function AuthScreen({ navigation, route }) {

  let [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  })

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [authLayout, setAuthLayout] = React.useState('login');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onToggleSnackbar = () => setShowSnackbar(!showSnackbar);

  const onDismissSnackbar = () => setShowSnackbar(false);

  const changeUsername = (value) => {
    setUsername(value);
  };

  const changePassword = (value) => {
    setPassword(value);
  };

  const login = () => {
    console.log('Attempting to log in...');
    if ( username === '' || password === '' ) {
      console.log('you must complete both values');
      setSnackbarMessage('Must enter values in both fields');
      setShowSnackbar(true);
    } else {
      console.log(SERVER_URL+'/api/login');
      fetch(SERVER_URL+'/api/login',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username:username,
          password:password,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSnackbarMessage(data.message);
        setShowSnackbar(true);
        if( data.type === 'success' ){
            navigation.navigate('Dashboard');
        }
      })
      .catch(error => {
        console.error(error);
      })
    }
  };

  const register = () => {
    console.log('Attempting to register...');
    if ( username === '' || password === '' ) {
      console.log('you must complete both values');
      setSnackbarMessage('Must enter values in both fields');
      setShowSnackbar(true);
    } else {
      console.log('all is good, calling fetch...');
      fetch(SERVER_URL+'/api/register',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username:username,
          password:password,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSnackbarMessage(data.message);
        setShowSnackbar(true);
        if( data.type === 'success' ){
            navigation.navigate('Dashboard');
        }
      })
      .catch(error => {
        console.error(error);
      })
    }
  };

  const changeLayout = (layout) => {
    setAuthLayout(layout);
  };

  if (!fontsLoaded) {
    return <Text>App is Loading...</Text>;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crawler App</Text>
        <LottieView source={require('../assets/lottie/ripple.json')} autoPlay loop style={styles.logo} />
        <Text style={styles.text}>Username</Text>
        <TextInput value={username} onChangeText={text => changeUsername(text)} style={styles.textInput}/>
        <Text style={styles.text}>Password</Text>
        <TextInput secureTextEntry value={password} onChangeText={text => changePassword(text)} style={styles.textInput}/>
        { authLayout === 'login' && (
            <>
              <TouchableOpacity onPress={ () => { login() } } style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <Text onPress={ () => { changeLayout('register') }} style={styles.authText}>Haven't registered yet?</Text>
            </>
        ) }
  
        { authLayout === 'register' && (
            <>
              <TouchableOpacity onPress={ () => { register() } } style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <Text onPress={ () => { changeLayout('login') }} style={styles.authText}>Already registered?</Text>
            </>
        ) }


      <Snackbar visible={showSnackbar} onDismiss={onDismissSnackbar} style={styles.snackbar}>
        <Text style={styles.snackbarText}>{ snackbarMessage }</Text>
      </Snackbar>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'lawngreen',
    fontSize: 24,
    marginVertical: -15,
    fontFamily: 'PressStart2P_400Regular',
    alignSelf: 'center',
  },
  logo: {
    height: 200,
    width: 200,
  },
  text: {
    color: 'lawngreen',
    fontFamily: 'PressStart2P_400Regular',
    marginVertical: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'lawngreen',
    borderStyle: 'solid',
    height: 40,
    width: 200,
    margin: 5,
    paddingHorizontal: 10,
    color: 'lawngreen',
    fontFamily: 'PressStart2P_400Regular',
  },
  buttonContainer: {
    backgroundColor:'black',
    elevation: 6,
    margin: 10,
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    margin: 10,
    padding: 10,
    color: 'lawngreen',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'lawngreen',
    borderStyle: 'solid',
    fontFamily: 'PressStart2P_400Regular',
  },
  authText:{
    color: 'lawngreen',
    fontFamily: 'PressStart2P_400Regular',
  },
  snackbar: {
    display:'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: 'lawngreen',
    borderStyle: 'solid',
  },
  snackbarText: {
    textAlign: 'center',
    fontFamily: 'PressStart2P_400Regular',
    color: 'lawngreen',
  },
});
