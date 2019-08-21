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

@connect(({ login }) => ({ ...login }))
class PurchaseRecords extends BaseComponent {
  static navigationOptions = {
    title: '',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      recordsList: []
    }
  }

  //组件加载完成
  async componentDidMount() {
    let res = await Utils.dispatchActiionData(this, {type: 'assets/getRechargeLog', payload: {}})
    if (res && res.code === 0) {
      this.setState({
        recordsList: res.data
      })
    }
  }
  keepFourDecimal(num) {
    num = parseFloat(num)
    let m = Math.pow(10, 4)
    return Math.floor(num * m) / m
  }

  render() {
    return (
      <View style={ styles.container }>
        <Header {...this.props} onPressLeft={true} title={"Purchase Records"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <LinearGradient colors={["#4F5162", "#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.5 }} style={ styles.person }>
              <View>
                <View style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(16) }}>
                  <Text style={{ fontSize: ScreenUtil.setSpText(14), color: '#fff', flex: 70 }}>Users</Text>
                  <Text style={{ fontSize: ScreenUtil.setSpText(14), color: '#fff', flex: 137, textAlign: 'center' }}>Amount(HSN)</Text>
                  <Text style={{ fontSize: ScreenUtil.setSpText(14), color: '#fff', flex: 70, textAlign: 'right' }}>Date</Text>
                </View>
                {
                  this.state.recordsList.reverse().map((val, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(11) }}>
                      <Text style={{fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 70}}>{this.props.loginUser.nickName}</Text>
                      <Text style={{fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 137, textAlign: 'center'}}>{this.keepFourDecimal(val.amount)}</Text>
                      <Text style={{fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 70, textAlign: 'right'}}>{val.create_date.split(' ')[0]}</Text>
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
    paddingHorizontal: ScreenUtil.autowidth(27)
  },

  footerBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 0,
    width: ScreenHeight / 3, 
    height: (ScreenHeight / 3) * 1.1672,
  }
});

export default PurchaseRecords;
