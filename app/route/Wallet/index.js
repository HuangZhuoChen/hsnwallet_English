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
import {Utils} from '../../utils/Utils'
import BaseComponent from "../../components/BaseComponent";
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login, assets }) => ({ ...login, ...assets }))
class Wallet extends BaseComponent {

  static navigationOptions = {
    title: '我的钱包',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  //组件加载完成
  async componentDidMount() {
    await Utils.dispatchActiionData(this, {type:'assets/getwallet',payload:{ } });
  }
  
  assetInfo (item) {
    try {
      const { navigate } = this.props.navigation;
      navigate('AssetInfo', {coinitem: item});
    } catch (error) {
      
    }
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <LinearGradient colors={["#4A4C5D","#1E202C"]} style={styles.linearout}>
          <View style={styles.outsource}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <View style={styles.headout}>
                <Text style={styles.headtitle}>My Wallet</Text>
                <View style={styles.headright}>
                  <Image source={(this.props.loginUser&&this.props.loginUser.partnerLevel)?Constants.levelimg[this.props.loginUser.partnerLevel]:UImage.integral_bg} style={styles.headrightimg}/>
                </View>
              </View>
              <Text style={styles.headcentertitle}>Total assets（USDT）</Text>
              <Text style={styles.headcentertext}>{"≈" + Utils.formatCNY(this.props.total)}</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'space-around',}}>
              {this._renderListItem()}
            </View>
          </View>
          <Image source={UImage.set_logo} style={styles.footpoho}/>
        </LinearGradient>
      </View>
    )
  }

  _renderListItem () {
    if(this.props.coinlist){
      return this.props.coinlist.map((item, i) => {
        return (
          <TouchableOpacity key={i} onPress={()=>{this.noDoublePress(()=>{this.assetInfo(item)})}}  style={styles.itemout}>
            <View style={styles.itemLeftout}>
              <View style={styles.itemimgout}>
                <Image source={item.coinName=="HSN"?UImage.icon_hsn:UImage.icon_usdt} style={styles.itemimg}/>
              </View>
              <Text style={styles.itemtext}>{item.coinName}</Text>
            </View>
            <View style={styles.itemRightout}>
              <Text style={styles.itemtext}>{Utils.formatCNY(item.available)}</Text>
              <Text style={styles.itemtext}>{"~" + Utils.formatCNY(item.usdtPrice)}</Text>
            </View>
          </TouchableOpacity>
        )
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  linearout: {
    width: ScreenWidth - ScreenUtil.autowidth(35),  
    height: ScreenHeight*0.7266, 
    marginTop: ScreenUtil.autoheight(10), 
    marginLeft: ScreenUtil.autowidth(20), 
    marginRight: ScreenUtil.autowidth(15), 
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
    paddingHorizontal: ScreenUtil.autowidth(25), 
    paddingBottom: ScreenUtil.autoheight(20),
  },
  headout: {
    flexDirection: 'row', 
    paddingTop: ScreenUtil.autoheight(35),
    paddingBottom: ScreenUtil.autoheight(30),
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
  headcentertitle: {
    color: '#FFFFFF',
    fontWeight:'400',
    fontSize: ScreenUtil.setSpText(16),
    paddingBottom: ScreenUtil.autoheight(10),
  },
  headcentertext: {
    color: '#FFFFFF', 
    fontWeight:'bold',  
    fontSize: ScreenUtil.setSpText(36),
  },
  itemout: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  itemLeftout: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  itemimgout: {
    backgroundColor: '#FFFFFF', 
    padding: ScreenUtil.autowidth(1), 
    borderRadius: ScreenUtil.autowidth(18),
  },
  itemimg: {
    width: ScreenUtil.autowidth(35), 
    height: ScreenUtil.autowidth(35), 
    borderRadius: ScreenUtil.autowidth(17.5),
  },
  itemRightout: {
    flexDirection: 'column',  
    alignItems: 'flex-end', 
  },
  itemtext: {
    color: '#FFFFFF', 
    fontSize: ScreenUtil.setSpText(16),
    paddingLeft: ScreenUtil.autowidth(15),
  },
  footpoho: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    width: ScreenHeight/3, 
    height: (ScreenHeight/3) * 1.1672,
  },
});

export default Wallet;
