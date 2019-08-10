import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View, Text, TextInput, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import { kapimg } from '../../utils/Api'
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
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
var tick=60;
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login }) => ({ ...login }))
class LoginPw extends BaseComponent {

  static navigationOptions = {
    title: '修改登录密码',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      usedpassword:"",
      usedpasswordSize: 16,
      usedpasswordPlaceholder:'Old Password',

      codeImg: "",
      codeImgSize: 16,
      codeImgPlaceholder:"Graphic Code",

      password:"",
      passwordSize: 16,
      passwordPlaceholder:'New Password',

      againpassword:"",
      againpasswordSize: 16,
      againpasswordPlaceholder:'Confirm Password',
      code:"",
      codeSize: 16,
      codePlaceholder:'Verification Code',
      
      uuid: '',
      capture:'Verification Code',
      captureState: false,
    };
  }

  //组件加载完成
  componentDidMount() {
    this.refreshImage();
  }

  componentWillUnmount(){
    //结束页面前，资源释放操作
    super.componentWillUnmount();
  }

  async kcaptrue () {
    if(this.state.usedpassword==""){
      EasyToast.show('Please enter the old password');
      return;
    }
    if(this.state.codeImg == ""){
      EasyToast.show('Please enter the Graphic Verification Code');
      return;
    }
    if(this.state.usedpassword.length < Constants.PWD_MIN_LENGTH){
      EasyToast.show('Password length at least 6 bits, please retry');
      return;
    }
    if(this.state.captureState){
      return;
    }
    let resp = await Utils.dispatchActiionData(this, {type:'login/sendVerify', 
      payload:{
        mobile: Utils.encryptedMsg(this.props.mobile), 
        type: 'reset', 
      } 
    });
    if(resp){
      EasyToast.show("Verification code has been sent. Please check it carefully.");
      this.setState({ capture: "60s", captureState: true });
      this.doTick();
    }
  }

  doTick = () =>{
    var th = this;
    var ct = 60;
    var thInter = setInterval(()=>{
      if(ct>0){
        ct--;
        th.setState({capture:ct+"s", captureState: true});
      }else {
        clearInterval(thInter);
        th.setState({capture:"Verification Code", captureState: false});
      }
    },1000);
  }

  regSubmit = () =>{
    if(this.state.usedpassword==""){
      EasyToast.show('Please enter the old password');
      return;
    }
    if(this.state.codeImg == ""){
      EasyToast.show('Please enter the Graphic Verification Code');
      return;
    }
    if(this.state.code==""){
      EasyToast.show('Please enter the verification code');
      return;
    }
    if(this.state.password==""){
      EasyToast.show('Please enter a new password');
      return;
    }
    if(this.state.againpassword==""){
      EasyToast.show('Please enter the new password again');
      return;
    }
    if(this.state.password != this.state.againpassword){
      EasyToast.show('Inconsistent passwords');
      return;
    }
    if(this.state.usedpassword.length < Constants.PWD_MIN_LENGTH || this.state.password.length < Constants.PWD_MIN_LENGTH
      || this.state.againpassword.length < Constants.PWD_MIN_LENGTH){
      EasyToast.show('Password length at least 6 bits, please retry');
      return;
    }
    this.onchangePwd();
  }

  async onchangePwd () {
    EasyShowLD.loadingShow('Modification in progress');
    let resp = await Utils.dispatchActiionData(this, {type:'login/changePwd',
      payload:{
        oldPassword: Utils.encryptedMsg(this.state.usedpassword), 
        code:this.state.code, 
        newPassword:Utils.encryptedMsg(this.state.password), 
        confirmNewPassword: Utils.encryptedMsg(this.state.againpassword),
        uuid: this.state.uuid,
        imgcode: this.state.codeImg
      } 
    });
    if(resp){
      EasyShowLD.loadingClose();
      this.refreshImage();
      if(resp.code==0){
        EasyToast.show("Successful modification, please login again");
        Utils.pop(this, 3, true);
        NavigationUtil.reset(this.props.navigation, 'Login');
      }else{
        EasyToast.show(resp.msg);
      }
    }
  }

  refreshImage () {
    this.setState({
      uuid: Math.ceil(Math.random()*10000000000)
    })
  }

  loaderror = () =>{
    EasyToast.show('Failed to obtain graphics authentication code, please check the network！');
  }

  clearFoucs = () =>{
    this._rupassword.blur();
    this._lcodeImg.blur();
    this._rpass.blur();
    this._rnewpass.blur();
    this._rcode.blur();
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
          <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
              <LinearGradient colors={["#4F5162","#1E202C"]}  style={styles.linearout} >
                <View style={styles.outsource}>
                  <View style={styles.headout}>
                    <Text style={styles.headtext}>Change Login Password</Text>
                  </View>
                  <View style={styles.inptout}>
                    <TextInput ref={(ref) => this._rupassword = ref} 
                      autoFocus={false}
                      value={this.state.usedpassword} 
                      placeholderTextColor={UColor.lightgray}  
                      selectionColor={UColor.tintColor} 
                      onFocus={()=>{this.setState({usedpasswordSize:32,usedpasswordPlaceholder:''})}}
                      onBlur={()=>{this.state.usedpassword?"":this.setState({usedpasswordSize:16,usedpasswordPlaceholder:'Old Password'})}}
                      style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.usedpasswordSize),}]}
                      placeholder={this.state.usedpasswordPlaceholder}
                      underlineColorAndroid="transparent" 
                      secureTextEntry={true} 
                      returnKeyType="next"
                      maxLength={Constants.PWD_MAX_LENGTH} 
                      onChangeText={(usedpassword) => this.setState({usedpassword})} 
                    />

                    <View style={{flexDirection: 'row', alignItems: 'center', }}>
                      <TextInput ref={(ref) => this._lcodeImg = ref} 
                        returnKeyType="next"
                        autoFocus={false}
                        onFocus={()=>{ this.setState({codeImgSize:32,codeImgPlaceholder:''})}} 
                        onBlur={()=>{ this.state.codeImg?"":this.setState({codeImgSize:16,codeImgPlaceholder:'Graphic Code'})}}
                        value={this.state.codeImg} 
                        placeholder={this.state.codeImgPlaceholder}
                        selectionColor={UColor.tintColor} 
                        placeholderTextColor={UColor.lightgray}
                        style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.codeImgSize)}]}
                        underlineColorAndroid="transparent" 
                        maxLength={Constants.Code_Moide} 
                        onChangeText={(codeImg) => this.setState({ codeImg })} 
                      />
                      <Image onError={(e)=>{this.loaderror()}} style={styles.codeimg} source={{uri: Constants.defaultrootaddr + kapimg + "?uuid=" + this.state.uuid}} />
                      <TouchableOpacity onPress={()=>{this.refreshImage()}}>
                        <Image style={styles.refreshimg} source={UImage.icon_refresh} resizeMode="contain"/>
                      </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', }} >
                      <TextInput ref={(ref) => this._rcode = ref} 
                        value={this.state.code} 
                        placeholderTextColor={UColor.lightgray}    
                        selectionColor={UColor.tintColor} 
                        returnKeyType="next" 
                        onFocus={()=>{this.setState({codeSize:32,codePlaceholder:''})}}
                        onBlur={()=>{this.state.code?"":this.setState({codeSize:16,codePlaceholder:'Verification Code'})}}
                        style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.codeSize),}]}
                        placeholder={this.state.codePlaceholder}
                        underlineColorAndroid="transparent" 
                        keyboardType="phone-pad" 
                        maxLength={Constants.Code_Moide} 
                        onChangeText={(code) => this.setState({code})} 
                      />
                      <TouchableOpacity style={styles.btnoutsource} onPress={()=>{this.noDoublePress(()=>{this.kcaptrue()})}}>
                        <LinearGradient colors={this.state.captureState ? ["rgba(255, 255, 255, 1)","rgba(255, 255, 255, 0.4)"] : ["#FF0A2F","#FFD083"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btnout}>
                          <Text style={styles.btntext}>{this.state.capture}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <TextInput ref={(ref) => this._rpass = ref} 
                      autoFocus={false}
                      value={this.state.password} 
                      placeholderTextColor={UColor.lightgray}   
                      selectionColor={UColor.tintColor} 
                      onFocus={()=>{this.setState({passwordSize:32,passwordPlaceholder:''})}}
                      onBlur={()=>{this.state.password?"":this.setState({passwordSize:16,passwordPlaceholder:'New Password'})}}
                      style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.passwordSize),}]}
                      placeholder={this.state.passwordPlaceholder}
                      underlineColorAndroid="transparent" 
                      secureTextEntry={true} 
                      returnKeyType="next"  
                      maxLength={Constants.PWD_MAX_LENGTH}
                      onChangeText={(password) => this.setState({password})} 
                    />

                    <TextInput ref={(ref) => this._rnewpass = ref} 
                      autoFocus={false}
                      value={this.state.againpassword} 
                      placeholderTextColor={UColor.lightgray}  
                      selectionColor={UColor.tintColor} 
                      onFocus={()=>{this.setState({againpasswordSize:32,againpasswordPlaceholder:''})}}
                      onBlur={()=>{this.state.againpassword?"":this.setState({againpasswordSize:16,againpasswordPlaceholder:'Confirm Password'})}}
                      style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.againpasswordSize),}]}
                      placeholder={this.state.againpasswordPlaceholder}
                      underlineColorAndroid="transparent" 
                      secureTextEntry={true} 
                      returnKeyType="go"  
                      maxLength={Constants.PWD_MAX_LENGTH}
                      onSubmitEditing={() => this.regSubmit()}
                      onChangeText={(againpassword) => this.setState({againpassword})} 
                    />
                  </View>
                </View>
                <Image source={UImage.set_logoB} style={styles.footpoho}/>
              </LinearGradient>
              <Text style={styles.explaintext}>Notice：6~12 characters(upper letters+digits+symbols)</Text>
              <View style={styles.referout}>
                <TextButton onPress={()=>{this.noDoublePress(()=>{this.regSubmit()})}}  shadow={true} textColor='#FFFFFF' text={"Reset Password"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  linearout: { 
    width: ScreenWidth - ScreenUtil.autowidth(30),  
    height: ScreenHeight*0.6403, 
    margin: ScreenUtil.autowidth(15),
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
    flex: 1, 
    flexDirection: 'row', 
    paddingTop: ScreenUtil.autoheight(40),
  },
  headtext: {
    color: '#FFFFFF', 
    fontSize: ScreenUtil.setSpText(28),
  },
  inptout: {
    flex: 4, 
    justifyContent: 'space-around',
    paddingHorizontal: ScreenUtil.autowidth(15), 
  },
  textinpt: {
    color: '#FFFFFF',
    paddingVertical:  ScreenUtil.autoheight(6),
  },

  btnoutsource: {
    alignItems: 'center',
    justifyContent: "flex-end",
    paddingBottom:  ScreenUtil.autoheight(3),
  },
  btnout: {
    width: ScreenUtil.autowidth(110),
    height: ScreenUtil.autoheight(25),
    borderRadius: ScreenUtil.autowidth(23),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0DA3DF',
  },
  btntext: {
    color: '#222330',
    fontSize: ScreenUtil.setSpText(12),
  },

  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.0436,
  },

  explaintext: {
    color: '#FF8C00', 
    fontSize: ScreenUtil.setSpText(12),
    paddingLeft: ScreenUtil.autowidth(40),
  },

  referout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ScreenUtil.autoheight(28), 
    paddingBottom: ScreenUtil.autoheight(35),
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(40),
    borderRadius: ScreenUtil.autowidth(23), 
  },

  codeimg: {
    width: ScreenUtil.autowidth(100),
    height: ScreenUtil.autowidth(30), 
    marginHorizontal: ScreenUtil.autowidth(10),
  },
  refreshimg: {
    width: ScreenUtil.autowidth(20), 
    height: ScreenUtil.autowidth(20), 
    margin: ScreenUtil.autoheight(5),
  },
});

export default LoginPw;
