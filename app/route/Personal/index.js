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

@connect(({ login }) => ({ ...login }))
class Personal extends React.Component {

  static navigationOptions = {
    title: '个人信息',
    header: null, 
  };
  
  constructor(props) {
    super(props);
    this.state = {
      
    };
    this.config = [
      {itemHeight: ScreenUtil.autoheight(80), paddingHorizontal: ScreenUtil.autowidth(5), disable: true, spot: true, nameColor: '#FFFFFF', 
      name: "Profile Picture", photo: this.props.loginUser.partnerLevel?Constants.levelimg[this.props.loginUser.partnerLevel]:UImage.integral_bg },

      {itemHeight: ScreenUtil.autoheight(80), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, nameColor: '#FFFFFF', name: "Nick Name",  
      disable: true, subName: this.props.loginUser.nickName, onPress: this.goNicknam.bind(this) },

      {itemHeight: ScreenUtil.autoheight(80), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, nameColor: '#FFFFFF', name: "Team Name",  
      disable: true, subName: this.props.loginUser.teamName?this.props.loginUser.teamName:'set', onPress: this.goTeamname.bind(this) },
      
      {itemHeight: ScreenUtil.autoheight(80), paddingHorizontal: ScreenUtil.autowidth(5), spot: true, 
      disable: true, nameColor: '#FFFFFF', name: "Invitation Code", subName: this.props.loginUser.inviteCode, },
    ];
  }

  //组件加载完成
  async componentDidMount() {
    //获用户信息
    await Utils.dispatchActiionData(this, {type:'login/findUserInfo',payload:{ } });
  }

  //修改昵称
  goNicknam = () => {
    try {
      const { navigate } = this.props.navigation;
      navigate('ModifyNicknames', {});
    } catch (error) {
      
    }
  }

  //团队名称
  goTeamname () {
    try {
      if(this.props.loginUser && this.props.loginUser.teamName == null){
        const { navigate } = this.props.navigation;
        navigate('SetTeamname', {});
      }else{
        EasyToast.show("You have set the team name");
      }
    } catch (error) {
      
    }
  }
  
  //我的邀请码
  goInvitecode () {
    try {
      
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
            <View style={styles.headout}>
              <Text style={styles.headtext}>Information</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center',}}>
              {this._renderListItem()}
            </View>
          </View>
          <Image source={UImage.set_logo} style={styles.footpoho}/>
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
    paddingBottom: ScreenUtil.autoheight(20),
  },
  headout: {
    flexDirection: 'row', 
    paddingVertical: ScreenUtil.autoheight(40),
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
    height: (ScreenHeight/3) * 1.1672,
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  }
});

export default Personal;
