import React from 'react';
import { connect } from 'react-redux'
import { SafeAreaView, InteractionManager, Dimensions, Platform, Image, ImageBackground, Modal, StyleSheet, View, RefreshControl, Text, ActivityIndicator, TouchableOpacity, Animated, FlatList, ScrollView } from 'react-native';
import moment from 'moment';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Constants from '../../utils/Constants'
import NativeUtil from '../../utils/NativeUtil'
import ScreenUtil from '../../utils/ScreenUtil'
import { Utils } from '../../utils/Utils';
import { EasyToast } from '../../components/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LargeList } from "react-native-largelist-v3";
import {AlertModal} from '../../components/modals/AlertModal'
import LinearGradient from 'react-native-linear-gradient'
import BaseComponent from "../../components/BaseComponent";

require('moment/locale/zh-cn');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
let pageNo = 1;
let pageSize = 10;

@connect(({ Invitate, login, loading }) => ({ ...Invitate, ...login ,
  friLoading:loading.effects['Invitate/friendList']}))
class Myinvitation extends BaseComponent{
  constructor(props) {
    super(props);
    this.state = {
      reward: 760,
      teamIntegral:"",
      friendsNum: 5,
      inviteCode: "2110453",
      friendsHeader:['好友等级','用户','好友日返还','邀请奖励'],
      levelName:['未激活合伙人','初级合伙人','中级合伙人','高级合伙人','超级合伙人'],
      friendsList:[],
      friDate:moment().format('YYYY/MM/DD'),
      todayTotal:0,
    };
  }

  //组件加载完成
  componentDidMount() {
    this.getuserinfo();
    this.getFriList();
  }

  componentWillUnmount(){
    this.setState = (state, callback) => {
      return;
    };
  }

  //获用户信息
  async getuserinfo () {
    try {
      //未设置团队名称
      const { navigate } = this.props.navigation;
      if(this.props.loginUser && !this.props.loginUser.teamName){
        let isPay =  await AlertModal.showSync("温馨提示","未设置团队名称，请立即设置","去设置",null,);
        if(isPay){
          navigate('SetTeamname', {});
        }
      }
    } catch (error) {
      
    }
    
  }

  //去设置团队名称
  geSetTeam () {
    try {
      if(this.props.loginUser&&!this.props.loginUser.teamName){
        const { navigate } = this.props.navigation;
        navigate('SetTeamname', {});
      }
    } catch (error) {
      
    }
    
  }

