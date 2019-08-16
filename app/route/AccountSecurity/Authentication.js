import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View, Text, TextInput, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
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
var WeChat = require('react-native-wechat');

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ personal }) => ({ ...personal }))
class Authentication extends BaseComponent {

  static navigationOptions = {
    title: '实名认证',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      fullname:"",
      dentitynumber:"",
      fullnameSize:16,
      dentitynumberSize:16,
      fullnamePlaceholder:"请输入姓名",
      dentitynumberPlaceholder:"请输入身份证号码",
    };
  }

  //组件加载完成
  componentDidMount() {
    
  }

  regSubmit = () =>{
    if(this.state.fullname==""){
      EasyToast.show('请输入姓名');
      return;
    }
    if(this.state.dentitynumber==""){
      EasyToast.show('请输入身份证号码');
      return;
    }
    if(this.state.dentitynumber.length != 18){
      EasyToast.show('请输入正确的身份证号码');
      return;
    }
    this.onAuthentication();
  }

  async onAuthentication () {
    EasyShowLD.loadingShow('认证中...');
    let resp = await Utils.dispatchActiionData(this, {type:'personal/getAuthentication',
      payload:{
        trueName: this.state.fullname, 
        idCard: this.state.dentitynumber, 
      } 
    });
    if(resp){
      EasyShowLD.loadingClose();
      if(resp.code==0){
        EasyToast.show("认证成功");
        Utils.pop(this, 3, true);
      }else{
        EasyToast.show(resp.msg);
      }
    }
  }

  clearFoucs = () =>{
    this._rname.blur();
    this._ridentification.blur();
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
          <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
              <LinearGradient colors={["#4F5162","#1E202C"]} style={styles.linearout}>
                <View style={styles.outsource}>
                  <View style={styles.headout}>
                    <Text style={styles.headtext}>实名认证</Text>
                  </View>
                  <View style={styles.inptout}>
                    <View style={styles.itemout}>
                      <Text style={styles.texttitle}>姓名</Text>
                      <TextInput ref={(ref) => this._rname = ref} 
                        autoFocus={false}
                        value={this.state.fullname} 
                        returnKeyType="next" 
                        onFocus={()=>{this.setState({fullnameSize:32,fullnamePlaceholder:''})}}
                        onBlur={()=>{this.state.phone?"":this.setState({fullnameSize:16,fullnamePlaceholder:'请输入姓名'})}}
                        style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.fullnameSize),}]}
                        placeholder={this.state.fullnamePlaceholder}
                        selectionColor={UColor.tintColor} 
                        placeholderTextColor={UColor.lightgray} 
                        underlineColorAndroid="transparent"
                        onChangeText={(fullname) => this.setState({fullname})}  
                      />
                    </View>
                    <View style={styles.itemout}>
                      <Text style={styles.texttitle}>身份证号码</Text>
                      <TextInput ref={(ref) => this._ridentification = ref} 
                        autoFocus={false}
                        value={this.state.dentitynumber} 
                        returnKeyType="go"  
                        onFocus={()=>{this.setState({dentitynumberSize:32,dentitynumberPlaceholder:''})}}
                        onBlur={()=>{this.state.phone?"":this.setState({dentitynumberSize:16,dentitynumberPlaceholder:'请输入身份证号码'})}}
                        style={[styles.textinpt,{fontSize: ScreenUtil.setSpText(this.state.dentitynumberSize),}]}
                        placeholder={this.state.dentitynumberPlaceholder}
                        selectionColor={UColor.tintColor} 
                        placeholderTextColor={UColor.lightgray} 
                        underlineColorAndroid="transparent" 
                        maxLength={18} 
                        onChangeText={(dentitynumber) => this.setState({dentitynumber})} 
                      />
                    </View>
                  </View>
                </View>
                <Image source={UImage.set_logoA} style={styles.footpoho}/>
              </LinearGradient>
              <View style={styles.referout}>
                <TextButton onPress={()=>{this.noDoublePress(()=>{this.regSubmit()})}} shadow={true} textColor='#FFFFFF' text={"保存"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
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
    height: ScreenHeight*0.5825, 
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
    paddingVertical: ScreenUtil.autoheight(40),
  },
  headtext: {
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },
  inptout: {
    flex: 2, 
    justifyContent: 'space-around',
    paddingHorizontal: ScreenUtil.autowidth(15), 
  },
  itemout: {
    flexDirection: 'column', 
    paddingVertical: ScreenUtil.autoheight(15),
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

  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.1,
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
  }
});

export default Authentication;
