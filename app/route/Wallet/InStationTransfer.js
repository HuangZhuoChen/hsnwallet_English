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
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login, assets }) => ({ ...login, ...assets }))
class InStationTransfer extends BaseComponent {

  static navigationOptions = {
    title: '站内转账',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      coinitem: this.props.navigation.state.params.coinitem?this.props.navigation.state.params.coinitem : {},

      address: '',
      amount: '',
      codeImg: '',
      password: '',
      code: '',

      uuid: '',
      capture: 'phone code',
      captureState: false,

      factAmount: 0, //扣手续费后实际到账数量
    };
  }

  //组件加载完成
  componentDidMount() {
    this.refreshImage();
  }

  componentWillUnmount(){
    this.setState = (state, callback) => {
      return;
    };
  }

  async kcaptrue () {
    if(this.state.address==""){
      EasyToast.show('Please enter your cell phone number');
      return;
    }
    if(this.state.amount==""){
      EasyToast.show('Please enter amount');
      return;
    }
    if(this.state.codeImg==""){
      EasyToast.show('Please enter the Graphic Verification Code');
      return;
    }
    if(this.state.password==""){
      EasyToast.show('Please enter the transaction password');
      return;
    }
    if(this.state.captureState){
      return;
    }
    let resp = await Utils.dispatchActiionData(this, {type:'login/sendVerify', 
      payload:{
        mobile: Utils.encryptedMsg(this.props.mobile), 
        type: 'insideTransfer', 
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
        th.setState({capture:"phone code", captureState: false});
      }
    },1000);
  }

  regSubmit = () =>{
    if(this.state.address==""){
      EasyToast.show('Please enter your cell phone number');
      return;
    }
    if(this.state.amount==""){
      EasyToast.show('Please enter amount');
      return;
    }
    if(this.state.codeImg==""){
      EasyToast.show('Please enter the Graphic Verification Code');
      return;
    }
    if(this.state.password==""){
      EasyToast.show('Please enter the transaction password');
      return;
    }
    if(this.state.code==""){
      EasyToast.show('Please enter the verification code.');
      return;
    }
    this.onchangePwd();
  }

  async onchangePwd () {
    EasyShowLD.loadingShow('Transfer...');
    let resp = await Utils.dispatchActiionData(this, {type:'assets/getInsideTransfer',
      payload:{
        mobile: this.state.address,
        coinName: this.state.coinitem.coinName,
        amount: this.state.amount,
        tradePassword: this.state.password,
        code: this.state.code,
        uuid: this.state.uuid,
        imgcode: this.state.codeImg
      }
    });
    if(resp){
      this.refreshImage();
      EasyShowLD.loadingClose();
      if(resp.code==0){
        EasyToast.show("Submitted pending confirmation by the main network");
        await Utils.dispatchActiionData(this, {type:'assets/getInouTorder',payload:{coinName: this.state.coinitem.coinName, pageNo: 1, pageSize: 10 } });
        this.props.navigation.goBack();
      }else{
        EasyToast.show(resp.msg);
      }
    }
  }
  
  goToAddress(){
    Utils.dispatchActiionData(this,{type:'assets/addlinkList',payload: {pageNo: 1, pageSize: 10}});
    const { navigate } = this.props.navigation;
    navigate('StationContacts', {coinName:this.state.coinitem.coinName,
      callback:(res)=>{
        if(res && res.mobile){
          this.setState({address: res.mobile})
        }
      }
    });
  }

  inputAmount(amount){
    try {
      let strAmount = Utils.checkQuantity(amount);
      if(!strAmount){
        this.setState({ amount: '',factAmount:0});
        return ;
      }
      if(strAmount>this.state.coinitem.available){
        this.setState({ amount: '',factAmount:0});
        EasyToast.show('The amount of transferable funds is insufficient. Please re-enter it.');
        return ;
      }
      let factAmount = strAmount - this.state.coinitem.transferAmmount;
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
    EasyToast.show('Failed to obtain graphics authentication code, please check the network！');
  }

  clearFoucs = () =>{
    this._raddress.blur();
    this._ramount.blur();
    this._rcodeImg.blur();
    this._rpass.blur();
    this._rcode.blur();
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={"Internal Transfer"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
          <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
              <View style={styles.linearout}>
                <View style={styles.itemout}>
                  <Text style={styles.texttitle}>HSN Account</Text>
                  <View style={styles.outsource}>
                    <TextInput ref={(ref) => this._raddress = ref}
                      autoFocus={false}
                      value={this.state.address}
                      selectionColor={UColor.tintColor}
                      placeholderTextColor={UColor.lightgray}
                      style={styles.textinpt}
                      placeholder={"phone number"}
                      underlineColorAndroid="transparent"
                      returnKeyType="next"
                      keyboardType="phone-pad"
                      onChangeText={(address) => this.setState({address})}
                    />
                    <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goToAddress()})}} style={styles.inptbtnout}>
                      <Image source={UImage.contacts} style={{width:ScreenUtil.autowidth(22),height:ScreenUtil.autoheight(22),}}/>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemout}>
                  <Text style={styles.texttitle}>Transferring Amount</Text>
                  <View style={styles.outsource}>
                    <TextInput  ref={ (ref) => this._ramount = ref} 
                      autoFocus={false} 
                      value={this.state.amount} 
                      selectionColor={UColor.tintColor}
                      placeholderTextColor={UColor.lightgray}  
                      style={styles.textinpt}
                      placeholder={"0.00"}
                      underlineColorAndroid="transparent" 
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      maxLength={15} 
                      onChangeText={(amount) => this.inputAmount(amount)}  
                    />
                    <View style={styles.inptbtnout}>
                      <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(8),}}>{this.state.coinitem.coinName}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.footerout}>
                  <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(11),lineHeight: ScreenUtil.autoheight(26),}}>{"Actual amount received：" + this.state.factAmount + " " + this.state.coinitem.coinName}</Text>
                  <View style={styles.footpoho}>
                    <Text style={styles.footertext}>
                      Available amount to transfer：
                      <Text style={styles.actualtext}>{Utils.formatCNY(this.props.balanceAvailable)}</Text>
                      {" " + this.state.coinitem.coinName}
                    </Text>
                    <Text style={styles.footertext}>{"Withdrawal fee：" + this.state.coinitem.transferAmmount + " " + this.state.coinitem.coinName}</Text>
                  </View>
                </View>

                <View style={[styles.itemout,{paddingTop: ScreenUtil.autoheight(35),}]}>
                  <Text style={styles.texttitle}>Graphic Code</Text>
                  <View style={styles.outsource}>
                    <TextInput ref={(ref) => this._rcodeImg = ref} 
                      autoFocus={false}
                      value={this.state.codeImg} 
                      placeholderTextColor={UColor.lightgray}    
                      selectionColor={UColor.tintColor} 
                      style={styles.textinpt}
                      placeholder={"Graphic Code"}
                      underlineColorAndroid="transparent" 
                      returnKeyType="next" 
                      maxLength={Constants.Code_Moide} 
                      onChangeText={(codeImg) => this.setState({codeImg})} 
                    />
                  </View>
                  <Image onError={(e)=>{this.loaderror()}} style={styles.codeimg} source={{uri: Constants.defaultrootaddr + kapimg + "?uuid=" + this.state.uuid}} />
                  <TouchableOpacity onPress={()=>{this.refreshImage()}}>
                    <Image style={styles.refreshimg} source={UImage.icon_refresh} resizeMode="contain"/>
                  </TouchableOpacity>
                </View>

                <View style={styles.itemout}>
                  <Text style={styles.texttitle}>Trading Password</Text>
                  <View style={styles.outsource}>
                    <TextInput ref={(ref) => this._rpass = ref} 
                      autoFocus={false}
                      value={this.state.password} 
                      placeholderTextColor={UColor.lightgray}    
                      selectionColor={UColor.tintColor} 
                      style={styles.textinpt}
                      placeholder={"Password"}
                      underlineColorAndroid="transparent" 
                      secureTextEntry={true} 
                      returnKeyType="next" 
                      maxLength={Constants.PWD_MAX_LENGTH} 
                      onChangeText={(password) => this.setState({password})} 
                    />
                  </View>
                </View>

                <View style={styles.itemout}>
                  <Text style={styles.texttitle}>code</Text>
                  <View style={styles.outsource}>
                    <TextInput ref={(ref) => this._rcode = ref} 
                      autoFocus={false}
                      value={this.state.code} 
                      placeholderTextColor={UColor.lightgray}    
                      selectionColor={UColor.tintColor} 
                      style={styles.textinpt}
                      placeholder={"email code"}
                      underlineColorAndroid="transparent" 
                      keyboardType="phone-pad" 
                      returnKeyType="go" 
                      maxLength={Constants.Code_Moide} 
                      onSubmitEditing={() => this.regSubmit()}
                      onChangeText={(code) => this.setState({code})} 
                    />
                  </View>
                  <TouchableOpacity style={styles.btnoutsource} onPress={()=>{this.noDoublePress(()=>{this.kcaptrue()})}}>
                    <LinearGradient colors={this.state.captureState ? ["rgba(255, 255, 255, 1)","rgba(255, 255, 255, 0.4)"] : ["#FF0A2F","#FFD083"]}  start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btnout}>
                      <Text style={styles.btntext}>{this.state.capture}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.referout}>
                <TextButton onPress={()=>{this.noDoublePress(()=>{this.regSubmit()})}} shadow={true} textColor='#FFFFFF' text={"Confirm"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
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
    marginTop: ScreenUtil.autoheight(40), 
  },
  
  itemout: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingTop: ScreenUtil.autoheight(15),
  },
  texttitle:{
    width: ScreenWidth/5,
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(13),
  },
  outsource: {
    flex: 1, 
    flexDirection:'row',
    alignItems:'center', 
    borderColor: "#7D7D7D", 
    height: ScreenUtil.autoheight(35),
    borderWidth: ScreenUtil.autowidth(1),
    borderRadius: ScreenUtil.autowidth(3),
    marginHorizontal: ScreenUtil.autowidth(7), 
  },
  textinpt: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(12),
    paddingLeft: ScreenUtil.autowidth(7),
    paddingVertical: 0,
  },
  inptbtnout: {
    width: ScreenUtil.autowidth(35),
    height: ScreenUtil.autoheight(35),
    borderLeftColor: "#7D7D7D", 
    borderLeftWidth: ScreenUtil.autowidth(1),
    alignItems: 'center',
    justifyContent: 'center',
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

  footerout: {
    paddingLeft: ScreenWidth/5, 
    paddingTop: ScreenUtil.autoheight(10), 
    marginHorizontal: ScreenUtil.autowidth(7),
  },
  footertext: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(10), 
    lineHeight: ScreenUtil.autoheight(16),
  },
  footpoho: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-between'
  },
  actualtext: {
    color: '#00BBFA',
    fontSize: ScreenUtil.setSpText(9), 
    lineHeight: ScreenUtil.autoheight(16),
  },

  btnoutsource: {
    alignItems: 'center',
    justifyContent: "center",
    marginHorizontal: ScreenUtil.autowidth(7),
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
  referout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ScreenHeight/5, 
  },
  btntransfer: {
    width: ScreenWidth*2/5, 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  }
});

export default InStationTransfer;
