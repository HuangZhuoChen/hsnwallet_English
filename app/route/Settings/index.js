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
import NavigationUtil from '../../utils/NavigationUtil';
import { EasyShowLD } from '../../components/EasyShow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import BaseComponent from "../../components/BaseComponent";
import AnalyticsUtil from '../../utils/AnalyticsUtil';
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
import codePush from 'react-native-code-push'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login }) => ({ ...login }))
class Setting extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      
    };
    this.config = [
      {itemHeight: ScreenUtil.autoheight(49), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', name: "My Wallet", onPress: this.goMyWallet.bind(this)},

      {itemHeight: ScreenUtil.autoheight(49), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', name: "My Node",  onPress: this.goMyNode.bind(this) },

      {itemHeight: ScreenUtil.autoheight(49), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', name: "My invitation Poster", onPress: this.goInvitecode.bind(this) },
      
      {itemHeight: ScreenUtil.autoheight(49), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', name: "Security", onPress: this.goSafety.bind(this) },
    ];
  }

  //组件加载完成
  async componentDidMount() {
    //获用户信息
    await Utils.dispatchActiionData(this, {type:'login/findUserInfo',payload:{ } });
    //获取实名认证信息
    await Utils.dispatchActiionData(this, {type:'personal/getfindauthentication',payload:{ } });
    //是否设置了交易密码
    await Utils.dispatchActiionData(this, {type:'personal/isSetTradePassword',payload:{ } });
  }

  _onPersonal () {
    try {
      const { navigate } = this.props.navigation;
      navigate('Personal', {});
    } catch (error) {
      
    }
  }

  //我的钱包
  async goMyWallet () {
    try {
      const { navigate } = this.props.navigation;
      navigate('Wallet', {});
    } catch (error) {
      
    }
  }

  //我的节点
  goMyNode () {
    try {
      const { navigate } = this.props.navigation;
      navigate('MyNode', {});
    } catch (error) {
      
    }
  }
  
  //我的邀请
  goInvitecode () {
    try {
      const { navigate } = this.props.navigation;
      navigate('InviteCode', {});
    } catch (error) {
      
    }
  }

  //安全中心
  goSafety () {
    try {
      const { navigate } = this.props.navigation;
      navigate('AccountSecurity', {});
    } catch (error) {
      
    }
  }

  //公告中心
  goAnnouncement () {
    try {
      const { navigate } = this.props.navigation;
      navigate('Announcement', {});
    } catch (error) {
      
    }
  }
  
  //规则说明
  goRuleClause () {
    try {
      const { navigate } = this.props.navigation;
      navigate('RuleClause', {wholeinvitation: 'whole'});
    } catch (error) {
      
    }
  }

  //关于我们
  goAboutus () {
    try {
      const { navigate } = this.props.navigation;
      navigate('Aboutus', {});
    } catch (error) {
      
    }
  }
 
  //退出登录
  async signout () {
    var th = this;
    let isOk = await AlertModal.showSync("提示", "您确定要退出登录？", "是", "否",);
    if(isOk){
      let resp = await Utils.dispatchActiionData(this, {type:'login/logout',payload:{} });
      if(resp){
        NavigationUtil.reset(th.props.navigation, 'Login');
        AnalyticsUtil.onEvent('Sign_out');
      }
    }
  }

  _renderListItem() {
    return this.config.map((item, i) => {
      return (<Item key={i} {...item} />)
    })
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, paddingTop: Constants.FitPhone+ScreenUtil.autoheight(20)}]}>
        <LinearGradient colors={["rgba(0, 208, 255, 0.9)","rgba(0, 102, 233, 0.9)"]}  style={styles.linearout}>
          <LinearGradient colors={["#4F5162","#1E202C"]} style={{ flex: 1, borderRadius: ScreenUtil.autowidth(10),}}>
            <View style={styles.outsource}>
              {/* 昵称、手机号码、头像 */}
              <TouchableOpacity activeOpacity={1} onPress={()=>{this.noDoublePress(()=>{this._onPersonal()})}} style={styles.headout}>
                <View style={styles.headleft}>
                  <Text style={styles.headlefttitle}>{this.props.loginUser?this.props.loginUser.nickName:""}</Text>
                  <Text style={styles.headlefttext}>{"TEL:" + (this.props.loginUser?this.props.loginUser.mobile:0)}</Text>
                </View>
                <View style={styles.headright}>
                  <Image source={(this.props.loginUser&&this.props.loginUser.partnerLevel)?Constants.levelimg[this.props.loginUser.partnerLevel]:UImage.integral_bg} style={styles.headrightimg}/>
                </View>
              </TouchableOpacity>
              {/* 我的钱包、我的节点、我的邀请海报、安全中心 */}
              <View style={{flex: 3, justifyContent: 'center',}}>
                {this._renderListItem()}
              </View>

              <View style={styles.footout}>
                <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goAnnouncement()})}} style={styles.footitem}>
                  <Image source={UImage.set_talk} style={{width: ScreenUtil.autowidth(16), height: ScreenUtil.autoheight(15),}}/>
                  <Text style={styles.footitemtext}>Announcement</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goRuleClause()})}} style={styles.footitem}>
                  <Image source={UImage.set_information} style={{width: ScreenUtil.autowidth(11), height: ScreenUtil.autoheight(14),}}/>
                  <Text style={styles.footitemtext}>Rules</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goAboutus()})}} style={styles.footitem}>
                  <Image source={UImage.set_about} style={{width: ScreenUtil.autowidth(14), height: ScreenUtil.autoheight(14),}}/>
                  <Text style={styles.footitemtext}>About Us</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image source={UImage.set_logo} style={styles.footpoho}/>
          </LinearGradient>
        </LinearGradient>
        <View style={styles.referout}>
          <TextButton onPress={()=>{this.noDoublePress(()=>{this.signout()})}} shadow={true} textColor='#FFFFFF' text={"Sign Out"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  linearout: {
    flex: 1, 
    width: ScreenWidth - ScreenUtil.autowidth(30),  
    borderRadius: ScreenUtil.autowidth(10), 
    padding: ScreenUtil.autowidth(0.5),
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
    paddingVertical: ScreenUtil.autoheight(18),
  },
  headleft: {
    flex: 1, 
    justifyContent: 'space-between',
    paddingRight: ScreenUtil.autowidth(15),
  },
  headlefttitle: {
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(30),
  },
  headlefttext: {
    color: '#FFFFFF', 
    fontWeight:'bold', 
    fontSize: ScreenUtil.setSpText(16),
    letterSpacing: ScreenUtil.autowidth(4),
  },
  headright: {
    width: ScreenUtil.autowidth(62), 
    height: ScreenUtil.autowidth(62), 
    marginVertical: ScreenUtil.autoheight(10), 
    backgroundColor: '#FFFFFF', 
    padding: ScreenUtil.autowidth(1), 
    borderRadius: ScreenUtil.autowidth(30),
  },
  headrightimg: {
    width: ScreenUtil.autowidth(60), 
    height: ScreenUtil.autowidth(60), 
    borderRadius: ScreenUtil.autowidth(30),
  },

  footout: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: ScreenUtil.autoheight(10),
  },
  footitem: {
    flex: 1, 
    alignItems: 'center',
    flexDirection: 'column', 
  },
  footitemtext: {
    color: '#FFFFFF', 
    fontSize: ScreenUtil.setSpText(12),
    paddingTop: ScreenUtil.autoheight(10),
  },
  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.1672,
  },
  referout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ScreenUtil.autoheight(28), 
    paddingBottom: ScreenUtil.autoheight(35),
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  }
});

export default Setting;
