import React, { Component } from 'react'
import { WebView, StyleSheet, Image, View, Text, Clipboard, TouchableOpacity, Linking, Dimensions, Animated, Easing} from 'react-native'
import UImage from '../utils/Img'
import UColor from '../utils/Colors'
import { connect } from 'react-redux'
import Header from '../components/Header'
import ScreenUtil from '../utils/ScreenUtil'
import { EasyToast } from "../components/Toast"
import TextButton from '../components/TextButton'
import { EasyShowLD } from "../components/EasyShow"
import BaseComponent from "../components/BaseComponent";
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
var WeChat = require('react-native-wechat');
require('moment/locale/zh-cn');

@connect(({ news }) => ({ ...news }))
export default class Web extends BaseComponent {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.state.params.title,
      header:null, 
    }
  }
  
  share = () => {
    this.setState({ optionShow: true })
    this.state.transformY = new Animated.Value(200);
    Animated.parallel([
      Animated.timing(this.state.transformY,{
        toValue: 0,
        duration: 400,
        easing: Easing.linear,
      }),
    ]).start();
  }

  _refreshWebview(){
    if(this.refs.refWebview){
      this.state.progress.setValue(0);
      this.refs.refWebview.reload();
    }
  }

  onPressTool(choose){
    this.setState({ optionShow: false })
    if(choose == 0){
      this._refreshWebview();
    }else if(choose == 1){
      Linking.openURL(this.props.navigation.state.params.url); // 外部浏览器打开
    }else if(choose == 2){
      this.setState({ ShareInvite: true })
      this.state.transformShareY = new Animated.Value(200);
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(this.state.transformShareY,{
            toValue: 0,
            duration: 100,
            easing: Easing.linear,
          }),
        ]).start();
      }, 300);
    }else if(choose == 3){
      Clipboard.setString(this.props.navigation.state.params.url);
      EasyToast.show("复制成功");
    }
  }

  constructor(props) {
    super(props)
    this.props.navigation.setParams({ onPress: this.share });
    this.state = {
      progress: new Animated.Value(10),
      error: false,
      news: this.props.navigation.state.params.news,
      
      optionShow: false,
      transformY: new Animated.Value(200),
      
      ShareInvite: false,
      transformShareY: new Animated.Value(200),
    }
    let noop = () => { }
    this.__onLoad = this.props.onLoad || noop
    this.__onLoadStart = this.props.onLoadStart || noop
    this.__onError = this.props.onError || noop
  }

  _onLoad() {
    Animated.timing(this.state.progress, {
      toValue: ScreenWidth,
      duration: 200
    }).start(() => {
      setTimeout(() => {
        this.state.progress.setValue(0);
      }, 300)
    })
    this.__onLoad()
  }

  _onLoadStart() {
    this.state.progress.setValue(0);
    Animated.timing(this.state.progress, {
      toValue: ScreenWidth * .7,
      duration: 5000
    }).start()
    this.__onLoadStart()
  }

  _onError() {
    setTimeout(() => {
      this.state.progress.setValue(0);
    }, 300)
    this.setState({ error: true })
    this.__onError()
  }

  shareAction = (e) => {
    var th = this;
    if (e == 1) {
 
    } else if (e == 2) {

    } else if (e == 3) {
      th.setState({ ShareInvite: false });
      EasyShowLD.dialogShow("温馨提示", "该功能正在紧急开发中,敬请期待", "知道了", null, () => { EasyShowLD.dialogClose() });
    }
  }
  
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: UColor.btnColor,marginBottom: ScreenUtil.isIphoneX() ?ScreenUtil.autoheight(34):ScreenUtil.autoheight(1),  }}>
        <Header {...this.props} onPressLeft={true} title={this.props.navigation.state.params.title} avatar={UImage.dapp_set} 
        imgWidth={ScreenUtil.autowidth(20)} imgHeight={ScreenUtil.autoheight(4)} onPressRight={this.share.bind()}/>
        <WebView
          ref="refWebview"
          source={{ uri: this.props.navigation.state.params.url }}
          startInLoadingState={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          style={[styles.webview_style,{backgroundColor: UColor.btnColor}]}
          onLoad={this._onLoad.bind(this)}
          onLoadStart={this._onLoadStart.bind(this)}
          onError={this._onError.bind(this)}
          renderLoading={() => {
            return <View>
            <Animated.View style={[styles.progress, {backgroundColor: UColor.bar, width: this.state.progress,  top: 0}]}></Animated.View>
          </View>
          }}
        >
        </WebView>
        <View style={[styles.infoPage,{backgroundColor: UColor.bgColor},this.state.error ? styles.showInfo : {}]}>
          <Text style={{ color: UColor.mainColor }}>{"加载失败"}</Text>
        </View>
        {this.state.optionShow ? 
          <View style={[styles.continer,{width:this.state.isLandscape ? ScreenHeight:ScreenWidth,height: this.state.isLandscape ? ScreenWidth:ScreenHeight,}]}>
              <Animated.View style={{ width: "100%",height:"100%", transform: [{ translateX: 0 },{ translateY: this.state.transformY }],}}>
                  <TouchableOpacity onPress={() => {{ this.setState({ optionShow:false }) }}} activeOpacity={1.0} style={{flex: 1}}/>
                  <View style={{width: this.state.isLandscape ? ScreenHeight:ScreenWidth, backgroundColor: '#FFFFFF',paddingTop:  ScreenUtil.autoheight(5), }}>
                      <View style={[styles.head,{width: this.state.isLandscape ? ScreenHeight:ScreenWidth, paddingTop:  ScreenUtil.autoheight(20), justifyContent: 'center', flexWrap:'wrap',}, this.state.isLandscape && {paddingHorizontal: (ScreenHeight - ScreenWidth/5*8)/2, }]}>
                          <TouchableOpacity onPress={this.onPressTool.bind(this,0)} style={[styles.headbtnout,{width: ScreenWidth/4,}]}>
                              <Image source={UImage.refresh_dapp} style={styles.imgBtnBig} />
                              <Text style={[styles.headbtntext,{color: '#808080'}]}>{"刷新"}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity  onPress={this.onPressTool.bind(this,1)} style={[styles.headbtnout,{width: ScreenWidth/4,}]}>
                              <Image source={UImage.browser_dapp} style={styles.imgBtnBig} />
                              <Text style={[styles.headbtntext,{color: '#808080'}]}>{"浏览器打开"}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity  onPress={this.onPressTool.bind(this,2)} style={[styles.headbtnout,{width: ScreenWidth/4,}]}>
                              <Image source={UImage.share_dapp} style={styles.imgBtnBig} />
                              <Text style={[styles.headbtntext,{color: '#808080'}]}>{"分享"}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={this.onPressTool.bind(this,3)} style={[styles.headbtnout,{width: ScreenWidth/4,}]}>
                              <Image source={UImage.copy_dapp} style={styles.imgBtnBig} />
                              <Text style={[styles.headbtntext,{color: '#808080'}]}>{"复制URL"}</Text>
                          </TouchableOpacity>
                      </View>

                      <View style={{paddingBottom: ScreenUtil.isIphoneX()?ScreenUtil.autoheight(10): 0, alignItems: 'center',justifyContent: 'center', borderTopColor: '#D9D9D9', borderTopWidth: 0.5,}}>
                          <TextButton onPress={() => {{ this.setState({ optionShow:false }) }}} textColor="#323232" text={"取消"}  bgColor="#FFFFFF" style={{width: ScreenWidth, height: ScreenUtil.autowidth(49),}} />
                      </View>
                  </View>
          
              </Animated.View>
          </View> : null
        }
        {this.state.ShareInvite ? (
          <View style={styles.continer}>
            <Animated.View style={{ flex: 1, transform: [{ translateX: 0 },{ translateY: this.state.transformShareY }],}}>
              <TouchableOpacity style={{flex: 1,}} onPress={() => { this.setState({ ShareInvite: false }) }}/>
              <View style={styles.content}>
                <View style={{flex: 1, flexDirection: "row",alignItems: 'center',}}>
                  <TouchableOpacity onPress={() => { this.shareAction(1) }} style={{justifyContent: 'center', alignSelf: 'center', width: ScreenWidth/2, }}>
                    <Image source={UImage.share_wx} style={styles.sharewximg} />
                    <Text style={[styles.sharetext,{color: '#323232'}]}>{"微信"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.shareAction(2) }} style={{justifyContent: 'center', alignSelf: 'center', width: ScreenWidth/2, }}>
                    <Image source={UImage.share_pyq} style={styles.sharepyqimg} />
                    <Text style={[styles.sharetext,{color: '#323232'}]}>{"朋友圈"}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { this.setState({ ShareInvite: false }) }} style={{alignItems: 'center',justifyContent: 'center'}}>
                  <View style={[styles.cancelout,{backgroundColor: '#FFFFFF'}]}>
                    <Text style={[styles.canceltext,{color: '#323232'}]}>{"取消"}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  webview_style: {
    flex: 1,
  },
  progress: {
    position: "absolute",
    height: 2,
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  infoPage: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    paddingTop: 50,
    alignItems: "center",
    transform: [
      { translateX: ScreenWidth }
    ],
    
  },
  showInfo: {
    transform: [
      { translateX: 0 }
    ]
  },
  continer:{
    left:0,
    right: 0,
    bottom:0,
    zIndex: 99999,
    position: 'absolute',
    width: ScreenWidth,
    height:ScreenHeight,
    backgroundColor: UColor.mask,
  },
  head: {
      flexDirection: "row",
  },

  headbtnout: {
      alignItems: 'center',
      justifyContent: "center",
      paddingBottom: ScreenUtil.autoheight(20),
  },
  headbtntext: {
      fontSize: ScreenUtil.setSpText(12),
      lineHeight: ScreenUtil.autoheight(17),
  },
  imgBtnBig: {
    width: ScreenUtil.autowidth(30),
    height: ScreenUtil.autowidth(30),
    marginBottom: ScreenUtil.autoheight(5),
  },

  content: {
    height: ScreenUtil.autowidth(132), 
    backgroundColor: '#FFFFFF', 
    elevation: 0.3,
    shadowRadius: 5,
    shadowOpacity:0.2,
    shadowColor: '#4A90E2',
    shadowOffset:{height: 0,width: 0},
  },
  sharewximg: {
    alignSelf: 'center',
    width: ScreenUtil.autowidth(37),
    height: ScreenUtil.autowidth(30),
  },
  sharepyqimg: {
    alignSelf: 'center',
    width: ScreenUtil.autowidth(30),
    height: ScreenUtil.autowidth(30),
  },
  shareqqimg: {
    alignSelf: 'center',
    width: ScreenUtil.autowidth(26),
    height: ScreenUtil.autowidth(30),
  },
  sharewbimg: {
    alignSelf: 'center',
    width: ScreenUtil.autowidth(35),
    height: ScreenUtil.autowidth(30),
  },
  sharetext: {
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(12),
    lineHeight: ScreenUtil.autowidth(20),
  },
  cancelout: {
    borderTopColor: '#F0F0F0',
    borderTopWidth: 0.5,
    width: ScreenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.autowidth(44),
    marginBottom: ScreenUtil.isIphoneX() ?ScreenUtil.autoheight(24):ScreenUtil.autoheight(1), 
  },
  canceltext: {
    textAlign: "center",
    fontSize: ScreenUtil.setSpText(14),
  },

})