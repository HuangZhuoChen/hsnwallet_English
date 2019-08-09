import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Modal, Text, Platform, Animated, KeyboardAvoidingView, TouchableWithoutFeedback, View, Dimensions, ActivityIndicator} from 'react-native';
import { material } from 'react-native-typography';
import ProgressBar from "./ProgressBar";
import UColor from '../utils/Colors'
import TextButton from './TextButton';
import ScreenUtil from '../utils/ScreenUtil'
import { Utils } from '../utils/Utils';
import LinearGradient from 'react-native-linear-gradient'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
var prs = 0;
var tk = null;
const LoadingShow=1;
const DailogShow=0;
const DailogShowWL=2;

export class EasyShowLD {
    constructor() {}

    static bind(LoadingDialog) {
      this.map["LoadingDialog"] = LoadingDialog;
    }

    static unBind() {
      this.map["LoadingDialog"] = null;
      delete this.map["LoadingDialog"];
    }

    static dialogShow(title, content, okLable, disLabel, okHandler,cancelHandler) {
      clearTimeout(this.handle);
      this.map["LoadingDialog"].setState({
        "modalVisible": true,
        "loadingDialogFlag": DailogShow,
        title,
        content,
        okLable,
        disLabel,
        okHandler,
        cancelHandler
      });
    }

    static dialogClose() {
        clearTimeout(this.handle);
        this.map["LoadingDialog"].setState({
          "modalVisible": false,
          showProgress: false
        });
    }

    //进度条
    static startProgress() {
      this.map["LoadingDialog"].setState({
        okHandler: null,
        disLabel: null,
        showProgress: true
      });
      var th = this;
      tk = setInterval(function () {
        th.map["LoadingDialog"].setState({
          progress: prs
        })
      }, 300);
    }

    static endProgress() {
      clearInterval(tk);
    }

    static progress(total, current) {
      let p = current / total;
      prs = parseInt((ScreenWidth - ScreenUtil.autowidth(126)) * p);
    }



    //以下是loading部分的
    static loadingShow(text = 'Loading...', timeout = 60000) {
      this.map["LoadingDialog"].loadingShow(text,timeout);
    }

    //切换页面时,如果有loading显示,立刻关闭
    static switchRoute() {

      if (this.map["LoadingDialog"] && this.map["LoadingDialog"].state.modalVisible) {
        this.map["LoadingDialog"] && this.map["LoadingDialog"].setState({
            "modalVisible": false
          });
      }
    }

    static loadingClose() {
      this.map["LoadingDialog"].loadingClose();
    }

}

EasyShowLD.map = {};

export class LoadingDialog extends React.Component {
    static propTypes = {
      type: PropTypes.string,
      color: PropTypes.string,
      textStyle: PropTypes.any,
      loadingStyle: PropTypes.any,
    };

    state = {
      modalVisible: false,
      loadingDialogFlag:LoadingShow,

      showProgress: false,
      progress: 0,

      timeout: 60000,
      text: "Loading...",
      mask: new Animated.Value(0),
    };

    constructor(props) {
      super(props);
      let handle = 0;
      EasyShowLD.bind(this);
    }

    componentWillUnmount() {
      clearTimeout(this.handle);
    }

    loadingClose = () =>{
      Animated.parallel([
          Animated.timing(this.state.mask,{toValue:0,duration:300}),
      ]).start(() => {
        this.isLoadingShow = false;
        this.setState({modalVisible:false});
      });
    }

    loadingShow = (text,timeout) => {
      if(this.isLoadingShow){
        return;
      }
      this.isLoadingShow = true;
      clearTimeout(this.handle);
      this.setState({modalVisible: true,loadingDialogFlag: LoadingShow,"text": text,"timeout": timeout});
      Animated.parallel([Animated.timing(this.state.mask,{toValue:0.6,duration:300})]).start(()=>{

      });
      if (timeout > 0) {
        this.handle = setTimeout(() => {
          clearTimeout(this.handle);
          this.loadingClose();
        }, timeout);
      }
    }

