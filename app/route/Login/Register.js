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
import AnalyticsUtil from '../../utils/AnalyticsUtil';
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
class Register extends BaseComponent {

  static navigationOptions = {
    title: '注册',
    header:null,
  };

  state = {
    phone:"",
    phoneSize:16,
    phonePlaceholder:"输入手机号码",

    code:"",
    codeSize:16,
    codePlaceholder:"输入验证码",

    password:"",
    passwordSize:16,
    passwordPlaceholder:"输入登录密码",

    passwordConfirm:"",
    passwordConfirmSize:16,
    passwordConfirmPlaceholder:"确认密码",

    invitecode:"",
    invitecodeConfirmSize:16,
    invitecodeConfirmPlaceholder:"输入邀请码",
    
    capture:'获取验证码',
    captureState: false,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount(){
    //结束页面前，资源释放操作
    super.componentWillUnmount();
  }

  async kcaptrue () {
    if(this.state.phone==""){
      EasyToast.show('请输入手机号');
      return;
    }
    if(this.state.phone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    if(this.state.captureState){
      return;
    }
    let resp = await Utils.dispatchActiionData(this, {type:'login/sendVerify', 
      payload:{
        mobile: Utils.encryptedMsg(this.state.phone), 
        type: 'register', 
      } 
    });
    if(resp){
      EasyToast.show("验证码已发送，请注意查收");
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
        th.setState({capture:"获取验证码", captureState: false});
      }
    },1000);
  }

