import React from 'react';
import { connect } from 'react-redux'
import {ImageBackground,SafeAreaView,TextInput, Dimensions,StyleSheet,Image,View,RefreshControl,Text,TouchableOpacity,FlatList,ScrollView,InteractionManager} from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import Button from '../../components/Button'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import { EasyToast } from '../../components/Toast';
import {CodeModal} from '../../components/modals/CodeModal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Utils} from '../../utils/Utils';
import { LargeList } from "react-native-largelist-v3";
import LinearGradient from 'react-native-linear-gradient'
import Carousel from "react-native-banner-carousel";
import {kapimg} from '../../utils/Api';
import BaseComponent from "../../components/BaseComponent";
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import {Update} from '../Home/index'
import TextButton from '../../components/TextButton'
const ScreenWidth = Dimensions.get('window').width;

@connect(({login, Nodeapplication, personal, loading }) => ({...login, ...Nodeapplication, ...personal,
  jdRefreshing: loading.effects['Nodeapplication/nodeRefresh']
}))
export default class Nodeapplication extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      jdBanner:[
        {image:UImage.homeBannerBg,url:""},
      ],
      nodeLists:[ ],
      arr: [1, 1, 1, 1],
      countDown:['-','-','-'],
      counter:"",
      season:"-",
      stage:"-",

      tradePassword:"",
      code: "",
      uuid: "",

      // lurui
      progress: 0,
      buyAmount: '1000',
      tradePassword: '',
      code: '',
      checked: true,

      // 购买弹框
      title: '',
      range: ''
    };
  }

  //组件加载完成
  async componentDidMount() {
    this.getProgress()
    // this.dataInit()
    // this.jdRefresh();
    //是否设置了交易密码
    await Utils.dispatchActiionData(this, {type:'personal/isSetTradePassword',payload:{ } });
  }

  componentWillUnmount(){
    this.setState = (state, callback) => {
      return;
    };
  }
  async dataInit() {
    let res = await Utils.dispatchActiionData(this, {type: 'Nodeapplication/nodeRefresh', payload: ''})
  }
  
  // 购买进度
  async getProgress() {
    let res = await Utils.dispatchActiionData(this, {type: 'Nodeapplication/getProgress', payload: {}})
    this.setState({
      progress: res.RateOfOgress
    })
  }

  // async jdRefresh(){
  //   try {
  //     // 获取各节点基本信息
  //     let res = await Utils.dispatchActiionData(this, {type:'Nodeapplication/nodeRefresh', payload: ""});
  //     // 获取节点抢购时剩余节点数量
  //     // Nodeapplication/nodeGetInfo为models/Nodeapplication.js下*nodeGetInf的函数方法
  //     let nodebk = await Utils.dispatchActiionData(this, {type:'Nodeapplication/nodeGetInfo', payload: ""});
  //     if(nodebk.msg !== "success"){
  //       EasyToast.show(nodebk.msg);
  //       return;
  //     }
  //     let nodeTemp = [];
  //     this.props.nodeList.map((item)=>{
  //       let row = Object.assign({},item);
  //       let fitData = this.props.nodeInfo.filter((info)=>info.nodeId == row.id);
  //       if(fitData.length>0){
  //         row.issueId = fitData[0].id;
  //         row.nodeTotal = fitData[0].nodeCount;
  //         row.nodeLast = fitData[0].nodeRemainCount;
  //       }else {
  //         row.nodeTotal = 0;
  //         row.nodeLast = 0;
  //       }
  //       nodeTemp.push(row);
  //     });

  //     let stageNums = this.props.nodeInfo[0].number;
  //     let sStr ="第"+ Math.ceil(stageNums/5) + "赛季";
  //     let qStr ="第"+ stageNums + "期";

  //     this.setState({season:sStr, stage:qStr});

  //     //计算倒计时
  //     const firTime = this.toTimeNumber((res.countDowm && res.countDowm.firstCountDowm)? res.countDowm.firstCountDowm : "10:00:00");
  //     const secTime = this.toTimeNumber((res.countDowm && res.countDowm.secondCountDowm)? res.countDowm.secondCountDowm : "22:00:00");
  //     const timeReg = new RegExp(/([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/);
  //     let nowTime = Constants.nowDate.match(timeReg)[0].split(":");
  //     let nowTimeNum = parseInt(nowTime[0])*3600+parseInt(nowTime[1])*60+parseInt(nowTime[2]);
  //     let remain;
  //     if(nowTimeNum< firTime){
  //       remain = firTime - nowTimeNum;
  //     }else if(nowTimeNum<secTime){
  //       remain = secTime - nowTimeNum;
  //     }else if(nowTimeNum<86400){
  //       remain = 86400 - nowTimeNum + firTime;
  //     }
  //     clearInterval(this.state.counter);
  //     remain>0?this.setCountDown(remain):"";
  //     this.setState({nodeLists:nodeTemp})
  //   }catch (e) {

  //   }
  // }

  setCountDown(st){
    this.setState({counter:setInterval(()=>{
      if(st>0){
        st--;
        this.setState({countDown:[parseInt(st/3600),parseInt((st%3600)/60),st%60]});
      }else {
        // this.jdRefresh();
        clearInterval(this.state.counter);
        this.setState({countDown:[0,0,0]})
      }},1000)})
  }

  toTimeNumber(t){
    let timeArr = t.split(":");
    return Number(timeArr[0])*3600 + Number(timeArr[1])*60 + Number(timeArr[2]);
  }

  jdMoreLoading(){
    EasyToast.show('加载中...')
  }

  //弹窗
  //confirm order
  async confirmOrder (item, index) {
    try {
      this.refreshImage();
      // const { navigate } = this.props.navigation;
      //未设置交易密码
      // if(!this.props.SetTradePW){
      //   let isPay =  await AlertModal.showSync("温馨提示","未设置交易密码，请立即设置","去设置","取消",);
      //   if(isPay){
      //     navigate('SetTransactionPw', {});
      //   }
      //   return;
      // }

      // 购买节点界面
      let title, range
      switch(index) {
        case 0:
          title = 'Bronze'
          range = '1000-2999'
          this.state.buyAmount = '1000'
          break
        case 1:
          title = 'Silver'
          range = '3000-4999'
          this.state.buyAmount = '3000'
          break
        case 2:
          title = 'Gold'
          range = '5000-9999'
          this.state.buyAmount = '5000'
          break
        case 3:
          title = 'Diamond'
          range = '≥10000'
          this.state.buyAmount = '10000'
          break
        default:
          return
      }
      this.state.title = title
      this.state.range = range
      let con = this.purchaseContent(title, range)
      // 最后一个true显示对赌协议
      let isAuth = await AlertModal.showSync(title, con, "Confirm" ,"Cancel" , true, () => {
        // 判断用户输入是否为区间数字
        let reg = /^\d+$/
        if (!reg.test(this.state.buyAmount)) {
          EasyToast.show('Please enter a positive integer')
          return false
        }
        switch(index) {
          case 0:
            if (Number(this.state.buyAmount) < 1000 || Number(this.state.buyAmount) >= 3000) {
              EasyToast.show('The purchase range of this segment is 1000-3000')
              return false
            }
            break
          case 1:
            if (Number(this.state.buyAmount) < 3000 || Number(this.state.buyAmount) >= 5000) {
              EasyToast.show('The purchase range of this segment is 3000-5000')
              return false
            }
            break
          case 2:
            if (Number(this.state.buyAmount) < 5000 || Number(this.state.buyAmount) >= 10000) {
              EasyToast.show('The purchase range of this segment is 5000-10000')
              return false
            }
            break
          case 3:
            if (Number(this.state.buyAmount) < 10000) {
              EasyToast.show('The purchase range of this segment is >=10000')
              return false
            }
        }
        return true
      }, true);
      if(isAuth){
        this.tradePassword();
      }
    } catch (error) {

    }
  }
  addHSN(title, range) {
    this.setState({
      buyAmount: (+this.state.buyAmount + 1).toString()
    }, () => {
      AlertModal.isUpdate(this.purchaseContent(title, range))
    })
  }
  reduceHSN(title, range) {
    this.setState({
      buyAmount: (+this.state.buyAmount - 1).toString()
    }, () => {
      AlertModal.isUpdate(this.purchaseContent(title, range))
    })
  }
  purchaseContent(title, range) {
    return (
      <View style={{alignItems: 'center'}}>
        <ImageBackground style={{width:ScreenWidth-ScreenUtil.autowidth(120),height:(ScreenWidth-ScreenUtil.autowidth(120))*0.528}} source={UImage.confirm_bg}>
          <View style={{flex: 1, paddingTop: ScreenUtil.autoheight(6)}}>
            <Text style={{fontSize: ScreenUtil.setSpText(20), color: '#fff', textAlign: 'center'}}>HSN</Text>
            <View style={{height: ScreenUtil.autoheight(50), marginBottom: ScreenUtil.autoheight(10), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: ScreenUtil.autowidth(30)}}>
              <TouchableOpacity onPress={() => {this.reduceHSN(this.state.title, this.state.range)}} style={{width: ScreenUtil.autowidth(20), height: ScreenUtil.autowidth(20), justifyContent: 'center'}}>
                <Image source={UImage.icon_reduce} style={{width: ScreenUtil.autowidth(20), height: ScreenUtil.autowidth(2)}} />
              </TouchableOpacity>
              <TextInput autoFocus={false} defaultValue={this.state.buyAmount} placeholderTextColor="#999" keyboardType='numeric' onChangeText={buyAmount => this.setState({buyAmount})} returnKeyType="go" style={{flex: 1, textAlign: 'center', fontSize: ScreenUtil.setSpText(30), color: '#fff', padding: 0}} />
              <TouchableOpacity onPress={() => {this.addHSN(this.state.title, this.state.range)}}>
                <Image source={UImage.icon_add} style={{width: ScreenUtil.autowidth(20), height: ScreenUtil.autowidth(20)}} />
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: ScreenUtil.setSpText(10), color: '#fff', textAlign: 'center'}}>*Purchase {range} HSN to become the {title}.</Text>
          </View>
        </ImageBackground>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => {this.agree(this.state.title, this.state.range)}} style={{marginRight: ScreenUtil.autowidth(8), paddingTop: ScreenUtil.autoheight(2)}}>
            <Image source={this.state.checked ? UImage.onAgree : UImage.offAgree} style={{width: ScreenUtil.autowidth(10), height: ScreenUtil.autowidth(10)}} />
          </TouchableOpacity>
          <Text style={{color: '#181B29', fontSize: ScreenUtil.setSpText(10)}}>Participate In The</Text>
          <TouchableOpacity onPress={() => {this.goGamblingAgree()}}>
            <Text style={{color: '#2394F8', fontSize: ScreenUtil.setSpText(10)}}>《Valuation Adjustment Mechanism》</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  agree(title, range) {
    this.setState({
      checked: !this.state.checked
    }, () => {
      AlertModal.isUpdate(this.purchaseContent(title, range))
    })
  }

  loaderror = () =>{
    EasyToast.show('未能获取图形验证码，请检查网络！');
  }

  async refreshImage () {
    this.setState({
      uuid: Math.ceil(Math.random()*10000000000)
    })
  }

  clearFoucs = () =>{
    this._rpass.blur();
    this._rcode.blur();
  }

  //trade Pass
  async tradePassword () {
    try {
      let th = this;
      let con = 
      <View>
        <View style={styles.tradepout}>
          <Image style={styles.tradepwimg} source={UImage.icon_lock} />
        </View>
        <View style={{flexDirection:"column",paddingHorizontal: ScreenUtil.autowidth(10),}}>
          <TextInput autoFocus={true} placeholder={"transaction password"} placeholderTextColor="#999"
            secureTextEntry={true} defaultValue={this.state.tradePassword} maxLength={Constants.PWD_MAX_LENGTH} style={styles.textinpt}
            onChangeText={(tradePassword) => this.setState({tradePassword})} selectionColor={"#6DA0F8"} 
            underlineColorAndroid="transparent" returnKeyType="next"
          />
          <TextInput autoFocus={false} placeholder={"Graphic Verification Code"} placeholderTextColor="#999"  
            secureTextEntry={true}  defaultValue={this.state.code} maxLength={5} style={styles.textinpt} 
            onChangeText={(code) => this.setState({code})} selectionColor={"#6DA0F8"} 
            underlineColorAndroid="transparent" returnKeyType="go"
          />
          <View style={{flexDirection:"row",alignItems:"space-between", paddingTop: ScreenUtil.autoheight(10)}}>
            <Image onError={(e)=>{this.loaderror()}} style={{width:(ScreenWidth-ScreenUtil.autowidth(120))/2, height:ScreenUtil.autowidth(40), marginRight:ScreenUtil.autowidth(10),}} 
              source={{uri: Constants.defaultrootaddr + kapimg + "?uuid=" + this.state.uuid}} />
            <TouchableOpacity onPress={()=>{this.refreshImage()}} style={{flexDirection:"row", alignItems: 'center', justifyContent:"center",}}>
              <Text style={{color: '#888888', fontSize: ScreenUtil.setSpText(10),}}>Invisibility?</Text>
              <Text style={{color: '#0DA3DF', fontSize: ScreenUtil.setSpText(10),}}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>;
      let isAuth =  await AlertModal.showSync(null,con,"Confirm","Cancel" ,false,()=>{
        if(th.state.tradePassword == "" ){
          EasyToast.show("Please enter the transaction password");
          return false;
        }else if(this.state.code == ""){
          EasyToast.show("Please enter the Graphic Verification Code");
          return false;
        }else {
          return true;
        }
      });
      if(isAuth){
        this.checkTradePassword();
      }else{
        this.setState({tradePassword: "", code: ""})
      }
    } catch (error) {

    }
  }

  // 提交到接口确认密码是否正确，若正确则购买节点成功或节点已卖完
  async checkTradePassword(){
    let res = await Utils.dispatchActiionData(this, {type: 'Nodeapplication/nodeTrade',
      payload: {
        "amount": this.state.buyAmount,
        "tradePassword": this.state.tradePassword,
        "uuid": this.state.uuid,
        "code": this.state.code,
        "vam": this.state.checked
      }
    })
    this.setState({tradePassword: "", code: ""})
    if(res.msg === "success"){
      this.nodeSuccess();
    } else {
      EasyToast.show(res.msg);
    }
  }


  //node success
  async nodeSuccess () {
    try {
      let con = (
        <View>
          <View style={styles.tradepout}>
            <Image style={styles.nodeimg} source={UImage.fireworks} />
          </View>
          <Text style={{textAlign:"center",fontSize:ScreenUtil.setSpText(16),color: 'rgba(0, 0, 0, 0.5)'}}>Tips</Text>
          <Text style={{textAlign:"center",fontSize:ScreenUtil.setSpText(21),color: 'rgba(0, 0, 0, 1)',paddingVertical:ScreenUtil.autoheight(16)}}>Congrats you become the {this.state.title} Protector.</Text>
        </View>
      )
      let isAuth =  await AlertModal.showSync(null, con, "Got It", null);
      if (isAuth) {
        // 购买成功后刷新购买进度
        this.getProgress()
        // 购买成功后刷新用户信息数据
        let res = await Utils.dispatchActiionData(this, {type: 'login/findUserInfo', payload: {}})
      }
    } catch (error) {

    }
  }

  bannerClick() {

  }

  //规则说明
  goRuleClause () {
    try {
      const { navigate } = this.props.navigation;
      navigate('RuleClause', {wholeinvitation: 'whole'});
    } catch (error) {
      
    }
  }
  // 对赌协议
  goGamblingAgree() {
    try {
      AlertModal.close()
      const { navigate } = this.props.navigation;
      navigate('GamblingAgreement', {wholeinvitation: 'whole'});
    } catch (error) {
      
    }
  }

  renderPage(image, index) {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() =>{this.noDoublePress(() => this.bannerClick(image.url))}}>
          <Image style={{ width: ScreenWidth, height: 0.6253*ScreenWidth }} source={image.image} />
        </TouchableOpacity>
      </View>
    );
  }

  renderNodeHeader(){
    return (
      <View style={{ paddingBottom: ScreenUtil.autoheight(20), marginBottom: ScreenUtil.autoheight(15) }}>
        {/* 轮播图 */}
        <Carousel autoplay autoplayTimeout={5000} loop index={0} pageSize={ScreenWidth}
          pageIndicatorContainerStyle={{bottom: 0.2*ScreenWidth, zIndex: 999}}
          pageIndicatorStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', }}
          activePageIndicatorStyle={{backgroundColor:'#FFFFFF', }}
        >
          {this.state.jdBanner.map((image, index) => this.renderPage(image, index))}
        </Carousel>
        {/* 规则说明 */}
        <View style={ styles.rule }>
          <TextButton onPress={ () => { this.noDoublePress(() => { this.goRuleClause() }) } } text="Rules" textColor="#03060FFF" fontSize={ ScreenUtil.setSpText(12) } bgColor="transparent" />
        </View>
        {/* 守护进度条 */}
        <View style={ styles.guard }>
          <Text style={ styles.guardTitle }>Purchase Progress</Text>
          <View style={ styles.guardProgress }>
            <LinearGradient colors={['#FAF961','#FFD600']} start={{x:0,y:0}} end={{x:0,y:1}} style={[styles.guardCors, { width: ScreenUtil.autowidth(339) * +this.state.progress }]}>
              <Text style={{ fontSize: ScreenUtil.setSpText(13), color: '#191B2AFF', paddingRight: ScreenUtil.autowidth(10) }}>{parseFloat((+this.state.progress * 100).toFixed(1))}%</Text>
            </LinearGradient>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#fff' }}>0</Text>
            <Text style={{ color: '#fff' }}>10 million</Text>
          </View>
        </View>
      </View>
    )
  }

  renderCard(item, index){
    return (
      <View style={[styles.sqCardWrap,{opacity:item.nodeLast==0?0.3:1}]}>
        <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:1,y:0}}>
          {/* 卡片上的2px白边 */}
          {
            item.nodeLast==0?
            <View style={{width:'100%',height:ScreenUtil.autoheight(2),backgroundColor:'transparent'}} />
            :
            <View style={{width:'100%'}}>
              <LinearGradient colors={['#0066E9','#00D0FF']} start={{x:0,y:0}} end={{x:1,y:0}}
                style={{height:ScreenUtil.autoheight(2),width:(1-item.nodeLast/item.nodeTotal)*100+'%'}}
              />
            </View>
          }
          <View style={ styles.guardCard }>
            <View style={{ width: ScreenUtil.autowidth(113), alignItems: 'center', justifyContent: 'center' }}>
              <Image source={ index === 0 ? UImage.guard_bronze : index === 1 ? UImage.guard_silver : index === 2 ? UImage.guard_gold : UImage.guard_diamond } style={{ width: ScreenUtil.autowidth(83), height: ScreenUtil.autoheight(90) }} />
            </View>
            <View style={{ flex: 1, paddingTop: ScreenUtil.autoheight(21) }}>
              <View style={ styles.guardText }>
                <LinearGradient colors={['#FAD961FF','#E2AF00FF']} start={{x:0,y:0}} end={{x:1,y:1}} style={ styles.guardDescription }>
                  <Text style={{ fontSize: ScreenUtil.setSpText(8), color: '#843500FF' }}>H</Text>
                </LinearGradient>
                <Text style={{ fontSize: ScreenUtil.setSpText(15), color: '#fff', marginRight: ScreenUtil.autowidth(5) }}>At least</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(38), color: '#fff', marginBottom: ScreenUtil.autoheight(-6), marginRight: ScreenUtil.autowidth(5) }}>{ index === 0 ? 1000 : index === 1 ? 3000 : index === 2 ? 5000 : 10000 }</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(15), color: '#fff' }}>HSN</Text>
              </View>
              <LinearGradient colors={['#0066E9FF','#00D0FFFF']} start={{x:0,y:0}} end={{x:1,y:0}} style={ styles.guardPurchase }>
                <TextButton onPress={() => this.confirmOrder(item, index)} bgColor="transparent" text="Purchase" textColor="#fff" fontSize={ ScreenUtil.setSpText(15) } />
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
        {item.nodeLast==0?<View style={styles.cardMask}></View>:<View/>}
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: '#191b2a'}]}>
        <ImageBackground source={UImage.jd_bg} style={{width:'100%',height:"100%"}}>
          <FlatList data={this.state.arr}
            ListHeaderComponent={this.renderNodeHeader()}
            renderItem={({item, index})=>this.renderCard(item, index)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item ,index) => "index" + index + item}
            refreshControl={
              <RefreshControl refreshing={this.props.jdRefreshing}
                colors={[UColor.tintColor]}
                onRefresh={()=>this.jdRefresh()}
                tintColor={UColor.tintColor}
                progressBackgroundColor={UColor.startup}
              />
            }
          />
        </ImageBackground>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  rule: {
    width: ScreenUtil.autowidth(70),
    height: ScreenUtil.autoheight(25),
    borderTopRightRadius: ScreenUtil.autoheight(25) / 2,
    borderBottomRightRadius: ScreenUtil.autoheight(25) / 2,
    backgroundColor: '#fff',
    position: 'absolute',
    top: ScreenUtil.autoheight(29),
    left: 0,
    zIndex: 999
  },

  guard: {
    width: ScreenUtil.autowidth(345),
    position: 'absolute',
    bottom: 0,
    left: ScreenUtil.autowidth(15)
  },
  guardTitle: {
    fontSize: ScreenUtil.setSpText(20),
    color: '#fff',
    textAlign: 'center',
    marginBottom: ScreenUtil.autoheight(8)
  },
  guardProgress: {
    width: '100%',
    height: ScreenUtil.autoheight(36),
    backgroundColor: 'rgba(25, 27, 42, 0.8)',
    borderColor: '#FCE731FF',
    borderWidth: ScreenUtil.autowidth(1),
    padding: ScreenUtil.autowidth(1.5),
    borderRadius: ScreenUtil.autoheight(16),
    marginBottom: ScreenUtil.autoheight(5)
  },
  guardCors: {
    height: '100%',
    borderRadius: ScreenUtil.autoheight(14),
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  tradepout: {
    flexDirection:'row',
    justifyContent:'center',
    marginVertical: ScreenUtil.autoheight(16)
  },
  tradepwimg: {
    width: ScreenUtil.autowidth(34),
    height:ScreenUtil.autoheight(47),
    paddingVertical:ScreenUtil.autoheight(10),
  },
  nodeimg: {
    width: ScreenUtil.autowidth(71),
    height:ScreenUtil.autoheight(60),
    paddingVertical:ScreenUtil.autoheight(10),
  },
  nodeEmptyimg: {
    width: ScreenUtil.autowidth(49),
    height: ScreenUtil.autowidth(49),
    marginVertical:ScreenUtil.autoheight(10),
  },
  tradetext: {
    textAlign:"center",
    fontSize:ScreenUtil.setSpText(16),
    color: 'rgba(0, 0, 0, 0.5)',
    marginVertical: ScreenUtil.autoheight(16)
  },
  textinpt: {
    width: '100%',
    color: "#1A1A1A",
    opacity: 0.8,
    fontSize: ScreenUtil.setSpText(18),
    paddingVertical: ScreenUtil.autoheight(10),
    paddingHorizontal: ScreenUtil.autowidth(10),
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: ScreenUtil.autowidth(1),
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sqHorizontal:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sqCardWrap:{
    width: ScreenUtil.autowidth(333),
    marginLeft: ScreenUtil.autowidth(21),
    marginVertical: ScreenUtil.autoheight(5),
    borderRadius: ScreenUtil.autowidth(10),
    overflow: 'hidden',
  },

  guardCard: {
    height: ScreenUtil.autoheight(125),
    flexDirection: 'row'
  },
  guardText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: ScreenUtil.autoheight(51),
    marginBottom: ScreenUtil.autoheight(5),
    paddingBottom: ScreenUtil.autoheight(3)
  },
  guardDescription: {
    width: ScreenUtil.autowidth(16),
    height: ScreenUtil.autowidth(16),
    borderRadius: ScreenUtil.autowidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ScreenUtil.autowidth(6),
    marginLeft: ScreenUtil.autowidth(4),
    marginBottom: ScreenUtil.autoheight(1)
  },
  guardPurchase: {
    width: ScreenUtil.autowidth(197),
    height: ScreenUtil.autoheight(28),
    borderRadius: ScreenUtil.autowidth(14)
  },
  
  sqCardHeader:{
    backgroundColor:'rgba(0, 0, 0, 0.3)',
    paddingHorizontal:ScreenUtil.autowidth(12),
    paddingVertical: ScreenUtil.autoheight(6),
  },
  sqCardBody:{
    paddingHorizontal: ScreenUtil.autowidth(20),
    paddingVertical: ScreenUtil.autoheight(25)
  },
  sqCardBodyText:{
    flex:1,
    textAlign:"center",
    color:'#fff',
    fontSize:ScreenUtil.setSpText(16),
  },
  sqCardBodyTitle:{
    flex:1,
    textAlign:"center",
    color:'rgba(255, 255, 255, 0.7)',
    fontSize:ScreenUtil.setSpText(12),
  },
  uIcon:{
    width:ScreenUtil.autowidth(10),
    height:ScreenUtil.autowidth(10),
    borderRadius: ScreenUtil.autowidth(5),
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  uBtn:{
    width:ScreenUtil.autowidth(60),
    height:ScreenUtil.autoheight(25),
    borderRadius:ScreenUtil.autoheight(12.5),
  },
  timeBox:{
    height:ScreenUtil.autoheight(50),
    width:ScreenUtil.autowidth(293),
    borderRadius:ScreenUtil.autoheight(25),
    position:'absolute',
    left:(ScreenWidth-ScreenUtil.autowidth(293))/2,
  },
  timeBlock:{
    width:ScreenUtil.autowidth(22),
    height:ScreenUtil.autowidth(22),
    borderRadius:ScreenUtil.autowidth(2),
  },
  timeText:{
    color:'#fff',
    fontSize:ScreenUtil.setSpText(16),
    textAlign:'center',
    lineHeight: ScreenUtil.autowidth(22)
  },
  cardMask:{
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top:0,
    left: 0,
  },
  input:{
    marginBottom:ScreenUtil.autowidth(11),
    borderBottomColor:"#D9D9D9",
    borderBottomWidth:ScreenUtil.autowidth(0.4),
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    height:ScreenUtil.autowidth(40),
  },
});

// export default Nodeapplication;
