import React from 'react';
import { connect } from 'react-redux'
import {CameraRoll, Dimensions, StyleSheet, ScrollView, View, Text, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import Item from '../../components/Item'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import NativeUtil from '../../utils/NativeUtil'
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import { EasyShowLD } from '../../components/EasyShow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
import BaseComponent from "../../components/BaseComponent";
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login }) => ({ ...login }))
class Recharge extends BaseComponent {

  static navigationOptions = {
    title: '充值',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      coinName: this.props.navigation.state.params.coinName ? this.props.navigation.state.params.coinName : 'HSN',

      isOmni: true,
      isErc20: false,
    };
  }

  //组件加载完成
  componentDidMount() {
    
  }

  businesButton(style, selectedSate, stateType, buttonTitle) {  
    let BTN_SELECTED_STATE_ARRAY = ['isOmni', 'isErc20'];  
    return(  
      <TouchableOpacity style={[style]}  onPress={ () => {this._updateBtnState(stateType, BTN_SELECTED_STATE_ARRAY)}}>  
        <Text style={[styles.tabText, selectedSate ? {color: '#3C9CFF'} : {color: '#6F758D'}]}>{buttonTitle}</Text>  
      </TouchableOpacity>  
    );  
  } 

  // 更新"个人排名 团队排名"按钮的状态  
  _updateBtnState(currentPressed, array) { 
    if (currentPressed === 'undefined' || currentPressed === null || array === 'undefined' || array === null ) {  
      return;  
    }  
    if(currentPressed == "isOmni"){
      this.setState({isOmni: true, isErc20: false,});
    }else if(currentPressed == "isErc20"){
      this.setState({isOmni: false, isErc20: true,});
    }
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
        <Header {...this.props} onPressLeft={true} title={this.state.coinName} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.state.coinName=='USDT'&&
          <View style={styles.businestab}>  
            {this.businesButton(styles.taboneStyle, this.state.isOmni, 'isOmni', 'OMNI')}  
            {this.businesButton(styles.tabtwoStyle, this.state.isErc20, 'isErc20', 'ERC20')}  
          </View>}
          <ImageBackground style={styles.outsource} source={UImage.share_card} resizeMode="cover">
            {this.state.coinName=='HSN'&&
            <View style={styles.headerout}>
              <Text style={styles.headertitle}>充币二维码</Text>
              <ViewShot ref="viewShot" style={styles.qrcodeout}>
                <QRCode size={ScreenUtil.autowidth(140)} logo={UImage.min_logo} logoBorderRadius={5} value={this.props.loginUser.depositHsnAddress}/>
              </ViewShot>
              <TextButton onPress={()=>{this.noDoublePress(()=>{this.savePictures()})}} shadow={true} textColor='#FFFFFF' text={"保存二维码至相册"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.headertext}>{"充币地址"}</Text>
                <Text style={styles.headertext}>{this.props.loginUser.depositHsnAddress}</Text>
              </View>
              <TextButton onPress={()=>{this.noDoublePress(()=>{this.onPressCopy(this.props.loginUser.depositHsnAddress)})}} shadow={true} textColor='#FFFFFF' text={"复制充币地址"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
            </View>}
            {this.state.coinName=='USDT'&&
            <View style={styles.headerout}>
              <Text style={styles.headertitle}>充币二维码</Text>
              <ViewShot ref="viewShot" style={styles.qrcodeout}>
                <QRCode size={ScreenUtil.autowidth(140)} logo={UImage.min_logo} logoBorderRadius={5} value={this.state.isOmni?this.props.loginUser.depositUsdtAddress:"0x62e990eF0e485b6345bB04c18D89429A8Ea59317"}/>
              </ViewShot>
              <TextButton onPress={()=>{this.noDoublePress(()=>{this.savePictures()})}} shadow={true} textColor='#FFFFFF' text={"保存二维码至相册"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer}/>
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.headertext}>{"充币地址"}</Text>
                <Text style={styles.headertext}>{this.state.isErc20 ? "0x62e990eF0e485b6345bB04c18D89429A8Ea59317" : this.props.loginUser.depositUsdtAddress}</Text>
              </View>
              <TextButton onPress={()=>{this.noDoublePress(()=>{this.onPressCopy(this.state.isErc20?"0x62e990eF0e485b6345bB04c18D89429A8Ea59317":this.props.loginUser.depositUsdtAddress)})}} 
              shadow={true} textColor='#FFFFFF' text={"复制充币地址"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
            </View>}
            <View style={styles.footerout}>
              <Text style={styles.footertext}>{"1 请勿向非上述地址充值任何非"+((this.state.coinName=="USDT"&&this.state.isOmni)?"Omni ":"Erc20 ")+this.state.coinName+"资产，否则资产将不可找回"}</Text>
              <Text style={styles.footertext}>2 您充值至上述地址后，需要整个网络节点的确认，15次网络确认后到账 </Text>
              <Text style={styles.footertext}>3 您的充值地址不会经常改变，可以重复充值，如有更改，我们将会通过网站公告通知您</Text>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
  },

  businestab: {
    alignSelf: 'center',
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.autoheight(40),
    width: ScreenWidth-ScreenUtil.autowidth(30),
    borderColor: '#6F758D',
    borderWidth: ScreenUtil.autowidth(1),
    borderRadius: ScreenUtil.autowidth(8),
  },
  taboneStyle: {
    flex: 1,
    alignItems: 'center',   
    justifyContent: 'center',
    height: ScreenUtil.autoheight(40),
    borderRightColor: '#6F758D',
    borderRightWidth: ScreenUtil.autowidth(0.5),
  },
  tabtwoStyle: {
    flex: 1,
    alignItems: 'center',   
    justifyContent: 'center',
    height: ScreenUtil.autoheight(40),
    borderLeftColor: '#6F758D',
    borderLeftWidth: ScreenUtil.autowidth(0.5),
  },
  tabText: {
    fontSize: ScreenUtil.setSpText(16),
  },

  outsource: {
    width: ScreenWidth, 
    height: ScreenWidth*1.64, 
    alignItems: 'center', 
    justifyContent: "space-between", 
    paddingTop: ScreenUtil.autoheight(20), 
    paddingBottom: ScreenUtil.autoheight(30),
    paddingHorizontal: ScreenUtil.autowidth(42), 
  },
  headerout: {
    flex: 7, 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
  },
  headertitle: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16), 
  },
  qrcodeout: {
    alignSelf: 'center', 
    justifyContent: 'center', 
    padding: ScreenUtil.autowidth(20), 
    backgroundColor: '#FFFFFF',
    borderRadius: ScreenUtil.autowidth(15), 
  },
  headertext: {
    color: '#009AF4', 
    fontSize: ScreenUtil.setSpText(12),
    lineHeight: ScreenUtil.autoheight(18),
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(40),
    borderRadius: ScreenUtil.autowidth(23), 
  },
  footerout: {
    flex: 3, 
    flexDirection: 'column', 
    justifyContent: 'center', 
  },
  footertext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: ScreenUtil.setSpText(12), 
    lineHeight: ScreenUtil.autoheight(17),
  },
});

export default Recharge;
