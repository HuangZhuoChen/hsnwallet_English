import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, Platform, StyleSheet, ScrollView, View, Text, TextInput, Image, Linking, KeyboardAvoidingView, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
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
import BaseComponent from "../../components/BaseComponent";
import {AlertModal,AlertModalView} from '../../components/modals/AlertModal'
import { EasyToast } from '../../components/Toast';
import TextButton from '../../components/TextButton'
import {Utils} from '../../utils/Utils'

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ personal, login }) => ({ ...personal, ...login }))
class Vam extends BaseComponent {
  static navigationOptions = {
    title: '对赌协议',
    header: null
  }
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  async componentDidMount() {
  }
  async openDialog() {
    try {
      let con = (
        <View style={{flex: 1, alignItems: 'center', paddingTop: ScreenUtil.autoheight(30), paddingBottom: ScreenUtil.autoheight(20)}}>
          <Image source={UImage.icon_profile} style={{width: ScreenUtil.autoheight(34), height: ScreenUtil.autoheight(34), marginBottom: ScreenUtil.autoheight(20)}} />
          <Text style={{fontSize: ScreenUtil.setSpText(14), color: '#000'}}>Do you want to Cancel the《VAM》?</Text>
        </View>
      )
      let isAuth = await AlertModal.showSync(null, con, 'Confirm', 'Cancel', false)
      if (isAuth) {
        let res = await Utils.dispatchActiionData(this, {type: 'personal/setVam', payload: {}})
        if (res && res.msg === 'success') {
          EasyToast.show('Cancellation Successful')
          Utils.pop(this, 3, true)
        }
      }
    } catch (error) {

    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.card}>
          <Text style={{fontSize: ScreenUtil.setSpText(20), color: '#fff', marginBottom: ScreenUtil.autoheight(50)}}>Valuation Adjustment Mechanism</Text>
          <Item itemHeight={ScreenUtil.autoheight(66)} paddingHorizontal={ScreenUtil.autowidth(5)} spot={true} disable={true} nameColor='#FFFFFF' name="《VAM》" subName='Agreed' />
          <Image source={UImage.set_logo} style={styles.bglogo} />
        </LinearGradient>
        <View style={{width: ScreenUtil.autowidth(230), height: ScreenUtil.autoheight(45)}}>
          <TextButton onPress={() => {this.openDialog()}} text="Cancel" textColor="#fff" shadow={true} style={{borderRadius: ScreenUtil.autoheight(45) / 2}} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UColor.bgColor,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  card: {
    width: ScreenUtil.autowidth(340),
    paddingHorizontal: ScreenUtil.autowidth(25),
    paddingTop: ScreenUtil.autoheight(34),
    paddingBottom: ScreenUtil.autoheight(170),
    marginBottom: ScreenUtil.autoheight(29),
    borderRadius: ScreenUtil.autowidth(10)
  },
  bglogo: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: ScreenUtil.autowidth(260),
    height: ScreenUtil.autowidth(260) * 628 / 537
  }
})

export default Vam