    render() {
      return (
        <View>
          <Modal
            animationType={'fade'}
            transparent={true}
            hardwareAccelerated
            visible={this.state.modalVisible}
            onRequestClose={()=>{console.log('dailog modal close...')}}
            supportedOrientations={['portrait', 'landscape']}
            onShow={()=>{console.log('dailog modal show...')}}>
          <Animated.View style={[styles.mask,{opacity:this.state.mask}]}></Animated.View>
          {this.state.loadingDialogFlag==LoadingShow &&
          <View style={[styles.load_box,{backgroundColor: "rgba(0,0,0,0.7)"}, this.props.loadingStyle]}>
              <ActivityIndicator animating={true} color={this.props.color || UColor.btnColor} size={'large'} style={styles.load_progress} />
              <Text style={[styles.load_text,{color: UColor.btnColor}, this.props.textStyle]}>{this.state.text}</Text>
          </View>}

          {this.state.loadingDialogFlag==DailogShow &&
            <TouchableWithoutFeedback>
              <View style={[styles.backgroundOverlay,{backgroundColor: UColor.mask}]}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                  <View style={[styles.modalContainer,styles.modalContainerPadding,{backgroundColor:UColor.btnColor}]}>
                    <TouchableWithoutFeedback>
                      <View>
                        <View style={styles.titleContainer}>
                            <Text style={[material.title,{color:'#3B80F4'}]}>{this.state.title}</Text>
                        </View>
                        <View style={[styles.contentContainer,styles.contentContainerPadding]}>
                          {(typeof(this.state.content)=='string')?<Text style={styles.contentext}>{this.state.content}</Text>:this.state.content}
                        </View>
                        {this.state.showProgress?
                          <View style={{alignItems: 'center', }}>
                            <ProgressBar style={{width:ScreenWidth-ScreenUtil.autowidth(126), height: ScreenUtil.autowidth(10), marginBottom: ScreenUtil.autoheight(10), backgroundColor: '#E4E4E4', borderRadius:5  }} progress={this.state.progress}/>
                            <View style={{paddingHorizontal: ScreenUtil.autowidth(15), flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} >
                              <Text style={styles.contentext}>{"Tips: If the update fails, please go to the official website to download it."}</Text>
                              <Text onPress={()=>Utils.goToOfficialWebsite()} style={[styles.contentext,{color:'#3B80F4'}]}>https://invite.wallet.hsn.link</Text>
                            </View>
                            <LinearGradient colors={['#4F5162','#1E202C']}  start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.bottom}>
                              <View style={{width:"100%",justifyContent: 'center', alignItems: 'center'}}>
                                <TextButton onPress={this.state.cancelHandler} shadow={false} textColor="#FFFFFF" bgColor="#9C9DA4" fontSize={ScreenUtil.setSpText(15)} text={this.state.disLabel?this.state.disLabel:"取消"} 
                                  style={{width: ScreenUtil.autowidth(120), height:ScreenUtil.autoheight(40),borderRadius: ScreenUtil.autowidth(23),}} />
                              </View>
                            </LinearGradient>
                          </View>
                          :
                          <View style={{flexDirection: 'column'}} >
                            <View style={{paddingHorizontal: ScreenUtil.autowidth(15), flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} >
                              <Text style={styles.contentext}>{"Tips: If the update fails, please go to the official website to download it."}</Text>
                              <Text onPress={()=>Utils.goToOfficialWebsite()} style={[styles.contentext,{color:'#3B80F4'}]}>https://invite.wallet.hsn.link</Text>
                            </View>
                            <LinearGradient colors={['#4F5162','#1E202C']}  start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={[styles.bottom, !this.state.disLabel && {justifyContent: 'center',marginBottom:ScreenUtil.autowidth(20)}]}>
                              {this.state.disLabel &&
                                <View style={{width:"50%",alignItems: 'center', justifyContent: 'center',}}>
                                  <TextButton onPress={this.state.cancelHandler} shadow={false} textColor="#FFFFFF" bgColor="#9C9DA4" fontSize={ScreenUtil.setSpText(15)} text={this.state.disLabel?this.state.disLabel:"取消"} 
                                  style={{width: ScreenUtil.autowidth(120), height:ScreenUtil.autoheight(40),borderRadius: ScreenUtil.autowidth(23),}} />
                                </View>
                              }
                              {this.state.okLable &&
                                <View style={{width:"50%",alignItems: 'center', justifyContent: 'center',}}>
                                  <TextButton onPress={this.state.okHandler} shadow={true}  textColor="#FFFFFF" fontSize={ScreenUtil.setSpText(15)} text={this.state.okLable?this.state.okLable:"确认"} 
                                  style={{width: ScreenUtil.autowidth(120), height:ScreenUtil.autoheight(40),borderRadius: ScreenUtil.autowidth(23),}} />
                                </View>
                              }
                            </LinearGradient>
                          </View>
                        }
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </TouchableWithoutFeedback>}
          </Modal>
        </View>
      )
    }
}

const styles = StyleSheet.create({

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

  load_box: {
    width: ScreenUtil.autowidth(100),
    height: ScreenUtil.autowidth(100),
    alignItems: 'center',
    marginLeft: ScreenWidth / 2 - ScreenUtil.autowidth(50),
    marginTop: ScreenHeight / 2 - ScreenUtil.autowidth(50),
    borderRadius: ScreenUtil.autowidth(10),
  },
  load_progress: {
    position: 'absolute',
    width: ScreenUtil.autowidth(100),
    height: ScreenUtil.autowidth(90)
  },
  load_text: {
    marginTop: ScreenUtil.autowidth(70),
  },

  backgroundOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    marginHorizontal: ScreenUtil.autowidth(48),
    minWidth: ScreenWidth - ScreenUtil.autowidth(96),
    elevation: 24,
    overflow: 'hidden',
    borderRadius: ScreenUtil.autowidth(10),
  },
  modalContainerPadding: {
    paddingTop: ScreenUtil.autoheight(25),
  },
  titleContainer: {
    paddingHorizontal: ScreenUtil.autowidth(22),
    paddingBottom: ScreenUtil.autoheight(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: -1,
  },
  contentContainerPadding: {
    paddingHorizontal: ScreenUtil.autowidth(15),
    paddingBottom: ScreenUtil.autoheight(10),
  },
  contentext : {
    color: '#808080',
    fontSize: ScreenUtil.setSpText(12),
    lineHeight: ScreenUtil.autoheight(24),
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
  }

});
