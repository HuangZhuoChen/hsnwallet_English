import React from 'react';
import { connect } from 'react-redux'
import {StyleSheet,Dimensions,Animated,Text,TouchableWithoutFeedback,View,TextInput,Image,Keyboard,Platform,TouchableOpacity} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import TextButton from '../TextButton';
import Button from '../Button';
import { Utils } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import {kapimg} from '../../utils/Api';
import { EasyToast } from '../Toast';
import { EasyShowLD } from "../EasyShow"
import LinearGradient from 'react-native-linear-gradient'
const ScreenWidth = Dimensions.get('window').width;
export class CodeModal {

  static bind(CodeModal) {
    this.map["CodeModal"] = CodeModal;
  }

  static unBind() {
    this.map["CodeModal"] = null;
    delete this.map["CodeModal"];
  }

  static show(uid,callback) {
    this.map["CodeModal"].show(uid,callback);
  }

}

CodeModal.map = {};
@connect(({login}) => ({...login}))
export class CodeModalView extends React.Component {

  state = {
    modalVisible: false,
    mask: new Animated.Value(0),
    alert: new Animated.Value(0),
    uuid: "",
  };

  constructor(props) {
    super(props);
    CodeModal.bind(this);
  }

  show = (uid,callback) =>{
    if(this.isShow)return;
    this.isShow = true;
    this.uid=uid;
    //如果需要支持返回关闭，请添加这句，并且实现dimss方法
    window.currentDialog = this;
    this.CodeModalCallback = callback;
    this.setState({modalVisible:true});
    this.refreshImage();
    Animated.parallel([
      Animated.timing(this.state.mask,{toValue:0.6,duration:500}),
      Animated.timing(this.state.alert,{toValue:1,duration:200})
    ]).start(() => {});
  }

  dimss = () => {
    if(!this.isShow)return;
    window.currentDialog = null;
    Animated.parallel([
        Animated.timing(this.state.mask,{toValue:0,duration:500}),
        Animated.timing(this.state.alert,{toValue:0,duration:200})
    ]).start(() => {
        this.setState({modalVisible:false,password:""});
        this.isShow = false;
        this.uid=null;
    });
  }

  cancel = () =>{
    this.dimss();
    this.CodeModalCallback && this.CodeModalCallback({isok:false});
  }

  ok = () => {
    if(this.state.password == ""){
      EasyToast.show('请输入图形验证码');
      return;
    }
    this.getCapture(this.state.password);
  }

  async getCapture (kcode) {
    let resp = await Utils.dispatchActiionData(this, {type:'login/getCapture',payload:{ uuid: this.state.uuid, code: kcode } });
    if(resp){
      this.dimss();
      if (resp.code == 0) {
        this.CodeModalCallback && this.CodeModalCallback({isok:true});
      } else {
        EasyToast.show(resp.msg)
      }
    }
  }

  async refreshImage () {
    this.setState({
      uuid: Math.ceil(Math.random()*10000000000)
    })
  }

  loaderror = () =>{
    EasyToast.show('未能获取图形验证码，请检查网络！');
  }

