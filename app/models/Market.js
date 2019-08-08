import Request from '../utils/RequestUtil'
import {mininginfo, seasonrank, teamrank, latestnumber,  } from '../utils/Api'


export default {
  namespace:'market',
  state:{
    MiningDate: {},
    seasonRanklist: [],
    teamRanklist: [],
    maxIssueNumnber: [],
    scoreRankList: [],
    scoreRankSelf: {},
  },
  effects:{
    //个人挖矿产出
    *getMiningInfo({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, mininginfo, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'update', payload: { MiningDate: resp.data } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/market.js++++getMiningInfo-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
    //最新一期期号
    *getLatestNumber({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, latestnumber, 'post', payload);
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/market.js++++getLatestNumber-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },

    //个人积分排名
    *getSeasonRank({ payload, callback }, { call, put }) {
      try {
        const  resp = yield call(Request.request, seasonrank, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'upscorerankdate', payload: { data: resp.data, scoreRankSelf: resp.self,  ...payload } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/market.js++++getSeasonRank-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
    
    //团队积分排名
    *getTeamRank({ payload, callback }, { call, put }) {
      try {
        const resp = yield call(Request.request, teamrank, 'post', payload);
        if(resp && resp.code == 0){
          yield put({ type: 'upscorerankdate', payload: { data: resp.data, scoreRankSelf: resp.self, ...payload } });
        }
        if (callback) callback(resp);
      } catch (error) {
        console.log("+++++app/models/market.js++++getTeamRank-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
      }
    },
  },
  reducers:{
    update(state, action){
      return { ...state, ...action.payload };
    },
    upscorerankdate(state, action) {
      let scoreRankList = state.scoreRankList;
      if(action.payload.pageNo==1){
        scoreRankList = action.payload.data;
      }else{
        scoreRankList = scoreRankList.concat(action.payload.data);
      }
      return { ...state, ...action.payload, scoreRankList };
    }, 
  },
  subscriptions:{

  }
}
