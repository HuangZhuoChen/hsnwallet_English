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
        <Header {...this.props} onPressLeft={true} title={"Rules"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={ UImage.rulesbg } style={{ width: ScreenUtil.autowidth(375), height: ScreenUtil.autowidth(665), marginBottom: ScreenUtil.autoheight(10) }} />
            <Image source={ UImage.rulesintroduction } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(1021) / 2, marginBottom: ScreenUtil.autoheight(10) }} />
            <Image source={ UImage.rules1 } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(293) / 2, marginBottom: ScreenUtil.autoheight(10) }} />
            <Image source={ UImage.rules2 } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(922) / 2, marginBottom: ScreenUtil.autoheight(10) }} />
            <Image source={ UImage.rules3 } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(232) / 2, marginBottom: ScreenUtil.autoheight(10) }} />
            <Image source={ UImage.rules4 } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(1825) / 2, marginBottom: ScreenUtil.autoheight(10) }} />
            <Image source={ UImage.rules51 } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(1343) / 2 }} />
            <Image source={ UImage.rules52 } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(1200) / 2, marginBottom: ScreenUtil.autoheight(10) }} />
            <Image source={ UImage.rules6 } style={{ width: ScreenUtil.autowidth(340), height: ScreenUtil.autowidth(1170) / 2, marginBottom: ScreenUtil.autoheight(10) }} />
          </View>
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
