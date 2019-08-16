import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, ScrollView, View, Text, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import Item from '../../components/Item'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import NativeUtil from '../../utils/NativeUtil'
import { EasyShowLD } from '../../components/EasyShow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import {Utils} from '../../utils/Utils'
import LinearGradient from 'react-native-linear-gradient'
import {VersionUpdateView} from '../../components/modals/VersionUpdate'
import {VersionUpdate} from '../../components/modals/VersionUpdate'
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ common }) => ({ ...common }))
class Aboutus extends React.Component {

  static navigationOptions = {
    title: '关于我们',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      
    };
    this.config = [
      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), disable: false, spot: true, 
        nameColor: '#FFFFFF',  avatar: UImage.authentication, name: "Official Website", onPress: this.goOfficialWebsite.bind(this) },

      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), nameColor: '#FFFFFF', spot: true, 
      disable: false,  avatar: UImage.invitation_code, name: "TeleGram", onPress: this.goTelegram.bind(this) },

      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), nameColor: '#FFFFFF', spot: true, 
      disable: false,  avatar: UImage.membership_level, name: "Twitter", onPress: this.goTwitter.bind(this) },
      
      // {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), disable: false,  spot: true, 
      //   nameColor: '#FFFFFF',   avatar: UImage.safety_center, name: "微信公众号", onPress: this.goWechatPublic.bind(this) },

    {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), disable: false,  spot: true, 
        nameColor: '#FFFFFF',   avatar: UImage.safety_center, name: "Check For Updates", subName: "V"+Constants.version, onPress: this.goCheckUpdate.bind(this), redDot: Constants.promptUpgrade},
      
    ];
  }

  //组件加载完成
  componentDidMount() {
    
  }

  //官网
  goOfficialWebsite () {
    try {
      Linking.openURL("https://www.hsn.link");
    } catch (error) {
      
    }
  }
  
  //telegram
  goTelegram () {
    try {
      Linking.openURL("https://t.me/HyperSpeedNetwork");
    } catch (error) {
      
    }
  }
  
  //twitter
  goTwitter () {
    try {
      Linking.openURL("https://twitter.com/HSpeedNetwork");
    } catch (error) {
      
    }
  }
  
  //微信公众号
  goWechatPublic () { 
    try {
      
    } catch (error) {
      
    }
  }

  //检查更新
  goCheckUpdate () {
    this.checkVersion();
  }

  //升级
  checkVersion(){
    this.props.dispatch({ type: 'common/upgradeApp', payload: { os: DeviceInfo.getSystemName(), version:  Constants.version},
      callback: (data) => {
        if (data && data.data && data.code == 0) {
          if (data.data.upgradeMethod == "force") {
            EasyShowLD.dialogShow("Version Update", data.data.intr, "upgrade", null, () => { Utils.doUpgrade(data.data.url,data.data.itmsservices, data.data.version) }, () => { Utils.cancelUpgrade() })
          }else if(data.data.upgradeMethod == "popup"){
            EasyShowLD.dialogShow("Version Update", data.data.intr, "upgrade", "cancel", () => { Utils.doUpgrade(data.data.url,data.data.itmsservices, data.data.version) }, () => { Utils.cancelUpgrade() })
          }else if(data.data.upgradeMethod == "hint"){
            EasyShowLD.dialogShow("Version Update", data.data.intr, "upgrade", "cancel", () => { Utils.doUpgrade(data.data.url,data.data.itmsservices, data.data.version) }, () => { Utils.cancelUpgrade() })
          }else{
            EasyToast.show("It's the latest version");
          }
        }else{
          EasyToast.show("It's the latest version");
        }
      }
    })
  }

  _renderListItem() {
    return this.config.map((item, i) => {
      return (<Item key={i} {...item} />)
    })
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <LinearGradient colors={["#4F5162","#1E202C"]}  style={styles.linearout}>
          <View style={styles.outsource}>
            <View style={styles.headout}>
              <Text style={styles.headtext}>About Us</Text>
              <Image source={UImage.blue_logo} style={styles.headimg}/>
            </View>
            <View style={{flex: 3, paddingHorizontal: ScreenUtil.autowidth(10), justifyContent: 'space-around',}}>
              {this._renderListItem()}
            </View>
          </View>
          <Image source={UImage.set_logoB} style={styles.footpoho}/>
        </LinearGradient>

        <VersionUpdateView/>

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
  linearout: {
    width: ScreenWidth - ScreenUtil.autowidth(30),  
    height: ScreenHeight*0.7266, 
    marginTop: ScreenUtil.autoheight(10), 
    borderRadius: ScreenUtil.autowidth(10), 
    elevation: 10, 
    shadowRadius: 5, 
    shadowOpacity:0.06, 
    shadowColor: 'rgba(0, 0, 0, 1)', 
    shadowOffset:{height: 2,width: 0},
  },
  outsource: {
    flex: 1, 
    zIndex: 99,
    paddingHorizontal: ScreenUtil.autowidth(15), 
    paddingVertical: ScreenUtil.autoheight(20), 
  },
  headout: {
    flex: 1, 
    flexDirection: 'row', 
    paddingVertical: ScreenUtil.autoheight(40),
  },
  headtext: {
    flex: 1, 
    color: '#FFFFFF', 
    fontWeight:'bold', 
    fontSize: ScreenUtil.setSpText(36), 
    paddingLeft: ScreenUtil.autowidth(10),
  },
  headimg: {
    width: ScreenWidth*0.3, 
    height: (ScreenWidth*0.3)*1.1863,
  },

  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.0436,
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  }
});

export default Aboutus;
