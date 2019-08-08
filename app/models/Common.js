import Request from '../utils/RequestUtil';
import { upgrade, upgradeApp, sysNotificationList, getAppConfig, newAnnouncement } from '../utils/Api';
import store from 'react-native-simple-store';
import DeviceInfo from 'react-native-device-info';
import Constants from '../utils/Constants';
import { Utils } from '../utils/Utils';
export default {
    namespace: 'common',
    state: {

    },
    effects: {
      *upgrade({payload,callback},{call,put}) {
        try{
          const resp = yield call(Request.request,upgrade+"?os="+payload.os,'post');
          if(resp && resp.code == 0){
            if(callback)callback(resp);
          }
        }catch(error){
          Utils.ERR("common/upgrade",error,payload);
        }
      },
      *upgradeApp({payload,callback},{call,put}) {
        try{
          const resp = yield call(Request.request, upgradeApp, 'post', { os: payload.os.toLowerCase(), version:  payload.version});
          if(resp){
            if(callback)callback(resp);
          }
        }catch(error){
          Utils.ERR("common/upgradeApp",error,payload);
        }
      },
      *init(action, { call, put }) {
        try {
          // Constants.version = DeviceInfo.getVersion();
          // Constants.version = DeviceInfo.getVersion()+".2";//热更新请修改小版本号
          Constants.version = DeviceInfo.getVersion()+"";//热更新请修改小版本号
          Constants.os = DeviceInfo.getSystemName().toLowerCase();
          Constants.osVersion = DeviceInfo.getSystemVersion();
          Constants.model = DeviceInfo.getModel();
          Constants.deviceId = DeviceInfo.getDeviceId();
          Constants.serial = DeviceInfo.getSerialNumber();
        } catch (error) {
          Utils.ERR("common/init",error);
        }
      },
      *loadBoot({payload,callback},{call,put}) {
        try {
          const boot = yield call(store.get, 'boot');
          if(callback)callback(boot);
          
        } catch (error) {
          Utils.ERR("common/loadBoot",error,payload);
        }
      },
      *saveBoot({payload},{call,put}) {
        yield call(store.save, 'boot', true);
      },
      *sysNotificationList({payload,callback},{call,put}) {
        try{
          const resp = yield call(Request.request, sysNotificationList, 'post', payload);
          if(callback)callback(resp);
        }catch(error){
          Utils.ERR("common/sysNotificationList",error,payload);
        }
      },
      *getAppConfig({payload,callback},{call,put}) {
        try{
            const resp = yield call(Request.request, getAppConfig, 'post');          
            if(resp && resp.code == 0){
              if(callback) callback(resp.data);
            }
            else{
              if(callback) callback(null);
            }
        }catch(error){         
          Utils.ERR("common/getAppConfig 1",error,payload);
        }
        try {
          if(callback) callback(null);
        } catch (error) {
          Utils.ERR("common/getAppConfig 2",error,payload);
        }
        
      },   
  
      *saveCurCurrency({payload},{call,put}) {
        try{
          if(payload && payload.curCurrency){
            yield call(store.save, 'current_currency', payload.curCurrency);
          }
        } catch (error) {
          Utils.ERR("common/saveCurCurrency",error,payload);
        }
      },
      *getCurCurrency({payload, callback},{call,put}) {
        try{
            let curCurrency = yield call(store.get, 'current_currency');
            if(callback) callback(curCurrency);
        } catch (error) {
          Utils.ERR("common/getCurCurrency",error,payload);
        }
      },
      *saveAppVersion({payload},{call,put}) {
        try{
          if(payload && payload.appVersion){
            yield call(store.save, 'version_number', payload.appVersion);
          }
        } catch (error) {
          Utils.ERR("common/saveAppVersion",error,payload);
        }
      },
      *getAppVersion({payload, callback},{call,put}) {
        try{
          let appVersion = yield call(store.get, 'version_number');
          if(callback) callback(appVersion);
        } catch (error) {
          Utils.ERR("common/getAppVersion 2",error,payload);
          }
          try {
            if (callback) callback(null);
            
          } catch (error) {
            Utils.ERR("common/getAppVersion 2",error,payload);
          }
      },
      *saveAppLabel({payload},{call,put}) {
        try{
          if(payload){
            yield call(store.save, 'app_label', payload);
          }
        } catch (error) {
          Utils.ERR("common/saveAppLabel",error,payload);
        }
      },
      *getAppLabel({payload, callback},{call,put}) {
        try{
          let appLabel = yield call(store.get, 'app_label');
          if(callback) callback(appLabel);
        } catch (error) {
          Utils.ERR("common/getAppLabel ",error,payload);
        }
        try {
          if (callback) callback(null);
        } catch (error) {
          Utils.ERR("common/getAppLabel 2",error,payload);
        }
      },
      //获取最新一条公告
      *getNewAnnouncement({payload, callback},{call,put}) {
        try {
          const resp = yield call(Request.request, newAnnouncement, 'post', payload);
          if(resp && resp.code == 0){
            if (callback) callback(resp.data);
          }
        } catch (error) {
          Utils.ERR("common/getNewAnnouncement",error,payload);
          if (callback) callback({ code: 500, msg: "" });
        }
      },
      *saveNoticeId({payload},{call,put}) {
        try{
          if(payload && payload.NoticeId){
            yield call(store.save, 'notice_id', payload.NoticeId);
          }
        } catch (error) {
          Utils.ERR("common/saveNoticeId",error,payload);
        }
      },
      *getNoticeId({payload, callback},{call,put}) {
        try{
          let NoticeId = yield call(store.get, 'notice_id');
          if(callback) callback(NoticeId);
        } catch (error) {
          Utils.ERR("common/getNoticeId",error,payload);
        }
      },
    },
    reducers: {
      update(state, action) {            
        return { ...state, ...action.payload };
      },  
    },
    subscriptions: {
      setup({ dispatch }) {
        dispatch({ type: 'init' })
      }
    }
  }
  