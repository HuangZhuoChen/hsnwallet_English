import React from 'react';
import {StyleSheet,Animated, Text,TouchableWithoutFeedback,View,TouchableOpacity,} from 'react-native';
import ScreenUtil from '../../utils/ScreenUtil';
import TextButton from '../TextButton';
import Constants from '../../utils/Constants';
import {CusProgressBar} from './CusProgressBar'
import CodePush from 'react-native-code-push'
export class VersionUpdate {

  static bind(VersionUpdate) {
    this.map["VersionUpdate"] = VersionUpdate;
  }

  static unBind() {
    this.map["VersionUpdate"] = null;
    delete this.map["VersionUpdate"];
  }
  
  static show(title,content,ok,cancel,callback) {
    this.map["VersionUpdate"].show(title,content,ok,cancel,callback);
  }

}

VersionUpdate.map = {};

export class VersionUpdateView extends React.Component {

  state = {
    modalVisible: false,
    immediateUpdate: false,
    mask: new Animated.Value(0),
    alert: new Animated.Value(0)
  };

  constructor(props) {
    super(props);
    VersionUpdate.bind(this);
  }
   
  show = (title,content,ok,cancel,callback) =>{
    if(this.isShow||this.state.modalVisible){
      this.state.mask.stopAnimation();
      this.state.alert.stopAnimation();
      // return;
    }
    this.isShow = true;
    this.VersionUpdateCallback = callback;
    this.setState({title:title,content:content,ok:ok,cancel:cancel,modalVisible:true});
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
    Animated.parallel([
        Animated.timing(this.state.mask,{toValue:0,duration:20}),
        Animated.timing(this.state.alert,{toValue:0,duration:10})
    ]).start(() => {
        this.setState({modalVisible:false});
    });
  }

  cancel = () =>{
    this.dimss();
    this.VersionUpdateCallback && this.VersionUpdateCallback(false);
  }

  ok = () =>{
    this.dimss();
    this.VersionUpdateCallback && this.VersionUpdateCallback(true);
  }


  //开始热更新
  immediateUpdate() {
    this.setState({immediateUpdate: true})
    CodePush.allowRestart();
    CodePush.sync(
      { installMode: CodePush.InstallMode.IMMEDIATE },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    )
  }

  codePushStatusDidChange(syncStatus) {
    if (this.state.immediateUpdate) {
      switch(syncStatus) {
        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
          this.syncMessage = 'Checking for update' //检查更新
          break;
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          this.syncMessage = 'Downloading package' //下载包
          break;
        case CodePush.SyncStatus.AWAITING_USER_ACTION:
          this.syncMessage = 'Awaiting user action' //等待用户操作
          break;
        case CodePush.SyncStatus.INSTALLING_UPDATE:
          this.syncMessage = 'Installing update' //安装更新
          break;
        case CodePush.SyncStatus.UP_TO_DATE:
          this.syncMessage = 'App up to date.' //应用程序最新。
          break;
        case CodePush.SyncStatus.UPDATE_IGNORED:
          this.syncMessage = 'Update cancelled by user' //用户取消的更新
          break;
        case CodePush.SyncStatus.UPDATE_INSTALLED:
          this.syncMessage = 'Update installed and will be applied on restart.' //已安装更新并将在重新启动时应用
          codePush.notifyAppReady();
          break;
        case CodePush.SyncStatus.UNKNOWN_ERROR:
          this.syncMessage = 'An unknown error occurred' //发生未知错误。
          Toast.show('更新出错,请重启应用')
          this.dimss();
          break;
      }
    }
  }

  codePushDownloadDidProgress(CusProgressBar) {
    if (this.state.immediateUpdate) {
      this.currProgress = parseFloat(CusProgressBar.receivedBytes / CusProgressBar.totalBytes).toFixed(2)
      if(this.currProgress >= 1) {
        this.dimss();
      } else { 
        this.refs.CusProgressBar.progress = this.currProgress
      }
    }
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
                  <Text style={styles.title}>{this.state.title?this.state.title:"提示"}</Text>
                  <View style={styles.ctx}>
                    {(typeof(this.state.content)=='string')?<Text style={styles.contentext}>{this.state.content?this.state.content:""}</Text>:this.state.content}
                  </View>
                  {this.state.immediateUpdate &&
                  <CusProgressBar
                    ref="CusProgressBar"
                    progressColor={'#3B80F4'}
                    style={{
                      marginTop: ScreenUtil.autoheight(10),
                      marginHorizontal:ScreenUtil.setSpText(20),
                      height: ScreenUtil.autoheight(10),
                      backgroundColor: '#E4E4E4',
                      borderRadius: ScreenUtil.autowidth(5),
                    }}
                  />
                  }
                  {this.state.immediateUpdate ?
                    <View style={[styles.bottom,{width:"100%",justifyContent: 'center', alignItems: 'center', borderTopColor: "#DBDBDB", borderTopWidth: 1}]}>
                      <TextButton onPress={()=>{CodePush.disallowRestart();this.dimss()}} fontSize={ScreenUtil.setSpText(16)} textColor="#D9D9D9" bgColor="#fff" text={"取消"} style={{height:ScreenUtil.setSpText(44),borderRadius: 25}} />
                    </View>
                  :
                    <View style={[styles.bottom,!this.state.cancel && {justifyContent: 'center',marginBottom:ScreenUtil.autowidth(20)}]}>
                      {this.state.cancel && 
                      <View style={{width:"50%"}}>
                        <TextButton onPress={()=>{this.dimss()}} textColor="#D9D9D9" bgColor="#fff" text={this.state.cancel?this.state.cancel:"取消"} style={{height:ScreenUtil.setSpText(44),borderTopWidth:ScreenUtil.setSpText(0.3),borderColor:"rgba(204,204,204,0.5)",borderBottomLeftRadius:4}} />
                      </View>
                      }
                      {this.state.ok && 
                      <View style={{width:"50%"}}>
                        <TextButton onPress={() => this.immediateUpdate()} bgColor="#3B80F4" textColor="#fff" text={this.state.ok?this.state.ok:"升级"} style={this.state.cancel ? {height:ScreenUtil.setSpText(44),borderBottomRightRadius:4} : {height:ScreenUtil.setSpText(40),borderRadius: 25}} />
                      </View>
                      }
                    </View>
                  }
                  
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
