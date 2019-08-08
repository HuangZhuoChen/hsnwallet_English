import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import UColor from '../utils/Colors'
import UImage from "../utils/Img";
import ScreenUtil from '../utils/ScreenUtil'
import PropTypes from 'prop-types';
import BaseComponent from "../components/BaseComponent";

{/* 示例：
  <PasswordInput password={this.state.password} onCallbackFun={(password) => this.setState({ password })} 
repeatpassword={this.state.repeatpassword} onCallbackFunRepeat={(repeatpassword) => this.setState({ repeatpassword })}/> 
*/}

  class PasswordInput extends BaseComponent {
  constructor(props){
    super(props)
    
    this.state = {
      margin_vertical: !this.props.margin_vertical ? ScreenUtil.autoheight(20): this.props.margin_vertical,
      password:"",
      repeatpassword: "",
      weak: false,
      medium: false,
      strong: false,
      statetext: "",
      showpwd: true,
    }
  }

  intensity() {
    let string = this.state.password;
    if(string.length >=5) {
      if(/[a-zA-Z]+/.test(string) && /[0-9]+/.test(string) && /\W+\D+/.test(string)) {
        this.state.statetext = '很棒';
        this.state.strong = true;
        this.state.medium = true;
        this.state.weak = true;
      }else if(/[a-zA-Z]+/.test(string) || /[0-9]+/.test(string) || /\W+\D+/.test(string)) {
        if(/[a-zA-Z]+/.test(string) && /[0-9]+/.test(string)) {
          this.state.statetext = '不错';
          this.state.strong = false;
          this.state.medium = true;
          this.state.weak = true;
        }else if(/\[a-zA-Z]+/.test(string) && /\W+\D+/.test(string)) {
          this.state.statetext = '不错';
          this.state.strong = false;
          this.state.medium = true;
          this.state.weak = true;
        }else if(/[0-9]+/.test(string) && /\W+\D+/.test(string)) {
          this.state.statetext = '不错';
          this.state.strong = false;
          this.state.medium = true;
          this.state.weak = true;
        }else{
          this.state.statetext = '还行';
          this.state.strong = false;
          this.state.medium = false;
          this.state.weak = true;
        }
      }
    }else{
      this.state.statetext = "";
      this.state.strong = false;
      this.state.medium = false;
      this.state.weak = false;
    }
   
  }

  
  static propTypes = {
    margin_vertical:PropTypes.number,
    password: PropTypes.string,
    onCallbackFun: PropTypes.func,

    repeatassword: PropTypes.string,
    onCallbackFunRepeat: PropTypes.func,
  
  }

  openChoiceToken(){
    
  }

  render(){

    let {password, onCallbackFun,repeatpassword, onCallbackFunRepeat } = this.props
    return (
        <View>
          <View style={{flexDirection: 'row', marginVertical: this.state.margin_vertical}}>
          <Text style={{flex: 1,fontSize: ScreenUtil.setSpText(16),  color: '#323232'}}>{"设置密码"}</Text>
          <View style={{flexDirection: 'row',alignItems: 'center'}}>
            <Text style={{fontSize: ScreenUtil.setSpText(10), color: '#3B80F4', paddingHorizontal: ScreenUtil.autowidth(5),}}>{this.state.statetext}</Text>
            <View style={{width: ScreenUtil.autowidth(10), flexDirection: 'column',}}>
              <View style={{height: 2,marginVertical: 0.5,backgroundColor: this.state.strong ? '#3B80F4' : '#D8D8D8',}}/>
              <View style={{height: 2,marginVertical: 0.5,backgroundColor: this.state.strong ? '#3B80F4' : '#D8D8D8',}}/>
              <View style={{height: 2,marginVertical: 0.5,backgroundColor: this.state.medium ? '#3B80F4' : '#D8D8D8',}}/>
              <View style={{height: 2,marginVertical: 0.5,backgroundColor: this.state.medium ? '#3B80F4' : '#D8D8D8',}}/>
              <View style={{height: 2,marginVertical: 0.5,backgroundColor: this.state.weak ? '#3B80F4' : '#D8D8D8',}}/>
              <View style={{height: 2,marginVertical: 0.5,backgroundColor: this.state.weak ? '#3B80F4' : '#D8D8D8',}}/>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', borderBottomWidth:0.5, borderBottomColor: '#D5D5D5', alignItems: 'center'}}>
          <TextInput ref={(ref) => this._lpass = ref} value={password} returnKeyType="next" placeholderTextColor={'#D9D9D9'}
            selectionColor={UColor.tintColor} style={[styles.inpt,{color: '#808080',}]} onChange={this.intensity()} 
            onChangeText={(password) => {this.setState({ password });if(onCallbackFun)onCallbackFun(password);}} 
            placeholder={"输入密码至少6位,建议大小写字母混合"} underlineColorAndroid="transparent" secureTextEntry={this.state.showpwd} 
          />
          <TouchableOpacity style={styles.textinptoue} onPress={()=>{this.openChoiceToken(this.setState({showpwd: !this.state.showpwd}))}} >
            <Image source={this.state.showpwd ? UImage.reveal_h_pwd : UImage.reveal_pwd} style={styles.alningimg} />
          </TouchableOpacity>
        </View>
        
        <TextInput ref={(ref) => this._rpass = ref} value={repeatpassword} returnKeyType="next"  placeholderTextColor={'#D9D9D9'}
          selectionColor={UColor.tintColor} style={[styles.textinpt,{color: '#808080', borderBottomColor: '#D5D5D5'}]} 
          onChangeText={(repeatpassword) => {this.setState({ repeatpassword });if(onCallbackFunRepeat)onCallbackFunRepeat(repeatpassword); }}  
          onChange={this.intensity()} placeholder={"重复输入密码"} underlineColorAndroid="transparent" secureTextEntry={this.state.showpwd} 
          />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  inptout: {
    // marginVertical: !this.props.marginVertical ? ScreenUtil.autowidth(20): this.props.marginVertical,
  },
  inpt: {
    flex: 1,
    paddingVertical: 0,
    fontSize: ScreenUtil.setSpText(14),
    paddingLeft: ScreenUtil.autowidth(2),
  },
  textinpt: {
    paddingVertical: 0,
    borderBottomWidth:0.5,
    fontSize: ScreenUtil.setSpText(14),
    paddingLeft: ScreenUtil.autowidth(2),
    paddingTop: ScreenUtil.autowidth(24), 
    paddingBottom: ScreenUtil.autowidth(4), 
  },
  textinptoue: {

  },
  alningimg: {
    width: ScreenUtil.autowidth(13),
    height: ScreenUtil.autowidth(8),
    margin: ScreenUtil.autowidth(9),
  }

});


export default PasswordInput;