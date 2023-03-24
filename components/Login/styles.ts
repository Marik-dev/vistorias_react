import { PixelRatio } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 45px;
`;

export const Header = styled.View`
  align-items: center;
  margin-top: 40px;
  margin-bottom: 30px;
`;

export const Logo = styled.Image`
  width: ${() => PixelRatio.roundToNearestPixel(72).toFixed(2)}px;
  height: ${() => PixelRatio.roundToNearestPixel(72).toFixed(2)}px;
  position: absolute;
  top: -180px;
  left: 170px;
`;

export const Title = styled.Text`
  font-size: ${() => PixelRatio.roundToNearestPixel(20).toFixed(2)}px;
  margin-top: 20px;
  text-align: center;
  position: absolute;
  top: -170px;
  font-weight: 500;
`;

export const HorizontalLine = styled.View`
  height: 3px;
  width: 150px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_700};
  margin-bottom: ${() => PixelRatio.roundToNearestPixel(42).toFixed(2)}px;
`;

export const InputField = styled.TextInput`
  border: solid 1px #c0c0c0;
  font-size: 17px;
  padding: 10px 14px;
  border-radius: 6px;
  height: ${() => PixelRatio.roundToNearestPixel(50).toFixed(2)}px;
  width: ${() => PixelRatio.roundToNearestPixel(335).toFixed(2)}px;
  background-color: #e6e6e6;
`;

export const RememberUser = styled.View`
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 200px;
  margin-bottom: ${() => PixelRatio.roundToNearestPixel(40).toFixed(2)}px;
`;

export const LoginButton = styled.TouchableOpacity`
  background-color: #2e83ab;
  align-items: center;
  justify-content: center;
  height: ${() => PixelRatio.roundToNearestPixel(55).toFixed(2)}px;
  width: ${() => PixelRatio.roundToNearestPixel(340).toFixed(2)}px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

export const LoginText = styled.Text`
  font-size: 18px;
  color: white;
`;

export const ShowPasswordButton = styled.TouchableWithoutFeedback`
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const ShowPasswodIcon = styled.View`
  border-color: ${(props) => (!props.showPassword ? '#bdbdbd' : '#a0a0a0')};
  border-width: 2px;
  border-radius: 5px;
  padding: 6px;
  background-color: ${(props) => (!props.showPassword ? '#dddddd' : '#cacaca')};
`;

export const FooterVersionText = styled.Text`
  position: absolute;
  width: 100%;
  opacity: 0.3;
  margin: auto;
  margin-top: 202%;
  text-align: center;
  align-items: flex-end;
  justify-content: flex-end;
`;
