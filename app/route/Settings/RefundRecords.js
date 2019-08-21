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
class RefundRecords extends BaseComponent {
  static navigationOptions = {
    title: '',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      returnList: []
    }
  }

  //组件加载完成
  async componentDidMount() {
    await Utils.dispatchActiionData(this, {type:'assets/getDailypayback', payload: {pageNo: 1, pageSize: 10}})
    this.setState({
      returnList: this.props.returnlist
    })
  }
  keepTwoDecimal(num) {
    num = parseFloat(num)
    let m = Math.pow(10, 2)
    return Math.floor(num * m) / m
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header {...this.props} onPressLeft={true} title={"Refund Records"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <LinearGradient colors={["#4F5162", "#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.5 }} style={ styles.person }>
              {/* <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginBottom: ScreenUtil.autoheight(38) }}>Refund Records</Text> */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Total refund</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>888666HSN</Text>
              </View>
              <View style={{ borderBottomColor: '#191B2A', borderBottomWidth: ScreenUtil.autoheight(1), marginTop: ScreenUtil.autoheight(11), marginBottom: ScreenUtil.autoheight(20) }}></View>
              <View>
                <View style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(24) }}>
                  <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 142 }}>Time</Text>
                  <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 74 }}>Rewards</Text>
                  <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 110, textAlign: 'right' }}>Types</Text>
                </View>
                {
                  this.state.returnList.map((val, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(20) }}>
                      <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 142 }}>{ val.create_date.split(' ')[0].replace(/-/g, '/') }</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 74 }}>{this.keepTwoDecimal(val.amount)}</Text>
                      <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 110, textAlign: 'right' }}>{ val.ref_type }</Text>
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

export default RefundRecords;
