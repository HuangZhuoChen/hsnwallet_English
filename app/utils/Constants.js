import UImage from './Img'
Constants = {
  nowDate:null, //获取服务器返回时间，* 只有在接口返回时更新
  loginUser:null,
  token:null,
  uid:null,
  rootaddr:'',
  defaultrootaddr:'https://api.wallet.hsn.link/api',
  //defaultrootaddr:'http://192.168.1.32:8888/api',
  Code_Moide: 8, //邀请码最大长度
  PWD_MIN_LENGTH:6,  //密码最小长度
  PWD_MAX_LENGTH:12, //密码最大长度
  BLOCK_OFFSET:100,//用于比较最高的块偏差，太大的屏蔽掉
  isNetWorkOffline:false,
  FitPhone: 20,
  isNeedGetRootaddr:true, //true:需要,false:不需要
  comeIn: '',
  isJpushOpen: false,
  curCurrency:'CNY',
  currencySymbol: 'logo-yen',
  curLanguage: 'zh-CN',
  payPassLocal:{},
  levelimg:[UImage.notactive,UImage.early,UImage.in,UImage.high,UImage.super],
  hasLocalPass:function(account){
    if(this.payPassLocal[account]){
      return true
    }
    return false;
  },

  saveLocalPass:function(account,password){
    this.payPassLocal[account]=password;
  },

  getLocalPass:function(account){
    if(this.payPassLocal[account]){
      try{
        return this.payPassLocal[account];
      }catch(e){
        return null;
      }
    }
    return null;
  },
  
  /*
  判断是否为至少有一个元素的数组
  */
  IsContainItems:function(arr){
    return arr!=null && arr.length && arr.length >0;
  },

  dappStautsBarFlag:false,//DAPP的状态栏有自己的特色，特别对待
  dappHorizontalScreenFlag:false,//DAPP的横屏标志
  promptUpgrade: false, //小红点提示升级标志
  gesturesEnabled:true, // navigationOptions 左滑手势
  versionHash: "7d550d651e0af7cd39346c5f58563d9e0e2b8a33",

  //扫描二维码的字符类型
  QRCodeStringType:{
    NO_STRING : 0, // 不是字符
    MEMO : 1, // memo
    ACTIVE : 2, // active私钥
    OWNER: 3, // owner私钥
  }
};

export default Constants;
