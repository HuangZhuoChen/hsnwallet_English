
import React from 'react';
import { connect } from 'react-redux'
import {CameraRoll, StyleSheet, Dimensions, Animated, Easing,Clipboard, View, Image, ScrollView, Text, Linking, TouchableOpacity, ImageBackground } from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import ScreenUtil from '../../utils/ScreenUtil'
import Header from '../../components/Header'
import { EasyToast } from '../../components/Toast';
import ViewShot from "react-native-view-shot";
import QRCode from 'react-native-qrcode-svg';
import {Utils} from '../../utils/Utils'
import TextButton from '../../components/TextButton'
import BaseComponent from "../../components/BaseComponent";
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login }) => ({ ...login }))
class InviteCode extends BaseComponent {

  static navigationOptions = {
    title: "分享海报",
    header:null, 
  };
  
  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  async componentDidMount() {
    //获用户信息
    await Utils.dispatchActiionData(this, {type:'login/findUserInfo',payload:{ } });
  }

  savePictures = () => {
    this.refs.viewShot.capture().then(uri => {
      CameraRoll.saveToCameraRoll(uri);
      EasyToast.show("图片已保存到您的相册");
      // setTimeout(() => {
      //   Linking.openURL('mqqwpa://');
      // }, 2000);
    });
  }

  onPressCopy = (copytext) =>{
    Clipboard.setString(copytext);
    EasyToast.show("复制成功");
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={"分享海报"} backgroundColors={"rgba(0, 0, 0, 0.0)"} onPressRight={this.savePictures.bind(this)} subName="保存图片"/>
        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false} style={{padding: ScreenUtil.autowidth(15), }}>
          <ViewShot ref="viewShot" style={{flex: 1, backgroundColor: UColor.bgColor,}}> 
            <ImageBackground style={styles.headimgout} source={UImage.share_bg} resizeMode="cover">
              <View style={{flexDirection: 'column', alignItems: 'center', paddingRight: ScreenUtil.autowidth(3)}}>
                <QRCode size={ScreenUtil.autowidth(90)} logo={UImage.min_logo} logoBorderRadius={2}
                value={"https://invite.wallet.hsn.link/?ref=" + (!this.props.loginUser ? "" : this.props.loginUser.inviteCode)}/>
              </View>
            </ImageBackground>
          </ViewShot>
          <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.referout}>
              <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(12)}}>我的邀请链接：</Text>
              <Text style={{flex: 1,color: '#FFFFFF',fontSize: ScreenUtil.setSpText(12),}}>{"https://invite.wallet.hsn.link/?ref=" + (!this.props.loginUser ? "" : this.props.loginUser.inviteCode)}</Text>
            </View>
            <TextButton onPress={()=>{this.noDoublePress(()=>{this.onPressCopy("https://invite.wallet.hsn.link/?ref=" + (!this.props.loginUser ? "" : this.props.loginUser.inviteCode))})}} shadow={true} textColor='#FFFFFF' 
              text={"复制链接"} fontSize={ScreenUtil.setSpText(14)} style={styles.btntransfer} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'column',
    paddingBottom: ScreenUtil.isIphoneX() ?ScreenUtil.autoheight(24):ScreenUtil.autoheight(0),
  },

  headimgout: {
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    height: (ScreenWidth-ScreenUtil.autowidth(30))*1.5488, 
    alignItems: 'center', 
    justifyContent: "flex-end", 
    paddingBottom: (ScreenWidth-ScreenUtil.autowidth(30))*0.15,
  },
  headtext: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16), 
  },
  qrcodeout: {
    alignSelf: 'center', 
    justifyContent: 'center', 
    padding: ScreenUtil.autowidth(5), 
    backgroundColor: '#FFFFFF',
    borderRadius: ScreenUtil.autowidth(3), 
  },
  codetitle: {
    color: '#009AF4', 
    fontWeight:'400',
    fontSize: ScreenUtil.setSpText(42), 
    lineHeight: ScreenUtil.autoheight(42), 
  },
  codetext: {
    color: '#009AF4', 
    fontWeight:'400',
    fontSize: ScreenUtil.setSpText(16), 
    lineHeight: ScreenUtil.autoheight(17), 
  },
  continertext: { 
    color: '#C1C2C6', 
    lineHeight: ScreenUtil.autoheight(28),
    fontSize: ScreenUtil.setSpText(14), 
  },

  referout: {
    width: ScreenWidth-ScreenUtil.autowidth(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScreenUtil.autoheight(26), 
  },
  btntransfer: {
    width: ScreenUtil.autowidth(150), 
    height: ScreenUtil.autoheight(40),
    borderRadius: ScreenUtil.autowidth(23), 
  }
});

export default InviteCode;