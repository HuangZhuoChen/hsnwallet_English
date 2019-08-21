import React from 'react';
import { connect } from 'react-redux'
import {Dimensions,StyleSheet,Animated,Text,TouchableWithoutFeedback,View,Image,TouchableOpacity,ScrollView} from 'react-native';
import UImage from '../../utils/Img'
import ScreenUtil from '../../utils/ScreenUtil';
import TextButton from '../TextButton';
import Constants from '../../utils/Constants';
import LinearGradient from 'react-native-linear-gradient'

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export class AlertModal {

  static bind(AlertModal) {
    this.map["AlertModal"] = AlertModal;
  }

  static unBind() {
    this.map["AlertModal"] = null;
    delete this.map["AlertModal"];
  }

  static isUpdate(content) {
    this.map["AlertModal"].update(content)
  }

  static close() {
    this.map["AlertModal"].dimss()
  }

  static show(title,content,ok,cancel,showatmosphere,verif,callback,agree) {
    this.map["AlertModal"].show(title,content,ok,cancel,showatmosphere,verif,callback,agree);
  }

  //窗口同步显示 -- agree表示是否显示对赌协议栏
  static async showSync(title,content,ok,cancel,showatmosphere,verif,agree) {
    let pthis =this;
    var p = new Promise(function (resolve, reject) {
      pthis.map["AlertModal"].show(title,content,ok,cancel,showatmosphere,verif,(ret) => {
        resolve(ret);
      },agree);     
    });
    return p;
  }
}

AlertModal.map = {};

export class AlertModalView extends React.Component {

    state = {
      showatmosphere: false,
      modalVisible: false,
      mask: new Animated.Value(0),
      alert: new Animated.Value(0),
      
      // 测试
      checked: true,
      ifAgree: false
    };

    constructor(props) {
      super(props);
      AlertModal.bind(this);
    }

    update = content => {
      this.setState({
        content
      })
    }

    show = (title,content,ok,cancel,showatmosphere,verif,callback,agree) =>{
      if(this.isShow||this.state.modalVisible){
        this.state.mask.stopAnimation();
        this.state.alert.stopAnimation();
        // return;
      }
      this.isShow = true;
      //如果需要支持返回关闭，请添加这句，并且实现dimss方法
      window.currentDialog = this;
      this.AlertModalCallback = callback;
      this.AlertVerif = verif?verif:null;
      this.setState({title:title,content:content,ok:ok,cancel:cancel,showatmosphere: showatmosphere,modalVisible:true,ifAgree:agree});
      Animated.parallel([
        Animated.timing(this.state.mask,{toValue:0.6,duration:100}),
        Animated.timing(this.state.alert,{toValue:1,duration:50})
      ]).start(() => {});
    }

    dimss = () => {
      if(!this.isShow){
        this.state.mask.stopAnimation();
        this.state.alert.stopAnimation();
        return;
      }
      this.isShow = false;
      window.currentDialog = null;
      Animated.parallel([
          Animated.timing(this.state.mask,{toValue:0,duration:20}),
          Animated.timing(this.state.alert,{toValue:0,duration:10})
      ]).start(() => {
          this.setState({modalVisible:false});
      });
    }

    cancel = () =>{
      this.dimss();
      this.AlertModalCallback && this.AlertModalCallback(false);
    }

    ok = () =>{
      let dimssFlag = true;
      if(this.AlertVerif!==null){
         dimssFlag=this.AlertVerif();
      }
      if(!dimssFlag){
        return
      }
      this.dimss();
      this.AlertModalCallback && this.AlertModalCallback(true);
    }

    render() {
        return (
          this.state.modalVisible && <View style={styles.continer}>
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                <Animated.View style={[styles.mask,{opacity:this.state.mask}]}></Animated.View>
                <View style={[styles.alertContent,Constants.dappHorizontalScreenFlag?{paddingHorizontal:ScreenUtil.screenHeith*3/10}:{padding:ScreenUtil.autowidth(40)}]}>
                  <Animated.View style={[styles.alert,{opacity:this.state.alert}]}>
                    <TouchableOpacity activeOpacity={1}>
                      {this.state.title && <Text style={styles.title}>{this.state.title}</Text>}
                      <View style={[styles.ctx, {marginHorizontal: this.state.ifAgree ? 0 : ScreenUtil.autowidth(20)}]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          {(typeof(this.state.content)=='string')?<Text style={styles.contentext}>{this.state.content?this.state.content:""}</Text>:this.state.content}
                        </ScrollView>
                      </View>
                      {this.state.cancel && 
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
                      }

                      {!this.state.cancel &&
                        <LinearGradient colors={['#4F5162','#1E202C']}  start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.bottom}>
                          <View style={{width:"100%",alignItems: 'center', justifyContent: 'center',}}>
                            <TextButton onPress={()=>{this.ok()}} shadow={true} textColor="#FFFFFF" fontSize={ScreenUtil.setSpText(16)} text={this.state.ok?this.state.ok:"确认"} 
                            style={{width: ScreenUtil.autowidth(200), height:ScreenUtil.autoheight(40),borderRadius: ScreenUtil.autowidth(23),}} />
                          </View>
                        </LinearGradient>
                      }
                    </TouchableOpacity>
                    {this.state.showatmosphere &&
                      <View style={styles.footpoho} pointerEvents='none'>
                        <Image source={UImage.atmosphere} style={{width: ScreenWidth-ScreenUtil.autowidth(58), height: (ScreenWidth-ScreenUtil.autowidth(58)) * 0.871,}} resizeMode='contain'/>
                      </View>
                    }
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
    // padding:ScreenUtil.autowidth(40)
  },
  alert:{
    flex:1,
    flexDirection: 'column',
    borderRadius:ScreenUtil.autowidth(10),
    width:"100%",
    backgroundColor:"#fff"
  },
  title:{
    color:"#333333",
    textAlign:"center",
    lineHeight:ScreenUtil.autoheight(26),
    fontSize:ScreenUtil.setSpText(18),
    fontWeight:"bold",
    marginTop:ScreenUtil.autoheight(18),
    margin:ScreenUtil.autowidth(10)
  },
  ctx:{
    marginBottom:ScreenUtil.autoheight(0),
    maxHeight: ScreenHeight/3*2,
  },
  contentext: {
    color:"#808080",
    lineHeight:ScreenUtil.autoheight(24),
    fontSize:ScreenUtil.setSpText(12),
  },
  bottom:{
    overflow: 'hidden',
    width:"100%",
    flexDirection: 'row',
    justifyContent: 'center',
    height:ScreenUtil.autoheight(70),
    marginTop:ScreenUtil.autoheight(20),
    borderBottomLeftRadius: ScreenUtil.autowidth(10),
    borderBottomRightRadius: ScreenUtil.autowidth(10),
  },
  footpoho: {
    position: 'absolute',
    left: -ScreenUtil.autowidth(10), 
    bottom: ScreenUtil.autoheight(50),
    zIndex: 999,
    width: ScreenWidth-ScreenUtil.autowidth(58), 
    height: (ScreenWidth-ScreenUtil.autowidth(58)) * 0.871
  },
});
