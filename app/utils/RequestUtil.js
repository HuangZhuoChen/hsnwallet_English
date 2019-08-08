import {NativeModules} from 'react-native';
import Constants from '../utils/Constants'
import moment from "moment";
var MD5 = require("crypto-js/md5");
const key = "9c812dcbe57d11e894da06c410bcfe5c";
// const request = (url, method, body) => {
//   let isOk;
//   return new Promise((resolve, reject) => {
//     fetch(url, {
//       method,
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//         "uid":Constants.uid|'',
//         "token":Constants.token,
//         "version":Constants.version,
//         "os":Constants.os,
//         "osVersion":Constants.osVersion,
//         "model":Constants.model,
//         "deviceId":Constants.deviceId
//       },
//       body:JSON.stringify(body)
//     })
//       .then((response) => {
//         if (response.ok) {
//           isOk = true;
//         } else {
//           isOk = false;
//         }
//         return response.json();
//       })
//       .then((responseData) => {
//         if (isOk) {
//           resolve(responseData);
//         } else {
//           reject(responseData);
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

const getSign = (data) => {
  return MD5("e6458687#%%^^&&&***"+data+"&key="+key);
}

const signGetParams = (url) => {
  let i = url.indexOf("?");
  if(i>0){
    let params = url.substring(i+1,url.length);
    url = url.substring(0,i);
    params = params.split("&");
    params.push("time="+new Date().getTime());
    params.sort();
    let paramsStr="";
    params.map(item=>{
      paramsStr += item+"&";
    })
    paramsStr=paramsStr.substr(0,paramsStr.length-1);
    let sign = getSign(paramsStr);
    url = url+"?"+paramsStr+"&sign="+sign;
  }else{
    let params = "time="+new Date().getTime();
    let sign = getSign(params);
    url = url+"?"+params+"&sign="+sign;
  }
  return url;
}

const signPostParams = (body) =>{
  let params = [];
  params.push("time="+new Date().getTime());
  if(body){
    for(let key in body){
      params.push(key+"="+body[key]);
    }
  }
  params.sort();
  let paramsStr="";
  let newbody={};
  params.map(item=>{
    paramsStr += item+"&";
    let index = item.indexOf("=");
    if(index != -1){
      let k = item.substr(0, index);
      let v = item.substr(index+1, item.length);
      newbody[k]=v;
    }

  })
  paramsStr=paramsStr.substr(0,paramsStr.length-1);
  let sign = getSign(paramsStr)+""; 
  newbody["sign"]=sign;
  return newbody;
}

const prePGetParams = (url) =>{
  let i = url.indexOf("?");
  let params = '';
  if(i>0){
    params = url.substring(i+1,url.length);
    params = params.split("&");
    params.push("time="+new Date().getTime());
    params.sort();
  }else{
    params = "time="+new Date().getTime();
  }
  return params;
}

const formatGetSignParams = (url, params) => {
  let i = url.indexOf("?");
  let paramsStr = '';
  if(i>0){
    params.map(item=>{
      paramsStr += item+"&";
    })
    paramsStr=paramsStr.substr(0,paramsStr.length-1);
  }else{
    paramsStr = params;
  }
  return paramsStr;
}

const formatGetParams = (url, params, sign) =>{
  let i = url.indexOf("?");
  if(i>0){
    url = url.substring(0,i);
  }
  url = url+"?"+params+"&sign="+sign;
  return url;
}

const prePPostParams = (body) =>{
  let params = [];
  params.push("time="+new Date().getTime());
  if(body){
    for(let key in body){
      params.push(key+"="+body[key]);
    }
  }
  params.sort();
  return params;
}

const formatPostSignParams = (params) =>{
  let paramsStr="";
  params.map(item=>{
    paramsStr += item+"&";
  })
  paramsStr=paramsStr.substr(0,paramsStr.length-1);
  return paramsStr + "";
}

const formatPostParams = (params, sign) =>{
  let newbody={};
  if(!params){
    params = [];
  }
  params.map(item=>{
    let index = item.indexOf("=");
    if(index != -1){
      let k = item.substr(0, index);
      let v = item.substr(index+1, item.length);
      newbody[k]=v;
    }

  })

  newbody["sign"]=sign;
  return newbody;
}




