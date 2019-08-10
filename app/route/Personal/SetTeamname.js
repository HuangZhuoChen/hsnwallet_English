import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, Platform, StyleSheet, ScrollView, View, Text, TextInput, Image, Linking, KeyboardAvoidingView, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
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
class SetTeamname extends BaseComponent {

  static navigationOptions = {
    title: '设置团队名称',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      teamname: '',
      teamnameSize: 16,
      teamnamePlaceholder:"Please enter the team name",
    };
  }

  //组件加载完成
  componentDidMount() {
    
  }

  async signout () {
    if(this.state.teamname==""){
      EasyToast.show('Please enter the team name');
      return;
    }
    if(this.state.teamname.length > 14){
      EasyToast.show('Team name word count up to 14 characters');
      return;
    }
    EasyShowLD.loadingShow('Modification in progress');
    let resp = await Utils.dispatchActiionData(this, {type:'personal/getsetteamname',payload:{ teamName: this.state.teamname } });
    if(resp){
      EasyShowLD.loadingClose();
      if(resp.code==0){
        EasyToast.show("Successful revision");
        Utils.pop(this, 3, true);
      }else{
        EasyToast.show(resp.msg);
      }
    }
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : null} style={{flex: 1}}>
          <ScrollView  keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)} style={{flex: 1,}}>
              <View style={[styles.outsource,{backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                <LinearGradient colors={["#4F5162","#1E202C"]} style={styles.linearout}>
                  <View style={styles.cardHeaderout}>
                    <Text style={styles.cardHeaderTitle}>Set Team Name</Text>
                    <TextInput ref={(ref) => this._rpass = ref}  
                      autoFocus={false}
                      value={this.state.teamname} 
                      selectionColor={UColor.tintColor} 
                      placeholderTextColor={UColor.lightgray} 
                      onFocus={()=>{this.setState({teamnameSize:32,teamnamePlaceholder:''})}} 
                      onBlur={()=>{this.state.teamname?"":this.setState({teamnameSize:16,teamnamePlaceholder:'Please enter the team name'})}}
                      style={[styles.inpt,{fontSize: ScreenUtil.setSpText(this.state.teamnameSize)}]}
                      placeholder={this.state.teamnamePlaceholder}  
                      underlineColorAndroid="transparent" 
                      returnKeyType="go" 
                      maxLength={14}
                      onChangeText={(teamname) => this.setState({teamname})} 
                    />
                  </View>
                  <Image source={UImage.set_logoC} style={styles.footpoho}/>
                </LinearGradient>
              </View>
              <Text style={styles.explaintext}>Notice：Users can only set the name one time</Text>
              <View style={styles.referout}>
                <TextButton onPress={()=>{this.noDoublePress(()=>{this.signout()})}} shadow={true} textColor='#FFFFFF' text={"Save"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
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
  outsource: {
    flexDirection: 'column', 
    margin: ScreenUtil.autoheight(15),
    marginLeft: ScreenUtil.autowidth(20),
    borderRadius: ScreenUtil.autowidth(10),
    elevation: 10, 
    shadowRadius: 5, 
    shadowOpacity:0.06, 
    shadowColor: 'rgba(0, 0, 0, 1)', 
    shadowOffset:{height: 2,width: 0},
  },
  linearout: { 
    paddingHorizontal: ScreenUtil.autowidth(28), 
    borderRadius: ScreenUtil.autowidth(10), 
    paddingBottom: ScreenUtil.autoheight(55),
  },
  cardHeaderout: {
    flex: 1, 
    zIndex: 99,
    paddingBottom: ScreenUtil.autoheight(20), 
  },
  cardHeaderTitle:{
    color:'#FFFFFF',
    fontSize:ScreenUtil.setSpText(36),
    fontWeight: 'bold',
    marginTop: ScreenUtil.autoheight(35),
    marginBottom: ScreenUtil.autoheight(122)
  },
  inpt: {
    color: '#FFFFFF',
    paddingVertical: ScreenUtil.autoheight(20),
  },
  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 0.4907,
  },
  explaintext: {
    color: '#FF8C00', 
    fontSize: ScreenUtil.setSpText(12),
    paddingLeft: ScreenUtil.autowidth(49),
  },
  referout: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ScreenUtil.autoheight(45),
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(40),
    borderRadius: ScreenUtil.autowidth(23), 
  }
});

export default SetTeamname;
