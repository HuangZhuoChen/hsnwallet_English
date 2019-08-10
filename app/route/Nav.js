import moment from 'moment';
import React from 'react';
import { Animated, AppState, BackHandler, DeviceEventEmitter, Dimensions, Easing, Image, NativeModules, NetInfo, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,NativeEventEmitter } from 'react-native';
import CodePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import Upgrade from 'react-native-upgrade-android';
import { StackNavigator, TabNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { connect } from 'react-redux';
import { EasyShowLD } from "../components/EasyShow";
import { AlertModalView,AlertModal } from '../components/modals/AlertModal';
import { AlertModalExView } from '../components/modals/AlertModalEx';
import { CodeModalView } from '../components/modals/CodeModal';
import { EasyToast } from "../components/Toast";
import UColor from '../utils/Colors';
import Constants from '../utils/Constants';
import UImage from '../utils/Img';
import ScreenUtil from '../utils/ScreenUtil';
import Security from '../utils/Security';
import PreInitial from './PreInitial';
import Web from './Web';
import { Utils } from '../utils/Utils';
import DeviceInfo from 'react-native-device-info';

import AccountSecurity from './AccountSecurity';
import Authentication from './AccountSecurity/Authentication';
import ForgetTransactionPw from './AccountSecurity/ForgetTransactionPw';
import ResetTransactionPw from './AccountSecurity/ResetTransactionPw'; 
import SetTransactionPw from './AccountSecurity/SetTransactionPw';

import Home from './Home';

import Login from './Login';
import LoginPw from './Login/LoginPw';  
import Forget from './Login/Forget';
import Register from './Login/Register';

import Myinvitation from './Myinvitation';

import Nodeapplication from './Nodeapplication';

import Personal from './Personal';
import ModifyNicknames from './Personal/ModifyNicknames'; 
import SetTeamname from './Personal/SetTeamname'; 

import Settings from './Settings'; 
import Aboutus from './Settings/Aboutus'; 
import Announcement from './Settings/Announcement';
import InviteCode from './Settings/InviteCode';  
import MyNode from './Settings/MyNode';  
import NodeDetailed from './Settings/NodeDetailed'; 
import RuleClause from './Settings/RuleClause'; 

import Wallet from './Wallet';   
import AddingInStationContacts from './Wallet/AddingInStationContacts';
import AssetInfo from './Wallet/AssetInfo'; 
import InStationTransfer from './Wallet/InStationTransfer'; 
import Recharge from './Wallet/Recharge';   
import StationContacts from './Wallet/StationContacts';
import Withdraw from './Wallet/Withdraw';
import address from './Wallet/address';
import NewAddress from './Wallet/NewAddress';

require('moment/locale/zh-cn');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var WeChat = require('react-native-wechat');

let routeLength = 0;
@connect(({ common, login }) => ({ ...common, ...login }))
class Route extends React.Component {

  static navigationOptions = {
    title: "",
    header:null,
  };

  state = {
      
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentDidMount() {
    try {
      //关闭欢迎页
      setTimeout(() => {
        SplashScreen.hide();
        //APK更新
        Utils.initUpgrade();
        //升级
        this.props.dispatch({ type: 'common/upgradeApp', payload: { os: DeviceInfo.getSystemName(), version:  Constants.version},
          callback: (data) => {
            if (data && data.code == 0) {
              if (data.data.upgradeMethod == "force") {
                EasyShowLD.dialogShow("Version Update", data.data.intr, "upgrade", null, () => { Utils.doUpgrade(data.data.url,data.data.itmsservices, data.data.version) }, () => { Utils.cancelUpgrade() })
              }else if(data.data.upgradeMethod == "popup"){
                // 这段逻辑主要目的：如果是非强制更新只弹出一次弹框，另外取消升级时要显示小红点
                this.props.dispatch({ type: 'common/getAppVersion', payload: {}, 
                  callback: (appVersion) => {
                    if(!appVersion || appVersion != data.data.version){
                      // EasyShowLD.dialogShow("版本更新", data.data.intr, "升级", "取消", () => { 
                      //   Utils.doUpgrade(data.data.url,data.data.itmsservices, data.data.version) 
                      // }, () => {
                      //   console.log(Utils)
                      //   Utils.cancelUpgrade() 
                      // })
                      // this.props.dispatch({ type: 'common/saveAppVersion', payload: {appVersion: data.data.version}}); //保存更新的版本号到本地，让更新框只弹一次
                    }else{
                      Constants.promptUpgrade= true; 
                    }
                  }
                });
              }else if(data.data.upgradeMethod == "hint"){
                Constants.promptUpgrade= true;
              }
            }else{
              console.log("It's the latest version");
              //新公告弹出框
              this.props.dispatch({ type: 'common/getNewAnnouncement', payload: { },
                callback: (data) => {
                  this.props.dispatch({ type: 'common/getNoticeId', payload: {}, 
                    callback: (NoticeId) => {
                      if(!NoticeId || NoticeId != data.id){
                        let content = (<View>
                          <Text style={{color:'#323232',fontSize:ScreenUtil.setSpText(15),paddingBottom:ScreenUtil.autoheight(10)}}>{data.title}</Text>
                          <Text style={{color:'#808080',fontSize:ScreenUtil.setSpText(14),lineHeight:ScreenUtil.autoheight(21)}}>{data.content}</Text>
                        </View>);
                        AlertModal.show("Latest Announcement", content, 'No more prompts')
                        this.props.dispatch({ type: 'common/saveNoticeId', payload: {NoticeId: data.id}}); //保存公告ID到本地，让公告框只弹一次
                      }
                    }
                  });
                }
              })
            }
          }
        })
      }, 1000);

      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    
      NetInfo.isConnected.fetch().then(isConnected => {
        Constants.isNetWorkOffline = !isConnected;
      });

      NetInfo.isConnected.addEventListener('connectionChange',this.handleConnectivityChange);

    } catch (error) {
      console.log("Route error: " + JSON.stringify(error));
    }
  }

  //Dapp分享关闭
  dimss = () => {
    window.currentDialog = null;
    Animated.parallel([
      Animated.timing(this.state.DapptransformY,{
          toValue: 200,
          duration: 400,
          easing: Easing.linear,
        }
      ),
    ]).start(() => {
      this.setState({showDappShare:false});
    });
  }

  handleConnectivityChange(isConnected){
    Constants.isNetWorkOffline = !isConnected;
  }

  /**
   *
   * @param {*} installImmediate 是否立即更新, true： 立即重启应用进行安装  false： 退出应用再进入后进行安装
   * @memberof Route
   */
  downloadUpdate(){
    CodePush.disallowRestart();
    CodePush.sync(
      { installMode: CodePush.InstallMode.IMMEDIATE },
      syncStatus => {
        switch (syncStatus) {
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                CodePush.notifyAppReady();
                break;
        }
      }
    )
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid = (navigator) => {
    if (routeLength == 1) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        BackHandler.exitApp();
        return false;
      }
      //返回，关闭弹框
      if(window.currentDialog){
        window.currentDialog.dimss();
        return true;
      }
      this.lastBackPressed = Date.now();
      EasyToast.show('Press once more to exit the application');
      return true;
    } else {
      return false;
    }
  };
 
  switchRoute = (prevNav, nav, action) => {
    //切换到我的邀请，检查是否设置团队名称
    if (action && action.routeName && action.routeName == "Myinvitation") {
      if (this.props.loginUser) {
        this.props.dispatch({ type: "login/findUserInfo", payload: { } });
      }
    }
    //关闭loading显示,防止进入下一页面，上一个页面的loading显示还在
    // if(action && action.routeName){
    //   EasyShowLD.switchRoute();
    //   EasyToast.switchRoute();
    // }
  }

  render() {
    return (<View style={{ flex: 1 }}>
      <Nav ref="nav" onNavigationStateChange={(prevNav, nav, action) => { this.switchRoute(prevNav, nav, action) }} />
      <AlertModalView />
      <AlertModalExView />
      <CodeModalView />
    </View>)
  }
}

const styles = StyleSheet.create({

})

var TabContainer = TabNavigator(
  {
    Home: { 
       screen: Home ,
       navigationOptions : {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused}) => (
          <Image resizeMode='contain' source={focused ? UImage.tab_1_h : UImage.tab_1} style={{width: ScreenUtil.autowidth(18), height: ScreenUtil.autowidth(18)}}/>
        ),
        header: null,
      }
    },
    Nodeapplication: { 
      screen: Nodeapplication,
      navigationOptions : {
        header: null, 
        tabBarLabel: 'Guardian',
        tabBarIcon: ({ focused}) => (
          <Image resizeMode='stretch'
              source={focused ? UImage.tab_2_h : UImage.tab_2} style={{width: ScreenUtil.autowidth(18), height: ScreenUtil.autowidth(18)}}
          />
        ),
      } 
    },
    Myinvitation: { 
      screen: Myinvitation,
      navigationOptions : {
        tabBarLabel: 'My invitation',
        tabBarIcon: ({ focused}) => (
          <Image resizeMode='contain' source={focused ? UImage.tab_3_h : UImage.tab_3} style={{width: ScreenUtil.autowidth(18), height: ScreenUtil.autowidth(18)}}/>
        ),
        header: null,
      }
    },
    Settings: { 
       screen: Settings,
       navigationOptions : {
        header:null,
        tabBarLabel: 'My Wallet', 
        tabBarIcon: ({ focused}) => (
          <Image resizeMode='contain' source={focused ? UImage.tab_4_h : UImage.tab_4} style={{width: ScreenUtil.autowidth(18), height: ScreenUtil.autowidth(18)}}/>
        ),
      }
    }
  },
  {
    initialRouteName: "Nodeapplication", // 默认页面组件
    lazy: true,
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    animationEnabled: false, // 切换页面时是否有动画效果
    tabBarOptions: {
      activeTintColor: '#FFFFFF', // 文字和图片选中颜色
      inactiveTintColor: '#727272', // 文字和图片未选中颜色
      showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
      showLabel: true,
      upperCaseLabel: false,
      style: { // TabBar
        height: ScreenUtil.autowidth(50),
        backgroundColor: '#11111B', // tab背景色
        borderBottomWidth: 0,
        padding: (Platform.OS == 'ios') ? 0 : ScreenUtil.autowidth(3),
      },
      labelStyle: { // 文字
        fontSize: ScreenUtil.setSpText(10),
        margin: 0,
      },
      indicatorStyle: { // 如TabBar下面显示有一条线，可以设高度为0后隐藏
        opacity: 0
      },
      tabStyle: {
        padding: 0,
        margin: 0,
        paddingTop: (Platform.OS == 'ios') ? ScreenUtil.autowidth(4) : ScreenUtil.autowidth(2),
        paddingBottom: (Platform.OS == 'ios') ? ScreenUtil.autowidth(4) : ScreenUtil.autowidth(2),
      }
    }
  }
);

