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
class WdDpRecords extends BaseComponent {
  static navigationOptions = {
    title: '',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          time: '2019/08/05',
          type: 'Withdraw',
          amount: '-600.0000',
          status: 'Pending Cancel'
        },
        {
          time: '2019/08/05',
          type: 'Withdraw',
          amount: '-200.0000',
          status: 'Received'
        },
        {
          time: '2019/08/05',
          type: 'Total deposit',
          amount: '+300.0000',
          status: 'Completed'
        },
        {
          time: '2019/08/05',
          type: 'Withdraw',
          amount: '-200.0000',
          status: 'Received'
        },
        {
          time: '2019/08/05',
          type: 'Total deposit',
          amount: '+300.0000',
          status: 'Completed'
        }
      ]
    }
  }

  //组件加载完成
  async componentDidMount() {
  }

  _renderHeader = () => {
    return (
      <>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <LinearGradient colors={["#4F5162", "#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.5 }} style={ styles.person }>
            <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginBottom: ScreenUtil.autoheight(35) }}>Withdrawal and Deposit Records</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ScreenUtil.autoheight(13) }}>
              <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Total Withdrawal</Text>
              <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>0HSN</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ScreenUtil.autoheight(13) }}>
              <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Internal Depositl</Text>
              <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>0HSN</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>Internal Withdrawal</Text>
              <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>0HSN</Text>
            </View>
            <View style={{ borderBottomColor: '#191B2A', borderBottomWidth: ScreenUtil.autoheight(1), marginVertical: ScreenUtil.autoheight(17) }}></View>
            <View>
              <View style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(17) }}>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 79 }}>Time</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 95 }}>Type</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 59 }}>Amount</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff', flex: 93, textAlign: 'right' }}>Status</Text>
              </View>
              {
                this.state.data.map(val => (
                  <View style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(26) }}>
                    <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 79 }}>{ val.time }</Text>
                    <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 95 }}>{ val.type }</Text>
                    <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 59 }}>{ val.amount }</Text>
                    <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 93, textAlign: 'right' }}>{ val.status }</Text>
                  </View>
                ))
              }
            </View>
            <Image source={UImage.set_logo} style={styles.footerBg}/>
          </LinearGradient>
        </View>
      </>
    )
  }

  render() {
    return (
      <View style={ styles.container }>
        <FlatList
          style={{ flex: 1 }}
          ListHeaderComponent={this._renderHeader()}
          showsVerticalScrollIndicator={ false }
          keyExtractor={(item, index) => "index" + index + item}
        />
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
    paddingTop: ScreenUtil.autoheight(55),
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
