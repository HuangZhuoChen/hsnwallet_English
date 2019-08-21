import Request from '../utils/RequestUtil'
import {nodeList, usernode, nodeIssue, detailnode, tradePass, decisionjudge, purchaseProgress } from '../utils/Api'


export default {
  namespace:'Nodeapplication',
  state:{
    discount: 0, //本期折扣
    nodeDetailList: [],
  },
  effects:{
    //购买进度查询
    *getProgress({ payload, callback }, { call, put }) {
      try {
        const res = yield call(Request.request, purchaseProgress, 'post', payload)
        if (res && res.msg === 'success') {
          yield put({type: 'update', payload: {progress: res.RateOfOgress}})
        }
        callback ? callback(res) : ''
      } catch (e) {
        console.log("+++++app/models/Nodeapplication.js++++getProgress-error:", JSON.stringify(error));
        callback ? callback({code:500, msg:""}) : "";
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
        console.log("+++++app/models/Nodeapplication.js++++getMyNode-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

     //个人节点详情
     *getNodeDetail({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, detailnode, 'post', payload);
        if(resp && resp.code == 0){
          let Nodedata = resp.data;
          yield put({ type: 'upNodedetail', payload: { Nodedata, ...payload } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/Nodeapplication.js++++getNodeDetail-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //节点请求/刷新
    *nodeRefresh({payload, callback},{ call, put }){
      try {
        const res = yield call(Request.request, nodeList, 'get');
        if(res && res.msg==="success") {
          yield put({type: "update",payload:{nodeList:res.nodeList, discount: res.discount}})
        }
        callback?callback(res):"";
      }catch (e) {
        console.log("+++++app/models/Nodeapplication.js++++nodeRefresh-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },

    //节点信息
    *nodeGetInfo({ payload, callback },{call,put}){
      try {
        const res = yield call(Request.request, nodeIssue,'post',payload);
        if(res && res.msg==="success"){
          yield put({type:"update",payload:{nodeInfo:res.data}})
        }
        callback?callback(res):"";
      }catch (e) {
        console.log("+++++app/models/Nodeapplication.js++++nodeGetInfo-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },

    //购买节点
    *nodeTrade({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, tradePass,'post',payload);
        if(res && res.msg === "success"){
          // yield put({ type: 'Nodeapplication/getMyNode', payload: {} })
        }
        if (callback) callback(res);
      }catch (e) {
        console.log("+++++app/models/Nodeapplication.js++++nodeTrade-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    },

    //购买节点
    *decisionJudge({payload, callback},{call,put}){
      try {
        const res = yield call(Request.request, decisionjudge, 'post', payload);
        if (callback) callback(res);
      }catch (e) {
        console.log("+++++app/models/Nodeapplication.js++++decisionJudge-error:",JSON.stringify(error));
        callback?callback({code:500, msg:""}):"";
      }
    }
  },
  reducers:{
    update(state, action){
      return { ...state, ...action.payload };
    },
    upNodedate(state, action){
      return { ...state, ...action.payload }
    },
    upNodedetail(state, action) {
      let nodeDetailList = state.nodeDetailList;
      if(action.payload.pageNo==1){
        nodeDetailList = action.payload.Nodedata;
      }else{
        nodeDetailList = nodeDetailList.concat(action.payload.Nodedata);
      }
      return { ...state, nodeDetailList };
    }, 

  },
  subscriptions:{

  }
}
