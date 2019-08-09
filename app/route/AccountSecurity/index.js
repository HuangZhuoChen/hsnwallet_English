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
import LinearGradient from 'react-native-linear-gradient'
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login, personal }) => ({ ...login, ...personal }))
class AccountSecurity extends React.Component {

  static navigationOptions = {
    title: '安全管理',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      
    };
    this.config = [
      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), nameColor: '#FFFFFF', spot: true, 
      disable: true, avatar: UImage.invitation_code, name: "Password", subName: "Change", onPress: this.goLoginPw.bind(this) },

      {itemHeight: ScreenUtil.autoheight(50), paddingHorizontal: ScreenUtil.autowidth(5), nameColor: '#FFFFFF', spot: true, disable: true,  
      avatar: UImage.membership_level, name: "Trading Password", subName: this.props.SetTradePW ? "Set" : "Not set", onPress: this.goSetTransaction.bind(this) },

      // {itemHeight: ScreenUtil.autoheight(50),paddingHorizontal: ScreenUtil.autowidth(5), nameColor: '#FFFFFF', spot: true, disable: true, 
      // avatar: UImage.help_center, name: "实名认证", subName:  this.props.authentication ? '已认证' : '未认证', onPress: this.goAuthentication.bind(this) },
    ];
  }

  componentDidMount() {
   
  }

  //修改登录密码
  goLoginPw () {
    try {
      const { navigate } = this.props.navigation;
      navigate('LoginPw', {});
    } catch (error) {
      
    }
  }

  //交易密码
  goSetTransaction = () => {
    try {
      if(this.props.SetTradePW){
        const { navigate } = this.props.navigation;
        navigate('ResetTransactionPw', {});
      }else{
        const { navigate } = this.props.navigation;
        navigate('SetTransactionPw', {});
      }
    } catch (error) {
      
    }
  }

  //实名认证
  goAuthentication () {
    try {
      if(!this.props.authentication){
        const { navigate } = this.props.navigation;
        navigate('Authentication', {});
      }
    } catch (error) {
      
    }
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
        <LinearGradient colors={["#4F5162","#1E202C"]} style={styles.linearout}>
          <View style={styles.outsource}>
            <TouchableOpacity style={styles.headout}>
              <Text style={styles.headtext}>Security</Text>
            </TouchableOpacity>
            <View style={{flex: 3, justifyContent: 'space-around', paddingVertical: ScreenUtil.autoheight(40),}}>
              {this._renderListItem()}
            </View>
          </View>
          <Image source={UImage.set_logoB} style={styles.footpoho}/>
        </LinearGradient>
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
    height: ScreenHeight*0.6403, 
    marginTop: ScreenUtil.autoheight(10), 
    borderRadius: ScreenUtil.autowidth(10), 
    elevation: 10, 
    shadowRadius: 5, 
    shadowOpacity: 0.06, 
    shadowColor: 'rgba(0, 0, 0, 1)', 
    shadowOffset:{height: 2,width: 0},
  },
  outsource: {
    flex: 1, 
    zIndex: 99,
    paddingHorizontal: ScreenUtil.autowidth(15), 
    paddingVertical: ScreenUtil.autoheight(40),
  },
  headout: {
    flexDirection: 'row', 
    paddingBottom: ScreenUtil.autoheight(40),
  },
  headtext: {
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },
  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.0436,
  },
});

export default AccountSecurity;
