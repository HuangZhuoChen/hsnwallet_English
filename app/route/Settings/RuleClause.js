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
var WeChat = require('react-native-wechat');

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ }) => ({ }))
class RuleClause extends React.Component {

  static navigationOptions = {
    title: '规则说明',
    header: null, 
  };

  constructor(props) {
    super(props);
    this.state = {
      // wholeinvitation: this.props.navigation.state.params.wholeinvitation ? this.props.navigation.state.params.wholeinvitation : 'whole',
      duanList: [
        {name: 'Bronze PMN', range: '≥1000, <3000'},
        {name: 'Silver PMN', range: '≥3000, <5000'},
        {name: 'Gold PMN', range: '≥5000, <10000'},
        {name: 'Diamond PMN', range: '≥10000'}
      ],
      levelList: [
        {name: 'Bronze', range: '≥1000, <3000', giveaway: '30%', income: '109.50%'},
        {name: 'Silver', range: '≥3000, <5000', giveaway: '35%', income: '127.75%'},
        {name: 'Gold', range: '≥5000, <10000', giveaway: '40%', income: '146.00%'},
        {name: 'Diamond', range: '≥10000', giveaway: '50%', income: '182.50%'}    
      ],
      awardRanking: [
        {name: '1', award: '18.00%', amount: '36,000'},
        {name: '2', award: '15.00%', amount: '30,000'},
        {name: '3', award: '12.00%', amount: '24,000'},
        {name: '4', award: '6.00%', amount: '12,000'},
        {name: '5', award: '4.00%', amount: '8,000'},
        {name: '6', award: '2.00%', amount: '4,000'},
        {name: '7', award: '2.00%', amount: '4,000'},
        {name: '8', award: '2.00%', amount: '4,000'},
        {name: '9', award: '2.00%', amount: '4,000'},
        {name: '10', award: '2.00%', amount: '4,000'},
        {name: '11', award: '2.50%', amount: '5,000'},
        {name: '12', award: '2.50%', amount: '5,000'},
        {name: '13', award: '2.50%', amount: '5,000'},
        {name: '14', award: '2.50%', amount: '5,000'},
        {name: '15', award: '2.50%', amount: '5,000'},
        {name: '16', award: '2.00%', amount: '4,000'},
        {name: '17', award: '2.00%', amount: '4,000'},
        {name: '18', award: '2.00%', amount: '4,000'},
        {name: '19', award: '2.00%', amount: '4,000'},
        {name: '20', award: '2.00%', amount: '4,000'},
        {name: '21', award: '1.50%', amount: '3,000'},
        {name: '22', award: '1.50%', amount: '3,000'},
        {name: '23', award: '1.50%', amount: '3,000'},
        {name: '24', award: '1.50%', amount: '3,000'},
        {name: '25', award: '1.50%', amount: '3,000'},
        {name: '26', award: '1.00%', amount: '2,000'},
        {name: '27', award: '1.00%', amount: '2,000'},
        {name: '28', award: '1.00%', amount: '2,000'},
        {name: '29', award: '1.00%', amount: '2,000'},
        {name: '30', award: '1.00%', amount: '2,000'},
      ],
      referralAward: [
        {name: 'Bronze', range: '≥1000, <3000', percentage: '4%'},
        {name: 'Silver', range: '≥3000, <5000', percentage: '5%'},
        {name: 'Gold', range: '≥5000, <10000', percentage: '6%'}
      ]
    };
  }

