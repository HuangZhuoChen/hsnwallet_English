import React from 'react';
import { StatusBar, View, Platform} from 'react-native';
import NavigationUtil from '../utils/NavigationUtil';
import UColor from '../utils/Colors'
import { Utils } from '../utils/Utils';
import Constants from '../utils/Constants';
import ScreenUtil from '../utils/ScreenUtil'
import { connect } from 'react-redux'
import JPush from '../utils/JPush'
import JPushModule from 'jpush-react-native'
import {AlertModal} from '../components/modals/AlertModal'
import DeviceInfo from 'react-native-device-info';

@connect(({ login }) => ({ ...login }))
class PreInitial extends React.Component {
  
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      //推送初始化
      const { navigate } = this.props.navigation;
      JPush.init(navigate);

      //获取用户信息
      var th = this;
      let loginUser =  await Utils.dispatchActiionData(this, {type:'login/loadStorage',payload:{ } });
      if(loginUser){
        let resp =  await Utils.dispatchActiionData(this, {type:'login/findUserInfo',payload:{ } });
        if(resp && resp.data){
          NavigationUtil.reset(th.props.navigation, 'Home');
        }else{
          NavigationUtil.reset(th.props.navigation, 'Login');
        }
      }else{
        NavigationUtil.reset(th.props.navigation, 'Login');
      }

      this.Fitphone();

      this.Testing();

    } catch (error) {
      console.log("Splash error: "+ JSON.stringify(error));
    }

  }

  Testing() {
    if(DeviceInfo.getVersion().indexOf('T') != -1){
      AlertModal.show('警告', '此版本为测试版本,切勿商用', '知道了')
    }
  }

  Fitphone(){
    if (Platform.OS == 'ios') {
      if(ScreenUtil.isIphoneX()){
        Constants.FitPhone = ScreenUtil.autoheight(35) //苹果X
      }else{
        Constants.FitPhone = ScreenUtil.autoheight(20) //苹果其他
      } 
    }else{
      Constants.FitPhone = ScreenUtil.autoheight(StatusBar.currentHeight) //全面屏
    }
  }
  
  render() {
    return (
      <View style={{backgroundColor: UColor.bgColor}}/>
    );
  }
}

export default PreInitial;