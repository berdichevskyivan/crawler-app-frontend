import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native';
import { Snackbar } from 'react-native-paper';
import { 
  useFonts,
  PressStart2P_400Regular, 
} from '@expo-google-fonts/press-start-2p';
import { SERVER_URL } from '../constants';

export default function DashboardScreen({ navigation, route }) {

  let [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  })

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const [selectedPrefix, setSelectedPrefix] = React.useState('https://');
  const [url, setUrl] = React.useState('');

  // status can be 'waiting' , 'submitting', 'response'
  const [currentStatus, setCurrentStatus] = React.useState('waiting');

  const [emailsFound, setEmailsFound] = React.useState([]);

  const onToggleSnackbar = () => setShowSnackbar(!showSnackbar);

  const onDismissSnackbar = () => setShowSnackbar(false);

  const handleChangeUrl = ( text ) => {
    setUrl(text);
  };

  const EmailAddress = ({ email }) => (
    <View style={styles.emailAddress}>
      <Text style={styles.emailAddressText}>{ email }</Text>
    </View>
  );

  const renderEmailAddress = ({ item }) => (
    <EmailAddress email={item.email} key={`email-${item.id}`}/>
  );

  const submitURL = () => {
    console.log('submitting URL...');
    if (!url) {
      return;
    } else {
      console.log(selectedPrefix+url);
      setCurrentStatus('submitting');
      setEmailsFound([]);
      fetch(SERVER_URL+'/api/crawlUrl',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: selectedPrefix+url,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if ( data.emailsFound ) {

          const uniqueEmailsFound = [...new Set(data.emailsFound)];

          let newEmails = uniqueEmailsFound.map((email,index) => {
            let newEmail = {};
            newEmail.id = index;
            newEmail.email = email;
            return newEmail;
          });
          console.log(newEmails);
          setEmailsFound(newEmails);
        } else {
          setEmailsFound([]);
        }

        setCurrentStatus('response');
      })
      .catch(error => {
        console.error(error);
        setCurrentStatus('waiting');
      })
    }
  };

  if (!fontsLoaded) {
    return <Text>App is Loading...</Text>;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Enter a URL and we'll scan it for e-mail addresses</Text>
        <View style={styles.searchContainer}>
          <View style={styles.pickerWrapper}>
            <Picker
            selectedValue={selectedPrefix}
            style={styles.picker}
            mode="dropdown"
            onValueChange={ ( value, index ) => { setSelectedPrefix(value) } }>
              <Picker.Item label="http://" value="http://" />
              <Picker.Item label="https://" value="https://" />
            </Picker>
          </View>
          <TextInput value={url} onChangeText={text => handleChangeUrl(text)} style={styles.textInput}/>
          <TouchableOpacity onPress={ () => { submitURL() } } style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* This image changes depending on the status of the query */}
        { currentStatus === 'waiting' && (
          <LottieView source={require('../assets/lottie/ripple.json')} autoPlay loop style={styles.logo} />
        )}
        { currentStatus === 'submitting' && (
          <LottieView source={require('../assets/lottie/loading.json')} autoPlay loop style={styles.logo} />
        )}
        { currentStatus === 'response' && (
          <>
            { emailsFound.length === 0 && (
              <Text style={styles.text}>No emails were found...</Text>
            )}

            { emailsFound.length > 0 && (
              <Text style={styles.text}>Some emails were found!</Text>
            )}  
            
            <FlatList
              data={emailsFound}
              renderItem={renderEmailAddress}
              keyExtractor={item => item.email} />
          </>
        )}



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
    justifyContent: 'flex-start',
  },
  searchContainer: {
    margin: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
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
    marginBottom: 10,
    marginTop: -10,
  },
  titleText: {
    color: 'lawngreen',
    fontFamily: 'PressStart2P_400Regular',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'lawngreen',
    borderStyle: 'solid',
    height: 40,
    width: 250,
    margin: 5,
    paddingHorizontal: 10,
    color: 'lawngreen',
    fontFamily: 'PressStart2P_400Regular',
  },
  buttonContainer: {
    backgroundColor:'black',
    elevation: 6,
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
  pickerWrapper: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'lawngreen',
    borderStyle: 'solid',
    display:'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  picker: {
    height:50,
    width: 115,
    color: 'lawngreen',
  },
  pickerItem: {
    color: 'lawngreen',
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
  },
  emailAddress: {
    borderWidth: 1,
    borderColor: 'lawngreen',
    borderStyle: 'solid',
    backgroundColor: 'black',
    height: 50,
    width: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailAddressText: {
    color: 'lawngreen',
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    margin: 2,
    textAlign: 'center',
  },
});
