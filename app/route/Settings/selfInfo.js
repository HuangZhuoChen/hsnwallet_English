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
  // 我的钱包
  goMyWallet() {
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

  _renderHeader = () => {
    return (
      <>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <LinearGradient colors={["#4F5162", "#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.5 }} style={ styles.person }>
          <Image source={ UImage.integral_bg } style={{ width: ScreenUtil.autoheight(60), height: ScreenUtil.autoheight(60) }} />
          <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginVertical: ScreenUtil.autoheight(11) }}>Nick Name：cisay</Text>
          <Text style={{ fontSize: ScreenUtil.setSpText(15), color: '#fff' }}>Email : 8976127328@qq.com</Text>
          <View style={{ height: ScreenUtil.autoheight(250), justifyContent: 'center' }}>
            {this._renderListItem()}
          </View>
          <Image source={UImage.set_logo} style={styles.footerBg}/>
        </LinearGradient>
        <View style={{ height: ScreenUtil.autoheight(45), alignItems: 'center', marginTop: ScreenUtil.autoheight(35) }}>
          <TextButton shadow={ true } text="Sign Out" style={{ width: ScreenUtil.autowidth(230), borderRadius: ScreenUtil.autoheight(45) / 2 }} />
        </View>
      </>
    )
  }

  _renderListItem = () => {
    return this.config.map((item, i) => {
      return (<Item key={i} {...item} />)
    })
  }

  render() {
    return (
      <View style={ styles.container }>
        <FlatList
          style={{ flex: 1 }}
          ListHeaderComponent={this._renderHeader()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item ,index) => "index"+index+item}
        />
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
    height: ScreenUtil.autoheight(340),
    borderRadius: ScreenUtil.autowidth(10),
    paddingTop: ScreenUtil.autoheight(30),
    paddingBottom: ScreenUtil.autoheight(160),
    paddingHorizontal: ScreenUtil.autowidth(25)
  },

  footerBg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
    width: ScreenHeight / 3, 
    height: (ScreenHeight / 3) * 1.1672,
  }
});

export default SelfInfo;