const Nav = StackNavigator(
  {
    PreInitial: {
      screen: PreInitial
    },
    Home: {
      screen: TabContainer,
    },
    Web: {
      screen: Web
    },
  
    AccountSecurity: {
      screen: AccountSecurity
    },
    Authentication: {
      screen: Authentication
    },
    ForgetTransactionPw: {
      screen: ForgetTransactionPw
    },
    ResetTransactionPw: {
      screen: ResetTransactionPw
    },
    SetTransactionPw: {
      screen: SetTransactionPw
    },

    Login: { 
      screen: Login ,
    },
    LoginPw: {
      screen: LoginPw
    },
    Forget: {
      screen: Forget
    },
    Register: {
      screen: Register
    },
    Route: {
      screen: Route
    },
  
    Personal: {
      screen: Personal
    },
    ModifyNicknames: {
      screen: ModifyNicknames
    },
    SetTeamname: {
      screen: SetTeamname
    },

    Settings: {
      screen: Settings
    },
    Aboutus: {
      screen: Aboutus
    },
    Announcement: {
      screen: Announcement
    },
    InviteCode: {
      screen: InviteCode
    },
    MyNode: {
      screen: MyNode
    },
    NodeDetailed: {
      screen: NodeDetailed
    },
    RuleClause: {
      screen: RuleClause
    },
  
    Wallet: {
      screen: Wallet
    },
    AddingInStationContacts: {
      screen: AddingInStationContacts
    },
    AssetInfo: {
      screen: AssetInfo
    },
    InStationTransfer: {
      screen: InStationTransfer
    },
    Recharge: {
      screen: Recharge
    },
    StationContacts: {
      screen: StationContacts
    },
    Withdraw: {
      screen: Withdraw
    },
    address: {
      screen:address
    },
    NewAddress: {
      screen:NewAddress
    }
  },
  {
    navigationOptions: () => ({
      swipeEnabled: true, 
      animationEnabled: true,
      gesturesEnabled: Constants.gesturesEnabled,
      headerTitleStyle: {
        fontWeight: 'normal',
        color: UColor.fontColor,
        fontSize: 18,
        alignSelf: 'center'
      },
      headerBackTitle: null,
      headerBackTitleStyle: {
        color: UColor.fontColor
      },
      headerTintColor: UColor.fontColor,
      headerStyle: {
        backgroundColor: UColor.bgColor,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        height: (Platform.OS == 'ios') ? 49 : 72,
        paddingTop: (Platform.OS == 'ios') ? 0 : 18
      },
      headerRight: (
        <View style={{ height: 44, width: 55, justifyContent: 'center', paddingRight: 15 }} />
      ),
    }),
    mode: 'card',
    headerMode: 'screen',
    cardStyle: { backgroundColor: UColor.fontColor },
    transitionConfig: (() => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.linear(),
        timing: Animated.timing,
      },
      screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    })),
    onTransitionStart: (() => {
      //console.log('页面跳转动画开始');
    }),
    onTransitionEnd: (() => {
      //console.log('页面跳转动画结束');
    }),
  }
);

let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL};
Route = CodePush(codePushOptions)(Route);

export default Route;
