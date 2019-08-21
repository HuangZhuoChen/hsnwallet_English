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
class AddingInStationContacts extends BaseComponent {

  static navigationOptions = {
    title: '新增地址',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      coinName: this.props.navigation.state.params.coinName?this.props.navigation.state.params.coinName:"HSN",
      hsnAccount:"",
      coinRemarks:"",
    };
  }

  //组件加载完成
  componentDidMount() {

  }

  async addAddress(){
    if(this.state.hsnAccount==""){
      EasyToast.show('Please enter your mail number');
      return;
    }
    if(this.state.coinRemarks==""){
        EasyToast.show('Please enter notes');
        return;
    }
    let res = await Utils.dispatchActiionData(this,{type:'assets/insertAdd',payload: {
      "mail": this.state.hsnAccount,
      "memo": this.state.coinRemarks,
    }});
    if(res.msg==='success'){
      EasyToast.show('Increasing Contact Success');
      this.props.navigation.goBack();
    }else{
      EasyToast.show(JSON.stringify(res.msg));
    }
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={"New Contacts"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
          <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1,}}>
            <View  style={styles.linearout}>
              <View style={styles.itemout}>
                <Text style={styles.inptitle}>HSN Account</Text>
                <View style={styles.outsource}>
                  <TextInput ref={(ref) => this._lphone = ref}
                    returnKeyType="next"
                    keyboardType="phone-pad"
                    autoFocus={false}
                    value={this.state.hsnAccount}
                    placeholder={'email number'}
                    style={styles.inpt}
                    selectionColor={UColor.tintColor}
                    placeholderTextColor={UColor.lightgray}
                    underlineColorAndroid="transparent"
                    onChangeText={(hsnAccount) => this.setState({ hsnAccount })}
                  />
                </View>
              </View>
              <View style={styles.itemout}>
                <Text style={styles.inptitle}>Remarks</Text>
                <View style={styles.outsource}>
                  <TextInput ref={(ref) => this._lphone = ref}
                    returnKeyType="go"
                    autoFocus={false}
                    value={this.state.coinRemarks}
                    placeholder={"Please input notes(optional)"}
                    style={styles.inpt}
                    selectionColor={UColor.tintColor}
                    placeholderTextColor={UColor.lightgray}
                    underlineColorAndroid="transparent"
                    onChangeText={(coinRemarks) => this.setState({ coinRemarks })}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.referout}>
            <TextButton onPress={()=>{this.noDoublePress(()=>{this.addAddress()})}} shadow={true} textColor='#FFFFFF' text={"Save"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
          </View>
        </TouchableOpacity>
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
    flex: 1,
    width: ScreenWidth - ScreenUtil.autowidth(30),  
    marginTop: ScreenUtil.autoheight(40), 
  },
  itemout: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingTop: ScreenUtil.autoheight(15),
  },
  inptitle: {
    width: ScreenWidth/6,
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(13),
  },
  outsource: {
    flex: 1, 
    height: ScreenUtil.autoheight(35),
    flexDirection:'row',
    alignItems:'center', 
    marginHorizontal: ScreenUtil.autowidth(7), 
    borderColor: "#7D7D7D", 
    borderWidth: ScreenUtil.autowidth(1),
    borderRadius: ScreenUtil.autowidth(3),
  },
  inpt: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(13),
    paddingLeft: ScreenUtil.autowidth(7),
    paddingVertical: 0,
  },
  referout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScreenUtil.autoheight(26), 
  },
  btntransfer: {
    width: ScreenWidth*2/5, 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  }

});

export default AddingInStationContacts;
