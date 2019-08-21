import React from 'react';
import { connect } from 'react-redux'
import {Dimensions,StyleSheet,Platform,KeyboardAvoidingView,ScrollView,View,Text,Image,Linking,TextInput,TouchableOpacity,Animated,
  Easing,FlatList,Clipboard,ImageBackground,RefreshControl} from 'react-native';
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
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
let pageNo = 1;
let pageSize = 10;

@connect(({ assets,loading }) => ({ ...assets,addlinkRefreshing: loading.effects['assets/addlinkList']}))
class StationContacts extends BaseComponent {

  static navigationOptions = {
    title: '站内联系人',
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

  //select address
  selectAddress(item){
    if(this.props.navigation.state.params.callback){
      this.props.navigation.state.params.callback(item);
    }
    this.props.navigation.goBack();
  }

  goAddAddress(){
    try {
      if(this.props.addlinkList.length>=10){
        EasyToast.show('You can add up to 10 addresses!');
        return;
      }
      const { navigate } = this.props.navigation;
      navigate('AddingInStationContacts',{coinName: this.state.coinName});
    } catch (error) {

    }
  }

  //address delete
  async addressDel (item) {
    try {
      let con = (<View>
        <View style={styles.frameout}>
          <Image style={styles.frameimg} source={UImage.sad_face} />
        </View>
        <Text style={styles.frametext}>Do you confirm deletion?</Text>
      </View>);
      let isAuth =  await AlertModal.showSync(null,con,"Confirm","Cancel" );
      if(isAuth){
        EasyToast.show('Successful deletion');
        Utils.dispatchActiionData(this,{type:'assets/addlinkDel',payload: {id: item.id}})
      }
    } catch (error) {

    }
  }

  addressRefreshList(){
    try {
      if(this.props.addlinkRefreshing){
        return
      }
      Utils.dispatchActiionData(this,{type:'assets/addlinkList',payload: {pageNo: pageNo, pageSize: pageSize}});
      pageNo = 1;
    }catch (e) {

    }
  }

  //加载更多  
  async onEndReached () {
    try {
      if (!this.onEndReachedCalledDuringMomentum) {
        await Utils.dispatchActiionData(this,{type:'assets/addlinkList',payload:{ pageNo: ++pageNo, pageSize: pageSize } });
        this.onEndReachedCalledDuringMomentum = true;
      }
    } catch (error) {
      
    }
  }

  render() {
    return (
      <View style={[styles.container,{backgroundColor: UColor.bgColor, }]}>
        <Header {...this.props} onPressLeft={true} title={"Contacts"} backgroundColors={"rgba(0, 0, 0, 0.0)"} />

        <FlatList style={{flex: 1, marginBottom:ScreenUtil.autoheight(65)}}
          data={this.props.addlinkList?this.props.addlinkList:[]}
          renderItem={({item})=>this.addressCardRender(item)}
          ListEmptyComponent={this.createEmptyView()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item ,index) => "index"+index+item}
          onEndReachedThreshold={0.1} 
          onMomentumScrollBegin={() => { 
            this.onEndReachedCalledDuringMomentum = false;     
          }}
          onEndReached={this.onEndReached.bind(this)}
          refreshControl={<RefreshControl  refreshing={!this.props.addlinkRefreshing?false:true} onRefresh={() => this.addressRefreshList()}
            tintColor={UColor.tintColor} colors={[UColor.tintColor]} progressBackgroundColor={UColor.startup}
          />} 
        />

        <View style={styles.referout}>
          <TextButton onPress={()=>{this.noDoublePress(()=>{this.goAddAddress()})}} shadow={true} textColor='#FFFFFF' 
          text={"Add Contacts"} fontSize={ScreenUtil.setSpText(16)} style={styles.btntransfer} />
        </View>
      </View>
    )
  }

  addressCardRender(item){
    return (
      <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.selectAddress(item)})}}>
        <LinearGradient style={styles.adCard} colors={['#4F5162','#1E202C']} start={{x:0,y:0}} end={{x:1,y:0}}>
          <Text style={styles.adCardtitle}>{moment(item.createDate).format('YYYY/MM/DD HH:mm')}</Text>
          <View style={styles.adCardRow}>
            <Text style={[styles.adCardRowTitle,{flex:1.5,textAlign: 'left'}]}>HSN Acount</Text>
            <Text style={[styles.adCardRowTitle,{flex:1.5,textAlign: 'center'}]}>Notes</Text>
            <Text style={[styles.adCardRowTitle,{flex:1,textAlign: 'center'}]}>Operation</Text>
          </View>
          <View style={[styles.adCardRow,{marginVertical:ScreenUtil.autoheight(5)}]}>
            <Text style={[styles.adCardRowTitle,{flex:1.5,textAlign: 'left'}]}>{item.mail}</Text>
            <Text style={[styles.adCardRowTitle,{flex:1.5,textAlign: 'center'}]}>{item.memo}</Text>
            <TouchableOpacity onPress={()=>{this.noDoublePress(()=>{this.addressDel(item)})}} style={[styles.adCardRowTitle,styles.delbtnout]}>
              <LinearGradient style={styles.delLinearout} colors={['#FF0A2F','#FFD083']} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={styles.deltext}>Delete</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  createEmptyView() {
    return(
      <LinearGradient colors={["#4F5162","#1E202C"]} style={styles.notimeout}>
        <Image source={UImage.noRecord} style={styles.defectbgimg}/>
        <Text style={styles.notimetext}>{"You don't have an in-station contact yet."}</Text>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  frameout: { 
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: ScreenUtil.autoheight(16)
  },
  frameimg: {
    width: ScreenUtil.autowidth(49),
    height: ScreenUtil.autowidth(49),
    marginVertical:ScreenUtil.autoheight(10),
  },
  frametext: {
    textAlign: "center",
    fontSize: ScreenUtil.setSpText(21),
    color: 'rgba(0, 0, 0, 1)',
    lineHeight: ScreenUtil.autoheight(32),
    paddingVertical: ScreenUtil.autoheight(12)
  },
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
  adCardtitle: {
    color:'#fff',
    fontSize:ScreenUtil.setSpText(12),
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScreenUtil.autoheight(26), 
  },
  btntransfer: {
    width: ScreenWidth*2/5, 
    height: ScreenUtil.autoheight(45),
    borderRadius: ScreenUtil.autowidth(23), 
  },
  delbtnout: {
    flex:1,
    textAlign: 'center',
    flexDirection:'row',
    justifyContent: 'center',
  },
  delLinearout: {
    borderRadius: ScreenUtil.autoheight(10),
    width: ScreenUtil.autowidth(42),
    height:ScreenUtil.autoheight(20),
  },
  deltext: {
    color: '#2C2E3C',
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(12),
    lineHeight: ScreenUtil.autoheight(20)
  },

  notimeout:{ 
    width: ScreenWidth-ScreenUtil.autowidth(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ScreenUtil.autowidth(10), 
    paddingVertical: ScreenUtil.autoheight(15), 
    elevation: 10, 
    shadowRadius: 5, 
    shadowOpacity:0.06, 
    shadowColor: 'rgba(0, 0, 0, 1)',  
    shadowOffset:{height: 2,width: 0},
  },
  defectbgimg: {
    width: ScreenUtil.autowidth(90),
    height: ScreenUtil.autowidth(90),
  },
  notimetext: {
    textAlign: 'center',
    color: '#FFFFFF',
    paddingTop: ScreenUtil.autoheight(11), 
    fontSize: ScreenUtil.setSpText(11),
    lineHeight: ScreenUtil.autoheight(18), 
  },
});

export default StationContacts;
