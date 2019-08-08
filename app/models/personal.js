import Request from '../utils/RequestUtil';
import { checkauthentication, realNameAuthentication, setnickname, setteamname, existTradePassword, setTradePassword, resetTradePassword, forgetPayPassword, announcement } from '../utils/Api';
import store from 'react-native-simple-store';
import { EasyToast } from '../components/Toast';
import Constants from '../utils/Constants'
import JPushModule from 'jpush-react-native';

export default {
  namespace: 'personal',
  state: {
    announcementlist: [],
  },
  effects: {
    //获取实名认证信息
    *getfindauthentication({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, checkauthentication, 'post', payload);
        if (resp && resp.code == 0) {
          yield put({ type: 'update', payload: { authentication: resp.data.authentication } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++getfindauthentication-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
    
    //实名认证
    *getAuthentication({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, realNameAuthentication, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'getfindauthentication', payload: {} })
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++getAuthentication-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //修改昵称
    *getsetnickname({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, setnickname, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'login/findUserInfo', payload: {} })
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++getsetnickname-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //设置团队名称
    *getsetteamname({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, setteamname, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'login/findUserInfo', payload: {} })
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++getsetteamname-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
   
    //是否设置了交易密码
    *isSetTradePassword({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, existTradePassword, 'post', payload);
        if (resp && resp.code == 0) {
          const TradePassword = resp.data.isSetTradePassword;
          yield put({ type: 'upSetPaydate', payload: { SetTradePW: TradePassword } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++isSetTradePassword-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //设置交易密码
    *setPayPassword({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, setTradePassword, 'post', payload);
        if (resp && resp.code == 0) {
          yield put({ type: 'isSetTradePassword', payload: { } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++setPayPassword-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //修改交易密码
    *resetPayPassword({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, resetTradePassword, 'post', payload);
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++resetPayPassword-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
   
    //忘记交易密码
    *forgetPayPassword({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, forgetPayPassword, 'post', payload);
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++forgetPayPassword-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //公告列表
    *getAnnouncement({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, announcement, 'post', payload);
        if (resp && resp.code == 0) {
          let dataList = resp.data;
          yield put({ type: 'upAnnouncement', payload: { dataList, ...payload } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/personal.js++++getAnnouncement-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    }, 
    upSetPaydate(state, action) {
      return { ...state, ...action.payload };
    }, 
    upAnnouncement(state, action) {
      let announcementlist = state.announcementlist;
      if(action.payload.pageNo==1){
        announcementlist = action.payload.dataList;
      }else{
        announcementlist = announcementlist.concat(action.payload.dataList);
      }
      return {...state, announcementlist };
    }, 
  },
  subscriptions: {
   
  },
}
