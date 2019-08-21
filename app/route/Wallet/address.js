import React from 'react';
import { connect } from 'react-redux'
import {
  Dimensions,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Image,
  Linking,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
  Clipboard,
  ImageBackground,
  RefreshControl
} from 'react-native';
import moment from 'moment';
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
var WeChat = require('react-native-wechat');

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

@connect(({ assets,loading }) => ({ ...assets,
  addressRefreshing: loading.effects['assets/addressList']}))
class address extends BaseComponent {

  static navigationOptions = {
    title: '提币地址',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      coinName: this.props.navigation.state.params.coinName?this.props.navigation.state.params.coinName:"HSN",
    };
  }

  //组件加载完成
  componentDidMount() {

  }

  addressCardRender(item){
    return (
        <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.selectAddress(item)})}}>
          <LinearGradient style={styles.adCard} colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={{color:'#fff'}}>{moment(item.createDate).format('YYYY/MM/DD HH:mm')}</Text>
            <View style={[styles.adCardRow,{}]}>
              <Text style={[styles.adCardRowTitle,{flex:3,textAlign: 'left'}]}>Address</Text>
              <Text style={[styles.adCardRowTitle,{flex:1,textAlign: 'center'}]}>Note</Text>
              <Text style={[styles.adCardRowTitle,{flex:1,textAlign: 'center'}]}>Operation</Text>
            </View>
            <View style={[styles.adCardRow,{marginVertical:ScreenUtil.autoheight(5)}]}>
              <Text style={[styles.adCardRowTitle,{flex:3,textAlign: 'left'}]}>{item.coinAddress}</Text>
              <Text style={[styles.adCardRowTitle,{flex:1,textAlign: 'center'}]}>{item.memo}</Text>
              <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.addressDel(item)})}} style={[styles.adCardRowTitle,{flex:1,textAlign: 'center',flexDirection:'row',justifyContent: 'center'}]}>
                <LinearGradient style={{
                  borderRadius: ScreenUtil.autoheight(10),
                  width: ScreenUtil.autowidth(42),
                  height:ScreenUtil.autoheight(20),
                }} colors={['#FF0A2F','#FFD083']} start={{x:0,y:0}} end={{x:1,y:0}}>
                  <Text style={{color:'#2C2E3C',textAlign:'center',fontSize:ScreenUtil.setSpText(12),lineHeight:ScreenUtil.autoheight(20)}}>delete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </LinearGradient>
        </TouchableOpacity>
    )
  }

  //select address
  selectAddress(item){
    if(this.props.navigation.state.params.callback){
      this.props.navigation.state.params.callback(item);
    }
    this.props.navigation.goBack();
  }

  goAddAddress(){
    try {
      if(this.props.addressLists.length>=10){
        EasyToast.show('You can add up to 10 addresses!');
        return;
      }
      const { navigate } = this.props.navigation;
      navigate('NewAddress',{coinName: this.state.coinName});
    } catch (error) {

    }
  }

  //address delete
  async addressDel (item) {
    try {
      let con = <View>
        <View style={{flexDirection:'row',justifyContent:'center',marginTop: ScreenUtil.autoheight(16)}}>
          <Image style={{
            width: ScreenUtil.autowidth(49),
            height: ScreenUtil.autowidth(49),
            marginVertical:ScreenUtil.autoheight(10),

          }} source={UImage.sad_face} />
        </View>
        <Text style={{textAlign:"center",fontSize:ScreenUtil.setSpText(21),color: 'rgba(0, 0, 0, 1)',lineHeight:ScreenUtil.autoheight(32),paddingVertical:ScreenUtil.autoheight(12)}}>Do you confirm deletion?</Text>
      </View>;
      let isAuth =  await AlertModal.showSync(null,con,"Confirm","Cancel" );
      if(isAuth){
        EasyToast.show('Successful deletion!');
        Utils.dispatchActiionData(this,{type:'assets/addressDel',payload: {id:item.id,coinName:this.state.coinName,}})
      }
    } catch (error) {

    }
  }

  addressRefreshList(){
    try {
      if(this.props.addressRefreshing){return}
      Utils.dispatchActiionData(this,{type:'assets/addressList',payload: {coinName:this.state.coinName}});
    }catch (e) {

    }

  }


  render() {
    return (
        <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
          <Header {...this.props} onPressLeft={true} title={""} backgroundColors={"rgba(0, 0, 0, 0.0)"} />
          <FlatList
            style={{marginBottom:ScreenUtil.autoheight(65)}}
            data={this.props.addressLists?this.props.addressLists:[]}
            renderItem={({item})=>this.addressCardRender(item)}
            refreshControl={
              <RefreshControl 
                refreshing={this.props.addressRefreshing}
                colors={[UColor.tintColor]}
                onRefresh={()=>this.addressRefreshList()}
                tintColor={UColor.tintColor}
                progressBackgroundColor={UColor.startup}
              />
            }
          />
          <View style={styles.referout}>
            <TextButton onPress={()=>{this.noDoublePress(()=>{this.goAddAddress()})}} shadow={true} textColor='#FFFFFF' text={"Add address"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  adCard:{
    width:ScreenWidth-ScreenUtil.autowidth(30),
    marginHorizontal: ScreenUtil.autowidth(15),
    marginVertical: ScreenUtil.autoheight(5),
    paddingHorizontal:ScreenUtil.autowidth(15),
    paddingVertical: ScreenUtil.autoheight(10),
    borderRadius:ScreenUtil.autowidth(8),
  },
  adCardRow:{
    color:'#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  adCardRowTitle:{
    color:'#fff',
    fontSize:ScreenUtil.setSpText(12),
  },

  referout: {
    flexDirection:"row",
    justifyContent:'center',
    position:'absolute',
    bottom:ScreenUtil.autoheight(15) 
  },
  btntransfer: {
    width: ScreenUtil.autowidth(230), 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  }

});

export default address;
