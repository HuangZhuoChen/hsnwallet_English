import Request from '../utils/RequestUtil';
import {sendVerify, register, login, resetPassword, findUserInfo, verifyImageCode,  forgetPassword, kapimgVerify } from '../utils/Api';
import store from 'react-native-simple-store';
import { EasyToast } from '../components/Toast';
import Constants from '../utils/Constants'
import NavigationUtil from '../utils/NavigationUtil';

export default {
  namespace: 'login',
  state: {
    pointInfo: {}
  },
  effects: {
    //监控登录状态更新
    *loadStorage({ payload, callback }, { call, put }) {
      const loginUser = yield call(store.get, 'loginUser')
      if (loginUser) {
        const uid = yield call(store.get, 'uid');
        const token = yield call(store.get, 'token');
        const mail = yield call(store.get, 'mail');
        Constants.uid = uid;
        Constants.token = token;
        Constants.mail = mail;
        Constants.loginUser = loginUser;
        yield put({ type: 'update', payload: { loginUser, uid, token, mail } });
      }
      if (callback) callback(loginUser);
    },

    //获取手机验证码
    *sendVerify({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, sendVerify, 'post', payload);
        if(resp && resp.code == 0){
          if (callback) callback(true);
          return ;
        }else{
          if(resp.msg){
            EasyToast.show(resp.msg);
          }
        }
      } catch (error) {
        console.log("+++++app/models/Login.js++++sendVerify-error:",JSON.stringify(error));
      }
      if (callback) callback(null);
    },

    //注册
    *register({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, register, 'post', payload);
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/Login.js++++register-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
    
    //登录
    *login({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, login, 'post', payload);
        if (resp && resp.code == 0 && resp.data) {
          const loginUser = resp.data;
          yield call(store.save, 'uid', loginUser.uid);
          yield call(store.save, 'token', loginUser.token);
          // yield call(store.save, 'mobile', loginUser.mobile);
          yield call(store.save, 'mail', loginUser.mail);
          yield call(store.save, 'loginUser', loginUser);
          Constants.uid = loginUser.uid;
          Constants.token = loginUser.token;
          Constants.mail = loginUser.mail;
          Constants.loginUser = loginUser;
          yield put({ type: 'update', payload: { loginUser, uid: loginUser.uid, token: loginUser.token, mail: loginUser.mail } });
          console.log(132465)
          // yield put({ type: 'personal/isSetPayPassword', payload: {} }) 
          // yield put({ type: 'personal/getfindRealNameInfo', payload: {} })
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/Login.js++++login-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
    
    //修改登录密码 
    *changePwd({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, resetPassword, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'logout', payload: {} })
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/Login.js++++changePwd-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //忘记登录密码
    *forgetPassword({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, forgetPassword, 'post', payload);
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/Login.js++++forgetPassword-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //退出
    *logout({ payload, callback }, { call, put }) {
      try {
        // yield put({ type: 'AssetsModel/clearAssetInfo', payload: {} });
        yield call(store.delete, 'uid');
        yield call(store.delete, 'token');
        yield call(store.delete, 'mail');
        yield call(store.delete, 'loginUser');
        yield put({ type: 'update', payload: { loginUser: null, uid: null, token: null, mail: null, } });
        Constants.uid = null;
        Constants.token = null;
        Constants.mail = null;
        Constants.loginUser = null;
        if (callback) callback(true);
      } catch (error) {
        if (callback) callback();
      }
    },

    //获取用户信息
    *findUserInfo({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, findUserInfo, 'post');
        if (resp.code == 0) {
          const loginUser = resp.data;
          yield call(store.save, 'loginUser', loginUser);
          yield put({ type: 'update', payload: { loginUser, uid: loginUser.uid, token: loginUser.token, mail: loginUser.mail } });
        }else{
          if(resp.code == -66){
            yield put({ type: 'logout', payload: {} })
          }
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/Login.js++++findUserInfo-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //验证图形验证码
    *getCapture({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, kapimgVerify, 'post', payload);
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/Login.js++++getCapture-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    }, 
    updateSign(state, action) {
      return { ...state, pointInfo: action.payload.pointInfo };
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' });
    },
  },
}
