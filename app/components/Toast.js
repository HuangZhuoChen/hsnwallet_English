import React from 'react';
import {StyleSheet,Text,View,Animated,Easing,Keyboard,Dimensions} from 'react-native';
import ScreenUtil from "../utils/ScreenUtil";
const ScreenHeight = Dimensions.get('window').height;

export class EasyToast {

  static bind(toast) {
    toast && (this.map['toast'] = toast);
  }

  static unBind() {
    this.map["toast"] = null
    delete this.map["toast"];
  }

  static show(text, duration, callback) {
    this.map["toast"].show(text, duration, callback);
  }

  static dismis() {
    this.map["toast"].close();
  }

  static switchRoute(){

  }

}

EasyToast.map = {};

export const DURATION = {LENGTH_SHORT: 800,FOREVER: 0};

export class Toast extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        isTopShow: false,
        isCenterShow:false,
        text:'',
        transformY:new Animated.Value(-150),
        opacityValue: new Animated.Value(0.7),
      }
      EasyToast.bind(this);
    }

    show(text, duration = 1500) {
      if(this.isShow) return;
      this.isShow=true;
      if(this.isShowKeyBoard){
        this.setState({isTopShow:true,text:text});
      }else{
        this.setState({isCenterShow:true,text:text});
      }
      Animated.parallel([
        Animated.timing(this.state.transformY,{toValue:0,duration: 300,easing:Easing.linear}),
        Animated.timing(this.state.opacityValue,{toValue:1,duration:300,easing:Easing.linear})
      ]).start(() => {
        this.close(duration);
      });
    }

    close(duration = 1500) {
      if(!this.isShow)return;
      this.ToastTimer && clearTimeout(this.ToastTimer);
      this.ToastTimer = setTimeout(() => {
        clearTimeout(this.ToastTimer);
        Animated.parallel([
          Animated.timing(this.state.transformY,{toValue: 0-ScreenUtil.autowidth(70),duration: 300,easing: Easing.linear}),
          Animated.timing(this.state.opacityValue,{toValue:0,duration:300,easing:Easing.linear})
        ]).start(() => {
          this.isShow=false;
          this.setState({isTopShow:false,isCenterShow:false});
        });
      },duration);
    }

    componentWillMount(){
      Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
      Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
      this.ToastTimer && clearTimeout(this.ToastTimer);
      Keyboard.removeListener('keyboardDidShow');
      Keyboard.removeListener('keyboardDidHide');
      EasyToast.unBind();
    }

    _keyboardDidShow(e){
      this.isShowKeyBoard=true;
    }

    _keyboardDidHide(e){
      this.isShowKeyBoard=false;
    }

    render() {
        var view = null;
        if(this.state.isTopShow){
          view = <Animated.View style={[styles.container,{transform:[{translateY:this.state.transformY}]}]}>
          <View style={styles.content}>
            <Text style={styles.text}>{this.state.text}</Text>
          </View>
        </Animated.View>
        }else if(this.state.isCenterShow){
          view = <View style={[centerStyles.container,
          Constants.dappHorizontalScreenFlag?{top:ScreenUtil.autowidth(1)}:{top:ScreenHeight-ScreenUtil.autoheight(150)} ]} pointerEvents="none">
              <Animated.View style={[centerStyles.content,{opacity:this.state.opacityValue}]}>
                  <Text style={centerStyles.text}>{this.state.text}</Text>
              </Animated.View>
          </View>
        }
        return view;
    }
}
const centerStyles = StyleSheet.create({
  container: {
      position: 'absolute',
      left: 0,
      right: 0,
      elevation: 999,
      alignItems: 'center',
      zIndex: 99999999999999,
  },
  content: {
      backgroundColor: '#4F5162',
      borderRadius:4,
      padding: 12,
      opacity:50
  },
  text: {
    color: 'white'
  }
});
const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 9999999999,
      width:"100%",
      height:ScreenUtil.autowidth(ScreenUtil.isIphoneX()?88:66),
      backgroundColor:"#3B80F4",
      elevation:4,
      shadowColor:"rgba(0,0,0,0.5)",
      shadowOffset:{width:3,height:3},
      shadowOpacity:0.9,
      shadowRadius:5
    },
    content: {
      marginTop: ScreenUtil.autowidth(ScreenUtil.isIphoneX()?36:16),
      borderRadius: ScreenUtil.autowidth(5),
      padding: ScreenUtil.autowidth(10),
      height:ScreenUtil.autowidth(50),
      flexDirection: 'row',
      justifyContent: 'center',
    },
    text: {
      color: '#ffffff',
      alignSelf: 'center',
      fontSize: ScreenUtil.autowidth(15),
    }
});
