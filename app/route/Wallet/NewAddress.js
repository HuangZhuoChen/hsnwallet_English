import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View, Text, Image, Linking, TextInput, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
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
import BaseComponent from "../../components/BaseComponent";
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ }) => ({ }))
class NewAddress extends BaseComponent {

  static navigationOptions = {
    title: '新增地址',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      coinName: this.props.navigation.state.params.coinName?this.props.navigation.state.params.coinName:"HSN",

      coinAddress:"",
      addressSize:16,
      addressPlaceholder:'Enter address',

      coinRemarks:"",
      remarkSize:16,
      remarkPlaceholder:'Enter note information',

    };
  }

  //组件加载完成
  componentDidMount() {

  }

  async addAddress(){
    if(this.state.coinAddress==""){
      EasyToast.show('Please enter the withdrawal address');
      return;
    }
    if(this.state.coinRemarks == ""){
      EasyToast.show('Please enter notes');
      return;
    }
    let res = await Utils.dispatchActiionData(this,{type:'assets/addressAdd',
      payload: {
        coinName: this.state.coinName,
        coinAddress: this.state.coinAddress,
        memo: this.state.coinRemarks,
      }
    });
    if(res){
      if(res.msg==='success'){
        EasyToast.show('Added Successfully');
        this.props.navigation.goBack();
      }else{
        EasyToast.show(res.msg);
      }
    }
  }

  render() {
    return (
        <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
          <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
          <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{width:ScreenWidth}}>
            <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
              <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
                <View style={[styles.outsource,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                  <LinearGradient colors={["rgba(79, 81, 98, 0.9)","rgba(30, 32, 44, 0.9)"]} style={styles.linearout}>
                    <View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                      <Text style={styles.cardHeaderTitle}>New Address</Text>
                      <Image source={this.state.coinName=='HSN'?UImage.icon_hsn:UImage.icon_usdt} style={styles.headrightimg}/>
                    </View>

                    <Text style={styles.inptitle}>Address</Text>
                    <TextInput ref={(ref) => this._laddress = ref}
                      returnKeyType="next"
                      autoFocus={false}
                      onFocus={()=>{ this.setState({addressSize:26,addressPlaceholder:''})}}
                      onBlur={()=>{ this.state.coinAddress?"":this.setState({addressSize:16,addressPlaceholder:'Enter address'}) }}
                      value={this.state.coinAddress}
                      placeholder={this.state.addressPlaceholder}
                      style={[styles.inpt,{fontSize: ScreenUtil.setSpText(this.state.addressSize),}]}
                      selectionColor={UColor.tintColor}
                      placeholderTextColor={UColor.lightgray}
                      underlineColorAndroid="transparent"
                      onChangeText={(coinAddress) => this.setState({ coinAddress })}
                    />

                    <Text style={styles.inptitle}>Notes</Text>
                    <TextInput ref={(ref) => this._lremarks = ref}
                      returnKeyType="next"
                      autoFocus={false}
                      onFocus={()=>{ this.setState({remarkSize:26,remarkPlaceholder:''})}}
                      onBlur={()=>{ this.state.coinRemarks?"":this.setState({remarkSize:16,remarkPlaceholder:'Enter note information'}) }}
                      value={this.state.coinRemarks}
                      placeholder={this.state.remarkPlaceholder}
                      style={[styles.inpt,{fontSize: ScreenUtil.setSpText(this.state.remarkSize),}]}
                      selectionColor={UColor.tintColor}
                      placeholderTextColor={UColor.lightgray}
                      underlineColorAndroid="transparent"
                      onChangeText={(coinRemarks) => this.setState({ coinRemarks })}
                    />
                  </LinearGradient>
                </View>
                <View style={styles.forgetpass}>
                  <Image source={UImage.forgetIcon} style={{width:ScreenUtil.setSpText(14),height:ScreenUtil.setSpText(14)}} />
                  <Text style={[styles.forgettext,{color: '#B9BBC1'}]} >{" Tips：You can add up to 10 addresses"}</Text>
                </View>

                <View style={styles.referout}>
                  <TextButton onPress={()=>{this.noDoublePress(()=>{this.addAddress()})}} shadow={true} textColor='#FFFFFF' text={"Confirm"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
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
  outsource: {
    borderRadius: ScreenUtil.autowidth(10),
    flexDirection: 'column',
    marginTop: ScreenUtil.autoheight(25),
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
    fontWeight: 'bold',
    marginTop: ScreenUtil.autoheight(35),
    marginBottom: ScreenUtil.autoheight(16)
  },
  headrightimg: {
    width:ScreenUtil.autowidth(36),
    height:ScreenUtil.autowidth(36),
    marginTop:ScreenUtil.autoheight(19)
  },
  inptitle: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16),
    marginVertical: ScreenUtil.autoheight(18),
  },
  inpt: {
    color: '#FFFFFF',
    paddingVertical: ScreenUtil.autoheight(20),
  },
  btnoutsource: {
    alignItems: 'center',
    justifyContent: "flex-end",
    paddingBottom:  ScreenUtil.autoheight(3),
  },
  btntext: {
    color: '#222330',
    fontSize: ScreenUtil.setSpText(12),
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

export default NewAddress;
