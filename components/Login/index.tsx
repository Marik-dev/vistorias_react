import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

// import * as Location from 'expo-location';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  Container,
  Logo,
  Header,
  InputField,
  Title,
  HorizontalLine,
  RememberUser,
  LoginButton,
  LoginText,
  ShowPasswordButton,
  FooterVersionText,
  ShowPasswodIcon,
} from './styles';

import Checkbox from 'expo-checkbox';
import { AuthContext } from '../../context/Auth';
import { AppContext } from '../../context/App';

const Login = ({ navigation }) => {
  const [rememberUser, setRememberUser] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [showPassword, setShowpassword] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, isLoggingIn } = useContext(AuthContext);

  const { appVersion } = useContext(AppContext);

  const getRemeberedUser = async () => {
    const rememberedUser = await AsyncStorage.getItem('userLoginRemembered');

    return rememberedUser;
  };

  useEffect(() => {
    getRemeberedUser().then((userRemebered) => {
      if (userRemebered) {
        let response = JSON.parse(userRemebered);
        setUserName(response.username);
        setUserPassword(response.password);
        setRememberUser(true);
      } else {
        setRememberUser(false);
      }
    });
  }, []);

  const handleLogin = async () => {
    const data = {
      username: userName,
      password: userPassword,
      rememberUser: rememberUser,
    };

    login(data).then((resp) => {
      if (resp.status === 200) {
        navigation.navigate('Panel');
      } else {
        setErrorMsg(resp.msg);
      }
    });
  };

  return (
    <>
      <Container>
        <Header>
          <Logo source={require('../../assets/png/LocalSIG.png')} />
          <Title>Inspeção Veicular</Title>
          <MaterialCommunityIcons name='car' size={100} color='#242424' />
          {/* <HorizontalLine /> */}
        </Header>
        {errorMsg ? (
          <Text style={{ marginTop: -25, marginBottom: 5, color: '#f75555' }}>{errorMsg}</Text>
        ) : null}
        <InputField
          placeholder='Usuário'
          placeholderTextColor='#a1a1a1'
          autoCapitalize='none'
          style={{ height: 55 }}
          value={userName}
          onChangeText={(text) => {
            setUserName(text);
            setErrorMsg(null);
          }}
        ></InputField>
        <View
          style={{
            marginVertical: 10,
          }}
        ></View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 340,
          }}
        >
          <InputField
            placeholder='Matricula'
            value={userPassword}
            style={{ width: '83%', height: 55 }}
            keyboardType='ascii-capable'
            secureTextEntry={!showPassword}
            autoCapitalize='none'
            onChangeText={(text) => {
              setUserPassword(text);
              setErrorMsg(null);
            }}
          />

          <ShowPasswordButton
            onPressIn={() => setShowpassword(true)}
            onPressOut={() => setShowpassword(false)}
          >
            <ShowPasswodIcon showPassword={showPassword}>
              <Feather name='eye' size={35} color={'#a1a1a1'} />
            </ShowPasswodIcon>
          </ShowPasswordButton>
        </View>

        <View
          style={{
            marginVertical: 10,
          }}
        ></View>
        <LoginButton onPress={handleLogin}>
          {isLoggingIn ? (
            <ActivityIndicator size='large' color='#f0f0f0' style={{ height: 80, width: 100 }} />
          ) : (
            <LoginText>Log in</LoginText>
          )}
        </LoginButton>
        <RememberUser>
          <Checkbox
            style={styles.checkbox}
            value={rememberUser}
            onValueChange={setRememberUser}
            color={rememberUser ? '#2e83ab' : undefined}
          />
          <Text onPress={() => setRememberUser(!rememberUser)}>Salvar Usuário?</Text>
        </RememberUser>

        <View style={{ marginBottom: 50 }}></View>
      </Container>
      <FooterVersionText>App Inspeção Veicular - v.{appVersion}</FooterVersionText>
    </>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  },
});

export default Login;
