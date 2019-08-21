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
import TextButton from '../../components/TextButton'

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
      friendsHeader:["Friends' Grade",'Name','Date','Invitation Awards'], 
      levelName:['Unactivated Partners','Junior Partners','Intermediate Partners','Senior Partners','Super Partners'],
      friendsList:[],
      friDate:moment().format('YYYY/MM/DD'),
      totalAmount:0,
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
        let isPay =  await AlertModal.showSync("Tips","Team name not set, please set it immediately.","Set","Cancel",);
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
        let total = 0
        res.data.forEach(val => {
          total += +val.amount
        })
        this.setState({friendsList: res.data, totalAmount: total})
      }
    }catch (e) {

    }

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
          <Text style={[styles.rowTextStyle,{flex:1,}]}>{"No  Data"}</Text>
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
            </ImageBackground>
          </View>
          <Text style={[styles.rowTextStyle,{flex:1,textAlign:'left'}]} numberOfLines={1} ellipsizeMode="tail">{item.nick_name}</Text>
          <Text style={[styles.rowTextStyle,{flex:1,}]}>{moment(item.createDate).format('YYYY/MM/DD')}</Text>
          <Text style={[styles.rowTextStyle,{flex:1,textAlign: 'right'}]}>{this.keepTwoDecimal(item.amount)}H</Text>
        </LinearGradient>
      </View>
    )
  }
  keepTwoDecimal(num) {
    num = parseFloat(num)
    let m = Math.pow(10, 2)
    return Math.floor(num * m) / m
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
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop: Constants.FitPhone + 9}}>
                {/* <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goSomePages(1)})}} style={{flex: 1, alignItems: 'flex-start',}}>
                  <Image source={UImage.rulesTips} style={{width: ScreenUtil.autowidth(71),height: ScreenUtil.autowidth(25),}}/>
                </TouchableOpacity> */}
                {/* 规则说明 */}
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <TextButton onPress={ () => { this.noDoublePress(() => { this.goSomePages(1) }) } } text="Rules" textColor="#00B3F9FF" fontSize={ ScreenUtil.setSpText(12) } bgColor="#fff" style={ styles.rule }></TextButton>
                </View>
                <View style={{flex: 2, alignItems: 'center'}}>
                  <Text style={{color:"#fff",fontSize: ScreenUtil.setSpText(16),}}>{this.state.levelName[this.props.loginUser&&this.props.loginUser.partnerLevel]}</Text>
                </View>
                <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.goSomePages(2)})}} style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center',}}>
                  <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: ScreenUtil.autowidth(18)}}>
                    <Image source={UImage.shareIcon} style={{width: ScreenUtil.autowidth(21),height: ScreenUtil.autowidth(22),}}/>
                    {/* <Text style={{color:"#fff",fontSize: ScreenUtil.setSpText(10),}}>点击分享</Text> */}
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
                <View style={{width:'57%'}}>
                  <Text style={styles.invInfoTitle}>Accumulated Reward(H)</Text>
                  <Text style={styles.invInfoContent}>{this.props.loginUser && this.props.loginUser.inviteRewardHsn ? Math.floor(this.props.loginUser.inviteRewardHsn) : 0}</Text>
                </View>
                <View style={{width:'43%'}}>
                  <Text style={styles.invInfoTitle}>Recommendations</Text>
                  <Text style={styles.invInfoContent}>
                    {(this.props.loginUser&&this.props.loginUser.isActive=='no') ? 'not active': (this.props.loginUser&&this.props.loginUser.teamPoints)}
                  </Text>
                </View>
              </View>
              <View style={[styles.invInfoWrap,styles.invHorizontal]}>
                <View style={{width:'59%'}}>
                  <Text style={styles.invInfoTitle}>Invite Friends</Text>
                  <Text style={styles.invInfoContent}>{this.props.loginUser && this.props.loginUser.myInviteNumber}</Text>
                </View>
                {/* <View style={{width:'41%'}}>
                  <Text style={styles.invInfoTitle}>团队名称</Text>
                  <Text style={styles.invInfoContent} onPress={()=>{this.noDoublePress(()=>{this.geSetTeam()})}}>{(this.props.loginUser&&this.props.loginUser.teamName)?this.props.loginUser.teamName:"去设置"}</Text>
                </View> */}
              </View>
            </LinearGradient>
          </View>
          {/* 我的好友下面日期切换栏 */}
          <View style={{marginTop:ScreenUtil.autoheight(30), marginBottom: ScreenUtil.autoheight(20)}}>
            <Text style={{color:"#fff",fontSize:ScreenUtil.setSpText(21),textAlign: 'center'}}>My Recommendation</Text>
          </View>
          {/* 朋友列表 */}
          <FlatList style={styles.friendsTable}
            data={this.state.friendsList}
            ListHeaderComponent={this._renderHeader()}
            ListEmptyComponent={this.friendEmptyRender}
            renderItem={({item})=>this.friendRowRender(item)}
            ListFooterComponent={this._renderFooter()} 
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => String(index)}
          />
        </ScrollView>
      </View>
    )
  }

  _renderHeader = () => {
    return(
      <View style={[styles.friendsRow,styles.invHorizontal]}>
        <Text style={{color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'left'}}>Friends' Grade</Text>
        <Text style={{flex:1,color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'center',}}>Name</Text>
        <Text style={{flex:1,color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'center',}}>Date</Text>
        <Text style={{color:"rgba(255, 255, 255, 0.5)",fontSize:ScreenUtil.setSpText(12),textAlign: 'center',}}>Invitation Awards</Text>
      </View>
    )
  }

  _renderFooter = () => {
    return(
      <View style={[styles.invHorizontal,{justifyContent:'flex-end',marginVertical: ScreenUtil.autoheight(5)}]}>
        <LinearGradient colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:1,y:0}} style={[styles.rowRadius,{flexDirection:'row',justifyContent:'center',alignItems:"center"}]}>
          <Text style={{color:'#fff',fontSize:ScreenUtil.setSpText(12)}}>Total Accumulation：</Text>
          <Text style={{color:'#fff',fontSize:ScreenUtil.setSpText(20),fontWeight:'bold'}}>{this.state.totalAmount ? this.keepTwoDecimal(this.state.totalAmount) : 0}HSN</Text>
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
  rule: {
    width: ScreenUtil.autowidth(70),
    height: ScreenUtil.autoheight(25),
    borderTopRightRadius: ScreenUtil.autoheight(25) / 2,
    borderBottomRightRadius: ScreenUtil.autoheight(25) / 2
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
    fontSize: ScreenUtil.setSpText(24),
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
    height:'100%',
    borderRadius:ScreenUtil.autowidth(6),
    marginRight: ScreenUtil.autowidth(10)
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
    height:ScreenUtil.autowidth(45),
    borderRadius: ScreenUtil.autowidth(22.5),
    paddingHorizontal: ScreenUtil.autowidth(10)
  },
  rowTextStyle:{
    color:'#fff',
    fontSize:ScreenUtil.setSpText(16),
    textAlign:'center',
  }

});

export default Myinvitation;
