import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, ScrollView, View, Text, TextInput, Image, Linking, RefreshControl, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
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
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
let pageNo = 1;
let pageSize = 10;

@connect(({ personal, loading }) => ({ ...personal, announcementRefreshing: loading.effects['personal/getAnnouncement']  }))
class Announcement extends BaseComponent {

  static navigationOptions = {
    title: '公告中心',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      centertext: "本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。本节点申请数量有限，需要购买的及时抢购，每个用户每期只能购买3台机器哦，前50期有丰厚的折扣，抓紧致富的机会吧。"
    };
  }

  //组件加载完成
  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh () {
    try {
      if(this.props.announcementRefreshing==true){
        return ;
      }
      await Utils.dispatchActiionData(this, {type:'personal/getAnnouncement',payload:{ pageNo: pageNo, pageSize: pageSize } });
      pageNo = 1;
    } catch (error) {
      
    }
  }

  //加载更多  
  onEndReached = async () => {
    try {
      if (!this.onEndReachedCalledDuringMomentum) {
        await Utils.dispatchActiionData(this,{type:'personal/getAnnouncement',payload:{ pageNo: ++pageNo, pageSize: pageSize } });
        this.onEndReachedCalledDuringMomentum = true;
      }
    } catch (error) {
      
    }
  }

  SeeAnnouncement = (item) => {
    AlertModal.show(item.title, item.content, '关闭')
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={"公告中心"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <View style={{paddingLeft: ScreenUtil.autowidth(20), paddingRight: ScreenUtil.autowidth(15), flex: 1,}}>
          <FlatList style={{flex: 1,}} 
            data={!this.props.announcementlist ? [] : this.props.announcementlist} 
            renderItem={this._renderItem}
            ListEmptyComponent={this.createEmptyView()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item ,index) => "index"+index+item}
            onEndReachedThreshold={0.1} 
            onMomentumScrollBegin={() => { 
              this.onEndReachedCalledDuringMomentum = false;     
            }}
            onEndReached={this.onEndReached.bind(this)}
            refreshControl={<RefreshControl  refreshing={!this.props.announcementRefreshing?false:true} onRefresh={() => this.onRefresh()}
              tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}
            />} 
          /> 
        </View>
      </View>
    )
  }

  _renderItem = ({item, index}) => {
    return (<TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.SeeAnnouncement(item)})}}>
        <LinearGradient colors={["#4F5162","#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.itemout}>
          <View style={styles.outsource}>
            <View style={styles.headout}>
              <Text style={styles.headtitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.headtime}>{moment(item.createDate).format('MM-DD HH:mm')}</Text>
            </View>
            <Text style={styles.centertext} numberOfLines={5}>{item.content}</Text>
          </View>
          <Image source={UImage.blue_logoa} style={styles.footpoho}/>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  createEmptyView() {
    return(
      <LinearGradient colors={["#4D4F60","#20212E"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.notimeout}>
        <Image source={UImage.noRecord} style={styles.defectbgimg}/>
        <Text style={styles.notimetext}>{"暂无公告"}</Text>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: ScreenUtil.isIphoneX() ?ScreenUtil.autoheight(24):ScreenUtil.autoheight(0),
  },

  headerout: {
    flexDirection: 'row', 
    paddingHorizontal: ScreenUtil.autowidth(20), 
    paddingBottom: ScreenUtil.autoheight(25),
  },
  headertext: {
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },
  
  itemout: {
    width: ScreenWidth - ScreenUtil.autowidth(35),  
    minHeight: ScreenUtil.autoheight(130), 
    marginVertical: ScreenUtil.autowidth(5),
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
    flexDirection: 'column', 
    paddingHorizontal: ScreenUtil.autowidth(20), 
    paddingVertical: ScreenUtil.autoheight(15), 
  },
  headout: {
    flexDirection: 'row',  
    alignItems: 'center', 
    paddingBottom:  ScreenUtil.autoheight(15),
  },
  headtitle: {
    flex: 1, 
    color: '#FFFFFF', 
    fontSize: ScreenUtil.setSpText(16),
  },
  headtime: {
    color: '#91939B', 
    fontSize: ScreenUtil.setSpText(12),
  },
  centertext: {
    flex: 1, 
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(14), 
    lineHeight: ScreenUtil.autoheight(21),
  },

  footpoho: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: ScreenUtil.autowidth(104), 
    height: ScreenUtil.autowidth(85),
  },

  notimeout:{ 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ScreenUtil.autowidth(10), 
    paddingVertical: ScreenUtil.autoheight(15), 
    elevation: 10, 
    shadowRadius: 5, 
    shadowOpacity:0.06, 
    shadowColor: 'rgba(0, 0, 0, 1)',  
    shadowOffset:{height: 2,width: 0},
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

export default Announcement;
