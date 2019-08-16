import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, ScrollView, View, Text, TextInput, Image, Linking, TouchableOpacity, RefreshControl, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
import moment from 'moment';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import Item from '../../components/Item'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import NativeUtil from '../../utils/NativeUtil'
import { EasyShowLD } from '../../components/EasyShow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
import BaseComponent from "../../components/BaseComponent";
require('moment/locale/zh-cn');
let pageNo = 1;
let pageSize = 10;
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ assets, loading }) => ({ ...assets, inouTorderRefreshing: loading.effects['assets/getInouTorder'], dailypaybackRefreshing: loading.effects['assets/getDailypayback']  }))
class AssetInfo extends BaseComponent {

  static navigationOptions = {
    title: '币交易详情',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      logRefreshing: false,
      coinitem: this.props.navigation.state.params.coinitem ? this.props.navigation.state.params.coinitem : {},
      summary: [
        {totalAmount: 0,type: "in"},
        {totalAmount: 0,type: "out"}
      ],
      isAccess: true,
      isReturn: false,
    };
  }

  //组件加载完成
  componentDidMount() {
    this.onRefresh();
  }

  //提币
  _onWithdraw = () => {
    const { navigate } = this.props.navigation;
    navigate('Withdraw', {coinitem:this.state.coinitem});
  }
  
  //充值
  _onRecharge = () => {
    const { navigate } = this.props.navigation;
    navigate('Recharge', {coinName: this.state.coinitem.coinName});
  }

  //站内转账
  _onTransfer = () => {
    const { navigate } = this.props.navigation;
    navigate('InStationTransfer', {coinitem: this.state.coinitem});
  }

  async onRefresh () {
    try {
      if(this.props.inouTorderRefreshing==true){
        return ;
      }
      if(this.state.isAccess){
        await Utils.dispatchActiionData(this, {type:'assets/getInouTorder',payload:{coinName: this.state.coinitem.coinName, pageNo: 1, pageSize: 10 } });
      }else{
        await Utils.dispatchActiionData(this, {type:'assets/getDailypayback',payload:{pageNo: 1, pageSize: 10 } });
      }
      pageNo = 1;
    } catch (error) {
      
    }
  }

  //加载更多  
  async onEndReached () {
    try {
      if (!this.onEndReachedCalledDuringMomentum) {
        if(this.state.isReturn){
          await Utils.dispatchActiionData(this, {type:'assets/getDailypayback',payload:{pageNo: ++pageNo, pageSize: pageSize } });
        }else{
          await Utils.dispatchActiionData(this,{type:'assets/getInouTorder',payload:{coinName: this.state.coinitem.coinName, pageNo: ++pageNo, pageSize: pageSize } });
        }
        this.onEndReachedCalledDuringMomentum = true;
      }
    } catch (error) {
      
    }
  }

  businesButton(style, selectedSate, stateType, buttonTitle) {  
    let BTN_SELECTED_STATE_ARRAY = ['isAccess', 'isReturn'];  
    return(  
      <TouchableOpacity style={[style]}  onPress={ () => {this._updateBtnState(stateType, BTN_SELECTED_STATE_ARRAY)}}>  
        <Text style={[styles.tabText, selectedSate ? {color: 'rgba(255, 255, 255, 1)'} : {color: 'rgba(255, 255, 255, 0.5)'}]}>{buttonTitle}</Text>  
      </TouchableOpacity>  
    );  
  } 

  // 更新"个人排名 团队排名"按钮的状态  
  _updateBtnState = async (currentPressed, array) => { 
    if (currentPressed === 'undefined' || currentPressed === null || array === 'undefined' || array === null ) {  
      return;  
    }  
    if(currentPressed == "isAccess"){
      await this.setState({isAccess: true, isReturn: false,});
      this.onRefresh();
    }else if(currentPressed == "isReturn"){
      await this.setState({isAccess: false, isReturn: true,});
      this.onRefresh();
    }
  }  

  async onCancelorder (item) {
    await Utils.dispatchActiionData(this, {type:'assets/getCancelorder',payload:{orderId: item.id, coinName: item.coinName } });
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        {this.state.isReturn ?
        <FlatList style={{flex: 1,}} 
          data={!this.props.returnlist ? [] : this.props.returnlist} 
          ListHeaderComponent={this._renderHeader()}
          renderItem={this._renderItemfh}
          ListEmptyComponent={this.createEmptyView()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item ,index) => "index"+index+item}
          onEndReachedThreshold={0.1} 
          onMomentumScrollBegin={() => { 
            this.onEndReachedCalledDuringMomentum = false;     
          }}
          onEndReached={this.onEndReached.bind(this)}
          refreshControl={<RefreshControl  refreshing={!this.props.dailypaybackRefreshing?false:true} onRefresh={() => this.onRefresh()}
            tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}/>
          } 
        /> 
        :
        <FlatList style={{flex: 1,}} 
          data={!this.props.inouTorderlist ? [] : this.props.inouTorderlist} 
          ListHeaderComponent={this._renderHeader()}
          renderItem={this._renderItemct}
          ListEmptyComponent={this.createEmptyView()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item ,index) => "index"+index+item}
          onEndReachedThreshold={0.1} 
          onMomentumScrollBegin={() => { 
            this.onEndReachedCalledDuringMomentum = false;     
          }}
          onEndReached={this.onEndReached.bind(this)}
          refreshControl={<RefreshControl  refreshing={!this.props.inouTorderRefreshing?false:true} onRefresh={() => this.onRefresh()}
            tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}/>
          } 
        /> 
        }
      </View>
    )
  }

  _renderListItem (summary) {
    return summary.map((item, i) => {
      return (<View key={i} style={{flex: 1, height: ScreenUtil.autoheight(40), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
      paddingHorizontal: ScreenUtil.autowidth(10), borderLeftWidth: i==1 ? ScreenUtil.autowidth(1) : 0, borderLeftColor: '#8B8D96',}}>
        <Text style={styles.headerintext}>{(item.type == "in" ? "Total Deposit " : "Total Withdrawal ")}</Text>
        <Text style={styles.headerintext}>{item.totalAmount + (this.state.coinitem.coinName=="USDT"?" U":" HSN")}</Text>
      </View>)
    })
  }

  _renderListItemzn (summary) {
    return summary.map((item, i) => {
      return (<View key={i} style={{flex: 1, height: ScreenUtil.autoheight(40), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
      paddingHorizontal: ScreenUtil.autowidth(10), borderLeftWidth: i==1 ? ScreenUtil.autowidth(1) : 0, borderLeftColor: '#8B8D96',}}>
        <Text style={styles.headerintext}>{(item.type == "out" ? "Internal Withdrawal " : "Internal Depositl ")}</Text>
        <Text style={styles.headerintext}>{item.totalAmount + (this.state.coinitem.coinName=="USDT"?" U":" HSN")}</Text>
      </View>)
    })
  }

  _renderHeader = () => {
    return(<View >
      <LinearGradient colors={["#4F5162","#1E202C"]} style={styles.linearout}>
        <View style={styles.outsource}>
          <View style={{flexDirection: 'column', paddingHorizontal: ScreenUtil.autowidth(25),}}>
            <View style={{flexDirection: 'row', }}>
              <Text style={styles.headtitle}>{this.state.coinitem.coinName}</Text>
              <View style={styles.headright}>
                <Image source={this.state.coinitem.coinName=="HSN"?UImage.icon_hsn:UImage.icon_usdt} style={styles.headrightimg}/>
              </View>
            </View>
            <Text style={styles.headcenter}>{"≈" + Utils.formatCNY(this.props.balanceAvailable)}</Text>
          </View>
          <View style={styles.headbottomout}>
            <TextButton onPress={()=>{this.noDoublePress(()=>{this._onWithdraw()})}} bgColor='#939499' textColor='#FFFFFF' text={"Withdraw"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
            <TextButton onPress={()=>{this.noDoublePress(()=>{this._onRecharge()})}} shadow={true} textColor='#FFFFFF' text={"Deposit"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
            <TextButton onPress={()=>{this.noDoublePress(()=>{this._onTransfer()})}} bgColor='#939499' textColor='#FFFFFF' text={"站内转账"}  fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
          </View>
        </View>
        
        <Image source={UImage.set_logoC} style={styles.footpoho}/>
      </LinearGradient>

      <View style={styles.businestab}>  
        {this.businesButton(styles.tabStyle, this.state.isAccess, 'isAccess', this.state.coinitem.coinName=="USDT"?'Withdrawal and Deposit Records(U)':'Withdrawal and Deposit Records(HSN)')}  
        {this.state.coinitem.coinName=="HSN" && this.businesButton(styles.tabStyle, this.state.isReturn, 'isReturn', 'Refund Records(HSN)')}  
      </View>
      {this.state.isAccess ?
        <View>
          <View style={styles.headout}>
            <View style={styles.headerout}>
              {(this.props.summary && this.props.summary.length == 0) ? this._renderListItem(this.state.summary) : this._renderListItem(this.props.summary)}
            </View>
            <View style={{width: ScreenWidth - ScreenUtil.autowidth(50), height: ScreenUtil.autoheight(1), backgroundColor: '#FFFFFF'}}></View>
            <View style={styles.headerout}>
              {(this.props.summaryInnerTrans && this.props.summaryInnerTrans.length == 0) ? this._renderListItemzn(this.state.summary) : this._renderListItemzn(this.props.summaryInnerTrans)}
            </View>
          </View>
          <View style={{height: ScreenUtil.autoheight(45), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: ScreenUtil.autowidth(25), }}>
            <Text style={{flex: 1, color: '#FFFFFF', fontSize: ScreenUtil.setSpText(14),}}>Time</Text>
            <Text style={{flex: 1, color: '#FFFFFF', fontSize: ScreenUtil.setSpText(14), textAlign: 'center',}}>Type</Text>
            <Text style={{flex: 1.5, color: '#FFFFFF', fontSize: ScreenUtil.setSpText(14),textAlign: 'center',}}>Amount</Text>
            <Text style={{flex: 1.5, color: '#FFFFFF', fontSize: ScreenUtil.setSpText(14)}}>Status</Text>
          </View>
        </View>
        :
        <View style={{height: ScreenUtil.autoheight(45), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: ScreenUtil.autowidth(25),}}>
          <Text style={styles.timetext}>时间</Text>
          <Text style={styles.rewardtext}>节点奖励</Text>
          <Text style={styles.paybacktext}>邀请奖励</Text>
        </View>
      }
    </View>)
  }

  _renderItemfh= ({item, index}) => {
    return (<View style={styles.itemout}>
        <Text style={styles.timetext}>{moment(item.paybackDate).format('MM-DD')}</Text>
        <Text style={[styles.rewardtext,{color:'#EFD575', }]}>{Utils.formatCNY(item.dailyPaybackHsn)}</Text>
        <Text style={[styles.paybacktext,{color:'#EFD575', }]}>{Utils.formatCNY(item.dailyInviteRewardHsn)}</Text>
      </View>
    )
  }

  _renderItemct = ({item, index}) => {
    return (
      <View style={styles.itemout}>
        <Text style={styles.itemtime}>{moment(item.createDate).format('MM-DD')}</Text>
        {item.type == "out" && <Text style={styles.itemtitle}>{"提币"}</Text>}
        {item.type == "in" && <Text style={styles.itemtitle}>{"充值"}</Text>}
        {item.type == "transferOut" && <Text style={styles.itemtitle}>{"站内转出"}</Text>}
        {item.type == "transferIn" && <Text style={styles.itemtitle}>{"站内转入"}</Text>}
        {(item.type == "out" || item.type == "in" ) && <Text style={[styles.itemtext,{color: item.type == "out" ? '#FFFFFF' : '#EFD575', }]}>{((item.type == "in") ? "+" : "-") + Utils.formatCNY(item.amount+item.commissionAmount)}</Text>}
        {(item.type == "transferOut" || item.type == "transferIn" ) && <Text style={[styles.itemtext,{color: item.type == "transferOut" ? '#FFFFFF' : '#EFD575', }]}>{((item.type == "transferIn") ? "+" : "-") + Utils.formatCNY(item.amount)}</Text>}
        <View style={{flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          {item.type == "out" && item.status == "wait_approved" && <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(14),}}>待审核</Text>}
          {item.type == "out" && item.status == "approved" && <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(14),}}>待入账</Text>}
          {item.type == "out" && item.status == "completed" && <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(14),}}>已到账</Text>}
          {item.type == "out" && item.status == "reject" && <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(14),}}>已拒绝</Text>}
          {item.type == "out" && item.status == "cancel" && <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(14),}}>已取消</Text>}
          {item.type == "in" && <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(14),}}>已到账</Text>}
          {(item.type == "transferOut" || item.type == "transferIn" ) && <Text style={{color: '#FFFFFF',fontSize: ScreenUtil.setSpText(14),}}>已完成</Text>}
          {item.type == "out" && item.status == "wait_approved" && <Text onPress={()=>{this.noDoublePress(()=>{this.onCancelorder(item)})}} style={{flex: 1, lineHeight: ScreenUtil.autoheight(40), textAlign: 'right', color: '#0079ED', fontSize: ScreenUtil.setSpText(14),}}>取消</Text>}
        </View>
      </View>
    )
  }

  createEmptyView() {
    return(
      <View style={styles.notimeout}>
        <Image source={UImage.noRecord} style={styles.defectbgimg}/>
        <Text style={styles.notimetext}>{"暂无记录"}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: ScreenUtil.isIphoneX() ?ScreenUtil.autoheight(24):ScreenUtil.autoheight(0),
  },

  linearout: {
    width: ScreenWidth - ScreenUtil.autowidth(35),  
    marginLeft: ScreenUtil.autowidth(20), 
    marginRight: ScreenUtil.autowidth(15), 
    marginVertical: ScreenUtil.autowidth(15), 
    marginTop: ScreenUtil.autoheight(10), 
    borderRadius: ScreenUtil.autowidth(10), 
    elevation: 10, 
    shadowRadius: 5, 
    shadowOpacity:0.06, 
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset:{height: 2,width: 0},
  },
  outsource: {
    flex: 1, 
    zIndex: 99,
    paddingVertical: ScreenUtil.autoheight(40), 
  },

  headtitle: {
    flex: 1, 
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },
  headright: {
    backgroundColor: '#FFFFFF', 
    padding: ScreenUtil.autowidth(1), 
    borderRadius: ScreenUtil.autowidth(30),
  },
  headrightimg: {
    width: ScreenUtil.autowidth(60), 
    height: ScreenUtil.autowidth(60), 
    borderRadius: ScreenUtil.autowidth(30),
  },
  headcenter: {
    color: '#FFFFFF', 
    fontWeight:'bold',  
    fontSize: ScreenUtil.setSpText(36),
    paddingVertical: ScreenUtil.autoheight(20),
  },
  headbottomout: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: ScreenUtil.autoheight(20),
    paddingHorizontal: ScreenUtil.autowidth(15),
  },
  btntransfer: {
    width: (ScreenWidth-ScreenUtil.autowidth(100))/3, 
    height: ScreenUtil.autoheight(40),
    borderRadius: ScreenUtil.autowidth(23), 
  },
  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 0.4907,
  },

  businestab: {
    flexDirection: 'row', 
    alignItems: 'center',
    height: ScreenUtil.autoheight(50),
    width: ScreenWidth,
    paddingHorizontal: ScreenUtil.autowidth(30)
  },
  tabStyle: {
    width: (ScreenWidth-ScreenUtil.autowidth(30))/2,
    alignItems: 'center',   
    justifyContent: 'center',
    height: ScreenUtil.autoheight(50),
  },
  tabText: {
    fontSize: ScreenUtil.setSpText(16),
  },
  headout: { 
    flexDirection: 'column',
    borderColor: '#8B8D96',
    borderWidth: ScreenUtil.autowidth(1), 
    borderRadius: ScreenUtil.autowidth(5), 
    marginHorizontal: ScreenUtil.autowidth(25), 
  },
  headerout: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerintext: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(14),
  },

  itemout: {
    width: ScreenWidth,
    height: ScreenUtil.autoheight(40), 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: ScreenUtil.autowidth(25),
  },
  itemtime: {
    flex: 1,
    color: '#FFFFFF', 
    fontSize: ScreenUtil.setSpText(14),
  },
  itemtitle: {
    flex: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(14),
  },
  itemtext: {
    flex: 1.5,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(14),
  },
  
  timetext: {
    flex: 1,
    color: '#FFFFFF', 
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(14),
  },
  rewardtext: {
    flex: 1,
    color: '#FFFFFF', 
    fontSize: ScreenUtil.setSpText(14),
  },
  paybacktext: {
    flex: 1,
    color: '#FFFFFF', 
    textAlign: 'right',
    fontSize: ScreenUtil.setSpText(14),
  },

  notimeout:{ 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScreenUtil.autoheight(15), 
    marginHorizontal: ScreenUtil.autowidth(15),
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

export default AssetInfo;
