import Request from '../utils/RequestUtil'
import {wallet, inoutorder, cancel_order, dailypayback, assets_withdraw, nodeList, usernode, detailnode,addressList, addressAdd, addressDel, insidetransfer, linkList, insertAdd, linkDel } from '../utils/Api'
import store from 'react-native-simple-store';
import { EasyToast } from '../components/Toast';
import Constants from '../utils/Constants'

export default {
  namespace:'assets',
  state:{
    balanceAvailable: '0', //代币数量
    summary: [], //总充提币总数量
    summaryInnerTrans: [], //总站内转出转入总数量
    inouTorderlist: [], //充提币记录
    returnlist: [], //返还记录
    total: '0', //总资产
    coinlist: [], //代币列表
    addlinkList: [], //站内联系人列表
  },
  effects:{
    //我的钱包
    *getwallet({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, wallet, 'post', payload);
        if (resp && resp.code == 0) {
          yield put({ type: 'upwalletdate', payload: { resp, ...payload } });
        }else {
          EasyToast.show(resp.msg);
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getwallet-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //充提记录
    *getInouTorder({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, inoutorder, 'post', payload);
        if (resp && resp.code == 0) {
          let orderdata = resp.data;
          yield put({ type: 'upawarddate', payload: { orderdata, ...payload } });
        }else {
          EasyToast.show(resp.msg);
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getInouTorder-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //取消提现订单
    *getCancelorder({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, cancel_order, 'post', payload);
        if (resp && resp.code == 0) {
          EasyToast.show("订单取消成功");
          yield put({ type: 'getInouTorder', payload: {coinName: payload.coinName, pageNo: 1, pageSize: 10 } })
        }else {
          EasyToast.show(resp.msg);
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getCancelorder-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //返回记录
    *getDailypayback({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, dailypayback, 'post', payload);
        if (resp && resp.code == 0) {
          let dailypayback = resp.data;
          yield put({ type: 'updailypayback', payload: { dailypayback, ...payload } });
        }else {
          EasyToast.show(resp.msg);
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getDailypayback-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //币种提现
    *getAssetsWithdraw({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, assets_withdraw, 'post', payload);
        if (resp && resp.code == 0) {
         
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getAssetsWithdraw-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //个人节点个数
    *getMyNode({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, usernode, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'upNodedate', payload: { nodeDate: resp.data } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getMyNode-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

     //个人节点详情
     *getNodeDetail({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, detailnode, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'upNodedetail', payload: { nodeDetailList: resp.data } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getNodeDetail-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    *nodeRefresh({payload, callback},{ call, put }){
      try {
        const res = yield call(Request.request, nodeList,'get');
        if(res && res.msg==="success") {
          console.log(res)
          yield put({type: "update",payload:{nodeList:res.nodeList}})
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++nodeRefresh-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },
    
    *nodeGetInfo({ payload, callback },{call,put}){
      try {
        const res = yield call(Request.request, nodeIssue,'post',payload);
        if(res && res.msg==="success"){
          yield put({type:"update",payload:{nodeInfo:res.data}})
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++nodeGetInfo-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },

    //地址列表
    *addressList({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, addressList,'post',payload);
        if(res && res.msg==="success"){
          yield put({type:"update",payload:{addressLists:res.data}})
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++addressList-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },
    //新增地址列表
    *addressAdd({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, addressAdd,'post',payload);
        if(res && res.msg==="success"){
          yield put({type:'addressList',payload:{coinName:payload.coinName}})
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++addressAdd-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },
    //删除地址列表
    *addressDel({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, addressDel,'post',{id:payload.id});
        if(res && res.msg==="success"){
          yield put({type:'addressList',payload:{coinName:payload.coinName}})
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++addressDel-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },

    //站内转账
    *getInsideTransfer({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, insidetransfer, 'post', payload);
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/assets.js++++getInsideTransfer-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
    //站内联系人列表
    *addlinkList({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, linkList,'post',payload);
        if(res && res.msg==="success"){
          yield put({ type: 'uplinkdate', payload: { data: res.data, ...payload } });
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++addlinkList-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },
    //新增账内联系人
    *insertAdd({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, insertAdd,'post',payload);
        if(res && res.msg==="success"){
          yield put({type:'addlinkList',payload:{pageNo: 1, pageSize: 10}})
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++insertAdd-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },
    // 删除账内联系人
    *addlinkDel({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, linkDel,'post',{id:payload.id});
        if(res && res.msg==="success"){
          yield put({type:'addlinkList',payload:{pageNo: 1, pageSize: 10}})
        }
        callback?callback(res):"";
      }catch (error) {
        console.log("+++++app/models/assets.js++++addlinkDel-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },

  },
  reducers:{
    update(state, action){
      return { ...state, ...action.payload };
    },
    upNodedate(state, action){
      return { ...state, ...action.payload }
    },
    upNodedetail(state, action){
      return { ...state, ...action.payload }
    },
    upwalletdate(state, action) {
      let total = state.total;
      let coinlist = state.coinlist;
      total = action.payload.resp.total
      coinlist = action.payload.resp.data
      return {...state, total, coinlist};
    },
    upawarddate(state, action) {
      let balanceAvailable = state.balanceAvailable;
      let summary = state.summary;
      let summaryInnerTrans = state.summaryInnerTrans;
      let inouTorderlist = state.inouTorderlist;
      if(action.payload.pageNo==1){
        inouTorderlist = action.payload.orderdata.orderList;
      }else{
        inouTorderlist = inouTorderlist.concat(action.payload.orderdata.orderList);
      }
      if(action.payload.orderdata.summary){
        summary = action.payload.orderdata.summary
      }
      if(action.payload.orderdata.summaryInnerTrans){
        summaryInnerTrans = action.payload.orderdata.summaryInnerTrans
      }
      balanceAvailable = action.payload.orderdata.balanceAvailable
      return {...state, balanceAvailable, summary, summaryInnerTrans, inouTorderlist, };
    },
    updailypayback(state, action) {
      let returnlist = state.returnlist;
      if(action.payload.pageNo==1){
        returnlist = action.payload.dailypayback;
      }else{
        returnlist = returnlist.concat(action.payload.dailypayback);
      }
      return {...state, returnlist, };
    },
    uplinkdate(state, action) {
      let addlinkList = state.addlinkList;
      if(action.payload.pageNo==1){
        addlinkList = action.payload.data;
      }else{
        addlinkList = addlinkList.concat(action.payload.data);
      }
      return { ...state, addlinkList };
    }, 
  },
  subscriptions:{

  }
}
