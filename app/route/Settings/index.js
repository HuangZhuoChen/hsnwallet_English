import React from 'react';
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, ScrollView, View, Text, Image, Linking, TouchableOpacity, Animated, Easing, FlatList, RefreshControl, Clipboard, ImageBackground, TextInput} from 'react-native';
import UImage from '../../utils/Img'
import UColor from '../../utils/Colors'
import Constants from '../../utils/Constants'
import ScreenUtil from '../../utils/ScreenUtil'
import LinearGradient from 'react-native-linear-gradient'
import BaseComponent from "../../components/BaseComponent";
import TextButton from '../../components/TextButton'
import {kapimg} from '../../utils/Api'
import {EasyToast} from '../../components/Toast'
import {AlertModal} from '../../components/modals/AlertModal'
import {Utils} from '../../utils/Utils'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ login, loading }) => ({ ...login, availableLoading: loading.effects['login/findUserInfo'] }))
class Setting extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      arr: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      isEye: true,
      usdtAmount: '',
      usdtInput: true,
      hsnAmount: '1000',
      hsnInput: true,
      exchangeRate: '', // 汇率
      hsnInit: true,
      // lurui
      tradePassword:"",
      code: "",
      uuid: "",
      hsnBalance: this.props.loginUser.balanceHsnAvailable,
      usdtBalance: this.props.loginUser.balanceUsdtAvailable
    };
  }
  //组件加载完成
  async componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this.setState({
        hsnBalance: this.props.loginUser.balanceHsnAvailable,
        usdtBalance: this.props.loginUser.balanceUsdtAvailable
      })
    })
    //获用户信息
    await Utils.dispatchActiionData(this, {type:'login/findUserInfo', payload:{}})
    await Utils.dispatchActiionData(this, {type:'personal/isSetTradePassword', payload: {}})
    // 钱包信息
    await Utils.dispatchActiionData(this, {type:'assets/getwallet', payload:{}})
    let res = await Utils.dispatchActiionData(this, {type: 'assets/getExchangeRate', payload: {}})
    this.setState({
      exchangeRate: res.exchangeRate,
      usdtAmount: this.keepFourDecimal(this.state.hsnAmount * res.exchangeRate) + ''
    })
  }
  // 下滑刷新
  async onRefresh() {
    console.log(this.state.hsnAmount)
    await Utils.dispatchActiionData(this, {type:'login/findUserInfo', payload:{}})
    await Utils.dispatchActiionData(this, {type:'assets/getwallet', payload:{}})
    let res = await Utils.dispatchActiionData(this, {type: 'assets/getExchangeRate', payload: {}})
    this.setState({
      exchangeRate: res.exchangeRate,
      usdtAmount: this.state.hsnAmount === '' ? '' : this.keepFourDecimal(this.state.hsnAmount * res.exchangeRate) + '',
      hsnBalance: this.props.loginUser.balanceHsnAvailable,
      usdtBalance: this.props.loginUser.balanceUsdtAvailable
    })
  }
  // 显隐余额
  showEye() {
    this.setState({
      isEye: !this.state.isEye
    })
  }
  // 个人信息
  goSelfInfo() {
    try {
      const { navigate } = this.props.navigation;
      navigate('SelfInfo', {wholeinvitation: 'whole'});
    } catch (error) {
      
    }
  }
  // 提现
  goWithdraw(coinName) {
    try {
      const { navigate } = this.props.navigation;
      navigate('Withdraw', {wholeinvitation: 'whole', coinName: coinName});
    } catch (error) {
      
    }
  }
  // 站内转账
  goInterTransfer(type) {
    try {
      const { navigate } = this.props.navigation;
      navigate('InStationTransfer', {wholeinvitation: 'whole', coinName: type});
    } catch (error) {
      
    }
  }
  // 充值
  goDeposit() {
    try {
      const { navigate } = this.props.navigation;
      navigate('Recharge', {wholeinvitation: 'whole', coinName: 'USDT'});
    } catch (error) {
      
    }
  }
  // 充提记录
  goWithdrawDepositRecords(type) {
    try {
      const { navigate } = this.props.navigation;
      navigate('WdDpRecords', {wholeinvitation: 'whole', type: type});
    } catch (error) {
      
    }
  }
  // 返还记录
  goRefundRecords() {
    try {
      const { navigate } = this.props.navigation;
      navigate('RefundRecords', {wholeinvitation: 'whole'});
    } catch (error) {
      
    }
  }
  // 闪购记录
  goPurchaseRecords() {
    try {
      const { navigate } = this.props.navigation;
      navigate('PurchaseRecords', {wholeinvitation: 'whole'});
    } catch (error) {
      
    }
  }
  keepFourDecimal(num) {
    num = parseFloat(num)
    let m = Math.pow(10, 4)
    return Math.floor(num * m) / m
  }
  // USDT、HSN输入框聚焦后禁止另外一个输入框的onTextChange，手动计算赋值
  banInput(bool) {
    this.state.usdtInput = bool
    this.state.hsnInput = !bool
  }
  onUsdtChange(val) {
    if (this.state.usdtInput) {
      let str = this.keepFourDecimal(parseFloat(val)) + ''
      if (val !== '') {
        this.setState({
          usdtAmount: str,
          hsnAmount: this.keepFourDecimal(str / this.state.exchangeRate) + ''
        })
      } else {
        this.setState({
          usdtAmount: '',
          hsnAmount: ''
        })
      }
    }
  }
  onHsnChange(val) {
    if (this.state.hsnInput) {
      let str = Number(parseFloat(val).toFixed(4)) + ''
      if (val !== '') {
        this.setState({
          hsnAmount: str,
          usdtAmount: this.keepFourDecimal(parseFloat(str) * this.state.exchangeRate) + ''
        })
      } else {
        this.setState({
          hsnAmount: '',
          usdtAmount: ''
        })
      }
    }
  }
  async exchange() {
    try {
      let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
      if (!reg.test(this.state.usdtAmount) && !reg.test(this.state.hsnAmount) && this.state.usdtAmount.indexOf('.') === this.state.usdtAmount.lastIndexOf('.') && this.state.hsnAmount.indexOf('.') === this.state.hsnAmount.lastIndexOf('.')) {
        EasyToast.show('Please enter a positive number')
        return
      }
      this.refreshImage()
      let con = (
        <View>
          <ImageBackground style={{width:ScreenWidth-ScreenUtil.autowidth(120), height:(ScreenWidth-ScreenUtil.autowidth(120))*0.528}} source={UImage.confirm_bg}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: ScreenUtil.autoheight(18), paddingHorizontal: ScreenUtil.autowidth(20)}}>
              <Text style={{fontSize: ScreenUtil.setSpText(19), color: '#fff', marginBottom: ScreenUtil.setSpText(5)}}>You will change</Text>
              <Text style={{fontSize: ScreenUtil.setSpText(19), color: '#fff'}}>{this.state.usdtAmount} USDT for {this.state.hsnAmount} HSN</Text>
            </View>
          </ImageBackground>
        </View>
      )
      let isAuth = await AlertModal.showSync('Confirmation of orders', con, 'Confirm', 'Cancel', true, false, false)
      if (isAuth) {
        this.tradePassword()
      }
    } catch (error) {

    }
  }
  async tradePassword() {
    try {
      let _this = this;
      let con = 
      <View>
        <View style={styles.tradepout}>
          <Image style={styles.tradepwimg} source={UImage.icon_lock} />
        </View>
        <View style={{flexDirection:"column",paddingHorizontal: ScreenUtil.autowidth(10),}}>
          <TextInput autoFocus={true} placeholder={"transaction password"} placeholderTextColor="#999"
            secureTextEntry={true} defaultValue={this.state.tradePassword} maxLength={Constants.PWD_MAX_LENGTH} style={styles.textinpt}
            onChangeText={(tradePassword) => this.setState({tradePassword})} selectionColor={"#6DA0F8"} 
            underlineColorAndroid="transparent" returnKeyType="next"
          />
          <TextInput autoFocus={false} placeholder={"Graphic Verification Code"} placeholderTextColor="#999"  
            secureTextEntry={true}  defaultValue={this.state.code} maxLength={5} style={styles.textinpt} 
            onChangeText={(code) => this.setState({code})} selectionColor={"#6DA0F8"} 
            underlineColorAndroid="transparent" returnKeyType="go"    
          />
          <View style={{flexDirection:"row",alignItems:"space-between", paddingTop: ScreenUtil.autoheight(10)}}>
            <Image onError={(e)=>{this.loaderror()}} style={{width:(ScreenWidth-ScreenUtil.autowidth(120))/2, height:ScreenUtil.autowidth(40), marginRight:ScreenUtil.autowidth(10),}} 
              source={{uri: Constants.defaultrootaddr + kapimg + "?uuid=" + this.state.uuid}} />
            <TouchableOpacity onPress={()=>{this.refreshImage()}} style={{flexDirection:"row", alignItems: 'center', justifyContent:"center",}}>
              <Text style={{color: '#888888', fontSize: ScreenUtil.setSpText(10),}}>Invisibility?</Text>
              <Text style={{color: '#0DA3DF', fontSize: ScreenUtil.setSpText(10),}}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>;
      let isAuth = await AlertModal.showSync(null,con,"Confirm","Cancel" ,false,()=>{
        if(_this.state.tradePassword == "" ){
          EasyToast.show("Please enter the transaction password");
          return false;
        }else if(this.state.code == ""){
          EasyToast.show("Please enter the Graphic Verification Code");
          return false;
        }else {
          return true;
        }
      });
      if(isAuth){
        this.checkTradePassword();
      }else{
        this.setState({tradePassword: "", code: ""})
      }
    } catch (error) {

    }
  }
  async checkTradePassword() {
    let res = await Utils.dispatchActiionData(this, {type: 'assets/usdtToHsn', payload: {
      "amount": this.state.usdtAmount,
      "tradePassword": this.state.tradePassword,
      "uuid": this.state.uuid,
      "code": this.state.code
    }})
    this.state.tradePassword = ''
    this.state.code = ''
    if (res.msg === 'success') {
      await Utils.dispatchActiionData(this, {type: 'login/findUserInfo', payload: {}})
      await Utils.dispatchActiionData(this, {type:'assets/getwallet', payload:{}})
      this.setState({
        hsnBalance: this.props.loginUser.balanceHsnAvailable,
        usdtBalance: this.props.loginUser.balanceUsdtAvailable
      })
    }
  }
  async refreshImage () {
    this.setState({
      uuid: Math.ceil(Math.random()*10000000000)
    })
  }
  render() {
    return (
      <View style={ styles.container }>
          <FlatList style={{flex: 1}} 
            data={[]} 
            ListHeaderComponent={this._renderHeader()}
            renderItem={this._renderItem}
            ListFooterComponent={this._renderFooter()} 
            ListEmptyComponent={this.createEmptyView()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item ,index) => "index" + index + item}
            refreshControl={<RefreshControl refreshing={(!this.props.availableLoading)?false:true} onRefresh={() => this.onRefresh()}
            tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}/>}
          />
        
          
        
      </View>
    )
  }
  _renderHeader = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#4F5162", "#1E202C"]} style={ styles.walletInfo }>
          {/* settings按钮 */}
          <View style={ styles.setting }>
            <TextButton onPress={ () => { this.noDoublePress(() => { this.goSelfInfo() }) } } text='More settings' textColor='#404252FF' bgColor='#fff' fontSize={ ScreenUtil.setSpText(12) } style={{ borderTopLeftRadius: ScreenUtil.autoheight(25) / 2, borderBottomLeftRadius: ScreenUtil.autoheight(25) / 2 }} />
          </View>
          {/* 头像栏 */}
          <View style={ styles.personalInfo }>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginRight: ScreenUtil.autowidth(23) }}>My Wallet</Text>
              <TouchableOpacity onPress={ () => { this.showEye() } } style={{ width: ScreenUtil.autowidth(16), height: ScreenUtil.autoheight(11) }}>
                <Image source={ UImage.set_eye } style={{ width: ScreenUtil.autowidth(16), height: ScreenUtil.autoheight(11), opacity: this.state.isEye ? 1 : 0.5 }} />
              </TouchableOpacity>
            </View>
            <View style={ styles.avatar }>
              <Image source={ UImage.integral_bg } style={{ width: ScreenUtil.autowidth(60), height: ScreenUtil.autowidth(60) }} />
              <Text style={{ fontSize: ScreenUtil.setSpText(15), color: '#fff' }}>{this.props.loginUser ? this.props.loginUser.nickName: ''}</Text>
            </View>
          </View>
          {/* HSN栏 */}
          <View style={ styles.hsnInfo }>
            <View style={ styles.hsnTransform }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: ScreenUtil.autowidth(135), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Image source={UImage.icon_hsn} style={styles.hsnIcon} />
                  <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>HSN</Text>
                </View>
                <Text style={{ fontSize: ScreenUtil.setSpText(35), color: '#fff' }}>≈</Text>
              </View>
              <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>{ this.state.isEye ? this.keepFourDecimal(this.state.hsnBalance) : '******' }</Text>
            </View>
            <View style={ styles.trade }>
              <View style={ styles.withdraw }>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goWithdraw('HSN') }) } } text='Withdraw' bgColor='#FFFFFF80' fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
              <View style={ styles.interTransfer}>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goInterTransfer('HSN') }) } } text='Internal Transfer' shadow={ true } fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
            </View>
            <View style={ styles.record }>
              <View style={{ height: ScreenUtil.autoheight(19), marginBottom: ScreenUtil.autoheight(11) }}>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goWithdrawDepositRecords('hsn') }) } } fontSize={ ScreenUtil.setSpText(14) } textColor="#fff" bgColor="transparent" text="Withdrawal and Deposit Records(HSN)" underline={ true } style={{ justifyContent: 'flex-start' }} />
              </View>
              <View style={{ height: ScreenUtil.autoheight(19) }}>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goRefundRecords() }) } } fontSize={ ScreenUtil.setSpText(14) } textColor="#fff" bgColor="transparent" text="Refund Records(HSN)" underline={ true } style={{ justifyContent: 'flex-start' }} />
              </View>
            </View>
          </View>
          {/* 直线 */}
          <View style={{ borderBottomColor: '#191B2AFF', borderBottomWidth: ScreenUtil.autoheight(1), marginHorizontal: ScreenUtil.autowidth(25), marginVertical: ScreenUtil.autoheight(19) }}></View>
          {/* USDT栏 */}
          <View style={ styles.hsnInfo }>
            <View style={ styles.hsnTransform }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: ScreenUtil.autowidth(135), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Image source={UImage.icon_usdt} style={styles.hsnIcon} />
                  <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>USDT</Text>
                </View>
                <Text style={{ fontSize: ScreenUtil.setSpText(35), color: '#fff' }}>≈</Text>
              </View>
              <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff' }}>{ this.state.isEye ? this.keepFourDecimal(this.state.usdtBalance) : '******' }</Text>
            </View>
            <View style={ styles.trade }>
              <View style={ styles.usdtWithdraw }>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goWithdraw('USDT') }) } } text='Withdraw' bgColor='#FFFFFF80' fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
              <View style={ styles.usdtWithdraw }>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goDeposit() }) } } text='Deposit' shadow={ true } fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
              <View style={ styles.usdtWithdraw}>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goInterTransfer("USDT") }) } }text='Inter-Transfer' bgColor='#FFFFFF80' fontSize={ ScreenUtil.setSpText(13) } textColor='#fff' style={{ borderRadius: ScreenUtil.autoheight(20) }} />
              </View>
            </View>
            <View style={ styles.record }>
              <View style={{ height: ScreenUtil.autoheight(19) }}>
                <TextButton onPress={ () => { this.noDoublePress(() => { this.goWithdrawDepositRecords('usdt') }) } } fontSize={ ScreenUtil.setSpText(14) } textColor="#fff" bgColor="transparent" text="Withdrawal and Deposit Records(HSN)" underline={ true } style={{ justifyContent: 'flex-start' }} />
              </View>
            </View>
          </View>
        </LinearGradient>
        <LinearGradient colors={["#4F5162","#1E202C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ styles.purchase }>
          <Text style={{ fontSize: ScreenUtil.setSpText(20), color: '#fff', marginBottom: ScreenUtil.autoheight(19) }}>Purchase</Text>
          <View style={{ marginBottom: ScreenUtil.autoheight(30) }}>
            <Text style={{ color: '#fff', fontSize: ScreenUtil.setSpText(18), marginBottom: ScreenUtil.autoheight(1) }}>Real-Time Price</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: ScreenUtil.setSpText(18) }}>HSN   =   {this.state.exchangeRate}    USDT</Text>
          </View>
          <View style={{backgroundColor: 'transparent'}}>
            <View style={ styles.usdtDetail }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={UImage.icon_usdt} style={styles.purchaseIcon} />
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>USDT ></Text>
              </View>
              <TextInput defaultValue={this.state.usdtAmount} keyboardType='numeric' onChangeText={(text) => {this.onUsdtChange(text)}} onFocus={() => {this.banInput(true)}} style={{flex: 1, textAlign: 'right', fontSize: ScreenUtil.setSpText(25), color: '#fff', height: ScreenUtil.autoheight(34), padding: 0}} />
            </View>
            {/* 虚线 */}
            <View style={{ flexDirection: 'row', marginVertical: ScreenUtil.autoheight(11), justifyContent: 'space-around' }}>
              {
                this.state.arr.map((val, i) => (
                  <View key={i} style={{ width: ScreenUtil.autowidth(7), height: ScreenUtil.autoheight(1), backgroundColor: '#191B2AFF' }}></View>
                ))
              }
            </View>
            <View style={ styles.usdtDetail }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={UImage.icon_hsn} style={styles.purchaseIcon} />
                <Text style={{ fontSize: ScreenUtil.setSpText(16), color: '#fff' }}>HSN ></Text>
              </View>
              <TextInput defaultValue={this.state.hsnAmount} keyboardType='numeric' onChangeText={(text) => {this.onHsnChange(text)}} onFocus={() => {this.banInput(false)}} style={{flex: 1, textAlign: 'right', fontSize: ScreenUtil.setSpText(25), color: '#fff', height: ScreenUtil.autoheight(34), padding: 0}} />
            </View>
            {/* Purchase按钮 */}
            <View style={ styles.purchaseButton }>
              <TextButton onPress={() => {this.exchange()}} text="Purchase" textColor="#fff" fontSize={ ScreenUtil.setSpText(13) } shadow={ true } style={{ width: ScreenUtil.autowidth(230), borderRadius: ScreenUtil.autoheight(20) }} />
            </View>
            <View style={{ height: ScreenUtil.autoheight(20) }}>
              <TextButton onPress={ () => { this.noDoublePress(() => { this.goPurchaseRecords() }) } } text="Records(HSN)" textColor="#fff" bgColor="transparent" underline={ true } fontSize={ ScreenUtil.setSpText(15) } style={{ justifyContent: 'flex-start' }} />
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    )
  }
  _renderItem = () => {}
  _renderFooter = () => {}
  createEmptyView = () => {}
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
    width: ScreenUtil.autoheight(35),
    height: ScreenUtil.autoheight(35),
    backgroundColor: '#fff',
    borderRadius: ScreenUtil.autowidth(35) / 2,
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
  usdtWithdraw: {
    width: ScreenUtil.autowidth(90),
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
  purchaseIcon: {
    width: ScreenUtil.autoheight(24),
    height: ScreenUtil.autoheight(24),
    backgroundColor: '#fff',
    borderRadius: ScreenUtil.autowidth(24) / 2,
    marginRight: ScreenUtil.autowidth(7)  
  },
  purchaseButton: {
    marginVertical: ScreenUtil.autoheight(19),
    height: ScreenUtil.autoheight(40),
    alignItems: 'center'
  },

  // 交易密码
  tradepout: {
    flexDirection:'row',
    justifyContent:'center',
    marginVertical: ScreenUtil.autoheight(16)
  },
  tradepwimg: {
    width: ScreenUtil.autowidth(34),
    height:ScreenUtil.autoheight(47),
    paddingVertical:ScreenUtil.autoheight(10),
  },
  textinpt: {
    width: '100%',
    color: "#1A1A1A",
    opacity: 0.8,
    fontSize: ScreenUtil.setSpText(18),
    paddingVertical: ScreenUtil.autoheight(10),
    paddingHorizontal: ScreenUtil.autowidth(10),
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: ScreenUtil.autowidth(1),
  },
});

export default Setting;