  async getFriList(){
    try {
      await Utils.dispatchActiionData(this, {type:"login/findUserInfo", payload: {}});
      let res = await Utils.dispatchActiionData(this, {type:"Invitate/friendList",payload:{date:this.state.friDate.replace(/\//g,'-')}});
      if(res.msg === 'success'){
        this.setState({friendsList:res.data,todayTotal:res.totalInviteRewardUsdt})
      }
    }catch (e) {

    }

  }

  async switchDate(sts){
    if(this.props.friLoading){
      EasyToast.show('正在刷新')
      return;
    }
    let friDate;
    if(sts==='add'){
      friDate = moment(this.state.friDate).add(1,'days');
      let today =  moment();

      if( moment.max(friDate,today) != today ){
        EasyToast.show('不能超过今天');
        return;
      }else {
        friDate = friDate.format('YYYY/MM/DD');
      }
    }else{
      friDate = moment(this.state.friDate).subtract(1,'days').format('YYYY/MM/DD');
    }
    await this.setState({friDate});
    this.getFriList();

  }

  goSomePages(sts){
    const { navigate } = this.props.navigation;
    switch (sts) {
      case 1:
        navigate('RuleClause', {wholeinvitation: 'invitation'});
        break;
      case 2:
        navigate('InviteCode', {});
        break;
    }
  }


  friendEmptyRender = ()=>{
    return (
      <View style={[styles.friendsRow,{opacity:0.3}]}>
        <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:1,y:0}} style={[styles.rowStyle,styles.invHorizontal]}>
          <Text style={[styles.rowTextStyle,{flex:1,}]}>{"无可显示项"}</Text>
        </LinearGradient>
      </View>
    )
  };

  // 好友列表
  friendRowRender(item){
    return (
      <View style={[styles.friendsRow,]}>
        <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:1,y:0}} style={[styles.rowStyle,styles.invHorizontal]}>
          <View style={styles.itemleftout}>
            <ImageBackground source={!item.friendLevel? UImage.integral_bg : Constants.levelimg[item.friendLevel]} style={{width:ScreenUtil.autowidth(45),height:ScreenUtil.autowidth(45)}}>
              <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                <Text style={[styles.rowTextStyle,{fontSize: ScreenUtil.setSpText(36)}]}>{item.friendLevel}</Text>
              </View>
            </ImageBackground>
          </View>
          <Text style={[styles.rowTextStyle,{flex:2,textAlign:'left'}]}>{item.nick_name}</Text>
          <Text style={[styles.rowTextStyle,{flex:1,}]}>{item.daily_payback_usdt}U</Text>
          <Text style={[styles.rowTextStyle,{flex:1,}]}>{item.inviteReward}U</Text>
        </LinearGradient>
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: '#191B2A'}]}>
        <ScrollView refreshControl={
          // 下拉刷新
          <RefreshControl refreshing={this.props.friLoading} colors={[UColor.tintColor]} tintColor={UColor.tintColor}
            onRefresh={()=>this.getFriList()} progressBackgroundColor={UColor.startup}
          />
        }>
          <View style={styles.invHeader}>
            <LinearGradient style={{paddingBottom: ScreenUtil.autoheight(32),}} colors={['#00ccfe','#0067e9']} start={{x:0,y:0}} end={{x:1,y:1}} >
              {/* 顶部规则说明、超级合伙人、点击分享 */}
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop: Constants.FitPhone}}>
                <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goSomePages(1)})}} style={{flex: 1, alignItems: 'flex-start',}}>
                  {/* 规则说明 */}
                  <Image source={UImage.rulesTips} style={{width: ScreenUtil.autowidth(71),height: ScreenUtil.autowidth(25),}}/>
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center',}}>
                  <Text style={{color:"#fff",fontWeight: 'bold',fontSize: ScreenUtil.setSpText(16),}}>{this.state.levelName[this.props.loginUser&&this.props.loginUser.partnerLevel]}</Text>
                </View>
                <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goSomePages(2)})}} style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center',}}>
                  <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: ScreenUtil.autowidth(18),}}>
                    <Image source={UImage.shareIcon} style={{width: ScreenUtil.autowidth(21),height: ScreenUtil.autowidth(22),}}/>
                    <Text style={{color:"#fff",fontSize: ScreenUtil.setSpText(10),}}>点击分享</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* 规则说明、超级合伙人下面横线 */}
              <View style={{
                height:ScreenUtil.autoheight(1),
                width:ScreenWidth-ScreenUtil.autowidth(86),
                marginHorizontal: ScreenUtil.autowidth(28),
                marginVertical:ScreenUtil.autoheight(28),
                backgroundColor:"#0071EC"
              }} />
              <View style={[styles.invInfoWrap,styles.invHorizontal]}>
                <View style={{width:'50%'}}>
                  <Text style={styles.invInfoTitle}>累计获得奖励（U）</Text>
                  <Text style={styles.invInfoContent}>{this.props.loginUser&&this.props.loginUser.inviteRewardUsdt}</Text>
                </View>
                <View style={{width:'50%'}}>
                  <Text style={styles.invInfoTitle}>团队积分</Text>
                  <Text style={styles.invInfoContent}>
                    {(this.props.loginUser&&this.props.loginUser.isActive=='no')?'未激活':(this.props.loginUser&&this.props.loginUser.teamPoints)}
                  </Text>
                </View>
              </View>
              <View style={[styles.invInfoWrap,styles.invHorizontal]}>
                <View style={{width:'50%'}}>
                  <Text style={styles.invInfoTitle}>邀请好友（人）</Text>
                  <Text style={styles.invInfoContent}>{this.props.loginUser&&this.props.loginUser.myInviteNumber}</Text>
                </View>
                <View style={{width:'50%'}}>
                  <Text style={styles.invInfoTitle}>团队名称</Text>
                  <Text style={styles.invInfoContent} onPress={()=>{this.noDoublePress(()=>{this.geSetTeam()})}}>{(this.props.loginUser&&this.props.loginUser.teamName)?this.props.loginUser.teamName:"去设置"}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
          {/* 我的好友下面日期切换栏 */}
          <View style={{marginTop:ScreenUtil.autoheight(30)}}>
            <Text style={{color:"#fff",fontSize:ScreenUtil.setSpText(22),textAlign: 'center',fontWeight:'bold'}}>我的好友</Text>
            <View style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              marginVertical:ScreenUtil.autoheight(21)}}>
              <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.switchDate('neg')})}}>
                <Ionicons style={{color:'#fff'}} name="ios-arrow-back" size={ScreenUtil.setSpText(25)}/>
              </TouchableOpacity>
              <Text style={{
                color:'#fff',
                fontSize: ScreenUtil.setSpText(16),
                marginHorizontal:ScreenUtil.autowidth(32)
              }}>{this.state.friDate}</Text>
              <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.switchDate('add')})}}>
                <Ionicons style={{color:'#fff'}} name="ios-arrow-forward" size={ScreenUtil.setSpText(25)}/>
              </TouchableOpacity>
            </View>
          </View>
          {/* 朋友列表 */}
          <FlatList style={styles.friendsTable}
            data={this.state.friendsList}
            ListHeaderComponent={this._renderHeader()}
            ListEmptyComponent={this.friendEmptyRender}
            renderItem={({item})=>this.friendRowRender(item)}
            ListFooterComponent={this._renderFooter()} 
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
          />
        </ScrollView>
      </View>
    )
  }

  _renderHeader = () => {
    return(
      <View style={[styles.friendsRow,styles.invHorizontal]}>
        <Text style={{color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'left'}}>好友等级</Text>
        <Text style={{flex:2,color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'center',}}>用户</Text>
        <Text style={{flex:1,color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'center',}}>好友日返还</Text>
        <Text style={{flex:1,color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'center',}}>邀请奖励</Text>
      </View>
    )
  }

  _renderFooter = () => {
    return(
      <View style={[styles.invHorizontal,{justifyContent:'flex-end',marginVertical: ScreenUtil.autoheight(5)}]}>
        <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:1,y:0}} style={[styles.rowRadius,{width:ScreenUtil.autowidth(173),flexDirection:'row',justifyContent:'center',alignItems:"center"}]}>
          <Text style={{color:'#fff',fontSize:ScreenUtil.setSpText(12)}}>今日累计：</Text>
          <Text style={{color:'#fff',fontSize:ScreenUtil.setSpText(20),fontWeight:'bold'}}>{this.state.todayTotal+"U"}</Text>
        </LinearGradient>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invHeader:{
    width:ScreenWidth-ScreenUtil.autowidth(30),
    marginHorizontal: ScreenUtil.autowidth(15),
    borderBottomRightRadius:ScreenUtil.autowidth(6),
    borderBottomLeftRadius:ScreenUtil.autowidth(6),
    overflow: 'hidden',
  },
  invInfoWrap:{
    paddingHorizontal:ScreenUtil.autowidth(31)
  },
  invInfoTitle:{
    color:"#fff",
    fontSize: ScreenUtil.setSpText(14),

  },
  invInfoContent:{
    color:"#fff",
    fontSize: ScreenUtil.setSpText(28),
    fontWeight: 'bold',
    height:ScreenUtil.autoheight(56),
    lineHeight: ScreenUtil.autoheight(56),
  },
  invHorizontal:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  friendsTable:{
    width:ScreenWidth-ScreenUtil.autowidth(30),
    marginHorizontal:ScreenUtil.autowidth(15),
  },
  friendsRow:{
    flex:1,
    alignItems:'center'
  },
  itemleftout: {
    flex:1,
    height:'100%',
    borderRadius:ScreenUtil.autowidth(6)
  },
  rowStyle:{
    width:'100%',
    height:ScreenUtil.autowidth(45),
    alignItems:'center',
    overflow: 'hidden',
    borderRadius: ScreenUtil.autowidth(6),
    marginVertical:ScreenUtil.autoheight(5)
  },
  rowRadius:{
    width:'100%',
    height:ScreenUtil.autowidth(45),
    borderRadius: ScreenUtil.autowidth(22.5)
  },
  rowTextStyle:{
    color:'#fff',
    fontSize:ScreenUtil.setSpText(16),
    fontWeight:'bold',
    textAlign:'center',
  }

});

export default Myinvitation;