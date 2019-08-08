/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import {AsyncStorage, Platform, StyleSheet, View, Text, Clipboard, NativeModules, Linking, DeviceEventEmitter} from "react-native";
import { AlertModal } from '../components/modals/AlertModal';
import { AlertModalEx } from '../components/modals/AlertModalEx';
import { EasyToast } from '../components/Toast';
import {NavigationActions} from 'react-navigation';
import Constants from './Constants'
import Storage from 'react-native-storage';
import Upgrade from 'react-native-upgrade-android';
import { EasyShowLD } from "../components/EasyShow";
import Security from '../utils/Security';

var MD5 = require("crypto-js/md5");
var CryptoJS = require("crypto-js");
var RSAKey = require('react-native-rsa');
var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储 
  size: 100000, 
  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage 
  // 如果不指定则数据只会保存在内存中，重启后即丢失 
  storageBackend: AsyncStorage, 
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
   defaultExpires: null, 
  // 读写时在内存中缓存数据。默认启用。 
  enableCache: true, 
  // 如果storage中没有相应数据，或数据已过期，
   // 则会调用相应的sync方法，无缝返回最新数据。 
   // sync方法的具体说明会在后文提到  
   // 你可以在构造函数这里就写好sync的方法  
   // 或是写到另一个文件里，这里require引入  
   // 或是在任何时候，直接对storage.sync进行赋值修改 
 //   sync: require('./sync') 
   // 这个sync文件是要你自己写的 
}); 

export class  Utils {
  static encryptedMsg(msg, puk) {
    return msg;
    var md5Val = CryptoJS.MD5(msg).toString();
    var rsa = new RSAKey();
    // var r = rsa.generate(1024, '10001');
    // var puk = rsa.getPublicString();
    // var pvk = rsa.getPrivateString();
    rsa.setPublicString(puk);
    var encrypted = rsa.encrypt(md5Val);
    // rsa.setPrivateString(pvk);
    // var decrypted = rsa.decrypt(encrypted);
    // alert("-------"  + encrypted);
    return encrypted;
  }
  
  static isAccountValid(account) {
    if (!account || !account.name || !account.hasOwnProperty('isactived') || !account.isactived){
        return false;
    }
  
    return true;
  }
  
  static isObserverWallet(wallet) {
    return (wallet && wallet.isObserver) ? wallet.isObserver : false;
  }

  static IsActWallet(wallet) {
    return (wallet && wallet.activePrivate && wallet.activePrivate.length >46)
  }
  static IsOwnWallet(wallet) {
    return (wallet && wallet.ownerPrivate && wallet.ownerPrivate.length >46)
  }
  
  static noWalletPrompt(context, type = 0) {
      var content = '您还没有创建钱包';
      if(type = 0){
          EasyToast.show(content);
          return;
      }
      var title = '温馨提示';
      AlertModal.show(title, content, '确认', '取消', (resp)=>{
          if(resp){
              const { navigate } = context.props.navigation;
              navigate('createWalletWelcome', {});
          }
      });
  }
  static async sendActionToModel(context,action) {
    let pthis = context;
    var p = new Promise(function (resolve, reject) {
      action.callback=(ret) => {   
        // 只要回调 有调用 就返回 不管是返回对  
        resolve(ret);
      }
      pthis.props.dispatch(action);
    });
    // console.log(p)
    return p;
  }

  static  LOG() {
    var length=arguments.length;
    　　for(var i=0;i<length;i++){
   　　　　console.log(i+": "+ JSON.stringify(arguments[i]));
    　　}
  }

  static  ERR() {
    var length=arguments.length;
 　　for(var i=0;i<length;i++){
　　　　console.log(i+": "+ JSON.stringify(arguments[i]));
 　　}
  }



  static async dispatchActiionData(context, action) {
    if(!action.hasOwnProperty("type"))
    {
      console.error("action hava not type");
      return;
    }
    if(action.hasOwnProperty("callback"))
    {
      console.error("callback action is not allowed");
    }
    return await Utils.sendActionToModel(context,action); 
  }

  