  regSubmit = () =>{
    if(this.state.phone==""){
      EasyToast.show('请输入手机号');
      return;
    }
    if(this.state.phone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    if(this.state.code==""){
      EasyToast.show('请输入验证码');
      return;
    }
    if(this.state.password=="" || this.state.password.length < 6){
      EasyToast.show('密码长度至少6位,请重输');
      return;
    }
    if (this.state.password == "" || this.state.password.length < Constants.PWD_MIN_LENGTH || 
    this.state.passwordConfirm == "" || this.state.passwordConfirm.length < Constants.PWD_MIN_LENGTH) {
      EasyToast.show('密码长度至少6位,请重输');
      return;
    }
    if (this.state.password != this.state.passwordConfirm) {
      EasyToast.show('两次密码不一致');
      return;
    }
    if(this.state.invitecode == ""){
      EasyToast.show('请输入邀请码');
      return;
    }
    this.onregister();
  }

  async onregister () {
    EasyShowLD.loadingShow('注册中...');
    let resp = await Utils.dispatchActiionData(this, {type:'login/register',
      payload:{
        mobile: Utils.encryptedMsg(this.state.phone), 
        code: this.state.code, 
        password: Utils.encryptedMsg(this.state.password), 
        confirmPassword: Utils.encryptedMsg(this.state.passwordConfirm), 
        inviteCode: this.state.invitecode,  
      } 
    });
    if(resp){
      EasyShowLD.loadingClose();
      if (resp.code == 0) {
        EasyToast.show("注册成功");
        this.props.navigation.goBack();
        AnalyticsUtil.onEvent('register_ok');
      } else {
        EasyToast.show(resp.msg)
      }
    }
  }

  clearFoucs = () =>{
    this._rphone.blur();
    this._rcode.blur();
    this._rpass.blur();
    this._rnewpass.blur();
    this._rinviteCode.blur();
  }

  render() {
    return (<View style={[styles.container,{backgroundColor: UColor.bgColor}]}>
      <Header {...this.props} onPressLeft={true} title={""} />
      <Image source={UImage.login_bg_blue} style={[styles.blueLogo,{top: Constants.FitPhone,}]}/>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
        <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
          <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1}}>
            <View style={[styles.outsource,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
              <LinearGradient colors={["rgba(0, 208, 255, 0.9)","rgba(0, 102, 233, 0.9)"]} style={styles.linearout}>
                <View style={[styles.regTitleWrap, ]}>
                  <Text style={styles.cardHeaderTitle}>注册</Text>
                </View>
                <Text style={styles.texttitle}> +86</Text>
                <TextInput ref={(ref) => this._rphone = ref}
                  autoFocus={false}
                  value={this.state.phone}
                  returnKeyType="next"
                  keyboardType="phone-pad"
                  onFocus={()=>{this.setState({phoneSize:32,phonePlaceholder:''})}}
                  onBlur={()=>{this.state.phone?"":this.setState({phoneSize:16,phonePlaceholder:'输入手机号码'})}}
                  style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.phoneSize),}]}
                  maxLength={11}
                  placeholder={this.state.phonePlaceholder}
                  underlineColorAndroid="transparent"
                  selectionColor={UColor.tintColor}
                  onChangeText={(phone) => this.setState({phone})}
                  placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                />
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <TextInput ref={(ref) => this._rcode = ref}
                    autoFocus={false}
                    onFocus={()=>{this.setState({codeSize:32,codePlaceholder:''})}}
                    onBlur={()=>{this.state.code?"":this.setState({codeSize:16,codePlaceholder:'输入验证码'}) }}
                    value={this.state.code}
                    returnKeyType="next"
                    placeholder={this.state.codePlaceholder}
                    selectionColor={UColor.tintColor}
                    style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.codeSize)}]}
                    placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                    underlineColorAndroid="transparent"
                    keyboardType="phone-pad"
                    maxLength={Constants.Code_Moide} 
                    onChangeText={(code) => this.setState({ code })} 
                  />
                  <TouchableOpacity style={styles.btnoutsource} onPress={()=>{this.noDoublePress(()=>{this.kcaptrue()})}}>
                    <LinearGradient colors={this.state.captureState ? ["rgba(255, 255, 255, 1)","rgba(255, 255, 255, 0.4)"] : ["#FF0A2F","#FFD083"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btnout}>
                      <Text style={{color: this.state.captureState ? '#0085EF' : '#222330',fontSize: ScreenUtil.setSpText(12),}}>{this.state.capture}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <TextInput ref={(ref) => this._rpass = ref}
                  value={this.state.password}
                  returnKeyType="go"
                  autoFocus={false}
                  onFocus={()=>{ this.setState({passwordSize:32,passwordPlaceholder:''})}}
                  onBlur={()=>{this.state.password?"":this.setState({passwordSize:16,passwordPlaceholder:'新密码'})}}
                  selectionColor={UColor.tintColor}
                  style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.passwordSize)}]}
                  placeholder={this.state.passwordPlaceholder}
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                  maxLength={Constants.PWD_MAX_LENGTH}
                  onChangeText={(password) => this.setState({ password })}
                />

                <TextInput ref={(ref) => this._rnewpass = ref}
                  value={this.state.passwordConfirm}
                  returnKeyType="next"
                  autoFocus={false}
                  onFocus={()=>{this.setState({passwordConfirmSize:32,passwordConfirmPlaceholder:''})}}
                  onBlur={()=>{this.state.passwordConfirm?"":this.setState({passwordConfirmSize:16,passwordConfirmPlaceholder:'确认密码'})}}
                  editable={true}
                  selectionColor={UColor.tintColor}
                  style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.passwordConfirmSize)}]}
                  placeholder={this.state.passwordConfirmPlaceholder}
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                  maxLength={Constants.PWD_MAX_LENGTH}
                  onSubmitEditing={() => this.regSubmit()}
                  onChangeText={(passwordConfirm) => this.setState({ passwordConfirm })}
                />

                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <TextInput ref={(ref) => this._rinvitecode = ref}
                    autoFocus={false}
                    onFocus={()=>{this.setState({invitecodeSize:32,invitecodeConfirmPlaceholder:''})}}
                    onBlur={()=>{this.state.invitecode?"":this.setState({invitecodeSize:16,invitecodeConfirmPlaceholder:"输入邀请码",}) }}
                    value={this.state.invitecode}
                    returnKeyType="go"
                    placeholder={this.state.invitecodeConfirmPlaceholder}
                    selectionColor={UColor.tintColor}
                    style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.invitecodeSize)}]}
                    placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                    underlineColorAndroid="transparent"
                    keyboardType="phone-pad"
                    maxLength={Constants.Code_Moide} 
                    onChangeText={(invitecode) => this.setState({ invitecode })} 
                  />
                  <Text style={{fontSize:ScreenUtil.autowidth(14),lineHeight:ScreenUtil.autowidth(20),}}>必填*</Text>
                </View>
              </LinearGradient>
            </View>
            <View style={styles.referout}>
              <TextButton onPress={()=>{this.noDoublePress(()=>{this.regSubmit()})}} textColor="#FFFFFF" text="立即注册"  shadow={true} style={styles.referbtn} />
            </View>
            <View style={styles.readout}>
              <Text style={[styles.readtext,{color: '#808080'}]}>注册即表示同意节点预选赛规则</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
  </View>)
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

  regTitleWrap: {
    flexDirection: 'row',
    marginTop: ScreenUtil.autoheight(32)
  },
  cardHeaderTitle:{
    color:'#FFFFFF',
    fontSize:ScreenUtil.setSpText(36),
    fontWeight: 'bold',
  },
  cardHeaderuid: {
    color:'#fff',
    fontSize:ScreenUtil.autowidth(24),
    fontWeight: 'bold',
    marginLeft:ScreenUtil.autowidth(14)
  },
  cardHeadertext: {
    color:'#fff',
    fontSize:ScreenUtil.autowidth(14),
    fontWeight: '500',
    marginLeft:ScreenUtil.autowidth(6)
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
    paddingVertical: ScreenUtil.autoheight(30), 
  },
  referbtn: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23),
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
    color: '#0085EF',
    fontSize: ScreenUtil.setSpText(12),
  },

  readout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ScreenUtil.autoheight(30),
  },
  readtext: {
    fontSize: ScreenUtil.setSpText(12),
  },
  servicetext: {
    fontSize: ScreenUtil.setSpText(12),
    paddingLeft: ScreenUtil.autowidth(5),
  },

});

export default Register;