  componentWillMount(){
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  _keyboardDidShow(e){
    if(this.isShow && Platform.OS=="ios"){
      this.setState({
        keyboardHeight:e.startCoordinates.height
      })
    }
  }

  _keyboardDidHide(e){
    if(this.isShow && Platform.OS=="ios"){
      this.setState({
        keyboardHeight:0
      });
    }
  }

  render() {
    return (
      this.state.modalVisible && <View style={styles.continer}>
        <TouchableWithoutFeedback >
          <View style={styles.content}>
            <Animated.View style={[styles.mask,{opacity:this.state.mask}]}></Animated.View>
            <View style={[styles.alertContent,Platform.OS=="ios"?{marginBottom:this.state.keyboardHeight*0.7}:{}]}>
              <Animated.View style={[styles.alert,{opacity:this.state.alert}]}>
                <TouchableOpacity style={{flexDirection: 'column',width:"100%",}} activeOpacity={1}>
                  <Text style={styles.title}>{"输入图形验证码"}</Text>
                  <View style={{flexDirection:"column",maxHeight:ScreenUtil.autowidth(90), paddingHorizontal: ScreenUtil.autowidth(20),}}>
                    <View style={[styles.input]}>
                      <TextInput autoFocus={true} style={{width:"100%",paddingHorizontal:ScreenUtil.autowidth(7),textAlign: 'center', fontSize:ScreenUtil.setSpText(18),color:"#1A1A1A",opacity: 0.8}} 
                      ref={(ref)=>this._i1=ref} defaultValue={this.state.password} maxLength={5} returnKeyType="go" onSubmitEditing={() => this.ok()}  
                      onChangeText={(password) => this.setState({password})} selectionColor={"#6DA0F8"} underlineColorAndroid="transparent" 
                       placeholderTextColor="#999" />
                    </View>
                    <View style={{flexDirection:"row",alignItems:"space-between",}}>
                      <Image onError={(e)=>{this.loaderror()}} style={{width:(ScreenWidth-ScreenUtil.autowidth(120))/2, height:ScreenUtil.autowidth(40), marginRight:ScreenUtil.autowidth(10),}} 
                        source={{uri: Constants.defaultrootaddr + kapimg + "?uuid=" + this.state.uuid}} />
                      <TouchableOpacity onPress={()=>{this.refreshImage()}} style={{flexDirection:"row", alignItems: 'center', justifyContent:"center",}}>
                        <Text style={{color: '#888888', fontSize: ScreenUtil.setSpText(10),}}>看不清？</Text>
                        <Text style={{color: '#0DA3DF', fontSize: ScreenUtil.setSpText(10),}}>点击刷新</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <LinearGradient colors={['#4F5162','#1E202C']}  start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.bottom}>
                    <View style={{width:"50%",alignItems: 'center', justifyContent: 'center',}}>
                      <TextButton onPress={()=>{this.cancel()}} shadow={false} textColor="#FFFFFF" bgColor="#9C9DA4" fontSize={ScreenUtil.setSpText(15)} text={this.state.cancel?this.state.cancel:"取消"} 
                      style={{width: ScreenUtil.autowidth(120), height:ScreenUtil.autoheight(40),borderRadius: ScreenUtil.autowidth(23),}} />
                    </View>
                    <View style={{width:"50%",alignItems: 'center', justifyContent: 'center',}}>
                      <TextButton onPress={()=>{this.ok()}} shadow={true}  textColor="#FFFFFF" fontSize={ScreenUtil.setSpText(15)} text={this.state.ok?this.state.ok:"确认"} 
                      style={{width: ScreenUtil.autowidth(120), height:ScreenUtil.autoheight(40),borderRadius: ScreenUtil.autowidth(23),}} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  continer:{
    left:0,
    top:0,
    position: 'absolute',
    zIndex: 99999,
    flex: 1,
    width:"100%",
    height:"100%"
  },
  content:{
    width:"100%",
    height:"100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"rgba(0, 0, 0, 0.0)"
  },
  mask: {
    flex:1,
    left:0,
    top:0,
    position: 'absolute',
    zIndex: 0,
    width:"100%",
    height:"100%",
    backgroundColor:"#000",
  },
  alertContent:{
    width:"100%",
    height:"100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"rgba(0, 0, 0, 0.0)",
    padding:ScreenUtil.autowidth(40)
  },
  alert:{
    flex:1,
    width:"100%",
    borderRadius:ScreenUtil.autowidth(10),
    backgroundColor:"#fff",
    flexDirection: 'column',
  },
  title:{
    color:"#333333",
    textAlign:"center",
    lineHeight:ScreenUtil.setSpText(26),
    fontSize:ScreenUtil.setSpText(15),
    fontWeight:"bold",
    marginTop:ScreenUtil.setSpText(18),
    margin:ScreenUtil.setSpText(10)
  },
  ctx:{
    marginBottom:ScreenUtil.setSpText(10),
    marginHorizontal:ScreenUtil.setSpText(20),
    color:"#808080",
    lineHeight:ScreenUtil.setSpText(24),
    fontSize:ScreenUtil.setSpText(12),
  },
  bottom:{
    overflow: 'hidden',
    width:"100%",
    flexDirection: 'row',
    justifyContent: 'center',
    height:ScreenUtil.autoheight(80),
    marginTop:ScreenUtil.autoheight(20),
    borderBottomLeftRadius: ScreenUtil.autowidth(10),
    borderBottomRightRadius: ScreenUtil.autowidth(10),
  },
  input:{
    marginBottom:ScreenUtil.autowidth(11),
    borderBottomColor:"#D9D9D9",
    borderBottomWidth:ScreenUtil.autowidth(0.4),
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    height:ScreenUtil.autowidth(40),
  },
});