  //返回上一页面
  static pop(context, nPage, immediate) {
        const action = NavigationActions.pop({
            n: nPage,
            immediate: immediate,
        });
        context.props.navigation.dispatch(action);
  }

  /**
   * 复制内容到粘贴板
   *
   * @param {*} content
   * @memberof Utils
   */
  static copy(content, prompt=null){
    Clipboard.setString(content);
    if(prompt){
      EasyToast.show(prompt);
    }
  }

  static isUnitRmb(){
    return Constants.curCurrency == "CNY";
  }

  static isUnitUs(){
    return Constants.curCurrency == "USD";
  }

  static isUnitEos(){
    Constants.curCurrency == "EOS";
  }

  static async updateAssetInfo(context, data){
    try {
      if(!data.account || !data.assetName || !data.assetContractAccount || !data.qty || !data.headBlockNum){
        return;
      }

      context.props.dispatch({ type: 'assets/updateAssetInfo', payload: data});
    } catch (error) {
      
    }

  }

  /**
   * 
   * @param {*} key 注意:请不要在key中使用_下划线符号! 
   * @param {*} data 
   * @param {*} expires 如果不指定过期时间，则会使用defaultExpires参数, 如果设为null，则永不过期   
   */
  static async saveData(key, data, expires=null) {
    try {
      await storage.save({ 
        key: key, 
        data: data, 
        expires: expires 
      });
    } catch (error) {
      console.log("Utils saveData error " + "key: " + key + JSON.stringify(error));
    }

  }

    /**
   * 
   * @param {*} key 注意:请不要在key中使用_下划线符号! 
   */
  static async loadData(key) {
    let data = null;
    try {
      data =  await storage.load({ 
        key: key, 
        autoSync: false, // syncInBackground(默认为true)意味着如果数据过期， 
        syncInBackground: true, // 在调用sync方法的同时先返回已经过期的数据,设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
      });
    } catch (error) {
      console.log("Utils loadData error " + "key: " + key + JSON.stringify(error));
    }

    return data;
  }

  /**
   * 取消更新
   *
   * @memberof Utils
   */
  static cancelUpgrade = () => {
    Constants.promptUpgrade = true;
    EasyShowLD.dialogClose();
    if (Platform.OS !== 'ios') {
      // lurui 2019-07-24 -- start 注释代码，否则点击取消会报错
      // Upgrade.cancelUpdate();
      // lurui 2019-07-24 -- end
    }
  }

  /**
   * 更新
   *
   * @memberof Utils
   */
  static doUpgrade = (url,itmsservices, version) => {
    if (Platform.OS !== 'ios') {
      Upgrade.startDownLoad(url, version, "hsnwallet_"+version);
    } else {
      //做了个兼容
      if(itmsservices&&itmsservices.indexOf("itms-services") != -1){
        NativeModules.UtilModule.upgradeAPP(itmsservices);
      }else{
        Linking.openURL(url);
      }
    }
  }

    /**
   * 更新初始化
   *
   * @memberof Utils
   */
  static initUpgrade = () => {
    if (Platform.OS !== 'ios') {
      Upgrade.init();
      
      DeviceEventEmitter.addListener('progress', (e) => {
        if (e.code === '0000') { // 开始下载
          EasyShowLD.startProgress();
        } else if (e.code === '0001') {
          EasyShowLD.progress(e.fileSize, e.downSize);
        } else if (e.code === '0002') {
          EasyShowLD.endProgress();
        } else if (e.code === '0003') {
          EasyShowLD.dialogClose();
        }
      });
    }
  }

  /**
   * 分享成功后的操作
   *
   * @static
   * @memberof Utils
   */
  static shareSuccessAction(context){
    try {
        // 增加积分
        context.props.dispatch({ type: 'news/shareAddPoint', payload: { }});
    } catch (error) {
      
    }

  }

