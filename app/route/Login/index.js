import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, Platform, Image, ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import UImage from '../../utils/Img';
import UColor from '../../utils/Colors'
import { kapimg } from '../../utils/Api'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import {Utils} from '../../utils/Utils';
import NavigationUtil from '../../utils/NavigationUtil';
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import AnalyticsUtil from '../../utils/AnalyticsUtil';
import { EasyShowLD } from "../../components/EasyShow"
import BaseComponent from "../../components/BaseComponent";
import LinearGradient from 'react-native-linear-gradient'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
var tick = 60;

@connect(({ login }) => ({ ...login }))
class Login extends BaseComponent {

  static navigationOptions = {
    title: '登录',
    header:null,
  };

  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      capture: 'Receive Code',
      captureState: false,

      loginPhone: "",
      phoneSize:16,
      phonePlaceholder:"Input Email Code",

      codeImg: "",
      codeImgSize: 16,
      codeImgPlaceholder:"Input Graphic Code",

      checkCode:"", //邮箱验证码
      codeSize:16,
      codePlaceholder:"Input Verification Code",

      loginPwd: "",
      passwordSize:16,
      passwordPlaceholder:"Password",
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
    if(this.state.loginPhone==""){
      EasyToast.show('Please enter your mail number');
      return;
    }
    if(this.state.loginPhone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    if(this.state.codeImg == ""){
      EasyToast.show('Please enter the Graphic Verification Code');
      return;
    }
    if(this.state.captureState){
      return;
    }
    let resp = await Utils.dispatchActiionData(this, {type:'login/sendVerify', 
      payload:{
        mobile: Utils.encryptedMsg(this.state.loginPhone), 
        type: 'login', 
      } 
    });
    if(resp){
      EasyToast.show("Verification code has been sent. Please check it carefully.");
      this.setState({ capture: "60s", captureState: true });
      this.doTick();
    }
  }

  doTick = () => {
    var th = this;
    setTimeout(function () {
      if (tick == 0) {
        tick = 60;
        th.setState({ capture: "Receive Code", captureState: false });
      } else {
        tick--;
        th.setState({ capture: tick + "s", captureState: true })
        th.doTick();
      }
    }, 1000);
  }

