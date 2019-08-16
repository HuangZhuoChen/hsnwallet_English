import {Platform,DeviceEventEmitter,Linking} from 'react-native';
import JPushModule from 'jpush-react-native';
import { EasyShowLD } from "../components/EasyShow"
const init = (navigation) => {
    
    if (Platform.OS === 'android') {
        JPushModule.initPush()
        JPushModule.notifyJSDidLoad(resultCode => {
          if (resultCode === 0) {}
        })
    }

    if (Platform.OS === 'ios') {
        JPushModule.setupPush();
        //点击通知唤起app
        JPushModule.addOpenNotificationLaunchAppListener(map=>{
            let extras =  JSON.parse(map.extras);
            if(extras && extras.url){
                if(extras.url.startsWith("http://") || extras.url.startsWith("https://")){
                    navigation("Web",{title:map.alertContent,url:extras.url});
                }else if(extras.url.startsWith("hsnwallet://")){
                    let nav = extras.url.replace("hsnwallet://","")
                    navigation(nav,extras.params?extras.params:{});
                }else if(extras.url.startsWith("alert://")){
                    EasyShowLD.dialogShow("温馨提示",map.alertContent,"知道了",null,()=>{EasyShowLD.dialogClose()});
                }else{

                }
            }
        });
    }
    //收到自定义消息
    JPushModule.addReceiveCustomMsgListener(map => {
        //alert(JSON.stringify(map))
    });
    //收到消息
    JPushModule.addReceiveNotificationListener(map => {

        let extras = JSON.parse(map.extras);
        if (extras && extras.url && extras.url.startsWith("transfer://")) {
            DeviceEventEmitter.emit('wallet_info')
        }
    });
    //点击通知
    JPushModule.addReceiveOpenNotificationListener(map => {
        let extras = JSON.parse(map.extras);
        if (extras && extras.url && extras.title) {
            extras.url = extras.url.trim(); //剔除空格
            if (extras.url.startsWith("app:")) {
                //内部js跳转
                let tmp_url1 = extras.url.substring("app:".length);
                navigation(tmp_url1, {});
            } else if (extras.url.startsWith("ext_viewer:")) {
                //外部浏览器打开
                let tmp_url3 = extras.url.substring("ext_viewer:".length);
                Linking.openURL(tmp_url3); 
            } else if(extras.url.startsWith("http://") || extras.url.startsWith("https://")){
                //内部浏览器打开
                navigation("Web",{title:extras.title,url:extras.url});
            } else if (extras.url.startsWith("transfer://")) {

            } else {

            }
        }
    });
    //注册设备
    JPushModule.addGetRegistrationIdListener(registrationId => {
        
    });
};

export default {
  init
};
