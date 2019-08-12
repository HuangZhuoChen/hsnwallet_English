import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, ScrollView, View, Text, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, RefreshControl, Clipboard, ImageBackground} from 'react-native';
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
class Setting extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      arr: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      isEye: true
    };
  }

  //组件加载完成
  async componentDidMount() {
    //获用户信息
    await Utils.dispatchActiionData(this, {type:'login/findUserInfo',payload:{ } });
    //获取实名认证信息
    await Utils.dispatchActiionData(this, {type:'personal/getfindauthentication',payload:{ } });
    //是否设置了交易密码
    await Utils.dispatchActiionData(this, {type:'personal/isSetTradePassword',payload:{ } });
  }

  //关于我们
  goAboutus () {
    try {
      const { navigate } = this.props.navigation;
      navigate('Aboutus', {});
    } catch (error) {
      
    }
  }

  _renderHeader = () => {
    return (
      <>
        <LinearGradient colors={["#4F5162", "#1E202C"]} style={ styles.walletInfo }>
          {/* settings按钮 */}
          <View style={ styles.setting }>
            <TextButton text='More settings' textColor='#404252FF' bgColor='#fff' fontSize={ ScreenUtil.setSpText(12) } style={{ borderTopLeftRadius: ScreenUtil.autoheight(25) / 2, borderBottomLeftRadius: ScreenUtil.autoheight(25) / 2 }} />
          </View>
          {/* 头像栏 */}
          <View style={ styles.personalInfo }>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginRight: ScreenUtil.autowidth(23) }}>My Wallet</Text>
              <Image source={ UImage.set_eye } style={{ width: ScreenUtil.autowidth(16), height: ScreenUtil.autoheight(11) }} />
            </View>
            <View style={ styles.avatar }>
              <Image source={ UImage.integral_bg } style={{ width: ScreenUtil.autowidth(60), height: ScreenUtil.autowidth(60) }} />
              <Text style={{ fontSize: ScreenUtil.setSpText(15), color: '#fff' }}>beyond</Text>
            </View>
          </View>
          {/* HSN栏 */}
          <View style={ styles.hsnInfo }>
            <View style={ styles.hsnTransform }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LinearGradient colors={['#00FFC6FF', '#14D7D9FF']} style={[styles.hsnIcon]}>
                  <Text style={{ fontSize: ScreenUtil.setSpText(17), color: '#fff', scaleX: 0.8, fontWeight: 'bold' }}>HSN</Text>
                </LinearGradient>
                <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>HSN</Text>
              </View>
              <Text style={{ fontSize: ScreenUtil.setSpText(35), color: '#fff' }}>≈</Text>
              <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>{ this.state.isEye ? '50.0000' : '******' }</Text>
            </View>
            <View style={ styles.trade }>
              <View style={ styles.withdraw }>
                <TextButton text='Withdraw' bgColor='#FFFFFF80' fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
              <View style={ styles.interTransfer}>
                <TextButton text='Internal Transfer' shadow={ true } fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
            </View>
            <View style={ styles.record }>
              <View style={{ height: ScreenUtil.autoheight(19), marginBottom: ScreenUtil.autoheight(11) }}>
                <TextButton fontSize={ ScreenUtil.setSpText(14) } textColor="#fff" bgColor="transparent" text="Withdrawal and Deposit Records(HSN)" underline={ true } style={{ justifyContent: 'flex-start' }} />
              </View>
              <View style={{ height: ScreenUtil.autoheight(19) }}>
                <TextButton fontSize={ ScreenUtil.setSpText(14) } textColor="#fff" bgColor="transparent" text="Refund Records(HSN)" underline={ true } style={{ justifyContent: 'flex-start' }} />
              </View>
            </View>
          </View>
          {/* 直线 */}
          <View style={{ borderBottomColor: '#191B2AFF', borderBottomWidth: ScreenUtil.autoheight(1), marginHorizontal: ScreenUtil.autowidth(25), marginVertical: ScreenUtil.autoheight(19) }}></View>
          {/* USDT栏 */}
          <View style={ styles.hsnInfo }>
            <View style={ styles.hsnTransform }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LinearGradient colors={['#F76D1DFF', '#F9D75FFF']} style={[styles.hsnIcon]}>
                  <Text style={{ fontSize: ScreenUtil.setSpText(26), color: '#fff', scaleX: 0.8, fontWeight: 'bold' }}>T</Text>
                </LinearGradient>
                <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>USDT</Text>
              </View>
              <Text style={{ fontSize: ScreenUtil.setSpText(35), color: '#fff' }}>≈</Text>
              <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>66.0000</Text>
            </View>
            <View style={ styles.trade }>
              <View style={ styles.withdraw }>
                <TextButton text='Withdraw' bgColor='#FFFFFF80' fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
              <View style={ styles.interTransfer}>
                <TextButton text='Internal Transfer' shadow={ true } fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
            </View>
            <View style={ styles.record }>
              <View style={{ height: ScreenUtil.autoheight(19) }}>
                <TextButton fontSize={ ScreenUtil.setSpText(14) } textColor="#fff" bgColor="transparent" text="Withdrawal and Deposit Records(HSN)" underline={ true } style={{ justifyContent: 'flex-start' }} />
              </View>
            </View>
          </View>
        </LinearGradient>
        <LinearGradient colors={["#4F5162","#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ styles.purchase }>
          <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginBottom: ScreenUtil.autoheight(19) }}>Purchase</Text>
          <View style={{ marginBottom: ScreenUtil.autoheight(30) }}>
            <Text style={{ color: '#fff', fontSize: ScreenUtil.setSpText(18), marginBottom: ScreenUtil.autoheight(1) }}>Real-Time Price</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: ScreenUtil.setSpText(18) }}>HSN   =   0.89    USDT</Text>
          </View>
          <View>
            <TouchableOpacity style={ styles.usdtDetail }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LinearGradient colors={['#F76D1DFF', '#F9D75FFF']} style={{ width: ScreenUtil.autoheight(24), height: ScreenUtil.autoheight(24), borderRadius: ScreenUtil.autoheight(12), justifyContent: 'center', alignItems: 'center', marginRight: ScreenUtil.autowidth(7) }}>
                  <Text style={{ fontSize: ScreenUtil.setSpText(19), color: '#fff' }}>T</Text>
                </LinearGradient>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>USDT ></Text>
              </View>
              <Text style={{ fontSize: ScreenUtil.setSpText(25), color: '#fff' }}>1000</Text>
            </TouchableOpacity>
            {/* 虚线 */}
            <View style={{ flexDirection: 'row', marginVertical: ScreenUtil.autoheight(11), justifyContent: 'space-around' }}>
              {
                this.state.arr.map(() => (
                  <View style={{ width: ScreenUtil.autowidth(7), height: ScreenUtil.autoheight(1), backgroundColor: '#191B2AFF' }}></View>
                ))
              }
            </View>
            <View style={ styles.usdtDetail }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LinearGradient colors={['#00FFC6', '#14D7D9']} style={{ width: ScreenUtil.autoheight(24), height: ScreenUtil.autoheight(24), borderRadius: ScreenUtil.autoheight(12), justifyContent: 'center', alignItems: 'center', marginRight: ScreenUtil.autowidth(7) }}>
                  <Text style={{ fontSize: ScreenUtil.setSpText(11), color: '#fff', scaleX: 0.8, fontWeight: 'bold' }}>HSN</Text>
                </LinearGradient>
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: 'rgba(255, 255, 255, 0.5)' }}>HSN ></Text>
              </View>
              <Text style={{ fontSize: ScreenUtil.setSpText(25), color: 'rgba(255, 255, 255, 0.5)' }}>888</Text>
            </View>
            {/* Purchase按钮 */}
            <View style={ styles.purchaseButton }>
              <TextButton text="Purchase" textColor="#fff" fontSize={ ScreenUtil.setSpText(13) } shadow={ true } style={{ width: ScreenUtil.autowidth(230), borderRadius: ScreenUtil.autoheight(20) }} />
            </View>
            <View style={{ height: ScreenUtil.autoheight(20) }}>
              <TextButton text="Records(HSN)" textColor="#fff" bgColor="transparent" underline={ true } fontSize={ ScreenUtil.setSpText(15) } style={{ justifyContent: 'flex-start' }} />
            </View>
          </View>
        </LinearGradient>
      </>
    )
  }

  async onRefresh() {

  }
  
  render() {
    return (
      <View style={ styles.container }>
        <FlatList
          style={{ flex: 1 }}
          ListHeaderComponent={this._renderHeader()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item ,index) => "index"+index+item}
          refreshControl={<RefreshControl refreshing={(!this.props.marketRefreshing)?false:true} onRefresh={() => this.onRefresh()}
          tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}/>}
        />
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
  walletInfo: {
    width: ScreenUtil.autowidth(340),
    borderBottomLeftRadius: ScreenUtil.autowidth(10),
    borderBottomRightRadius: ScreenUtil.autowidth(10),
    paddingBottom: ScreenUtil.autoheight(28),
    marginBottom: ScreenUtil.autoheight(12)
  },
  setting: {
    width: ScreenUtil.autowidth(99),
    height: ScreenUtil.autoheight(25),
    position: 'absolute',
    right: 0,
    top: Constants.FitPhone + ScreenUtil.autoheight(10)
  },

  personalInfo: {
    marginHorizontal: ScreenUtil.autowidth(25),
    marginTop: Constants.FitPhone + ScreenUtil.autoheight(54),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ScreenUtil.autoheight(34)
  },
  avatar: {
    flexDirection: 'column',
    alignItems: 'center'
  },

  hsnInfo: {
    marginHorizontal: ScreenUtil.autowidth(25),
    flexDirection: 'column'
  },
  hsnTransform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ScreenUtil.autoheight(17),
    height: ScreenUtil.autowidth(35)
  },
  hsnIcon: {
    width: ScreenUtil.autowidth(35),
    height: ScreenUtil.autowidth(35),
    borderRadius: ScreenUtil.autowidth(35) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ScreenUtil.autowidth(5)
  },
  trade: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScreenUtil.autoheight(11)
  },
  withdraw: {
    width: ScreenUtil.autowidth(130),
    height: ScreenUtil.autoheight(40)
  },
  interTransfer: {
    width: ScreenUtil.autowidth(130),
    height: ScreenUtil.autoheight(40)
  },
  record: {
    flexDirection: 'column'
  },

  purchase: {
    width: ScreenUtil.autowidth(340),
    flexDirection: 'column',
    paddingHorizontal: ScreenUtil.autowidth(25),
    paddingTop: ScreenUtil.autoheight(24),
    paddingBottom: ScreenUtil.autoheight(30),
    borderRadius: ScreenUtil.autowidth(10)
  },
  usdtDetail: {
    height: ScreenUtil.autoheight(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  purchaseButton: {
    marginVertical: ScreenUtil.autoheight(19),
    height: ScreenUtil.autoheight(40),
    alignItems: 'center'
  }
});

export default Setting;
