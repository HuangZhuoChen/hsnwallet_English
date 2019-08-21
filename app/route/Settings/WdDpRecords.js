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
import NavigationUtil from '../../utils/NavigationUtil';
import { EasyShowLD } from '../../components/EasyShow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import BaseComponent from "../../components/BaseComponent";
import AnalyticsUtil from '../../utils/AnalyticsUtil';
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'
import codePush from 'react-native-code-push'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login, assets }) => ({ ...login, ...assets }))
class WdDpRecords extends BaseComponent {
  static navigationOptions = {
    title: '',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      type: this.props.navigation.state.params.type,
      records: [],
      totalWithdraw: 0,
      totalDeposit: 0,
      interDeposit: 0,
      interWithdraw: 0
    }
  }

  //组件加载完成
  async componentDidMount() {
    // 获取充提记录数据
    await Utils.dispatchActiionData(this, {type:'assets/getInouTorder',payload:{coinName: this.state.type, pageNo: 1, pageSize: 10}})
    let totalWithdraw, interDeposit, interWithdraw
    this.props.summary.forEach((val) => {
      if (val.type === 'in') {
        totalDeposit = val.totalAmount
      }
      if (val.type === 'out') {
        totalWithdraw = val.totalAmount
        return
      }
    })
    this.props.summaryInnerTrans.forEach((val) => {
      if (val.type === 'in') {
        interDeposit = val.totalAmount
      }
      if (val.type === 'out') {
        interWithdraw = val.totalAmount
      }
    })
    this.setState({
      records: this.props.inouTorderlist,
      totalWithdraw: this.keepFourDecimal(totalWithdraw),
      totalDeposit: this.keepFourDecimal(totalDeposit),
      interDeposit: this.keepFourDecimal(interDeposit),
      interWithdraw: this.keepFourDecimal(interWithdraw)
    })
  }
  // 向下保留四位小数
  keepFourDecimal(num) {
    num = parseFloat(num)
    let m = Math.pow(10, 4)
    return Math.floor(num * m) / m
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header {...this.props} onPressLeft={true} title={"Withdrawal and Deposit Records"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <LinearGradient colors={["#4F5162", "#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.5 }} style={ styles.person }>
              {
                this.state.type === 'hsn' ? (
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ScreenUtil.autoheight(13) }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Total Withdrawal</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>{this.state.totalWithdraw}HSN</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ScreenUtil.autoheight(13) }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Internal Depositl</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>{this.state.interDeposit}HSN</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Internal Withdrawal</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>{this.state.interWithdraw}HSN</Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ScreenUtil.autoheight(13) }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Total Deposit</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>{this.state.totalDeposit}U</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ScreenUtil.autoheight(13) }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Total Withdrawal </Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>{this.state.totalWithdraw}U</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ScreenUtil.autoheight(13) }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Internal Deposit</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>{this.state.interDeposit}U</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Internal Withdrawal</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>{this.state.interWithdraw}U</Text>
                    </View>
                  </View>
                )
              }
              <View style={{ borderBottomColor: '#191B2A', borderBottomWidth: ScreenUtil.autoheight(1), marginVertical: ScreenUtil.autoheight(17) }}></View>
              <View>
                <View style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(17) }}>
                  <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 79 }}>Time</Text>
                  <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 95 }}>Type</Text>
                  <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 59 }}>Amount</Text>
                  <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 93, textAlign: 'right' }}>Status</Text>
                </View>
                {
                  this.state.records.map((val, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(26) }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 79 }}>{ val.createDate.split(' ')[0] }</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 95, paddingLeft: ScreenUtil.autowidth(10) }}>{ val.type }</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 59 }}>{ val.amount }</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 93, textAlign: 'right' }}>{ val.status }</Text>
                    </View>
                  ))
                }
              </View>
              <Image source={UImage.set_logo} style={styles.footerBg}/>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UColor.bgColor,
    flex: 1,
    flexDirection: 'column'
  },
  person: {
    width: ScreenUtil.autowidth(340),
    borderRadius: ScreenUtil.autowidth(10),
    paddingTop: ScreenUtil.autoheight(30),
    paddingBottom: ScreenUtil.autoheight(50),
    paddingHorizontal: ScreenUtil.autowidth(7)
  },

  footerBg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
    width: ScreenHeight / 3, 
    height: (ScreenHeight / 3) * 1.1672,
  }
});

export default WdDpRecords;
