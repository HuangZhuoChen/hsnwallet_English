import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, Platform, Dimensions, View, Text, ScrollView, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ImageBackground } from 'react-native';
import UImage from '../../utils/Img';
import {kapimg} from '../../utils/Api'
import UColor from '../../utils/Colors'
import Header from '../../components/Header'
import Button from  '../../components/Button'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import {Utils} from '../../utils/Utils';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import { EasyShowLD } from "../../components/EasyShow"
import LinearGradient from 'react-native-linear-gradient'
import BaseComponent from "../../components/BaseComponent";
var tick=60;
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login }) => ({ ...login }))
class Forget extends BaseComponent {

  static navigationOptions = {
    title: '忘记密码',
    header:null,
  };

  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      capture:'Receive Code',
      captureState: false,

      phone:"",
      phoneSize:16,
      phonePlaceholder:"Input Email Code",

      codeImg: "",
      codeImgSize: 16,
      codeImgPlaceholder:"Input Graphic Code",

      code:"",
      codeSize:16,
      codePlaceholder:"Input Verification Code",

      password:"",
      passwordSize:16,
      passwordPlaceholder:"Password",

      passwordConfirm:"",
      passwordConfirmSize:16,
      passwordConfirmPlaceholder:"Confirm Password",
    }
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
    if(this.state.phone==""){
      EasyToast.show('Please enter your email number');
      return;
    }
    if(this.state.phone.length!=11){
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
        mobile: Utils.encryptedMsg(this.state.phone), 
        type: 'forget', 
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
        th.setState({capture:"Receive Code", captureState: false});
      }
    },1000);
  }

  regSubmit = () =>{
    if(this.state.phone==""){
      EasyToast.show('Please enter your email number');
      return;
    }
    if(this.state.phone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    if(this.state.codeImg == ""){
      EasyToast.show('Please enter the Graphic Verification Code');
      return;
    }
    if(this.state.code==""){
      EasyToast.show('Please enter the verification code.');
      return;
    }
    if(this.state.password=="" || this.state.password.length < 6){
      EasyToast.show('Password length at least 6 bits, please retry');
      return;
    }
    if (this.state.password == "" || this.state.password.length < Constants.PWD_MIN_LENGTH || 
    this.state.passwordConfirm == "" || this.state.passwordConfirm.length < Constants.PWD_MIN_LENGTH) {
      EasyToast.show('Password length at least 6 bits, please retry');
      return;
    }
    if (this.state.password != this.state.passwordConfirm) {
      EasyToast.show('Inconsistent passwords');
      return;
    }
    this.onchangePwd();
  }

  async onchangePwd () {
    EasyShowLD.loadingShow('Resetting...');
    let resp = await Utils.dispatchActiionData(this, {type:'login/forgetPassword',
      payload:{
        mobile: Utils.encryptedMsg(this.state.phone), 
        code: this.state.code, 
        password: Utils.encryptedMsg(this.state.password), 
        confirmPassword: Utils.encryptedMsg(this.state.passwordConfirm),
        uuid: this.state.uuid,
        imgcode: this.state.codeImg
      } 
    });
    if(resp){
      EasyShowLD.loadingClose();
      this.refreshImage();
      if(resp.code==0){
        EasyToast.show("Reset successfully");
        this.props.navigation.goBack();
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
    this._rphone.blur();
    this._lcodeImg.blur();
    this._rcode.blur();
    this._rpass.blur();
    this._rnewpass.blur();
  }

  render() {
    return <View style={styles.container}>
      <Header {...this.props} onPressLeft={true} title={""} />
      <Image source={UImage.login_bg_blue} style={[styles.blueLogo,{top: Constants.FitPhone,}]}/>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
        <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
          <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1}}>
            <View style={[styles.outsource,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
              <LinearGradient colors={["rgba(79, 81, 98, 0.9)","rgba(30, 32, 44, 0.9)"]} style={styles.linearout}>
                <Text style={styles.cardHeaderTitle}>Forgot Password</Text>
                <Text style={styles.texttitle}>Email</Text>
                <TextInput ref={(ref) => this._rphone = ref}
                  value={this.state.phone}
                  returnKeyType="next"
                  keyboardType="phone-pad"
                  onFocus={()=>{this.setState({phoneSize:32,phonePlaceholder:''})}}
                  onBlur={()=>{this.state.phone?"":this.setState({phoneSize:16,phonePlaceholder:'Input Email Code'})}}
                  style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.phoneSize),}]}
                  maxLength={11}
                  placeholder={this.state.phonePlaceholder}
                  underlineColorAndroid="transparent"
                  selectionColor={UColor.tintColor}
                  placeholderTextColor={UColor.lightgray}
                  onChangeText={(phone) => this.setState({phone})}
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
                    autoFocus={false}
                    onFocus={()=>{this.setState({codeSize:32,codePlaceholder:''})}}
                    onBlur={()=>{this.state.code?"":this.setState({codeSize:16,codePlaceholder:'Input Verification Code'}) }}
                    value={this.state.code}
                    returnKeyType="next"
                    placeholder={this.state.codePlaceholder}
                    selectionColor={UColor.tintColor}
                    style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.codeSize)}]}
                    placeholderTextColor={UColor.lightgray}
                    underlineColorAndroid="transparent"
                    keyboardType="phone-pad"
                    maxLength={Constants.Code_Moide} 
                    onChangeText={(code) => this.setState({ code })} 
                  />
                  <TouchableOpacity style={styles.btnoutsource} onPress={()=>{this.noDoublePress(()=>{this.kcaptrue()})}}>
                    <LinearGradient colors={this.state.captureState ? ["rgba(255, 255, 255, 1)","rgba(255, 255, 255, 0.4)"] : ["#FF0A2F","#FFD083"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btnout}>
                      <Text style={styles.btntext}>{this.state.capture}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <TextInput ref={(ref) => this._lpass = ref}
                  value={this.state.password}
                  returnKeyType="go"
                  autoFocus={false}
                  onFocus={()=>{ this.setState({passwordSize:32,passwordPlaceholder:''})}}
                  onBlur={()=>{this.state.password?"":this.setState({passwordSize:16,passwordPlaceholder:'Password'})}}
                  selectionColor={UColor.tintColor}
                  style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.passwordSize)}]}
                  placeholder={this.state.passwordPlaceholder}
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  placeholderTextColor={UColor.lightgray}
                  maxLength={Constants.PWD_MAX_LENGTH}
                  onChangeText={(password) => this.setState({ password })}
                />

                <TextInput ref={(ref) => this._rnewpass = ref}
                  value={this.state.passwordConfirm}
                  returnKeyType="go"
                  autoFocus={false}
                  onFocus={()=>{this.setState({passwordConfirmSize:32,passwordConfirmPlaceholder:''})}}
                  onBlur={()=>{this.state.passwordConfirm?"":this.setState({passwordConfirmSize:16,passwordConfirmPlaceholder:'Confirm Password'})}}
                  editable={true}
                  selectionColor={UColor.tintColor}
                  style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.passwordConfirmSize)}]}
                  placeholder={this.state.passwordConfirmPlaceholder}
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  placeholderTextColor={UColor.lightgray}
                  maxLength={Constants.PWD_MAX_LENGTH}
                  onSubmitEditing={() => this.regSubmit()}
                  onChangeText={(passwordConfirm) => this.setState({ passwordConfirm })}
                />
              </LinearGradient>
            </View>
            <View style={styles.referout}>
              <TextButton onPress={()=>{this.noDoublePress(()=>{this.regSubmit()})}} textColor="#FFFFFF" text="Confirm" shadow={true} style={styles.referbtn} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
  </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: UColor.bgColor
  },
  blueLogo:{
    width: ScreenUtil.autowidth(258),
    height:ScreenUtil.autowidth(314),
    position:'absolute',
    top: ScreenUtil.autoheight(20),
    right:0,
  },
  outsource: {
    flexDirection: 'column',
    marginHorizontal: ScreenUtil.autowidth(15),
    marginTop: ScreenUtil.autoheight(15),
    borderRadius: ScreenUtil.autowidth(10),
  },
  linearout: { 
    paddingHorizontal: ScreenUtil.autowidth(28), 
    borderRadius: ScreenUtil.autowidth(10), 
    paddingBottom: ScreenUtil.autoheight(35),
  },
  cardHeaderTitle:{
    color:'#FFFFFF',
    fontSize:ScreenUtil.setSpText(36),
    fontWeight: 'bold',
    marginTop: ScreenUtil.autoheight(35),
    marginBottom: ScreenUtil.autoheight(16)
  },
  texttitle:{
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16),
    marginVertical: ScreenUtil.autoheight(18),
  },
  textinpt: {
    color: '#FFFFFF',
    paddingVertical: ScreenUtil.autoheight(20)
  },
 
  referout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScreenUtil.autoheight(62),
  },
  referbtn: {
    width: ScreenUtil.autowidth(175), 
    height: ScreenUtil.autoheight(42),
    borderRadius: ScreenUtil.autowidth(25),
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

export default Forget;