const requestRawNetwork = (url,method, body, timeout=4000) => {
  // console.log("before===========url: " + url + "-------body: " + JSON.stringify(body));
  const request1_dapp = new Promise((resolve, reject) => {
      // console.log("after==========url: " + url + "-------body: " + JSON.stringify(body));
      fetch(url,{
        method: method,
        headers: {
          // Accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          // "uid":Constants.uid|'',
          // "token":Constants.token,
          // "version":Constants.version,
          // "os":Constants.os,
          // "osVersion":Constants.osVersion,
          // "model":Constants.model,
          // "deviceId":Constants.deviceId
        },
        body:JSON.stringify(body)
      }).then((response) => {
        // console.log('1111::: ' + JSON.stringify(response));
        return response.json();
      })
      .then((responseData) => {
        // console.log('2222' + JSON.stringify(responseData));
        resolve(responseData);
      })
      .catch((error) => {
        // console.log('3333' + JSON.stringify(error));
        reject(error);
      });
    
  });

// 定义一个延时函数
  const timeoutRequest_dapp = new Promise((resolve, reject) => {
    setTimeout(reject, timeout, 'Request timed out');
  });

// 竞时函数，谁先完成调用谁
  return Promise
    .race([request1_dapp, timeoutRequest_dapp])
    .then(res => {
      return res
    }, m => {
      throw new Error(m);
    });
};

const   requestDappNetwork = async (url,method, body, timeout=4000) => {
  let data  = null;
  let count = 0;
  //最多重测 3次
    while(count++ < 3)
    {
      try {
        // console.log("count ==============="+count);
        data =  await requestRawNetwork(url, method, body, timeout);
        if(data)
        {
          return data;    
        } 
      
      } catch (error) {       
        rejectdata = error;
        // console.log("get requestDappNetwork err==============="+JSON.stringify(error)+"url:"+eosnodeurl+url +"body"+JSON.stringify(body) +"data"+JSON.stringify(data));
      }  
    }
  throw rejectdata;
}

//向服务器发送请求
const requestO = (url,method, body, timeout=30000) => {
  
  const request1 = new Promise((resolve, reject) => {
    let preParams = null;
    let signParams = null;

      if(method.toLowerCase()=="get"){
        preParams = prePGetParams(url);
        signParams = formatGetSignParams(url, preParams);
      }else if(method.toLowerCase()=="post"){
        preParams = prePPostParams(body);
        signParams = formatPostSignParams(preParams);
      }
   

    NativeModules.UtilModule.commSign(signParams, (r) => {

        if(method.toLowerCase()=="get"){
          url = formatGetParams(url, preParams, r);
        }else if(method.toLowerCase()=="post"){
          body = formatPostParams(preParams, r);
        }      
       
      fetch(url,{
        method: method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Accept-Language': Constants.curLanguage,
          'isMultiLang': "true",
          "uid":Constants.uid|'',
          "token":Constants.token,
          "version":Constants.version,
          "os":Constants.os,
          "osVersion":Constants.osVersion,
          "model":Constants.model,
          "deviceId":Constants.deviceId
        },
        body:JSON.stringify(body)
      }).then((response) => {
        if(Constants.nowDate!==undefined){
          Constants.nowDate =  moment(response.headers.get('Date')).zone(-8).toString();
        }
        if (response.ok) {
          isOk = true;
        } else {
          isOk = false;
        }
        return response.json();
      })
      .then((responseData) => {     
        Constants.isNetWorkOffline = false;
         resolve(responseData);      
      })
      .catch((error) => { 
        Constants.isNeedGetRootaddr = true;
        reject(error);
      });
    });
  });

// 定义一个延时函数
  const timeoutRequest = new Promise((resolve, reject) => {
    setTimeout(reject, timeout, 'Request timed out');
  });

// 竞时函数，谁先完成调用谁
  return Promise
    .race([request1, timeoutRequest])
    .then(res => {
      return res
    }, m => {
      return null;
      // throw new Error(m);
    });
};

const request = (url,method,body, timeout = 30000)=>{
   if(Constants.isNetWorkOffline){
    Constants.isNeedGetRootaddr = true;
   }

   if(Constants.isNeedGetRootaddr)
   {
      // console.log("get root addr===============");
      return getRootaddr().then(res=>{
      let okUrl = url
      let rootaddr = res
      if(okUrl.indexOf("/")==0){
        okUrl = rootaddr+url
      }

      return requestO(okUrl, method, body, timeout)
   }).catch(e=>{
    // console.log(e);
    return { code: 500, msg: '' };
   });
  }else{

    let okUrl = url;
    let rootaddr = Constants.rootaddr;
    if(okUrl.indexOf("/")==0){
      okUrl = rootaddr+url;
    }

    return requestO(okUrl, method, body, timeout);
  }

};

const getRootaddr = ()=>{
  return requestO(Constants.gateurl, 'post',{})
    .then(res => {
      Constants.isNeedGetRootaddr = false;
      Constants.rootaddr = res.url
      return Constants.rootaddr;
    })
    .catch(e=>{
      Constants.isNeedGetRootaddr = true;
      Constants.rootaddr = Constants.defaultrootaddr
      return Constants.rootaddr;
    })
}

export default {
  request,
  requestDappNetwork,
};
