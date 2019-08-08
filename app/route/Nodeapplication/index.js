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
const ScreenWidth = Dimensions.get('window').width;

@connect(({login, Nodeapplication, personal, loading }) => ({...login, ...Nodeapplication, ...personal,
  jdRefreshing: loading.effects['Nodeapplication/nodeRefresh']
}))
class Nodeapplication extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      jdBanner:[
        {image:UImage.homeBannerBg,url:""},
      ],
      nodeLists:[ ],
      countDown:['-','-','-'],
      counter:"",
      season:"-",
      stage:"-",

      tradePassword:"",
      code: "",
      uuid: "",
    };
  }

  //组件加载完成
  async componentDidMount() {
    this.jdRefresh();
    //是否设置了交易密码
    await Utils.dispatchActiionData(this, {type:'personal/isSetTradePassword',payload:{ } });
  }

  componentWillUnmount(){
    this.setState = (state, callback) => {
      return;
    };
  }

  async jdRefresh(){
    try {
      // 获取各节点基本信息
      let res = await Utils.dispatchActiionData(this, {type:'Nodeapplication/nodeRefresh', payload: ""});
      // 获取节点抢购时剩余节点数量
      // Nodeapplication/nodeGetInfo为models/Nodeapplication.js下*nodeGetInf的函数方法
      let nodebk = await Utils.dispatchActiionData(this, {type:'Nodeapplication/nodeGetInfo', payload: ""});
      if(nodebk.msg !== "success"){
        EasyToast.show(nodebk.msg);
        return;
      }
      let nodeTemp = [];
      this.props.nodeList.map((item)=>{
        let row = Object.assign({},item);
        let fitData = this.props.nodeInfo.filter((info)=>info.nodeId == row.id);
        if(fitData.length>0){
          row.issueId = fitData[0].id;
          row.nodeTotal = fitData[0].nodeCount;
          row.nodeLast = fitData[0].nodeRemainCount;
        }else {
          row.nodeTotal = 0;
          row.nodeLast = 0;
        }
        nodeTemp.push(row);
      });

      let stageNums = this.props.nodeInfo[0].number;
      let sStr ="第"+ Math.ceil(stageNums/5) + "赛季";
      let qStr ="第"+ stageNums + "期";

      this.setState({season:sStr, stage:qStr});

      //计算倒计时
      const firTime = this.toTimeNumber((res.countDowm && res.countDowm.firstCountDowm)? res.countDowm.firstCountDowm : "10:00:00");
      const secTime = this.toTimeNumber((res.countDowm && res.countDowm.secondCountDowm)? res.countDowm.secondCountDowm : "22:00:00");
      const timeReg = new RegExp(/([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/);
      let nowTime = Constants.nowDate.match(timeReg)[0].split(":");
      let nowTimeNum = parseInt(nowTime[0])*3600+parseInt(nowTime[1])*60+parseInt(nowTime[2]);
      let remain;
      if(nowTimeNum< firTime){
        remain = firTime - nowTimeNum;
      }else if(nowTimeNum<secTime){
        remain = secTime - nowTimeNum;
      }else if(nowTimeNum<86400){
        remain = 86400 - nowTimeNum + firTime;
      }
      clearInterval(this.state.counter);
      remain>0?this.setCountDown(remain):"";
      this.setState({nodeLists:nodeTemp})
    }catch (e) {

    }
  }

  setCountDown(st){
    this.setState({counter:setInterval(()=>{
      if(st>0){
        st--;
        this.setState({countDown:[parseInt(st/3600),parseInt((st%3600)/60),st%60]});
      }else {
        this.jdRefresh();
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
  async confirmOrder (item) {
    try {
      this.refreshImage();
      const { navigate } = this.props.navigation;
      //未设置交易密码
      if(!this.props.SetTradePW){
        let isPay =  await AlertModal.showSync("温馨提示","未设置交易密码，请立即设置","去设置","取消",);
        if(isPay){
          navigate('SetTransactionPw', {});
        }
        return;
      }

      // 提示抢购时间未开始
      let judge = await Utils.dispatchActiionData(this, {type:'Nodeapplication/decisionJudge', payload: {issueId : item.issueId}});
      if(judge && judge.msg != "success" && judge.code != 0){
        EasyToast.show(JSON.stringify(judge.msg));
        return;
      }

      // 购买节点界面
      let con = <View>
        <ImageBackground style={{width:ScreenWidth-ScreenUtil.autowidth(120),height:(ScreenWidth-ScreenUtil.autowidth(120))*0.528,}} source={UImage.confirm_bg}>
          <View style={{flex:1,flexDirection:'row',paddingTop: ScreenUtil.autoheight(30),}}>
            <View style={{flex:1,paddingLeft:ScreenUtil.autowidth(15),flexDirection:'column',}}>
              <Text style={{color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),paddingBottom:ScreenUtil.autoheight(20),}}>购买类型</Text>
              <Text style={{color:"#FFF",fontSize:ScreenUtil.setSpText(16),fontWeight:'bold'}}>{item.name}</Text>
            </View>
            <View style={{flex:2,paddingLeft:ScreenUtil.autowidth(10),flexDirection:'column',}}>
              <Text style={{color:"#FFE794",fontSize:ScreenUtil.setSpText(12),paddingBottom:ScreenUtil.autoheight(10),}}>支付USDT</Text>
              <Text style={{color:"#FFE794",fontSize:ScreenUtil.setSpText(28),fontWeight:'bold'}}>{item.discountPriceUsdt}</Text>
            </View>
          </View>
       </ImageBackground>
      </View>;
      let isAuth =  await AlertModal.showSync("确认订单",con,"确认支付","取消",true );
      if(isAuth){
        this.tradePassword(item);
      }
    } catch (error) {

    }
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
  async tradePassword (item) {
    try {
      let th = this;
      let con = 
      <View>
        <View style={styles.tradepout}>
          <Image style={styles.tradepwimg} source={UImage.icon_lock} />
        </View>
        <View style={{flexDirection:"column",paddingHorizontal: ScreenUtil.autowidth(10),}}>
          <TextInput autoFocus={true} placeholder={"请输入交易密码"} placeholderTextColor="#999"
            secureTextEntry={true} defaultValue={this.state.tradePassword} maxLength={Constants.PWD_MAX_LENGTH} style={styles.textinpt}
            onChangeText={(tradePassword) => this.setState({tradePassword})} selectionColor={"#6DA0F8"} 
            underlineColorAndroid="transparent" returnKeyType="next"
          />
          <TextInput autoFocus={false} placeholder={"请输入图形验证码"} placeholderTextColor="#999"  
            secureTextEntry={true}  defaultValue={this.state.code} maxLength={5} style={styles.textinpt} 
            onChangeText={(code) => this.setState({code})} selectionColor={"#6DA0F8"} 
            underlineColorAndroid="transparent" returnKeyType="go"    
          />
          <View style={{flexDirection:"row",alignItems:"space-between", paddingTop: ScreenUtil.autoheight(10)}}>
            <Image onError={(e)=>{this.loaderror()}} style={{width:(ScreenWidth-ScreenUtil.autowidth(120))/2, height:ScreenUtil.autowidth(40), marginRight:ScreenUtil.autowidth(10),}} 
              source={{uri: Constants.defaultrootaddr + kapimg + "?uuid=" + this.state.uuid}} />
            <TouchableOpacity onPress={()=>{this.refreshImage()}} style={{flexDirection:"row", alignItems: 'center', justifyContent:"center",}}>
              <Text style={{color: '#888888', fontSize: ScreenUtil.setSpText(10),}}>看不清？</Text>
              <Text style={{color: '#0DA3DF', fontSize: ScreenUtil.setSpText(10),}}>点击刷新</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>;
      let isAuth =  await AlertModal.showSync(null,con,"确认支付","取消" ,false,()=>{
        if(th.state.tradePassword == "" ){
          EasyToast.show("请输入交易密码");
          return false;
        }else if(this.state.code == ""){
          EasyToast.show("请输入图形验证码");
          return false;
        }else {
          return true;
        }
      });
      if(isAuth){
        this.checkTradePassword(item);
      }else{
        this.setState({tradePassword: "", code: ""})
      }
    } catch (error) {

    }
  }

  // 提交到接口确认密码是否正确，若正确则购买节点成功或节点已卖完
  async checkTradePassword(item){
    let res = await Utils.dispatchActiionData(this,{type:'Nodeapplication/nodeTrade',
      payload:{
        "nodeId": item.id,//接点id
        "issueId": item.issueId,//活动id
        "tradePassword": this.state.tradePassword,
        "uuid": this.state.uuid,
        "code": this.state.code
      }
    });
    this.setState({tradePassword: "", code: ""})
    if(res.msg === "success"){
      this.nodeSuccess();
    }else if(res.msg === '对不起，节点已卖完'){
      this.nodeEmpty();
    }else {
      EasyToast.show(res.msg);
    }
  }


  //node success
  async nodeSuccess () {
    try {
      let con = <View>
        <View style={styles.tradepout}>
          <Image style={styles.nodeimg} source={UImage.fireworks} />
        </View>
        <Text style={{textAlign:"center",fontSize:ScreenUtil.setSpText(16),color: 'rgba(0, 0, 0, 0.5)'}}>温馨提示</Text>
        <Text style={{textAlign:"center",fontSize:ScreenUtil.setSpText(21),color: 'rgba(0, 0, 0, 1)',paddingVertical:ScreenUtil.autoheight(16)}}>恭喜您已成功申请节点</Text>
      </View>;
      let isAuth =  await AlertModal.showSync(null,con,"我知道了",null );
      if(isAuth){
        this.jdRefresh();
      }
    } catch (error) {

    }
  }

  //node empty
  async nodeEmpty () {
    try {
      let con = <View>
        <View style={styles.tradepout}>
          <Image style={styles.nodeEmptyimg} source={UImage.sad_face} />
        </View>
        <Text style={{textAlign:"center",fontSize:ScreenUtil.setSpText(16),color: 'rgba(0, 0, 0, 0.5)' }}>温馨提示</Text>
        <Text style={{textAlign:"center",fontSize:ScreenUtil.setSpText(21),color: 'rgba(0, 0, 0, 1)',lineHeight:ScreenUtil.autoheight(32),paddingVertical:ScreenUtil.autoheight(12)}}>很遗憾，今日已售罄，{'\n'}明天继续抢购</Text>
      </View>;
      let isAuth =  await AlertModal.showSync(null,con,"我知道了",null );
      if(isAuth){
        this.jdRefresh();
        EasyToast.show("Success!");
      }
    } catch (error) {

    }
  }

  bannerClick() {

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
      <View>
        {/* 轮播图 */}
        <Carousel autoplay autoplayTimeout={5000} loop index={0} pageSize={ScreenWidth}
                  pageIndicatorContainerStyle={{bottom: 0.2*ScreenWidth, zIndex: 999}}
                  pageIndicatorStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', }}
                  activePageIndicatorStyle={{backgroundColor:'#FFFFFF', }}>
          {this.state.jdBanner.map((image, index) => this.renderPage(image, index))}
        </Carousel>
        {/* 下一轮开抢时间黄色区域 */}
        <LinearGradient colors={['#FAF961','#FFD600']} start={{x:0,y:0}} end={{x:0,y:1}} style={[styles.sqHorizontal,styles.timeBox,{top: 0.4*ScreenWidth+Constants.FitPhone,justifyContent:"center"}]}>
          <Image source={UImage.icon_clock} style={{width:ScreenUtil.autowidth(20),height:ScreenUtil.autowidth(20)}} />
          <Text style={{color:"#04025C",marginLeft: ScreenUtil.autowidth(8),marginRight: ScreenUtil.autowidth(16),}}>
            下一轮开抢时间
          </Text>
          <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.timeBlock}>
            <Text style={styles.timeText}>{this.state.countDown[0]<10?'0'+String(this.state.countDown[0]):this.state.countDown[0]}</Text>
          </LinearGradient>
          <Text style={{color:'#000',fontWeight:'bold',paddingHorizontal:ScreenUtil.autowidth(5),fontSize:ScreenUtil.setSpText(18)}}>:</Text>
          <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.timeBlock}>
            <Text style={styles.timeText}>{this.state.countDown[1]<10?'0'+String(this.state.countDown[1]):this.state.countDown[1]}</Text>
          </LinearGradient>
          <Text style={{color:'#000',fontWeight:'bold',paddingHorizontal:ScreenUtil.autowidth(5),fontSize:ScreenUtil.setSpText(18)}}>:</Text>
          <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.timeBlock}>
            <Text style={styles.timeText}>{this.state.countDown[2]<10?'0'+String(this.state.countDown[2]):this.state.countDown[2]}</Text>
          </LinearGradient>
        </LinearGradient>
        {/* 总XXX期文字 */}
        <View style={{paddingVertical: ScreenUtil.autoheight(20),}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end',marginBottom: ScreenUtil.autoheight(17)}}>
            <View style={{flex: 1,}}/>
            <Text style={{flex: 1,textAlign:'center',color:"#ffff",fontSize:ScreenUtil.setSpText(21),fontWeight:'bold',}}>{"总" + (this.props.loginUser&&this.props.loginUser.totalIssueNumber?this.props.loginUser.totalIssueNumber:200) + "期"}</Text>
            <Text style={{flex: 1,color:'#FFDB11',fontSize:ScreenUtil.setSpText(14),}}>{this.props.discount==0?"":"(本期"+this.props.discount + "折)"}</Text>
          </View>
          {/* 第XX赛季、第XX期文字 */}
          <View style={[styles.sqHorizontal,{flex: 1,paddingHorizontal:ScreenUtil.autowidth(8)}]}>
            <Text style={{flex:1,color:"#ffff",fontSize:ScreenUtil.setSpText(16),textAlign:'center'}}>{this.state.season}</Text>
            <Text style={{flex:1,color:"#ffff",fontSize:ScreenUtil.setSpText(16),textAlign:'center'}}>{this.state.stage}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderCard(item){
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
          {/* 节点类型+剩余  文字 */}
          <View style={[styles.sqHorizontal,styles.sqCardHeader,{}]}>
            <Text style={{color:'#fff',fontSize:ScreenUtil.setSpText(16),fontWeight: 'bold'}}>{item.name}</Text>
            <Text style={{color:'#00D0FF',fontSize:ScreenUtil.setSpText(12)}}>剩余 {item.nodeLast}/{item.nodeTotal}</Text>
          </View>
          {/* 卡片内容 */}
          <View style={[styles.sqCardBody,{}]}>
            <View style={[styles.sqHorizontal,]}>
              <Text style={[styles.sqCardBodyText,{textAlign:'left'}]}>{item.totalReturnUsdt}U</Text>
              <Text style={[styles.sqCardBodyText]}>{item.returnDay}天</Text>
              <Text style={[styles.sqCardBodyText]}>{item.dailyReturnUsdt}U</Text>
              <Text style={[styles.sqCardBodyText,{textAlign:'right'}]}>{item.totalReturnRadio*100}%</Text>
            </View>

            <View style={[styles.sqHorizontal,{marginTop: ScreenUtil.autoheight(12)}]}>
              <Text style={[styles.sqCardBodyTitle,{textAlign:'left'}]}>总返还</Text>
              <Text style={[styles.sqCardBodyTitle]}>返还天数</Text>
              <Text style={[styles.sqCardBodyTitle]}>每日返还</Text>
              <Text style={[styles.sqCardBodyTitle,{textAlign:'right'}]}>总回报率</Text>
            </View>
            {/* 购买按钮那一行 */}
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',paddingTop: ScreenUtil.autoheight(20),}}>
              {this.props.discount == 0 ?
                <View style={[styles.sqHorizontal,{paddingRight: ScreenUtil.autowidth(10)}]}>
                  <LinearGradient style={styles.uIcon} colors={['#FAD961','#E2AF00']} start={{x:0,y:0}} end={{x:0,y:1}}>
                    <Text style={{color:"#843500",textAlign: 'center',fontSize:ScreenUtil.setSpText(8)}}>U</Text>
                  </LinearGradient>
                  <Text style={{paddingRight: ScreenUtil.autowidth(10),color:'#FFDB11',paddingLeft: ScreenUtil.autowidth(5),fontSize:ScreenUtil.setSpText(12)}}>{item.discountPriceUsdt}U</Text>
                </View>
                :
                <View style={[styles.sqHorizontal,{paddingRight: ScreenUtil.autowidth(10)}]}>
                  <LinearGradient style={styles.uIcon} colors={['#FAD961','#E2AF00']} start={{x:0,y:0}} end={{x:0,y:1}}>
                    <Text style={{color:"#843500",textAlign: 'center',fontSize:ScreenUtil.setSpText(8)}}>U</Text>
                  </LinearGradient>
                  <Text style={{textDecorationLine:'line-through',color:'#FFDB11',paddingLeft: ScreenUtil.autowidth(5),fontSize:ScreenUtil.setSpText(12)}}>原价：{item.standarPriceUsdt}U</Text>
                  <Text style={{paddingRight: ScreenUtil.autowidth(10),color:'#FFDB11',paddingLeft: ScreenUtil.autowidth(5),fontSize:ScreenUtil.setSpText(12)}}>折后：{item.discountPriceUsdt}U</Text>
                </View>
              }
              <View style={[styles.sqHorizontal,{}]}>
                <TouchableOpacity onPress={()=>this.confirmOrder(item)}>
                  <LinearGradient style={styles.uBtn} colors={['#0066E9','#00D0FF']} start={{x:0,y:0}} end={{x:1,y:0}}>
                    <Text style={{color:"#fff",textAlign: 'center',lineHeight:ScreenUtil.autoheight(25),fontSize:ScreenUtil.setSpText(14)}}>{item.nodeLast==0?'售罄':'购买'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
        {item.nodeLast==0?<View style={styles.cardMask}></View>:<View/>}
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: '#191b2a',}]}>
        <ImageBackground source={UImage.jd_bg} style={{width:'100%',height:"100%"}}>
          <FlatList data={this.state.nodeLists}
                    ListHeaderComponent={this.renderNodeHeader()}
                    renderItem={({item})=>this.renderCard(item)}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item ,index) => "index"+index+item}
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
    width:ScreenWidth-ScreenUtil.autowidth(30),
    marginHorizontal: ScreenUtil.autowidth(15),
    marginVertical: ScreenUtil.autoheight(5),
    borderRadius: ScreenUtil.autowidth(10),
    overflow: 'hidden',
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

export default Nodeapplication;