  loginKcaptrue = () => {
    if (this.state.loginPhone == "") {
      EasyToast.show('Please enter your email number');
      return;
    }
    if(this.state.loginPhone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    if(this.state.codeImg == ""){
      EasyToast.show('Please enter the Graphic Verification Code');
      return;
    }
    if(this.state.checkCode == ""){
      EasyToast.show('Please enter the verification code.');
      return;
    }
    if (this.state.loginPwd == "" || this.state.loginPwd.length < Constants.PWD_MIN_LENGTH) {
      EasyToast.show('Password length at least 6 bits, please retry');
      return;
    }
    this.loginSubmit();
  }

  async loginSubmit () {
    EasyShowLD.loadingShow('Login in...');
    let resp = await Utils.dispatchActiionData(this, {type:'login/login',
      payload:{
        mobile: Utils.encryptedMsg(this.state.loginPhone), 
        code: this.state.checkCode,
        password: Utils.encryptedMsg(this.state.loginPwd), 
        uuid: this.state.uuid,
        imgcode: this.state.codeImg
      } 
    });
    if(resp){
      EasyShowLD.dialogClose();
      this.refreshImage();
      if(resp.code == 0){
        EasyToast.show("Successful login");
        NavigationUtil.reset(this.props.navigation, 'Home');
        AnalyticsUtil.onEvent('Sign_inok');
      }else{
        EasyToast.show(resp.msg);
      }
    }
  }

  forget = () => {
    const { navigate } = this.props.navigation;
    navigate('Forget');
  }

  regSubmit () {
    const { navigate } = this.props.navigation;
    navigate('Register', {});
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
    this._lphone.blur();
    this._lcodeImg.blur();
    this._lpass.blur();
    this._lcode.blur();
  }

  render() {
    return (
      <View style={[styles.container,{paddingTop: Constants.FitPhone}]}>
        <Image source={UImage.login_bg_blue} style={[styles.blueLogo,{top: Constants.FitPhone,}]}/>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
          <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
              <View style={[styles.outsource,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                <LinearGradient colors={["rgba(79, 81, 98, 0.9)","rgba(30, 32, 44, 0.9)"]} style={styles.linearout}>
                  <Text style={styles.cardHeaderTitle}>Log In</Text>
                  <Text style={styles.inptitle}>Email</Text>
                  {/* <TextInput ref={(ref) => this._lphone = ref} 
                    returnKeyType="next"
                    autoFocus={false}
                    onFocus={()=>{ this.setState({phoneSize:32,phonePlaceholder:''})}} 
                    onBlur={()=>{ this.state.loginPhone?"":this.setState({phoneSize:16,phonePlaceholder:'输入手机号码'}) }}
                    value={this.state.loginPhone} 
                    placeholder={this.state.phonePlaceholder} 
                    style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.phoneSize),}]}
                    selectionColor={UColor.tintColor} 
                    placeholderTextColor={UColor.lightgray}  
                    underlineColorAndroid="transparent" 
                    keyboardType="phone-pad" 
                    maxLength={11}
                    onChangeText={(loginPhone) => this.setState({ loginPhone })}
                  /> */}
                  <TextInput ref={(ref) => this._lphone = ref} 
                    returnKeyType="next"
                    autoFocus={false}
                    onFocus={()=>{ this.setState({phoneSize:32,phonePlaceholder:''})}} 
                    onBlur={()=>{ this.state.loginPhone?"":this.setState({phoneSize:16,phonePlaceholder:'Input Email Code'}) }}
                    value={this.state.loginPhone} 
                    placeholder={this.state.phonePlaceholder} 
                    style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.phoneSize),}]}
                    selectionColor={UColor.tintColor} 
                    placeholderTextColor={UColor.lightgray}  
                    underlineColorAndroid="transparent" 
                    keyboardType="phone-pad" 
                    maxLength={11}
                    onChangeText={(loginPhone) => this.setState({ loginPhone })}
                  />

                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TextInput ref={(ref) => this._lcodeImg = ref} 
                      returnKeyType="next"
                      autoFocus={false}
                      onFocus={()=>{ this.setState({codeImgSize:32,codeImgPlaceholder:''})}} 
                      onBlur={()=>{ this.state.codeImg?"":this.setState({codeImgSize:16,codeImgPlaceholder:'Input Graphic Code'})}}
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

                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TextInput ref={(ref) => this._lcode = ref} 
                      returnKeyType="next"
                      autoFocus={false}
                      onFocus={()=>{ this.setState({codeSize:32,codePlaceholder:''})}} 
                      onBlur={()=>{ this.state.checkCode?"":this.setState({codeSize:16,codePlaceholder:'Input Verification Code'})}}
                      value={this.state.checkCode} 
                      placeholder={this.state.codePlaceholder}
                      selectionColor={UColor.tintColor} 
                      placeholderTextColor={UColor.lightgray}
                      style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.codeSize)}]}
                      underlineColorAndroid="transparent" 
                      keyboardType="phone-pad" 
                      maxLength={Constants.Code_Moide} 
                      onChangeText={(checkCode) => this.setState({ checkCode })} 
                    />
                    <TouchableOpacity style={styles.btnoutsource} onPress={()=>{this.noDoublePress(()=>{this.kcaptrue()})}}>
                      <LinearGradient colors={this.state.captureState ? ["rgba(255, 255, 255, 1)","rgba(255, 255, 255, 0.4)"] : ["#FF0A2F","#FFD083"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btnout}>
                        <Text style={styles.btntext}>{this.state.capture}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <TextInput ref={(ref) => this._lpass = ref} 
                    returnKeyType="go"     
                    autoFocus={false}
                    onFocus={()=>{this.setState({passwordSize:32,passwordPlaceholder:''})}} 
                    onBlur={()=>{this.state.loginPwd?"":this.setState({passwordSize:16,passwordPlaceholder:'Enter the login password'})}}
                    style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.passwordSize)}]}
                    value={this.state.loginPwd}   
                    placeholder={this.state.passwordPlaceholder}
                    selectionColor={UColor.tintColor} 
                    placeholderTextColor={UColor.lightgray}
                    underlineColorAndroid="transparent" 
                    secureTextEntry={true} 
                    onSubmitEditing={() => this.loginKcaptrue()}  
                    maxLength={Constants.PWD_MAX_LENGTH}
                    onChangeText={(loginPwd) => this.setState({ loginPwd })}
                  />
                </LinearGradient>
              </View>
              <TouchableOpacity style={styles.forgetpass} onPress={()=>{this.noDoublePress(()=>{this.forget()})}}>
                <Image source={UImage.forgetIcon} style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} />
                <Text style={[styles.forgettext,{color: '#B9BBC1'}]} >{" Forgot Password"}</Text>
              </TouchableOpacity>
              <View style={styles.readout}>
                <TextButton onPress={()=>{this.noDoublePress(()=>{this.loginKcaptrue()})}} textColor="#FFFFFF" text={"Log In"}  shadow={true} style={styles.readbtn} />
              </View>
              <View style={styles.submitout}>
                <TextButton onPress={()=>{this.noDoublePress(()=>{this.regSubmit()})}} textColor='#3B80F4' text={"Register"}  style={styles.readbtn} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  blueLogo:{
    width: ScreenUtil.autowidth(258),
    height:ScreenUtil.autowidth(314),
    position:'absolute',
    right:0,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: UColor.bgColor
  },
  outsource: {
    borderRadius: ScreenUtil.autowidth(10),
    flexDirection: 'column', 
    marginTop: ScreenUtil.autoheight(60),
    marginHorizontal: ScreenUtil.autowidth(15),
  },
  linearout: { 
    paddingHorizontal: ScreenUtil.autowidth(28), 
    borderRadius: ScreenUtil.autowidth(10), 
    paddingBottom: ScreenUtil.autoheight(35),
  },
  cardHeaderTitle:{
    color:'#FFFFFF',
    fontSize:ScreenUtil.setSpText(36),
    marginTop: ScreenUtil.autoheight(35),
    marginBottom: ScreenUtil.autoheight(16)
  },
  inptitle: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16),
    marginVertical: ScreenUtil.autoheight(18),
  },
  textinpt: {
    color: '#FFFFFF',
    paddingVertical: ScreenUtil.autoheight(20),
  },
  forgetpass: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems:'center',
    paddingVertical: ScreenUtil.autoheight(15),
    paddingHorizontal: ScreenUtil.autowidth(35),
  },
  forgettext: {
    fontSize: ScreenUtil.setSpText(14),
  },

  readout: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ScreenUtil.autoheight(30),
  },
  readbtn: {
    width: ScreenUtil.autowidth(175), 
    height: ScreenUtil.autoheight(42),
    borderRadius: ScreenUtil.autowidth(25),
  },

  submitout: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ScreenUtil.autoheight(17),
    marginBottom: ScreenUtil.autoheight(26),
  },

  btnoutsource: {
    alignItems: 'center',
    justifyContent: "flex-end",
    paddingBottom:  ScreenUtil.autoheight(3),
  },
  btnout: {
    width: ScreenUtil.autowidth(90),
    height: ScreenUtil.autoheight(25),
    borderRadius: ScreenUtil.autowidth(23),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntext: {
    color: '#222330',
    fontSize: ScreenUtil.setSpText(12),
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

export default Login;
