import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View, Text, Image, Linking, TextInput, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import { kapimg } from '../../utils/Api'
import Header from '../../components/Header'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import NativeUtil from '../../utils/NativeUtil'
import { EasyShowLD } from '../../components/EasyShow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import BaseComponent from "../../components/BaseComponent";
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
var WeChat = require('react-native-wechat');

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login, assets, personal, }) => ({ ...login, ...assets, ...personal, }))
class Withdraw extends BaseComponent {

  static navigationOptions = {
    title: '提币',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      coinitem: this.props.navigation.state.params.coinitem?this.props.navigation.state.params.coinitem : {},

      address: '',
      addressSize: 16,
      addressPlaceholder: "提币地址",

      amount: '',
      amountSize: 16,
      amountPlaceholder: "请输入数量",

      password: '',
      passwordSize: 16,
      passwordPlaceholder: "请输入密码",

      codeImg: "",
      codeImgSize: 16,
      codeImgPlaceholder:"请输入图形验证码",

      code:"",
      codeSize:16,
      codePlaceholder:"请输入验证码",

      uuid: '',
      capture:'获取验证码',
      captureState: false,

      factAmount: 0, //扣手续费后实际到账数量
      min_usdt_withdrawable: 10,
      min_hsn_withdrawable: 30,

      isOmni: true,
      isErc20: false,
      addressError: false,
    };
  }

  //组件加载完成
  componentDidMount() {
    this.refreshImage();
    this.onSetTradePW();
  }

  //未设置交易密码
  async onSetTradePW () {
    const { navigate } = this.props.navigation;
    if(!this.props.SetTradePW){
      let isPay =  await AlertModal.showSync("温馨提示","未设置交易密码，请立即设置","去设置","取消",);
      if(isPay){
        navigate('SetTransactionPw', {});
      }
      return;
    }
  }

  componentWillUnmount(){
    this.setState = (state, callback) => {
      return;
    };
  }

  businesButton(style, selectedSate, stateType, buttonTitle) {  
    let BTN_SELECTED_STATE_ARRAY = ['isOmni', 'isErc20'];  
    return(  
      <TouchableOpacity style={[style, selectedSate ? {backgroundColor: '#3C9CFF'} : {backgroundColor: 'rgba(0, 0, 0, 0.0)'}]}  onPress={ () => {this._updateBtnState(stateType, BTN_SELECTED_STATE_ARRAY)}}>  
        <Text style={[styles.tabText, selectedSate ? {color: '#FFFFFF'} : {color: '#6F758D'}]}>{buttonTitle}</Text>  
      </TouchableOpacity>  
    );  
  } 

  // 更新"个人排名 团队排名"按钮的状态  
  _updateBtnState(currentPressed, array) { 
    if (currentPressed === 'undefined' || currentPressed === null || array === 'undefined' || array === null ) {  
      return;  
    }  
    if(currentPressed == "isOmni"){
      this.setState({isOmni: true, isErc20: false,});
    }else if(currentPressed == "isErc20"){
      this.setState({isOmni: false, isErc20: true,});
    }
  }  

  async kcaptrue () {
    if(this.state.address==""){
      EasyToast.show('请输入提币地址');
      return;
    }
    if(this.state.amount==""){
      EasyToast.show('请输入数量');
      return;
    }
    if(this.state.coinitem.coinName == "USDT" && this.state.amount < this.state.min_usdt_withdrawable){
      EasyToast.show('最小提币数量为10');
      return;
    }
    if(this.state.coinitem.coinName == "HSN" && this.state.amount < this.state.min_hsn_withdrawable){
      EasyToast.show('最小提币数量为30');
      return;
    }
    if(this.state.password==""){
      EasyToast.show('请输入密码');
      return;
    }
    if(this.state.password.length < Constants.PWD_MIN_LENGTH){
      EasyToast.show('密码长度至少6位,请重输');
      return;
    }
    if(this.state.codeImg==""){
      EasyToast.show('请输入图形验证码');
      return;
    }
    if(this.state.captureState){
      return;
    }
    let resp = await Utils.dispatchActiionData(this, {type:'login/sendVerify', 
      payload:{
        mobile: Utils.encryptedMsg(this.props.mobile), 
        type: 'withdraw', 
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
    if(this.state.address==""){
      EasyToast.show('请输入提币地址');
      return;
    }
    if(this.state.amount==""){
      EasyToast.show('请输入数量');
      return;
    }
    if(this.state.coinitem.coinName == "USDT" && this.state.amount < this.state.min_usdt_withdrawable){
      EasyToast.show('最小提币数量为10');
      return;
    }
    if(this.state.coinitem.coinName == "HSN" && this.state.amount < this.state.min_hsn_withdrawable){
      EasyToast.show('最小提币数量为30');
      return;
    }
    if(this.state.password==""){
      EasyToast.show('请输入密码');
      return;
    }
    if(this.state.password.length < Constants.PWD_MIN_LENGTH){
      EasyToast.show('密码长度至少6位,请重输');
      return;
    }
    if(this.state.codeImg==""){
      EasyToast.show('请输入图形验证码');
      return;
    }
    if(this.state.code==""){
      EasyToast.show('请输入验证码');
      return;
    }
    this.onchangePwd();
  }

  async onchangePwd () {
    EasyShowLD.loadingShow('提币中...');
    let resp = await Utils.dispatchActiionData(this, {type:'assets/getAssetsWithdraw',
      payload:{
        coinName: this.state.coinitem.coinName,
        amount: this.state.amount,
        tradePassword: this.state.password,
        withdrawAddress: this.state.address,
        code: this.state.code,
        uuid: this.state.uuid,
        imgcode: this.state.codeImg
      } 
    });
    if(resp){
      this.refreshImage();
      EasyShowLD.loadingClose();
      if(resp.code==0){
        EasyToast.show("已提交，待主网确认");
        await Utils.dispatchActiionData(this, {type:'assets/getInouTorder',payload:{coinName: this.state.coinitem.coinName, pageNo: 1, pageSize: 10 } });
        this.props.navigation.goBack();
      }else{
        EasyToast.show(resp.msg);
      }
    }
  }
  
  goToAddress(){
    Utils.dispatchActiionData(this,{type:'assets/addressList',payload: {coinName:this.state.coinitem.coinName}});
    const { navigate } = this.props.navigation;
    navigate('address', {coinName:this.state.coinitem.coinName,
      callback:(res)=>{
        if(res && res.coinAddress){
          this.setState({address: res.coinAddress})
        }
      }
    });
  }

  async inputAddress (address) {
    try {
      this.setState({ address: address});
      if(this.state.coinitem.coinName == "USDT"){
        if(this.state.isOmni&&address!=""){
          await this.setState({addressError: true});
        }else{
          await this.setState({addressError: false});
        }

        if(this.state.isErc20&&address!=""){
          await this.setState({addressError: true});
        }else{
          await this.setState({addressError: false});
        }
      }else{
        if(address != ""){
          await this.setState({addressError: true});
        }else{
          await this.setState({addressError: false});
        }
      }
    } catch (error) {
      
    }
  }

  inputAmount(amount){
    try {
      let strAmount = Utils.checkQuantity(amount);
      if(!strAmount){
        this.setState({ amount: '',factAmount:0});
        return ;
      }
      if(this.state.coinitem.coinName == "USDT" && strAmount < this.state.min_usdt_withdrawable){
        this.setState({ amount: strAmount,});
        return ;
      }
      if(this.state.coinitem.coinName == "HSN" && strAmount < this.state.min_hsn_withdrawable){
        this.setState({ amount: strAmount,});
        return ;
      }
      let factAmount = strAmount - this.state.coinitem.commissionAmount;
      this.setState({ amount: strAmount, factAmount: factAmount});
    } catch (error) {
      console.log("++++inputAmount-error:",error.message);
    }
  }

  refreshImage () {
    this.setState({
      uuid: Math.ceil(Math.random()*10000000000)
    })
  }

  loaderror = () =>{
    EasyToast.show('未能获取图形验证码，请检查网络！');
  }

  clearFoucs = () =>{
    this._raddress.blur();
    this._ramount.blur();
    this._rpass.blur();
    this._lcodeImg.blur();
    this._rcode.blur();
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={this.state.coinitem.coinName} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
          <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
              <LinearGradient colors={["#4A4C5D","#1E202C"]}  style={styles.linearout}>
                <View style={styles.outsource}>
                  <View style={styles.headout}>
                    <Text style={styles.headtext}>提币</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'space-around',}}>
                    <View style={styles.itemout}>
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={styles.texttitle}>提币地址</Text>
                        {this.state.coinitem.coinName=='USDT'&&
                        <View style={styles.businestab}>  
                          {this.businesButton(styles.taboneStyle, this.state.isOmni, 'isOmni', 'OMNI')}  
                          {this.businesButton(styles.tabtwoStyle, this.state.isErc20, 'isErc20', 'ERC20')}  
                        </View>}
                      </View>
                      
                      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TextInput ref={(ref) => this._raddress = ref}
                          autoFocus={false}
                          value={this.state.address}
                          selectionColor={UColor.tintColor}
                          placeholderTextColor={UColor.lightgray}
                          onFocus={()=>{this.setState({addressSize:32,addressPlaceholder:''})}}
                          onBlur={()=>{this.state.password?"":this.setState({addressSize:16,addressPlaceholder:'请输入提币地址'})}}
                          style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.addressSize),}]}
                          placeholder={this.state.addressPlaceholder}
                          underlineColorAndroid="transparent"
                          returnKeyType="next"
                          onChangeText={(address) => this.inputAddress({address})}
                        />

                        <LinearGradient colors={['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 0.4)']} start={{x:0,y:0}} start={{x:1,y:0}} style={{
                          width:ScreenUtil.autowidth(42),
                          height:ScreenUtil.autoheight(20),
                          borderRadius:ScreenUtil.autoheight(10),
                        }}>
                          <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goToAddress()})}} >
                            <Text style={{color:'#222330',textAlign: 'center',fontSize:ScreenUtil.setSpText(12),lineHeight:ScreenUtil.autoheight(20)}}>选择</Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                      <Text style={{color:this.state.addressError?'#ED2D2E':'#FFFFFF'}}>*地址错误</Text>

                    </View>
                    <View style={styles.itemout}>
                      <Text style={styles.texttitle}>提币数量</Text>
                      <TextInput  ref={ (ref) => this._ramount = ref} 
                        autoFocus={false} 
                        value={this.state.amount} 
                        selectionColor={UColor.tintColor}
                        placeholderTextColor={UColor.lightgray}  
                        onFocus={()=>{this.setState({amountSize:32,amountPlaceholder:''})}}
                        onBlur={()=>{this.state.password?"":this.setState({amountSize:16,amountPlaceholder:'请输入数量'})}}
                        style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.amountSize),}]}
                        placeholder={this.state.amountPlaceholder}
                        underlineColorAndroid="transparent" 
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                        maxLength={15} 
                        onChangeText={(amount) => this.inputAmount(amount)}  
                      />
                    </View>
                    <View style={styles.itemout}>
                      <Text style={styles.texttitle}>交易密码</Text>
                      <TextInput ref={(ref) => this._rpass = ref} 
                        autoFocus={false} 
                        value={this.state.password} 
                        selectionColor={UColor.tintColor}
                        placeholderTextColor={UColor.lightgray} 
                        onFocus={()=>{this.setState({passwordSize:32,passwordPlaceholder:''})}}
                        onBlur={()=>{this.state.password?"":this.setState({passwordSize:16,passwordPlaceholder:'请输入交易密码'})}}
                        style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.passwordSize),}]}
                        placeholder={this.state.passwordPlaceholder}
                        underlineColorAndroid="transparent" 
                        secureTextEntry={true} 
                        returnKeyType="next" 
                        maxLength={Constants.PWD_MAX_LENGTH} 
                        onSubmitEditing={() => this.regSubmit()}
                        onChangeText={(password) => this.setState({ password })} 
                      />
                    </View>

                    <View style={styles.itemout}>
                      <Text style={styles.texttitle}>图形验证码</Text>
                      <View style={{flexDirection: 'row', alignItems: 'center', }} >
                        <TextInput ref={(ref) => this._lcodeImg = ref} 
                          autoFocus={false}
                          value={this.state.codeImg} 
                          placeholderTextColor={UColor.lightgray}    
                          selectionColor={UColor.tintColor} 
                          onFocus={()=>{this.setState({codeImgSize:32,codeImgPlaceholder:''})}}
                          onBlur={()=>{this.state.code?"":this.setState({codeImgSize:16,codeImgPlaceholder:'请输入图形验证码'})}}
                          style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.codeImgSize),}]}
                          placeholder={this.state.codeImgPlaceholder}
                          underlineColorAndroid="transparent" 
                          returnKeyType="next" 
                          maxLength={Constants.Code_Moide} 
                          onSubmitEditing={() => this.regSubmit()}
                          onChangeText={(codeImg) => this.setState({codeImg})} 
                        />
                        <Image onError={(e)=>{this.loaderror()}} style={styles.codeimg} source={{uri: Constants.defaultrootaddr + kapimg + "?uuid=" + this.state.uuid}} />
                        <TouchableOpacity onPress={()=>{this.refreshImage()}}>
                          <Image style={styles.refreshimg} source={UImage.icon_refresh} resizeMode="contain"/>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.itemout}>
                      <Text style={styles.texttitle}>验证码</Text>
                      <View style={{flexDirection: 'row', alignItems: 'center', }} >
                        <TextInput ref={(ref) => this._rcode = ref} 
                          autoFocus={false}
                          value={this.state.code} 
                          placeholderTextColor={UColor.lightgray}    
                          selectionColor={UColor.tintColor} 
                          onFocus={()=>{this.setState({codeSize:32,codePlaceholder:''})}}
                          onBlur={()=>{this.state.code?"":this.setState({codeSize:16,codePlaceholder:'请输入验证码'})}}
                          style={[styles.textinpt,{flex: 1,fontSize: ScreenUtil.setSpText(this.state.codeSize),}]}
                          placeholder={this.state.codePlaceholder}
                          underlineColorAndroid="transparent" 
                          keyboardType="phone-pad" 
                          returnKeyType="go" 
                          maxLength={Constants.Code_Moide} 
                          onSubmitEditing={() => this.regSubmit()}
                          onChangeText={(code) => this.setState({code})} 
                        />
                        <TouchableOpacity style={styles.btnoutsource} onPress={()=>{this.noDoublePress(()=>{this.kcaptrue()})}}>
                          <LinearGradient colors={this.state.captureState ? ["rgba(255, 255, 255, 1)","rgba(255, 255, 255, 0.4)"] : ["#FF0A2F","#FFD083"]}  start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btnout}>
                            <Text style={styles.btntext}>{this.state.capture}</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.actualtext}>{"实际到账数量：" + this.state.factAmount}</Text>
                  </View>
                  <View style={styles.footerout}>
                    <Text style={styles.footertext}>{"1 最小提币数量为：" + this.state.coinitem.limitAmount + " " + this.state.coinitem.coinName}</Text>
                    <Text style={styles.footertext}>{"2 提币手续费：每笔收取 " + this.state.coinitem.commissionAmount + " " + this.state.coinitem.coinName }</Text>
                    <Text style={styles.footertext}>3 请务必确认设备安全，防止信息被篡改或泄漏</Text>
                  </View>
                </View>
                <Image source={UImage.set_logoB} style={styles.footpoho}/>
              </LinearGradient>
              <View style={styles.referout}>
                <TextButton onPress={()=>{this.noDoublePress(()=>{this.regSubmit()})}} shadow={true} textColor='#FFFFFF' text={"确认提币"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
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
    alignItems: 'center', 
  },
  linearout: {
    width: ScreenWidth - ScreenUtil.autowidth(30),  
    // height: ScreenHeight*0.7266,
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
    paddingHorizontal: ScreenUtil.autowidth(25), 
  },
  headout: {
    flexDirection: 'row', 
    paddingVertical: ScreenUtil.autoheight(40)
  },
  headtext: {
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },
  itemout: {
    flexDirection: 'column', 
    paddingVertical: ScreenUtil.autoheight(15),
  },

  businestab: {
    alignSelf: 'center',
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.autoheight(25),
    width: (ScreenWidth-ScreenUtil.autowidth(80))/2,
    borderColor: '#3C9CFF',
    borderWidth: ScreenUtil.autowidth(1),
    borderRadius: ScreenUtil.autowidth(8),
    overflow: 'hidden',
  },
  taboneStyle: {
    flex: 1,
    alignItems: 'center',   
    justifyContent: 'center',
    height: ScreenUtil.autoheight(25),
  },
  tabtwoStyle: {
    flex: 1,
    alignItems: 'center',   
    justifyContent: 'center',
    height: ScreenUtil.autoheight(25),
  },
  tabText: {
    fontSize: ScreenUtil.setSpText(14),
  },
  
  texttitle:{
    fontWeight:'bold',
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16),
    paddingVertical:  ScreenUtil.autoheight(10),
  },
  textinpt: {
    color: '#FFFFFF',
    paddingVertical:  ScreenUtil.autoheight(10),
  },
  btnoutsource: {
    alignItems: 'center',
    justifyContent: "flex-end",
    paddingBottom:  ScreenUtil.autoheight(3),
  },
  btnout: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0DA3DF',
    width: ScreenUtil.autowidth(90),
    height: ScreenUtil.autoheight(25),
    borderRadius: ScreenUtil.autowidth(23),
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

  actualtext: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(21), 
    lineHeight: ScreenUtil.autoheight(36),
  },

  footerout: {
    flexDirection: 'column', 
    paddingVertical: ScreenUtil.autoheight(40)
  },
  footertext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: ScreenUtil.setSpText(12), 
    lineHeight: ScreenUtil.autoheight(17),
  },
  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.0436,
  },
  referout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScreenUtil.autoheight(26), 
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  }
});

export default Withdraw;
