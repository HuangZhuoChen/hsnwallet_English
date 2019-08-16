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
import BaseComponent from "../../components/BaseComponent";
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ Nodeapplication }) => ({ ...Nodeapplication }))
class MyNode extends BaseComponent {

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
  async componentDidMount() {
    //获我的节点信息
    await Utils.dispatchActiionData(this, {type:'Nodeapplication/getMyNode',payload:{ } });
  }

  onNodeDetailed () {
    try {
      const { navigate } = this.props.navigation;
      navigate('NodeDetailed', {});
    } catch (error) {
      
    }
  }

  _renderListItem () {
    if(this.props.nodeDate){
      return this.props.nodeDate.map((item, i) => {
        return (<Item key={i} itemHeight={ScreenUtil.autoheight(50)} disable={true}  spot={true} nameColor={'#FFFFFF'}
          paddingHorizontal={ScreenUtil.autowidth(5)} name={item.node_name} subName={item.count + "个"}/>
        )
      })
    }
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <LinearGradient colors={["#4F5162","#1E202C"]} style={styles.linearout}>
          <View style={styles.outsource}>
            <View style={styles.headout}>
              <Text style={styles.headlefttext}>我的节点</Text>
              <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.onNodeDetailed()})}} style={styles.headrightout}>
                <Text style={styles.headrightext}>查看明细</Text>
                <Ionicons name="ios-arrow-forward" size={ScreenUtil.autowidth(20)} color='#B5B5B5' />
              </TouchableOpacity>
            </View>
            <View style={{flex: 3, justifyContent: 'space-around',}}>
              {this._renderListItem()}
            </View>
          </View>
          <Image source={UImage.set_logo} style={styles.footpoho}/>
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
  },
  linearout: {
    width: ScreenWidth - ScreenUtil.autowidth(30),  
    height: ScreenHeight*0.7266,
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
    paddingHorizontal: ScreenUtil.autowidth(15), 
    paddingVertical: ScreenUtil.autoheight(20), 
  },
  headout: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    paddingVertical: ScreenUtil.autoheight(40)
  },
  headlefttext: {
    flex: 1, 
    color: '#FFFFFF', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(36),
  },
  headrightout: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: ScreenUtil.autoheight(10)
  },
  headrightext: {
    color: '#EFD575', 
    fontWeight:'bold',
    fontSize: ScreenUtil.setSpText(16),
    paddingRight: ScreenUtil.autowidth(10),
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

export default MyNode;
