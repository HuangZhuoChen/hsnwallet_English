import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, ScrollView, View, Text, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
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
var WeChat = require('react-native-wechat');

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ }) => ({ }))
class RuleClause extends React.Component {

  static navigationOptions = {
    title: '规则说明',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      wholeinvitation: this.props.navigation.state.params.wholeinvitation ? this.props.navigation.state.params.wholeinvitation : 'whole',
      homeBanner: [
        {a:'节点类型',b:'快速节点',c:'高速节点',d:'音速节点',e:'光速节点',f:'超速节点'},
        {a:'标准价格',b:'100U',c:'500U',d:'1500U',e:'5000U',f:'8000U'},
        {a:'返还天数',b:'260',c:'270',d:'280',e:'290',f:'300'},
        {a:'总返还(折算)',b:'260U',c:'1350U',d:'4200U',e:'14500U',f:'24000U'},
        {a:'每日返还',b:'1',c:'5',d:'15',e:'50',f:'80'},
        {a:'总返还率',b:'260%',c:'270%',d:'280%',e:'290%',f:'300%'},
        {a:'日返还率',b:'1.00%',c:'1.00%',d:'1.00%',e:'1.00%',f:'1.00%'},
        {a:'回本天数',b:'100天',c:'100天',d:'100天',e:'100天',f:'100天'},
      ],
      reward: [
        {a:'节点等级',b:'快速节点',c:'高速节点',d:'音速节点',e:'光速节点',f:'超速节点',g:'合计数量'},
        {a:'超速节点',b:'80名',c:'60名',d:'30名',e:'20名',f:'10名',g:'200名'},
      ],
      invit: [
        {a:'节点总价格',b:'合伙人等级',c:'一级好友奖励',d:'二级好友奖励',},
        {a:'100U-1000U',b:'初级合伙人',c:'5%',d:'3%',},
        {a:'1001U-3000U',b:'中级合伙人',c:'8%',d:'3%',},
        {a:'3001U-5000U',b:'高级合伙人',c:'8%',d:'5%',},
        {a:'5001U及以上',b:'超级合伙人',c:'10%',d:'5%',}
      ],
      ranking: [
        {a:'节点等级',b:'快速节点',c:'高速节点',d:'音速节点',e:'光速节点',f:'超速节点'},
        {a:'积分',b:'1分',c:'5分',d:'15分',e:'30分',f:'50分'},
      ],
      personal: [
        {a:'名次',b:'1',c:'2',d:'3',e:'4-10'},
        {a:'比例',b:'30%',c:'20%',d:'15%',e:'5%'},
        {a:'数量(折算)',b:'9000U',c:'6000U',d:'4500U',e:'1500U'}
      ],
      team: [
        {a:'名次',b:'1',c:'2',d:'3',e:'4-10',f:'11-20',g:'21-30'},
        {a:'比例',b:'15%',c:'12%',d:'8%',e:'5%',f:'2%',g:'1%'},
        {a:'数量(折算)',b:'75000U',c:'60000U',d:'40000U',e:'25000U',f:'10000U',g:'5000U'},
      ]
    };
  }

  //组件加载完成
  componentDidMount() {
    
  }



  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor,}]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.wholeinvitation== 'invitation' && <Image source={UImage.rule_Invitation} style={{ width: ScreenWidth, height: ScreenWidth * 1.169,}} resizeMode="contain"/>}
          
          {this.state.wholeinvitation== 'whole' && 
          <View style={{width: ScreenWidth, backgroundColor: '#023DA3',}}>
            <Image source={UImage.rule_whole} style={{ width: ScreenWidth, height: ScreenWidth * 0.5275,}} resizeMode="contain"/> 
            <View style={{paddingHorizontal: ScreenUtil.autowidth(13),}}>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(14), lineHeight: ScreenUtil.autoheight(26),}}>
                HSN超速网络是融合了5G高速网络传输结合区块链分布式储存等多项技术的新一代公链，
                旨在在5G时代为用户提供传输、储存、云计算等全方位服务。为了更好的凝聚社群的力量，
                为HSN寻找有实力的超级节点候选人，在HSN主网上线之前，将通过
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(14),}}>HSN超级节点预选赛</Text> 
                ，选出
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(14),}}>30个超级节点候选团队</Text> 
                ，并在之后择机选出最终的 
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(14),}}>21个超级节点</Text>
                。超级节点预选赛将瓜分节点奖励池中
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(14),}}>2亿</Text>   
                枚HSN，此外，HSN基金会还将划拨
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(14),}}>1500万</Text>    
                枚HSN用于本次活动排名奖励。HSN超速钱包是由HSN官方发布的多功能数字钱包，本次预选赛仅在HSN超速钱包中进行，用户
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(14),}}>注册HSN超速钱包，必须填写邀请码</Text>    
                。预选赛共分为
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(14),}}>100期</Text>   
                进行，规则及奖励方式如下：
              </Text>
            </View>

            <View style={{paddingHorizontal: ScreenUtil.autowidth(13),}}>
              <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(16), textAlign: 'center', fontWeight: 'bold', paddingVertical: ScreenUtil.autoheight(20), }}>节点申请</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(12), lineHeight: ScreenUtil.autoheight(20),}}>
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(12),}}>1、</Text> 
                用户需充值USDT到HSN超速钱包中用于申请节点。节点共分为五种类型，对应不同的回报率与回报周期。奖励采用金本位制度，
                即奖励按照应发放的USDT数量，根据奖励发放前12小时的HSN/USDT平均价，折算成HSN进行发放，用户永远不用担心因币价变动带来的影响。
              </Text>
              <View style={{marginVertical: ScreenUtil.autoheight(20),borderBottomColor: '#FFFFFF', borderBottomWidth: ScreenUtil.autoheight(1),}}>
                {this.state.homeBanner.map((item,index) => (
                  <View key={index} style={{flex: 1, height: ScreenUtil.autoheight(20), flexDirection: 'row',alignItems: 'center', textAlign: 'center',backgroundColor: index%2 == 0 ? '#005BF4':'transport'}}>
                    <Text style={{flex: 1.3,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),}}>{item.a}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.b}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.c}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.d}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.e}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.f}</Text>
                  </View>))
                }
              </View>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8), textAlign: 'center', paddingBottom: ScreenUtil.autoheight(28),}}>*奖励金每日返还一次</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(12), lineHeight: ScreenUtil.autoheight(20),}}>
                <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(12),}}>2、</Text> 
                节点申请共进行200期，每期申请节点的数量是有限的，所有的节点需要在钱包中进行抢购。每个账户每期最多可申请各种类型的节点共3个名额。
                每日开放两次抢购，时间为10:00与22:00(UTC+8)。为了鼓励先申请节点的用户，前50期享受折扣优惠，第一期为标准价格的90%，
                之后每一期较前一期上涨标准价格的0.2%，直到第51期恢复初始价格。以快速节点为例，第1期价格为100USDT*90%=90USDT，
                第2期价格为100USDT*（90%+0.2%）=90.2USDT，第51期价格为100USDT*（90%+0.2%*50）=100USDT。
              </Text>
              <View style={{marginVertical: ScreenUtil.autoheight(20), borderBottomColor: '#FFFFFF', borderBottomWidth: ScreenUtil.autoheight(1),}}>
                {this.state.reward.map((item,index) => (
                  <View key={index} style={{flex: 1, height: ScreenUtil.autoheight(20), flexDirection: 'row',alignItems: 'center', textAlign: 'center',backgroundColor: index%2 == 0 ? '#005BF4':'transport'}}>
                    <Text style={{flex: 1.3,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.a}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.b}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.c}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.d}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.e}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.f}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.g}</Text>
                  </View>))
                }
              </View>
            </View>

            <View style={{width: '100%', height: ScreenUtil.autoheight(1), backgroundColor: '#FFFFFF', marginVertical: ScreenUtil.autoheight(20),}}/>

            <View style={{paddingHorizontal: ScreenUtil.autowidth(13),}}>
              <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(16), textAlign: 'center', fontWeight: 'bold', paddingVertical: ScreenUtil.autoheight(20), }}>节点分享邀请奖励</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(12), textAlign: 'center', paddingVertical: ScreenUtil.autoheight(10)}}>1、分享奖励</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10), lineHeight: ScreenUtil.autoheight(20),}}>
                邀请好友注册HSN超速钱包，并成功申请任意节点，邀请人与被邀请人将各获得5枚HSN奖励。总计赠送50万枚，赠完为止。
              </Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(12), textAlign: 'center', paddingVertical: ScreenUtil.autoheight(10)}}>2、邀请奖励</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10), lineHeight: ScreenUtil.autoheight(20),}}>
                邀请好友注册HSN超速钱包，并成功申请任意节点，可获得邀请奖励。奖励=被邀请人每日返还数量*对应奖励系数。奖励系数以购买节点总价值分为以下四挡：
              </Text>
              <View style={{paddingVertical: ScreenUtil.autoheight(20), marginHorizontal: ScreenUtil.autowidth(15),}}>
                {this.state.invit.map((item,index) => (
                  <View key={index} style={{flex: 1, height: ScreenUtil.autoheight(20), flexDirection: 'row',alignItems: 'center', textAlign: 'center',backgroundColor: index%2 == 0 ? '#005BF4':'transport'}}>
                    <Text style={{flex: 1.3,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.a}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.b}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.c}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.d}</Text>
                  </View>))
                }
              </View>
            </View>

            <View style={{width: '100%', height: ScreenUtil.autoheight(1), backgroundColor: '#FFFFFF', marginVertical: ScreenUtil.autoheight(20),}}/>
            <View style={{paddingHorizontal: ScreenUtil.autowidth(13),}}>
              <Text style={{color: '#00C7FD', fontSize: ScreenUtil.setSpText(16), textAlign: 'center', fontWeight: 'bold', paddingVertical: ScreenUtil.autoheight(20), }}>排名与奖励</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),lineHeight: ScreenUtil.autoheight(18),}}>申请节点可获得相应的排名积分，积分作为个人排名奖励与团队排名奖励的依据。</Text>
              <View style={{marginVertical: ScreenUtil.autoheight(20), marginHorizontal: ScreenUtil.autowidth(15), borderBottomColor: '#FFFFFF', borderBottomWidth: ScreenUtil.autoheight(1),}}>
                {this.state.ranking.map((item,index) => (
                  <View key={index} style={{flex: 1, height: ScreenUtil.autoheight(20), flexDirection: 'row',alignItems: 'center', textAlign: 'center', backgroundColor: index%2 == 0 ? '#005BF4':'transport'}}>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),textAlign: 'center'}}>{item.a}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),textAlign: 'center'}}>{item.b}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),textAlign: 'center'}}>{item.c}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),textAlign: 'center'}}>{item.d}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),textAlign: 'center'}}>{item.e}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),textAlign: 'center'}}>{item.f}</Text>
                  </View>))
                }
              </View>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(12),textAlign: 'center',paddingVertical: ScreenUtil.autoheight(10), }}>1、个人排名奖励</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10),lineHeight: ScreenUtil.autoheight(18),}}>节点预选赛共进行200期，每5期位一个赛季，共40个赛季，每个赛季计算一次个人积分。排名前10位的用户，将获得由基金会发放的HSN奖励，奖励每赛季发放1次，每次发放3万USDT等值的HSN。</Text>
              <View style={{paddingVertical: ScreenUtil.autoheight(20), marginHorizontal: ScreenUtil.autowidth(15),}}>
                {this.state.personal.map((item,index) => (
                  <View key={index} style={{flex: 1, height: ScreenUtil.autoheight(20), flexDirection: 'row',alignItems: 'center', textAlign: 'center',backgroundColor: index%2 == 0 ? '#005BF4':'transport'}}>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.a}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.b}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.c}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.d}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.e}</Text>
                  </View>))
                }
              </View>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(12),textAlign: 'center', paddingVertical: ScreenUtil.autoheight(10)}}>2、团队排名奖励</Text>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(10), lineHeight: ScreenUtil.autoheight(18),}}>团队长即邀请人必须具备超级合伙人资格。团队排名计算5级好友的积分之和，不同层级好友的积分需要乘以积分系数，一级好友1.0，二级好友0.8，三级好友0.6，四级好友0.4，,五级好友0.2。在200期节点预选赛结束后，积分排名前30名的团队的进入最终的超级节点候选名单，并分享由基金会发放的50万USDT等值的HSN奖励。团队排名奖励与个人排名奖励可以叠加。</Text>
              <View style={{paddingVertical: ScreenUtil.autoheight(20), marginHorizontal: ScreenUtil.autowidth(15),}}>
                {this.state.team.map((item,index) => (
                  <View key={index} style={[{flex: 1, height: ScreenUtil.autoheight(20), flexDirection: 'row', alignItems: 'center', textAlign: 'center', backgroundColor: index%2 == 0 ? '#005BF4':'transport'}]}>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.a}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.b}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.c}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.d}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.e}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.f}</Text>
                    <View style={{width: ScreenUtil.autowidth(1), height: ScreenUtil.autoheight(20), backgroundColor: '#FFFFFF'}}/>
                    <Text style={{flex: 1,color: '#FFFFFF', fontSize: ScreenUtil.setSpText(8),textAlign: 'center'}}>{item.g}</Text>
                  </View>))
                }
              </View>
              <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(12), lineHeight: ScreenUtil.autoheight(20), paddingBottom: ScreenUtil.autoheight(28),}}>3、后续的超级节点评选与奖励细则另行制定，请留意官方公告。</Text>
            </View>
          </View>
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    paddingBottom: ScreenUtil.isIphoneX() ?ScreenUtil.autoheight(24):ScreenUtil.autoheight(1),
  },
  linearout: {
    width: ScreenWidth - ScreenUtil.autowidth(30), 
    marginVertical: ScreenUtil.autoheight(10), 
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
    paddingHorizontal: ScreenUtil.autowidth(15), 
    paddingVertical: ScreenUtil.autoheight(20), 
  },
  headout: {
    flexDirection: 'row', 
    paddingBottom: ScreenUtil.autoheight(40),
  },
  headtext: {
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },
  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.0436,
  },
});

export default RuleClause;
