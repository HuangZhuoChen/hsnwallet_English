import React from 'react';
import {StyleSheet,Animated,Text,TouchableWithoutFeedback,View,TouchableOpacity,Image} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import TextButton from '../TextButton';
import UImage from '../../utils/Img';
import Constants from '../../utils/Constants';
import CheckMarkCircle from '../CheckMarkCircle'

export class AlertModalEx {

  static bind(AlertModalEx) {
    this.map["AlertModalEx"] = AlertModalEx;
  }

  static unBind() {
    this.map["AlertModalEx"] = null;
    delete this.map["AlertModalEx"];
  }

  static show(title,content,ok,cancel,callback) {
    this.map["AlertModalEx"].show(title,content,ok,cancel,callback);
  }

  //窗口同步显示
  static async showSync(title,content,ok,cancel) {  
    let pthis =this; 
    var p = new Promise(function (resolve, reject) {
      pthis.map["AlertModalEx"].show(title,content,ok,cancel,(ret) => {
                    resolve(ret);
              });     
    });
    return p;
  }



}

AlertModalEx.map = {};

export class AlertModalExView extends React.Component {

    state = {
      modalVisible: false,
      // mask: new Animated.Value(0),
      // alert: new Animated.Value(0),
      isChecked: false,
    };

    constructor(props) {
      super(props);
      AlertModalEx.bind(this);
    }

    show = (title,content,ok,cancel,callback) =>{
      if(this.isShow||this.state.modalVisible){
        // this.state.mask.stopAnimation();
        // this.state.alert.stopAnimation();
        return;
      }
      this.isShow = true;
      //如果需要支持返回关闭，请添加这句，并且实现dimss方法
      window.currentDialog = this;
      this.AlertModalExCallback = callback;
      this.setState({title:title,content:content,ok:ok,cancel:cancel,modalVisible:true});
      // Animated.parallel([
      //   Animated.timing(this.state.mask,{toValue:0.6,duration:100}),
      //   Animated.timing(this.state.alert,{toValue:1,duration:50})
      // ]).start(() => {});
    }

    dimss = () => {
      if(!this.isShow){
        // this.state.mask.stopAnimation();
        // this.state.alert.stopAnimation();
        return;
      }
      this.isShow = false;
      window.currentDialog = null;
      // Animated.parallel([
      //     Animated.timing(this.state.mask,{toValue:0,duration:20}),
      //     Animated.timing(this.state.alert,{toValue:0,duration:10})
      // ]).start(() => {
          this.setState({modalVisible:false,isChecked: false});
      // });
    }

    cancel = () =>{
      this.dimss();
      this.AlertModalExCallback && this.AlertModalExCallback(null);
    }

    ok = () =>{
      this.dimss();
      this.AlertModalExCallback && this.AlertModalExCallback({prompt:this.state.isChecked});
    }
    checkClick = () =>{
      let isChecked = this.state.isChecked;
      this.setState({isChecked: !isChecked});
    }

    render() {
        return (
          this.state.modalVisible && <View style={styles.continer}>
            <TouchableWithoutFeedback onPress={()=>{this.dimss()}}>
              <View style={styles.content}>
                <View style={[styles.alertContent,Constants.dappHorizontalScreenFlag?{paddingHorizontal:ScreenUtil.screenHeith*3/10}:{padding:ScreenUtil.autowidth(40)}]}>
                  <View style={[styles.alert,]}>
                    <TouchableOpacity activeOpacity={1}>
                      {this.state.title && <Text style={styles.title}>{this.state.title}</Text>}
                      <View style={styles.ctx}>
                        {(typeof(this.state.content)=='string')?<Text style={styles.contentext}>{this.state.content?this.state.content:""}</Text>:this.state.content}
                      </View>
                      <TouchableOpacity  style={{flexDirection:"row",alignItems:"center", marginHorizontal: ScreenUtil.autowidth(20),}} onPress={() => this.checkClick()} >
                        <CheckMarkCircle  width={ScreenUtil.autowidth(13)} height={ScreenUtil.autowidth(13)} selected={this.state.isChecked} onPress={() => this.checkClick()}/>
                        <Text style={{ color:"#3B80F4", fontSize:ScreenUtil.setSpText(12), paddingLeft:  ScreenUtil.autowidth(10)}}>{"不再提示"} </Text>
                      </TouchableOpacity>
                      {this.state.cancel && 
                        <View style={styles.bottom}>
                          <View style={{width:"50%"}}>
                            <TextButton onPress={()=>{this.cancel()}} textColor="#D9D9D9" bgColor="#fff" text={this.state.cancel?this.state.cancel:"取消"} style={{height:ScreenUtil.setSpText(44),borderTopWidth:ScreenUtil.setSpText(0.3),borderColor:"rgba(204,204,204,0.5)",borderBottomLeftRadius:4}} />
                          </View>
                          <View style={{width:"50%"}}>
                            <TextButton  onPress={()=>{this.ok()}} bgColor="#3B80F4" textColor="#fff" text={this.state.ok?this.state.ok:"确认"} style={{height:ScreenUtil.setSpText(44),borderBottomRightRadius:4}} />
                          </View>
                        </View>
                      }

                      {!this.state.cancel &&
                        <View style={[styles.bottom,{ justifyContent: 'center',marginBottom: ScreenUtil.autowidth(20)}]}>
                          <View style={{width:"50%",}}>
                            <TextButton onPress={()=>{this.ok()}} bgColor="#3B80F4" textColor="#fff" text={this.state.ok?this.state.ok:"确认"} style={{height:ScreenUtil.setSpText(40),borderRadius:25}} />
                          </View>
                        </View>
                      }
                      
                    </TouchableOpacity>
                  </View>
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
    height:"100%",
    backgroundColor:"rgba(0, 0, 0, 0.4)"
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
    borderRadius:4,
    width:"100%",
    backgroundColor:"#fff"
  },
  title:{
    color:"#3B80F4",
    textAlign:"center",
    lineHeight:ScreenUtil.setSpText(26),
    fontSize:ScreenUtil.setSpText(16),
    fontWeight:"bold",
    marginTop:ScreenUtil.setSpText(18),
    margin:ScreenUtil.setSpText(10)
  },
  ctx:{
    marginBottom:ScreenUtil.setSpText(10),
    marginHorizontal:ScreenUtil.setSpText(20),
  },
  contentext: {
    color:"#808080",
    lineHeight:ScreenUtil.setSpText(24),
    fontSize:ScreenUtil.setSpText(12),
  },
  bottom:{
    flexDirection: 'row',
    maxHeight:ScreenUtil.autowidth(44),
    marginTop:ScreenUtil.autowidth(20)
  }
});
