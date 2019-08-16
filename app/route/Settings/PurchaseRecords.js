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
      data: [
        {
          users: 'Jack',
          amount: '888',
          date: '2019/08/05'
        },
        {
          users: 'Jack',
          amount: '888',
          date: '2019/08/05'
        },
        {
          users: 'Jack',
          amount: '888',
          date: '2019/08/05'
        },
        {
          users: 'Jack',
          amount: '888',
          date: '2019/08/05'
        },
        {
          users: 'Jack',
          amount: '888',
          date: '2019/08/05'
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
            <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>Purchase Records</Text>
            <View>
              <View style={{ flexDirection: 'row', marginTop: ScreenUtil.autoheight(25), marginBottom: ScreenUtil.autoheight(16) }}>
                <Text style={{ fontSize: ScreenUtil.setSpText(14), color: '#fff', flex: 62 }}>Users</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(14), color: '#fff', flex: 145, textAlign: 'center' }}>Purchase Records(HSN)</Text>
                <Text style={{ fontSize: ScreenUtil.setSpText(14), color: '#fff', flex: 70, textAlign: 'right' }}>Date</Text>
              </View>
              {
                this.state.data.map(val => (
                  <View style={{ flexDirection: 'row', marginBottom: ScreenUtil.autoheight(11) }}>
                    <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 62 }}>{ val.users }</Text>
                    <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 145, textAlign: 'center' }}>{ val.amount }</Text>
                    <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', flex: 70, textAlign: 'right' }}>{ val.date }</Text>
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
          showsVerticalScrollIndicator={false}
          keyExtractor={(item ,index) => "index" + index + item}
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
    paddingTop: ScreenUtil.autoheight(54),
    paddingBottom: ScreenUtil.autoheight(50),
    paddingHorizontal: ScreenUtil.autowidth(27)
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

export default PurchaseRecords;
