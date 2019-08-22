import React, { Fragment } from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, ScrollView, View, Text, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground, TouchableNativeFeedback} from 'react-native';
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
class SelfInfo extends BaseComponent {
  static navigationOptions = {
    title: '',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      
    }
    this.config = [
      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', name: "Information", onPress: this.goPerson.bind(this)},

      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', bgColor: 'teal', name: "Security",  onPress: this.goSafety.bind(this) },

      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', name: "Announcement", onPress: this.goAnnouncement.bind(this) },
      
      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: false, nameColor: '#FFFFFF', name: "Rules", onPress: this.goRuleClause.bind(this) },

      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
        disable: false, nameColor: '#FFFFFF', name: "About Us", onPress: this.goAboutus.bind(this) },
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
  // 个人信息
  goPerson () {
    try {
      const { navigate } = this.props.navigation;
      navigate('Personal', {});
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
    let isOk = await AlertModal.showSync("Tips", "Are you sure you want to log out?", "Confirm", "Cancel",);
    if(isOk){
      let resp = await Utils.dispatchActiionData(this, {type:'login/logout',payload:{} });
      if(resp){
        NavigationUtil.reset(th.props.navigation, 'Login');
        AnalyticsUtil.onEvent('Sign_out');
      }
    }
  }

  _renderListItem = () => {
    return this.config.map((item, i) => {
      return (<Item key={i} {...item} />)
    })
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
          <LinearGradient colors={["#4F5162", "#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.5 }} style={ styles.person }>
            <Image source={ UImage.integral_bg } style={{ width: ScreenUtil.autoheight(60), height: ScreenUtil.autoheight(60) }} />
            <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginVertical: ScreenUtil.autoheight(11) }}>Nick Name：cisay</Text>
            <Text style={{ fontSize: ScreenUtil.setSpText(15), color: '#fff' }}>Email : 8976127328@qq.com</Text>
            <View style={{ marginTop: ScreenUtil.autoheight(20) }}>
              { this._renderListItem() }
            </View>
            <View style={styles.footerBg} pointerEvents='none'>
              <Image source={UImage.set_logo} style={{width: ScreenHeight / 3, height: ScreenHeight / 3 * 1.1672}}/>
            </View>
          </LinearGradient>
          <View style={{ height: ScreenUtil.autoheight(45), alignItems: 'center', marginTop: ScreenUtil.autoheight(35), marginBottom: ScreenUtil.autoheight(79) }}>
            <TextButton onPress={ () => { this.noDoublePress(() => this.signout()) } } shadow={ true } text="Sign Out" textColor="#fff" style={{ width: ScreenUtil.autowidth(230), borderRadius: ScreenUtil.autoheight(45) / 2 }} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UColor.bgColor,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  person: {
    width: ScreenUtil.autowidth(340),
    borderRadius: ScreenUtil.autowidth(10),
    paddingTop: ScreenUtil.autoheight(30),
    paddingBottom: ScreenUtil.autoheight(40),
    paddingHorizontal: ScreenUtil.autowidth(25)
  },

  listStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    lineHeight: ScreenUtil.autoheight(50),
    paddingHorizontal: ScreenUtil.autowidth(5)
  },

  footerBg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0
  }
});

export default SelfInfo;
