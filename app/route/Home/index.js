import React from 'react';
import { connect } from 'react-redux'
import {Dimensions, StyleSheet, Image, View, Text, TouchableOpacity, RefreshControl, FlatList,} from 'react-native';
import moment from 'moment';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import NativeUtil from '../../utils/NativeUtil'
import { Utils } from '../../utils/Utils';
import { EasyToast } from "../../components/Toast"
import Ionicons from 'react-native-vector-icons/Ionicons'
import {AlertModal} from '../../components/modals/AlertModal'
import Carousel from 'react-native-banner-carousel';
import Swiper from 'react-native-swiper';
import BaseComponent from "../../components/BaseComponent";
import TextButton from '../../components/TextButton'
import LinearGradient from 'react-native-linear-gradient'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login, Nodeapplication, market, loading }) => ({ ...login, ...Nodeapplication, ...market, marketRefreshing: loading.effects['market/getSeasonRank']}))
class Home extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      homeBanner:[
        {image:UImage.homeBannerBg,url:""},
      ],
      isPersonal: true,
      isTeam: false,
      IssueNumnber: [{"stage":1}],
      currentSeason:0,
      triggerReset:1,
      countDownHome:[0,0,0],
      counter:"",

      // 守护者等级
      grade: this.props.loginUser.protectorMasterNode
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentWillUnmount(){
    this.setState = (state, callback) => {
      return;
    };
  }

  async onRefresh () {
    //我的节点信息
    // await Utils.dispatchActiionData(this, {type:'Nodeapplication/getMyNode',payload:{} });
    // //个人挖矿产出
    // await Utils.dispatchActiionData(this, {type:'market/getMiningInfo',payload:{} });
    //获取赛季
    // await this._onGetLatest();

    await this.setState({isPersonal: true, isTeam: false,});
    
    await this.onSeasonRefresh(this.state.currentSeason+1);
    //计算倒计时
    // const timeReg = new RegExp(/([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/);
    // let nowTime = Constants.nowDate.match(timeReg)[0].split(":");
    // let nowTimeNum = parseInt(nowTime[0])*3600+parseInt(nowTime[1])*60+parseInt(nowTime[2]);
    // let remain;
    // if(nowTimeNum<43200){
    //   remain = 43200 - nowTimeNum;
    // }else if(nowTimeNum<86400){
    //   remain = 86400 - nowTimeNum + 43200;
    // }
    // clearInterval(this.state.counter);
    // remain>0?this.setCountDown(remain):this.setState({countDownHome:[0,0,0]});
  }

  //倒计时函数
  setCountDown(st){
    this.setState({ counter:setInterval(()=>{
      if (st>0) {
        st--;
        this.setState({countDownHome:[parseInt(st/3600),parseInt((st%3600)/60),st%60]});
      } else {
        this.onRefresh();
        clearInterval(this.state.counter);
        this.setState({countDownHome:[0,0,0]})
      }
    },1000) })
  }

   
  //个人积分排名
  async onSeasonRefresh (stageNumnber) {
    if(this.props.marketRefreshing){
      return
    }
    await Utils.dispatchActiionData(this, {type:'market/getSeasonRank',payload:{number: stageNumnber, pageNo: 1, pageSize: 10 } })
  }

  //团队积分排名 
  async onTeamRefresh () {
    await Utils.dispatchActiionData(this, {type:'market/getTeamRank',payload:{pageNo: 1, pageSize: 30 } })
  }

  //获取赛季期数
  async _onGetLatest () {
    try {
      let resp = await Utils.dispatchActiionData(this, {type:'market/getLatestNumber',payload:{} })
      let currentSeason = this.state.currentSeason;
      if(resp && resp.code == 0){
        let IssueNumnber = []
        for(let i = 0; i < resp.data.maxSeasonNumnber; i++){
          IssueNumnber.push({stage:i+1});
        }
        if(currentSeason === 0){
          currentSeason = IssueNumnber.length-1
        }
        this.setState({ IssueNumnber: IssueNumnber,currentSeason })
      }
    } catch (error) {
      
    }
  }
  //切换赛季
  _changeSeason(sts){
    let currentSeason = this.state.currentSeason;
    if(sts==='add' && this.state.currentSeason < this.state.IssueNumnber.length-1){
      currentSeason++;
    }else if(sts==='neg' && this.state.currentSeason>0){
      currentSeason--;
    }
    this.setState({currentSeason});
    this.onSeasonRefresh(currentSeason+1);

  }

  //获取倒计时
  transferTimeZone(){
    const timeReg = new RegExp(/([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/);
    let nowTime = Constants.nowDate.match(timeReg)[0].split(":");
    let nowTimeNum = parseInt(nowTime[0]);
    if(nowTimeNum>=12){
      let timezone = moment(Constants.nowDate).add(+24,'hours').format('YYYY-MM-DD 12:00:00');
      return  timezone;
    }else{
      let timeover = moment(Constants.nowDate).format("YYYY-MM-DD 12:00:00")
      return  timeover;
    }
  }

  
  bannerClick() {

  }

  onNodeDetailed () {
    try {
      const { navigate } = this.props.navigation;
      navigate('NodeDetailed', {});
    } catch (error) {
      
    }
  }
  
  //Banner图
  renderPage(image, index) {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() =>{this.noDoublePress(() => this.bannerClick(image.url))}}>
          <Image style={{ width: ScreenWidth, height: 0.6253*ScreenWidth }} source={!this.props.homeBanner?image.image:{uri:image.image}} />
        </TouchableOpacity>
      </View>
    );
  }


  businesButton(style, selectedSate, stateType, buttonTitle) {  
    let BTN_SELECTED_STATE_ARRAY = ['isPersonal', 'isTeam'];  
    return(  
      <TouchableOpacity style={[style]}  onPress={ () => {this._updateBtnState(stateType, BTN_SELECTED_STATE_ARRAY)}}>  
        <Text style={[styles.tabText, selectedSate ? {color: 'rgba(255, 255, 255, 1)'} : {color: 'rgba(255, 255, 255, 0.5)'}]}>{buttonTitle}</Text>  
      </TouchableOpacity>  
    );  
  } 

  // 更新"个人排名 团队排名"按钮的状态  
  _updateBtnState(currentPressed, array) { 
    if (currentPressed === 'undefined' || currentPressed === null || array === 'undefined' || array === null ) {  
      return;  
    }  
    if(currentPressed == "isPersonal"){
      this.setState({isPersonal: true, isTeam: false,});
      this.onSeasonRefresh(this.state.currentSeason+1);
    }else if(currentPressed == "isTeam"){
      this.setState({isPersonal: false, isTeam: true,});
      this.onTeamRefresh();
    }
  }

  //规则说明
  goRuleClause () {
    try {
      const { navigate } = this.props.navigation;
      navigate('RuleClause', {wholeinvitation: 'whole'});
    } catch (error) {
      
    }
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor}]}>
        <FlatList style={{flex: 1,}} 
          data={!this.props.scoreRankList ? [] : this.props.scoreRankList} 
          ListHeaderComponent={this._renderHeader()}
          renderItem={this._renderItem}
          ListFooterComponent={this._renderFooter(this.props.scoreRankSelf)} 
          ListEmptyComponent={this.createEmptyView()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item ,index) => "index"+index+item}
          refreshControl={<RefreshControl refreshing={(!this.props.marketRefreshing)?false:true} onRefresh={() => this.onRefresh()}
          tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}/>}
        /> 
      </View>
    )
  }
  // 顶部倒计时到排名账户积分标题栏（不包括列表）
  _renderHeader = () => {
    console.log(this.state.grade)
    return(
      <View style={styles.itemheadout}>
        <View style={styles.headerout}>
          {/* 规则说明 */}
          <View style={ styles.rule }>
            <TextButton onPress={ () => { this.noDoublePress(() => { this.goRuleClause() }) } } text="Rules" textColor="#03060FFF" fontSize={ ScreenUtil.setSpText(12) } bgColor="transparent"></TextButton>
          </View>
          {/* 轮播图 */}
          <Carousel autoplay autoplayTimeout={5000} loop index={0} pageSize={ScreenWidth}
            pageIndicatorContainerStyle={{bottom: 0.18*ScreenWidth, zIndex: 999}}
            pageIndicatorStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', }}
            activePageIndicatorStyle={{backgroundColor:'#FFFFFF'}}>
            {!this.props.homeBanner ? 
              this.state.homeBanner.map((image, index) => this.renderPage(image, index))
              : 
              this.props.homeBanner.map((image, index) => this.renderPage(image, index))
            }
          </Carousel>
          {/* 段位图 */}
          <View style={ styles.duan }>
            <Image style={styles.duanImg} source={this.state.grade === 'bronze' ? UImage.bronze_light : UImage.bronze} />
            <Image style={styles.duanImg} source={this.state.grade === 'silver' ? UImage.silver_light : UImage.silver} />
            <Image style={styles.duanImg} source={this.state.grade === 'gold' ? UImage.gold_light : UImage.gold} />
            <Image style={styles.duanImg} source={this.state.grade === 'diamond' ? UImage.diamond_light : UImage.diamond} />
          </View>
        </View>
        {/* 产出蓝色区域 */}
        <View style={styles.produceout}>
          <LinearGradient colors={["#00D0FF","#0066E9"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.produceLinear}>
            <Text style={styles.producetoptitle}>Today's Refund</Text>
            <View style={styles.producebtm}>
              <Text style={styles.producebtmtext}>{this.props.MiningDate.todayOutPut ? parseFloat(this.props.MiningDate.todayOutPut).toFixed() : 0}</Text>
              <Text style={styles.producebtmtitle}>U</Text>
            </View>
          </LinearGradient>
          <LinearGradient colors={["#00D0FF","#0066E9"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.produceLinear}>
            <Text style={styles.producetoptitle}>Refunded</Text>
            <View style={styles.producebtm}>
              <Text style={styles.producebtmtext}>{this.props.MiningDate.historyOutPut ? parseFloat(this.props.MiningDate.historyOutPut).toFixed() : 0}</Text>
              <Text style={styles.producebtmtitle}>U</Text>
            </View>
          </LinearGradient>
          <LinearGradient colors={["#00D0FF","#0066E9"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.produceLinear}>
            <Text style={styles.producetoptitle}>Tatol Refund</Text>
            <View style={styles.producebtm}>
              <Text style={styles.producebtmtext}>{this.props.MiningDate.totalWaitOutPut ? parseFloat(this.props.MiningDate.totalWaitOutPut).toFixed() : 0}</Text>
              <Text style={styles.producebtmtitle}>U</Text>
            </View>
          </LinearGradient>
        </View>
        {/* 个人团队排名列表 */}
        <View style={styles.listheadout}>
          <LinearGradient colors={["#4F5162","#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{width: ScreenWidth-ScreenUtil.autowidth(30),}}>
            <View style={styles.businestab}>  
              {this.businesButton(styles.tabStyle, this.state.isPersonal, 'isPersonal', 'Protectors Ranking')}  
              {this.businesButton(styles.tabStyle, this.state.isTeam, 'isTeam', 'Team Ranking')}  
            </View>
            <View style={ styles.titleLine }></View>

            {/* {this.state.isPersonal ?
              <View style={styles.swiperout}>
                <LinearGradient colors={["rgba(45, 47, 62, 1)",UColor.bgColor,"rgba(45, 47, 62, 1)"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={[styles.teamout,{flexDirection:'row', justifyContent:'space-between'}]}>
                  <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this._changeSeason('neg')})}}>
                    <Ionicons style={{color:'#fff',paddingHorizontal:ScreenUtil.autowidth(20)}} name="ios-arrow-back" size={ScreenUtil.setSpText(25)}/>
                  </TouchableOpacity>
                  <Text style={styles.teamtext}>{"第" + this.state.IssueNumnber[this.state.currentSeason].stage + "赛季"}</Text>
                  <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this._changeSeason('add')})}}>
                    <Ionicons style={{color:'#fff',paddingHorizontal:ScreenUtil.autowidth(20)}} name="ios-arrow-forward" size={ScreenUtil.setSpText(25)}/>
                  </TouchableOpacity>
                </LinearGradient>
            </View>
            :
            <LinearGradient colors={["rgba(45, 47, 62, 1)",UColor.bgColor,"rgba(45, 47, 62, 1)"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.teamout}>
              <Text style={styles.teamtext}>总积分排名</Text>
            </LinearGradient>
            } */}
            {
              this.state.isPersonal ?
                <View style={styles.itemheadtitleout}>
                  <Text style={[styles.itemheadtitle, {flex: 49, textAlign: 'center'}]}>Ranking</Text>
                  <Text style={[styles.itemheadtitle, {flex: 123, textAlign: 'center'}]}>Account</Text>
                  <Text style={[styles.itemheadtitle, {flex: 67}]}>Deposit</Text>
                  <Text style={[styles.itemheadtitle, {flex: 78, textAlign: 'right'}]}>HSN Rewards</Text>
                </View>
                :
                <View style={styles.itemheadtitleout}>
                  <Text style={[styles.itemheadtitle, {flex: 1, textAlign: 'center'}]}>Ranking</Text>
                  <Text style={[styles.itemheadtitle, {flex: 2, textAlign: 'center'}]}>Account</Text>
                </View>
            }
          </LinearGradient>
        </View>
      </View>
    )
  }
  // 排名列表(排前10)
  _renderItem = ({item, index}) => {
    if (this.state.isPersonal) { // 个人
        return (
          <LinearGradient colors={(this.props.scoreRankSelf && this.props.scoreRankSelf.uid == item.uid)? ["#0066E9","#00D0FF"] : ["#4F5162","#1E202C"]} 
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.itemout}>
          {(this.props.scoreRankSelf && this.props.scoreRankSelf.uid == item.uid)?
            <View style={styles.itemleftout}>
              <Text style={styles.itemlefttext}>me</Text>
            </View>
            :
            <View style={styles.itemleft}/>
          }
          <View style={styles.itemright}>
            <Text style={(item.rankNo==1||item.rankNo==2||item.rankNo==3)?[styles.itemrankinga, {flex: 49, textAlign: 'center'}]:[styles.itemrankingb, {flex: 49, textAlign: 'center'}]}>{item.rankNo}</Text>
            <View style={[styles.itemaccountout, {flex: 123}]}>
              <Image source={!item.partner_level ? UImage.integral_bg : Constants.levelimg[item.partner_level]} style={[styles.itemaccountimg, {marginHorizontal: ScreenUtil.autowidth(6)}]}/>
              {item.nick_name && <Text style={[styles.itemaccounttext, {flex: 1}]} numberOfLines={1} ellipsizeMode="tail">{item.nick_name}</Text>}
              {item.team_name && <Text style={[styles.itemaccounttext, {flex: 1}]} numberOfLines={1} ellipsizeMode="tail">{item.team_name}</Text>}
            </View>
            <Text style={[styles.itemintegral, {flex: 67, textAlign: 'left', paddingLeft: ScreenUtil.autowidth(10)}]} numberOfLines={1}>{item.points}</Text>
            <Text style={[styles.itemintegral, {flex: 78, textAlign: 'right'}]} numberOfLines={1}>{item.points}</Text>
          </View>
        </LinearGradient>
      )
    } else { // 团队
      return (
        <LinearGradient colors={(this.props.scoreRankSelf && this.props.scoreRankSelf.uid == item.uid)? ["#0066E9","#00D0FF"] : ["#4F5162","#1E202C"]} 
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.itemout}>
          {(this.props.scoreRankSelf && this.props.scoreRankSelf.uid == item.uid)?
            <View style={styles.itemleftout}>
              <Text style={styles.itemlefttext}>me</Text>
            </View>
            :
            <View style={styles.itemleft}/>
          }
          <View style={styles.itemright}>
            <Text style={(item.rankNo==1||item.rankNo==2||item.rankNo==3)?[styles.itemrankinga, { flex: 1 }]:[styles.itemrankingb, {flex: 1}]}>{item.rankNo}</Text>
            <View style={styles.itemaccountout}>
              <Image source={!item.partner_level ? UImage.integral_bg : Constants.levelimg[item.partner_level]} style={styles.itemaccountimg}/>
              {item.nick_name && <Text style={styles.itemaccounttext} numberOfLines={1}>{item.nick_name}</Text>}
              {item.team_name && <Text style={styles.itemaccounttext} numberOfLines={1}>{item.team_name}</Text>}
            </View>
          </View>
        </LinearGradient>
      )
    }
  }
  // 当排名大于10额外显示自己排名的一行
  _renderFooter = (self) => {
    if (this.state.isPersonal) {
      return (
        <View style={styles.footerout}>
          <LinearGradient colors={["#4F5162","#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{width:ScreenWidth-ScreenUtil.autowidth(30)}}>
            {self && (self.rankNo > 10 || self.rankNo == 0) &&
            <LinearGradient colors={["#0066E9","#00D0FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.footlinear}>
              <View style={styles.itemleftout}>
                <Text style={styles.itemlefttext}>me</Text>
              </View>
              <View style={styles.itemright}>
                <Text style={[styles.itemrankingb, {flex: 49}]}>{self.rankNo}</Text>
                <View style={[styles.itemaccountout, {flex: 123}]}>
                  <Image source={!self.partner_level ? UImage.integral_bg : Constants.levelimg[self.partner_level]} style={[styles.itemaccountimg, {marginHorizontal: ScreenUtil.autowidth(6)}]}/> 
                  {self.nick_name && <Text style={[styles.itemaccounttext, {flex: 1}]} numberOfLines={1}>{self.nick_name}</Text>}
                  {self.team_name && <Text style={[styles.itemaccounttext, {flex: 1}]} numberOfLines={1}>{self.team_name}</Text>}
                </View>
                <Text style={[styles.itemintegral, {flex: 67, textAlign: 'left'}]} numberOfLines={1}>{self.points}</Text>
                <Text style={[styles.itemintegral, {flex: 78, textAlign: 'right'}]} numberOfLines={1}>{self.points}</Text>
              </View>
            </LinearGradient>}
            <View style={styles.itemfooter}></View>
          </LinearGradient>
        </View>
      )
    } else {
      return (
        <View style={styles.footerout}>
          <LinearGradient colors={["#4F5162","#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{width:ScreenWidth-ScreenUtil.autowidth(30)}}>
            {self && (self.rankNo > 10 || self.rankNo == 0) &&
            <LinearGradient colors={["#0066E9","#00D0FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.footlinear}>
              <View style={styles.itemleftout}>
                <Text style={styles.itemlefttext}>me</Text>
              </View>
              <View style={styles.itemright}>
                <Text style={[styles.itemrankingb, { flex: 1 }]}>{self.rankNo}</Text>
                <View style={[styles.itemaccountout, { flex: 2 }]}>
                  <Image source={!self.partner_level ? UImage.integral_bg : Constants.levelimg[self.partner_level]} style={styles.itemaccountimg}/> 
                  {self.nick_name && <Text style={styles.itemaccounttext} numberOfLines={1}>{self.nick_name}</Text>}
                  {self.team_name && <Text style={styles.itemaccounttext} numberOfLines={1}>{self.team_name}</Text>}
                </View>
              </View>
            </LinearGradient>}
            <View style={styles.itemfooter}></View>
          </LinearGradient>
        </View>
      )
    }
  }

  createEmptyView = () => {
    return(<LinearGradient colors={["#4F5162","#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.emptyView}>
      <View style={styles.notimeout}>
        <Image source={UImage.noRecord} style={styles.defectbgimg}/>
        <Text style={styles.notimetext}>{"No ranking yet"}</Text>
      </View>
    </LinearGradient>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#F8F8F8'
  },

  itemheadout: {
    flexDirection: 'column', 
  },
  headerout: {
    width: ScreenWidth, 
    height: 0.6253*ScreenWidth + ScreenUtil.autowidth(27),
  },
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
  headtitle: {
    color: '#000000', 
    fontWeight: 'bold',
    fontSize: ScreenUtil.setSpText(12),
  },
  headtime: {
    color: '#000000', 
    fontWeight: 'bold',
    fontSize: ScreenUtil.setSpText(16),
  },
  headlinearout: {
    flexDirection: 'row', 
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    height: ScreenUtil.autoheight(75), 
    borderRadius: ScreenUtil.autowidth(10), 
    position: 'absolute', 
    bottom: 0, 
    left: ScreenUtil.autowidth(15), 
    right: ScreenUtil.autowidth(15), 
    zIndex: 999,
  },
  headlinear: {
    flexDirection: 'row', 
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    height: ScreenUtil.autoheight(75), 
    borderRadius: ScreenUtil.autowidth(10), 
  },
  dividingline: {
    height: '100%', 
    width: ScreenUtil.autowidth(1), 
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  headrowout: {
    flex: 1, 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'space-around',  
  },
  headrowtitle: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: ScreenUtil.setSpText(12),
  },
  headrowtext: {
    color: '#000000',
    fontSize: ScreenUtil.setSpText(24),
  },

  duan: {
    width: ScreenUtil.autowidth(346),
    height: ScreenUtil.autoheight(75),
    position: 'absolute',
    bottom: 0,
    left: ScreenUtil.autowidth(15),
    flexDirection: 'row',
    borderRadius: ScreenUtil.autowidth(8),
    overflow: 'hidden'
  },
  duanImg: {
    flex: 1,
    height: ScreenUtil.autoheight(75)
  },

  outsource: {
    flexDirection: "column", 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor:"#0DA3DF"
  },
  listheadout: {
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    marginHorizontal: ScreenUtil.autowidth(15), 
    borderTopLeftRadius: ScreenUtil.autowidth(10), 
    borderTopRightRadius: ScreenUtil.autowidth(10), 
    overflow: 'hidden',
  },

  produceout: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: ScreenUtil.autowidth(15), 
  },
  produceLinear: {
    width: (ScreenWidth-ScreenUtil.autowidth(54))/3, 
    height: (ScreenWidth-ScreenUtil.autowidth(54))/4, 
    borderRadius: ScreenUtil.autowidth(10), 
    padding: ScreenUtil.autowidth(10), 
    paddingBottom: ScreenUtil.autowidth(19), 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  producetoptitle: {
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontSize: ScreenUtil.setSpText(13),
  },
  producetoptext: {
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: ScreenUtil.setSpText(10),
    lineHeight: ScreenUtil.autoheight(18),
  },
  producebtm: {
    flexDirection: 'row', 
    alignItems: 'flex-end', 
  },
  producebtmtext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: ScreenUtil.setSpText(16),
  },
  producebtmtitle: {
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontSize: ScreenUtil.setSpText(12),
  },

  outsourcelist: {
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    minHeight: ScreenHeight/3,
    borderRadius: ScreenUtil.autowidth(10), 
    marginHorizontal: ScreenUtil.autowidth(15), 
    marginBottom: ScreenUtil.autoheight(30),  
  },

  businestab: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.autoheight(67),
    width: ScreenWidth-ScreenUtil.autowidth(30),
  },
  tabStyle: {
    flex: 1,
    alignItems: 'center',   
    justifyContent: 'center',
    height: ScreenUtil.autoheight(50),
  },
  tabText: {
    fontSize: ScreenUtil.setSpText(16),
  },

  titleLine: {
    marginTop: ScreenUtil.autoheight(7),
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', 
    borderBottomWidth: ScreenUtil.autoheight(0.5),
    marginBottom: ScreenUtil.autoheight(26),
    marginHorizontal: ScreenUtil.autowidth(15)
  },
  
  swiperout: {
    width: ScreenWidth-ScreenUtil.autowidth(64), 
    marginHorizontal: ScreenUtil.autowidth(17), 
    alignItems: 'center', 
    overflow: 'hidden', 
    borderRadius: ScreenUtil.autowidth(5),
  },
  prevbtnout: {
    width: ScreenWidth/3.5, 
    height: ScreenUtil.autoheight(50), 
    paddingLeft: (ScreenWidth/3)/5, 
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  nextbtnout: {
    width: ScreenWidth/3.5, 
    height: ScreenUtil.autoheight(50), 
    paddingRight: (ScreenWidth/3)/5, 
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  swiperseason: {
    width: ScreenWidth-ScreenUtil.autowidth(64), 
    height: ScreenUtil.autoheight(50), 
    alignItems: 'center', 
    justifyContent: 'center', 
    alignSelf: 'center',
  },
  swipertext: {
    color: '#0096F3',
    fontSize: ScreenUtil.setSpText(16),
  },

  teamout: {
    width:ScreenWidth-ScreenUtil.autowidth(64), 
    height: ScreenUtil.autoheight(50), 
    overflow: 'hidden', 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: ScreenUtil.autowidth(5) 
  },
  teamtext: {
    color: '#0096F3',
    fontSize: ScreenUtil.setSpText(16),
  },

  
  itemheadtitleout: {
    marginHorizontal: ScreenUtil.autowidth(15), 
    paddingVertical: ScreenUtil.autoheight(6), 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', 
    borderBottomWidth: ScreenUtil.autoheight(0.5),
  },
  itemheadtitle: {
    fontSize: ScreenUtil.setSpText(13),
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  footerout: {
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    marginHorizontal: ScreenUtil.autowidth(15), 
    marginBottom: ScreenUtil.autoheight(15), 
    borderBottomLeftRadius: ScreenUtil.autowidth(10), 
    borderBottomRightRadius: ScreenUtil.autowidth(10), 
    overflow: 'hidden',
  },
  footlinear: {
    width: ScreenWidth-ScreenUtil.autowidth(30),
    height: ScreenUtil.autoheight(50),
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  itemout: {
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    marginHorizontal: ScreenUtil.autowidth(15), 
    height: ScreenUtil.autoheight(50),
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  itemleftout: {
    width: ScreenUtil.autowidth(15), 
    height: ScreenUtil.autowidth(15), 
    marginLeft: ScreenUtil.autowidth(5),  
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: ScreenUtil.autowidth(7.5), 
  },
  itemlefttext: {
    color: '#006CEB', 
    fontWeight: 'bold',
    fontSize: ScreenUtil.setSpText(10), 
  },
  itemleft: {
    width: ScreenUtil.autowidth(20), 
    height: ScreenUtil.autowidth(20), 
  },
  itemright: {
    width: (ScreenWidth-ScreenUtil.autowidth(70)), 
    height: ScreenUtil.autoheight(50), 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', 
    borderBottomWidth: ScreenUtil.autoheight(0.5), 
  },
  itemrankinga: {
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    textAlign: 'center',
    width: ScreenUtil.autowidth(36), 
    fontSize: ScreenUtil.setSpText(32),
  },
  itemrankingb: {
    color: '#FFFFFF', 
    textAlign: 'center', 
    width: ScreenUtil.autowidth(36), 
    fontSize: ScreenUtil.setSpText(16),
  },
  itemaccountout: {
    flex: 2, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  itemaccountimg: { 
    width: ScreenUtil.autowidth(26), 
    height: ScreenUtil.autowidth(26), 
    borderRadius: ScreenUtil.autowidth(13),
    marginHorizontal: ScreenUtil.autowidth(16),
  },
  itemaccounttext: {
    color: '#FFFFFF', 
    fontSize: ScreenUtil.setSpText(16),
  },
  itemintegral: {
    flex: 1, 
    color: '#FFFFFF', 
    textAlign: 'right',
    fontSize: ScreenUtil.setSpText(16)
  },
  itemfooter: {
    width: '100%',
    height: ScreenUtil.autoheight(20),
  },
  
  emptyView: {
    width: ScreenWidth-ScreenUtil.autowidth(30), 
    marginHorizontal: ScreenUtil.autowidth(15),
  },
  notimeout:{ 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScreenUtil.autoheight(15), 
  },
  defectbgimg: {
    width: ScreenUtil.autowidth(90),
    height: ScreenUtil.autowidth(90),
  },
  notimetext: {
    textAlign: 'center',
    color: '#FFFFFF',
    paddingTop: ScreenUtil.autoheight(11), 
    fontSize: ScreenUtil.setSpText(11),
    lineHeight: ScreenUtil.autoheight(18), 
  },
});

export default Home;