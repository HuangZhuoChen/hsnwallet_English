import Request from '../utils/RequestUtil'
import { friendList } from '../utils/Api'
import { EasyToast } from '../components/Toast';


export default {
  namespace:'Invitate',
  state:{
  },
  effects:{
    //我的邀请
    *friendList({ payload, callback }, { call, put }) {
      try {
        const res = yield call(Request.request, friendList, 'post', payload);
        if(res && res.code == 0){
          yield put({ type: 'update', payload: { friendList: res.data } });
        } else {
          EasyToast.show(res.msg)
        }
        if (callback) callback(res);
      } catch (error) {
        console.log("+++++app/models/Invitate.js++++friendList-error:",JSON.stringify(error));
        if (callback) callback({ code: 500, msg: "" });
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

  },
  subscriptions:{

  }
}