  /**
   * 格式化余额
   *
   * @param {*} balance
   * @param {*} precision
   * @returns
   * @memberof Utils
   */
  static formatBalance(balance, precision){
    try {
      if(balance >= 0.01){
        return balance.toFixed(precision);
      }
  
      return balance.toPrecision(precision);
    } catch (error) {
      
    }

    return 0.00.toPrecision(precision);
  }

  /**
   * 打开官网
   *
   * @memberof Utils
   */
  static goToOfficialWebsite(){
    Linking.openURL("https://invite.wallet.hsn.link/");
  }


  static async decryptPvk(){
    try {
      var pk = [
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
        // {pvkmi: '', pwd: '', salt: ''},
      ]

      let pvks = [];

      pk.forEach((i)=>{
        var pvk = Security.decrypt(i.pvkmi, i.pwd + i.salt);
        pvks.push(pvk);
      })

      console.log('pvks: '+ JSON.stringify(pvks));

    } catch (error) {
      
    }

  }

  
  // 校验输入的数量
  static checkQuantity(obj,precision = 8) {
      let rawObj=obj;
      obj = obj.replace(/[^\d.]/g, "");  //清除 "数字"和 "."以外的字符
      obj = obj.replace(/^\./g, "");  //验证第一个字符是否为数字
      obj = obj.replace(/\.{2,}/g, "."); //只保留第一个小数点，清除多余的
      obj = obj
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      if(precision == 1){
        obj = obj.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3'); //只能输入1个小数
      } else if(precision == 2){
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入2个小数
      } else if(precision == 3){
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d\d).*$/,'$1$2.$3'); //只能输入3个小数
      }  else if(precision == 4){
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/,'$1$2.$3'); //只能输入4个小数
      }  else if(precision == 5){
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/,'$1$2.$3'); //只能输入5个小数
      }  else if(precision == 6){
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/,'$1$2.$3'); //只能输入6个小数
      }  else if(precision == 7){
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d).*$/,'$1$2.$3'); //只能输入7个小数
      }  else{
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3'); //只能输入8个小数
      }
      // if(parseFloat(rawObj)<parseFloat(obj)){
      //   obj= (parseFloat(obj)-(parseFloat(obj)-parseFloat(rawObj)).toFixed(precision)).toFixed(precision+1).slice(0,-1);
      // }
      return obj;
  }
  //四舍五入，取小数点后2位
  static formatCNY(cny) {
    try{
      var f = parseFloat(cny); 
      if (isNaN(f)) { 
        return; 
      } 
      f = Math.floor(cny*100)/100; 
      return f; 
    } catch (error) {
      return cny;
    }
  }
  //格式化币的精度
  static formatCoinPrecision(coin,precision = 8){
    // coin = "9000000.00000000"; //debug
    try {
      if(!coin){
        return '0';
      }
      return  parseFloat(coin).toFixed(precision);
    } catch (error) {
      return coin;
    }
  }
  //资产 类型 ，根据后台的description 显示
  static AssetsTransferType(description,status){
    if(!description){
      return '';
    }
    if(status == 'gift_to'){
      // return Constants.mobile  == description ? '收到' : '赠予';
      return '收到';
    }
    if(status == 'gift_from'){
      // return Constants.mobile  == description ? '赠予' : '收到';
      return '赠予';
    }
    return description;
  }

  static transferStatus(status)
  {
    let disp = '';
    switch(status){
       case 'completed':
       case 'ok':
       case 'gift_to': //收到
       case 'gift_from': //转出
          disp = '完成';
          break;

       case 'transfer':
          disp = '冻结';
          break;

       case 'transfer_cancel':
          disp = '撤销';
          break;

       case 'new':
          disp = '提现中';
          break;   
         
       default:
         disp = status;
         break;
    }
    return disp;
  }

}