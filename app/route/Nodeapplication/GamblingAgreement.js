import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View, Text, Image, Linking, TextInput, TouchableOpacity, Animated, Easing, FlatList, Clipboard, ImageBackground} from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import { kapimg } from '../../utils/Api'
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

@connect(({ login, assets, personal, }) => ({ ...login, ...assets, ...personal, }))
class GamblingAgreement extends BaseComponent {
  static navigationOptions = {
    title: '对赌协议',
    header: null, 
  }

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} onPressLeft={true} title={''} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: ScreenUtil.autowidth(15)}}>
          <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1.5}} style={styles.card}>
            <Text style={{fontSize: ScreenUtil.setSpText(20), color: '#fff', marginBottom: ScreenUtil.autoheight(31)}}>Valuation Adjustment Mechanism</Text>
            <View>
              <Text style={styles.cardText}>All Protector Master Nodes have the right to choose to participate in the 《Valuation Adjustment Mechanism》</Text>
              <Text style={styles.cardText}>Condition: If PMN participants in the "Valuation Adjustment Mechanism" , whose principal and giveaways rewards will be locked for 100 days.</Text>
              <Text style={styles.cardText}>Right: If the HSN/USDT price on the token release date is higher than the price on PMN certification date , all token is completely released; </Text>
              <Text style={styles.cardText}>If the HSN/USDT price on the token release date is lower than the price on PMN certification date, the principal loss portion will be calculated, and the HSN token will be replenished according to (price on certification date - price on releaseing date) / price on releaseing date The loss of PMN principal due to the price drop is completely avoided.</Text>
            </View>
            <Image source={UImage.hsn_bluelog} style={styles.bg_logo} />
          </LinearGradient>
        </ScrollView>
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
    paddingTop: ScreenUtil.autoheight(58),
    paddingHorizontal: ScreenUtil.autowidth(20),
    borderRadius: ScreenUtil.autowidth(10)
  },
  cardText: {
    fontSize: ScreenUtil.setSpText(12),
    color: '#fff',
    marginBottom: ScreenUtil.autoheight(20),
    lineHeight: ScreenUtil.autoheight(24)
  },

  bg_logo:{
    width: ScreenUtil.autowidth(320),
    height: ScreenUtil.autowidth(320) * 1514 / 1302,
    position: 'absolute',
    top: ScreenUtil.autoheight(40),
    right: ScreenUtil.autowidth(-60)
  }
})

export default GamblingAgreement