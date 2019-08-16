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
require('moment/locale/zh-cn');
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
let pageNo = 1;
let pageSize = 10;

@connect(({ Nodeapplication, loading }) => ({ ...Nodeapplication, nodeDetailRefreshing: loading.effects['Nodeapplication/getNodeDetail']  }))
class NodeDetailed extends React.Component {

  static navigationOptions = {
    title: '我的节点',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  //组件加载完成
  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh () {
    try {
      if(this.props.nodeDetailRefreshing==true){
        return ;
      }
      await Utils.dispatchActiionData(this, {type:'Nodeapplication/getNodeDetail',payload:{ pageNo: pageNo, pageSize: pageSize } });
      pageNo = 1;
    } catch (error) {
      
    }
  }

  //加载更多  
  async onEndReached () {
    try {
      if (!this.onEndReachedCalledDuringMomentum) {
        await Utils.dispatchActiionData(this,{type:'Nodeapplication/getNodeDetail',payload:{ pageNo: ++pageNo, pageSize: pageSize } });
        this.onEndReachedCalledDuringMomentum = true;
      }
    } catch (error) {
      
    }
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <View style={{flex: 1,paddingHorizontal: ScreenUtil.autowidth(18), }} >
          <FlatList style={{flex: 1}} 
            data={!this.props.nodeDetailList ? [] : this.props.nodeDetailList} 
            ListHeaderComponent={this._renderHeader()}
            renderItem={this._renderItem}
            ListEmptyComponent={this.createEmptyView()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item ,index) => "index"+index+item}
            onEndReachedThreshold={0.1} 
            onMomentumScrollBegin={() => { 
              this.onEndReachedCalledDuringMomentum = false;     
            }}
            onEndReached={this.onEndReached.bind(this)}
            refreshControl={<RefreshControl  refreshing={!this.props.nodeDetailRefreshing?false:true} onRefresh={() => this.onRefresh()}
              tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}
            />} 
          /> 
        </View>
      </View>
    )
  }

  _renderHeader = () => {
    return(
      <View style={styles.headerout}>
        <Text style={styles.headertext}>我的节点</Text>
        <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(14), paddingLeft: ScreenUtil.autowidth(20)}}>折算成usdt</Text>
      </View>
    )
  }

  _renderItem = ({item, index}) => {
    return (<View style={styles.itemout}>
      <LinearGradient colors={["#363743","#181922"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.itemheadout}>
        <Text style={styles.itemheadtext}>{item.node_name}</Text>
      </LinearGradient>
      <LinearGradient colors={["#4F5162","#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.itemconter}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.itemcontertext,{flex: 1, color: '#EED372'}]}>{item.payback}</Text>
          <Text style={[styles.itemcontertext,{flex: 1, color: '#EED372'}]}>{item.wait_payback}</Text>
          <Text style={[styles.itemcontertext,{flex: 1.5, color: '#FFFFFF'}]}>{moment(item.create_date).format('YYYY-MM-DD')}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.itemcontertitle,{flex: 1, }]}>已返还</Text>
          <Text style={[styles.itemcontertitle,{flex: 1, }]}>待返还</Text>
          <Text style={[styles.itemcontertitle,{flex: 1.5 }]}>购买日期</Text>
        </View>
      </LinearGradient>
    </View>)
  }

  createEmptyView() {
    return(
      <LinearGradient colors={["#4F5162","#1E202C"]} style={styles.notimeout}>
        <Image source={UImage.noRecord} style={styles.defectbgimg}/>
        <Text style={styles.notimetext}>{"您还没有节点哦"}</Text>
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
    alignItems: 'flex-end',
    paddingHorizontal: ScreenUtil.autowidth(22), 
    paddingVertical: ScreenUtil.autoheight(5),
  },
  headertext: {
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },

  itemout: {
    width: ScreenWidth - ScreenUtil.autowidth(36),  
    height: ScreenUtil.autoheight(130), 
    marginVertical: ScreenUtil.autowidth(5), 
    overflow: 'hidden',
    marginTop: ScreenUtil.autoheight(10), 
    borderRadius: ScreenUtil.autowidth(10), 
    elevation: 10, 
    shadowRadius: 5, 
    shadowOpacity:0.06, 
    shadowColor: 'rgba(0, 0, 0, 1)',  
    shadowOffset:{height: 2,width: 0},
  },
  itemheadout: {
    width: ScreenWidth - ScreenUtil.autowidth(35), 
    height: ScreenUtil.autoheight(35), 
    justifyContent: 'center',
  },
  itemheadtext: {
    color: '#C1C1C4',
    fontSize: ScreenUtil.setSpText(16),
    paddingHorizontal: ScreenUtil.autowidth(25),
  },
  itemconter: {
    width: ScreenWidth - ScreenUtil.autowidth(35), 
    height: ScreenUtil.autoheight(95), 
    paddingVertical: ScreenUtil.autoheight(15), 
    justifyContent: 'space-around',
  },
  itemcontertext: {
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(16), 
  },
  itemcontertitle: {
    color: '#BCBDC0',
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(12), 
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

export default NodeDetailed;