  //组件加载完成
  componentDidMount() {
    
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor,}]}>
        <Header {...this.props} onPressLeft={true} title={"Rules"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={ UImage.rulesbg } style={{ width: ScreenUtil.autowidth(375), height: ScreenUtil.autowidth(665), marginBottom: ScreenUtil.autoheight(10) }} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.linearStyle}>
                <Text style={[styles.textStyle, {marginBottom: ScreenUtil.autoheight(20)}]}>With the accelerated development of 5G technology and the coming of the 5G era, as the first value ecosystem combining Public Chain + 5G application in the world, Hyper Speed Network (HSN) is also increasing the speed of research, development and promotion. At present, the HSN team has reached 100 members, 95% of which are experts and researchers in the field of Blockchain and 5G communications. 
                HSN has completed the release of first generation of ecosystem application technology，white paper Version 1, and has listed on five international exchanges. Our global community base has expanded to over 30 countries and regions around the world, supporting an incredible 100,000+ people.</Text>
                <Text style={styles.textStyle}>In order to accelerate the progress of the project’s research and development, HSN aims to continuously involve the community to participate and enable active members to participate in the further development and governance of our ecosystem. HSN wants to jointly promote the development of our 5G+blockchain ecosystem and share the return. Therefore, we launch the ‘Protector Master Node Plan’(PMN) recruitment program. The HSN Foundation allocates 5,000,000 HSN as reward to the PMN and referrals.</Text>
              </LinearGradient>
              {/* 规则1 */}
              <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.linearStyle}>
                <View style={styles.sort}></View>
                <View style={styles.sortText}>
                  <Text style={{color: '#191B2A', fontSize: ScreenUtil.setSpText(20)}}>1</Text>
                </View>
                <View style={{paddingHorizontal: ScreenUtil.autowidth(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ScreenUtil.autoheight(10)}}>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Selection Criteria Of</Text>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Protector Master Node</Text>
                  </View>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                </View>
                <Text style={styles.textStyle}>Through specific token levels and long-term holding, users will support the development of HSN projects, participate in the ecological development, and receive exclusive benefits and interests.</Text>
              </LinearGradient>
              {/* 规则2 */}
              <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.linearStyle}>
                <View style={styles.sort}></View>
                <View style={styles.sortText}>
                  <Text style={{color: '#191B2A', fontSize: ScreenUtil.setSpText(20)}}>2</Text>
                </View>
                <View style={{paddingHorizontal: ScreenUtil.autowidth(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ScreenUtil.autoheight(10)}}>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Authentic Protector Master</Text>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Node Qualification</Text>
                  </View>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                </View>
                <Text style={styles.textStyle}>1. Deposit USDT in the official HSN wallet, exchange this into HSN and deposit it into the wallet's personal account. A maximum of 10 million HSN available for the initial PMN progam. The wallet will exchange the USDT for HSN tokens according the actual market price in a timely manner. Submit the application for Protector Master Node qualification to participate in the PMN recruitment program. Each address is eligible to obtain one PMN status. According to the actual amount of participants, applicants obtain the certification of the corresponding level of Protector Master Node after approval of HSN project:</Text>
                <View style={{flex: 1, paddingHorizontal: ScreenUtil.autowidth(40), marginVertical: ScreenUtil.autoheight(10)}}>
                  <View style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(7)}}>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 82, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(21), justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Rank Name</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 134, height: ScreenUtil.autoheight(21), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Protector Master Node</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Participation Amount(HSN)</Text>
                    </LinearGradient>
                  </View>
                  <View>
                    {
                      this.state.duanList.map((val, i) => (
                        <View key={i} style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(3)}}>
                          <View style={{flex: 82, borderWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', borderTopWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.name}</Text>
                          </View>
                          <View style={{flex: 134, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.range}</Text>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                </View>
                <Text style={styles.textStyle}>2. After the Protector Master Node is successfully authenticated, the identity and related benefits are permanently valid.</Text>
              </LinearGradient>
              {/* 规则3 */}
              <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.linearStyle}>
                <View style={styles.sort}></View>
                <View style={styles.sortText}>
                  <Text style={{color: '#191B2A', fontSize: ScreenUtil.setSpText(20)}}>3</Text>
                </View>
                <View style={{paddingHorizontal: ScreenUtil.autowidth(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ScreenUtil.autoheight(10)}}>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Recruitment Period</Text>
                  </View>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                </View>
                <Text style={styles.textStyle}>The first phase will start from the end of August 2019 (launch HSN Wallet), onwards until a total of 10,000,000 HSN has been purchased.</Text>
              </LinearGradient>
              {/* 规则4 */}
              <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.linearStyle}>
                <View style={styles.sort}></View>
                <View style={styles.sortText}>
                  <Text style={{color: '#191B2A', fontSize: ScreenUtil.setSpText(20)}}>4</Text>
                </View>
                <View style={{paddingHorizontal: ScreenUtil.autowidth(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ScreenUtil.autoheight(10)}}>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Benefits For The</Text>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Protector Master Node</Text>
                  </View>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                </View>
                <Text style={styles.textStyle}>1. Exclusive Identity Authentication: HSN project will award exclusive identity authentication logo for Protector Master Node, award identity trophies and certificates, and highlight the identity of Protectors on official platforms such as official websites, wallets and online store.</Text>
                <Text style={styles.textStyle}>2. 5 million HSN will be given away to Protector Master Node in Phase I: HSN tokens will be given away to Protector Master Nodes in different proportions according to the amount of HSN. From the day when the Protector Master Node deposits and locks the tokens, 1% of the principal and giveaway rewards will be released every day, and the release will be completed in 100 days.</Text>
                <View style={{flex: 1, paddingHorizontal: ScreenUtil.autowidth(2), marginVertical: ScreenUtil.autoheight(10)}}>
                  <View style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(7)}}>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 56, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(34), justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Level</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 116, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(34), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>The Number Of HSN</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Tokens From</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Protector Master Node</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 64, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(34), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Giveaway</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Percentage</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 62, height: ScreenUtil.autoheight(34), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Equivalent</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Annualized</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Income</Text>
                    </LinearGradient>
                  </View>
                  <View>
                    {
                      this.state.levelList.map((val, i) => (
                        <View key={i} style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(3)}}>
                          <View style={{flex: 56, borderWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', borderTopWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.name}</Text>
                          </View>
                          <View style={{flex: 116, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.range}</Text>
                          </View>
                          <View style={{flex: 64, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.giveaway}</Text>
                          </View>
                          <View style={{flex: 62, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.income}</Text>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                </View>
                <Text style={[styles.textStyle, {marginBottom: ScreenUtil.autoheight(12)}]}>（Remark: 1 Deposits and giveaway rewards will be distributed via the HSN Wallet app yet to be released. Please await further details. 2 If PMN participants in the "Valuation Adjustment Mechanism", as below explained, whose principal and giveaway reward amounts will be locked for 100 days.)</Text>
                <Text style={[styles.textStyle, {marginBottom: ScreenUtil.autoheight(12)}]}>3. Airdrop awards from the development of DAPP or sub-chain: The Protector Master Nodes participate in the development of DAPP and sub-chain, and can enjoy no less than 10% awards according to the specific contribution.</Text>
                <Text style={styles.textStyle}>4. Dealership and sales dividends of the HSN application solution and products:</Text>
                <Text style={styles.textStyle}>{'1) Protector Master Nodes can apply for becoming an authorized agent  of a certain area, according to different levels, possessing exclusive rights to HSN application solutions and products, and get no less than 50% of store construction costs and channel development costs from HSN, in order to carry out HSN application solutions and product agent sales;'}</Text>
                <Text style={styles.textStyle}>{'2) Protector Master Nodes can obtain a sales rebate that is less than 10% of the delivery price by the HSN Team.'}</Text>
                <Text style={[styles.textStyle, {marginTop: ScreenUtil.autoheight(12)}]}>5.Participate in important decision-making and operations of the HSN project development according to the level of the PMN.</Text>
              </LinearGradient>
              {/* 规则5 */}
              <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.linearStyle}>
                <View style={styles.sort}></View>
                <View style={styles.sortText}>
                  <Text style={{color: '#191B2A', fontSize: ScreenUtil.setSpText(20)}}>5</Text>
                </View>
                <View style={{paddingHorizontal: ScreenUtil.autowidth(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ScreenUtil.autoheight(10)}}>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Special Reward To</Text>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Protector Master Nodes</Text>
                  </View>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                </View>
                <Text style={[styles.textStyle, {marginBottom: ScreenUtil.autoheight(12)}]}>1. After the end of this stage, when 10 million HSN tokens are exchanged, the top three Protector Master Nodes will have the opportunity to participate in the Super Nodes competition (21 in total). Twenty-One Super Nodes will share up to 200 million HSN tokens as mining awards.</Text>
                <Text style={styles.textStyle}>2. After the release of all the tokens from the Protector Master Nodes (after 100 days from the end of the event), if the balance of the wallet deposit is not less than 80% of the principal and giveaway rewards, the nodes can participate in the "Protector Master Nodes Realignment Award". The nodes with top 30 wallet deposit balances, will be awarded a total of 200,000 HSN tokens. The amount allocated is as follows:</Text>
                <View style={{flex: 1, paddingHorizontal: ScreenUtil.autowidth(5), marginVertical: ScreenUtil.autoheight(10)}}>
                  <View style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(7)}}>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 113, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(38), justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Protector Master Nodes</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Realignment</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Award Ranking</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 89, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(38), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Award Percentage</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 101, height: ScreenUtil.autoheight(38), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Award Amount(HSN)</Text>
                    </LinearGradient>
                  </View>
                  <View>
                    {
                      this.state.awardRanking.map((val, i) => (
                        <View key={i} style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(3)}}>
                          <View style={{flex: 113, borderWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', borderTopWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.name}</Text>
                          </View>
                          <View style={{flex: 89, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.award}</Text>
                          </View>
                          <View style={{flex: 101, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.amount}</Text>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                </View>
                <Text style={styles.textStyle}>3. All Protector Master Nodes have the right to choose to participate in the "Valuation Adjustment Mechanism":</Text>
                <Text style={styles.textStyle}>Condition: If PMN participants in the "Valuation Adjustment Mechanism" , whose principal and giveaways rewards will be locked for 100 days.</Text>
                <Text style={styles.textStyle}>Right: If the HSN/USDT price on the token release date is higher than the price on PMN certification date , all token is completely released;</Text>
                <Text style={styles.textStyle}>If the HSN/USDT price on the token release date is lower than the price on PMN certification date, the principal loss portion will be calculated, and the HSN token will be replenished according to (price on certification date - price on releaseing date) / price on releasing date The loss of PMN principal due to the price drop is completely avoided.</Text>
              </LinearGradient>
              {/* 规则6 */}
              <LinearGradient colors={["#4F5162", "#1E202C"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.linearStyle}>
                <View style={styles.sort}></View>
                <View style={styles.sortText}>
                  <Text style={{color: '#191B2A', fontSize: ScreenUtil.setSpText(20)}}>6</Text>
                </View>
                <View style={{paddingHorizontal: ScreenUtil.autowidth(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ScreenUtil.autoheight(10)}}>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Awards to Referrals of</Text>
                    <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(15)}}>Protector Master Nodes</Text>
                  </View>
                  <Image source={UImage.title_icon} style={{width: ScreenUtil.autoheight(25), height: ScreenUtil.autoheight(10)}} />
                </View>
                <Text style={styles.textStyle}>Protector Master Nodes are entitled to recommend new Protector Master Nodes. Protector Master Nodes of various levels will be able to receive the referral award according to the percentage listed below, for recommending others to deposit tokens and become new Protector Master Nodes.</Text>
                <View style={{flex: 1, paddingHorizontal: ScreenUtil.autowidth(5), marginVertical: ScreenUtil.autoheight(10)}}>
                  <View style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(7)}}>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 56, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(38), justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Level</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 124, marginRight: ScreenUtil.autowidth(2), height: ScreenUtil.autoheight(38), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>The Number Of HSN Tokens</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>From</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Protector Master Node</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#00D0FF', '#0066E9']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 120, height: ScreenUtil.autoheight(38), justifyContent: 'space-around', alignItems: 'center'}}>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Percentage Of</Text>
                      <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(9)}}>Referral Award</Text>
                    </LinearGradient>
                  </View>
                  <View>
                    {
                      this.state.referralAward.map((val, i) => (
                        <View key={i} style={{flexDirection: 'row', marginBottom: ScreenUtil.autoheight(3)}}>
                          <View style={{flex: 56, borderWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', borderTopWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.name}</Text>
                          </View>
                          <View style={{flex: 124, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.range}</Text>
                          </View>
                          <View style={{flex: 120, borderRightWidth: ScreenUtil.autowidth(0.5), borderBottomWidth: ScreenUtil.autowidth(0.5), borderColor: '#5098DA', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: ScreenUtil.setSpText(12)}}>{val.percentage}</Text>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                </View>
                <Text style={[styles.textStyle, {marginBottom: ScreenUtil.autoheight(12)}]}>For example, one user (user A) becomes a Silver Protector Master Node by purchasing 3000 HSN tokens. When this node recommends another user (user B) to deposit 1000 HSN tokens and become Bronze Protector Master Node, then the User A will receive referral award of 1000*5%= 50 HSN.</Text>
                <Text style={styles.textStyle}>Description:</Text>
                <Text style={[styles.textStyle, {marginBottom: ScreenUtil.autoheight(12)}]}>1.The HSN team reserves the right of final interpretation and modification of this content. When the content of the English and Chinese announcements is ambiguous, the official interpretation shall prevail.</Text>
                <Text style={styles.textStyle}>2.Deposits and giveaway rewards will be via the HSN Wallet app yet to be announced. Please await further details of launch date and operation guide.</Text>
              </LinearGradient>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    paddingBottom: ScreenUtil.isIphoneX() ?ScreenUtil.autoheight(24):ScreenUtil.autoheight(1),
  },
  linearStyle: {
    width: ScreenUtil.autowidth(340),
    borderRadius: ScreenUtil.autowidth(10),
    padding: ScreenUtil.autowidth(20),
    marginBottom: ScreenUtil.autoheight(10),
    overflow: 'hidden'
  },
  textStyle: {
    color: '#fff',
    fontSize: ScreenUtil.setSpText(11),
    lineHeight: ScreenUtil.autoheight(20)
  },
  sort: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: ScreenUtil.autoheight(44),
    height: ScreenUtil.autoheight(44),
    borderWidth: ScreenUtil.autoheight(22),
    borderTopColor: '#FED852',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FED852'
  },
  sortText: {
    width: ScreenUtil.autoheight(26),
    height: ScreenUtil.autoheight(26),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0
  }
});

export default RuleClause;
