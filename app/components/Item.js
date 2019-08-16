import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, View, Image, StyleSheet, Dimensions, Platform, TouchableHighlight, TouchableOpacity, AlertIOS, SwitchIOS, Switch, TouchableNativeFeedback} from 'react-native'
import ScreenUtil from '../utils/ScreenUtil'
import UColor from '../utils/Colors'
import Button from './Button'
import NoDoublePress from '../utils/NoDoublePress'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const Font = {
  Ionicons,
  FontAwesome
}

class ItemButton extends Component {
    constructor(props){
      super(props)
    }
    render(){
      return (
        <Button style={{marginTop: this.props.first?10:0}} onPress={this.props.onPress}>
          <View style={[styles.button,{height: itemHeight?itemHeight: ScreenUtil.autoheight(55)}]}>
            <Text style={{color: this.props.color || UColor.riseColor}}>{this.props.name}</Text>
          </View>
        </Button>
      )
    }
  }

export default class Item extends Component {

  state = {
    value: false,
    thcolor:UColor.bgColor
  }

  constructor(props){
    super(props)
  }
  static propTypes = {
    itemHeight: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    nameColor: PropTypes.string,
    redDot: PropTypes.bool,
    color: PropTypes.string,
    topfirst: PropTypes.number,
    first: PropTypes.number,
    avatar: PropTypes.number,
    disable: PropTypes.bool,
    iconSize: PropTypes.number,
    font: PropTypes.string,
    onPress: PropTypes.func,
    swt: PropTypes.string,
    spot: PropTypes.bool,
    shadow: PropTypes.bool,
    shadowname: PropTypes.string,
    subletterSpacing: PropTypes.number,
  }

  _render(){
    let {itemHeight, paddingHorizontal, swt, icon, iconSize, spot, name, nameColor, shadow, shadowname, subName, subletterSpacing, redDot, photo, color, topfirst, first, avatar, disable, font} = this.props
    font = font||"Ionicons"
 
    return (
      <View style={[styles.listItem,{height: itemHeight?itemHeight: ScreenUtil.autoheight(55),backgroundColor: UColor.transport,marginTop: topfirst?topfirst:0},{paddingHorizontal: paddingHorizontal? paddingHorizontal: 0}]}>
        { 
          icon ? (
            <Icon name={icon} size={iconSize||ScreenUtil.setSpText(20)} style={{width: ScreenUtil.autowidth(22), marginRight:ScreenUtil.autowidth(5), textAlign:"center"}} color={color || UColor.blueDeep} />
          ) : null
        }
        { 
          spot ? (
            <View style={{width: ScreenUtil.autowidth(6),height: ScreenUtil.autowidth(6), marginRight: ScreenUtil.autowidth(8), borderRadius: ScreenUtil.autowidth(3), backgroundColor: '#D0D0D4'}} />
          ) : null
        }
        <View style={[styles.listInfo, first && {borderBottomColor: UColor.bgColor,borderBottomWidth: first},{height: itemHeight?itemHeight: ScreenUtil.autoheight(55),}]}>
          { 
            avatar ? (
              <Image source={avatar} style={{width: ScreenUtil.autowidth(19), height: ScreenUtil.autowidth(17), resizeMode: "contain", overflow:"hidden",marginRight:ScreenUtil.autowidth(13),}}/>
            ) : null
          }
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{color:nameColor? nameColor : '#555555', fontSize:ScreenUtil.setSpText(16), paddingRight: ScreenUtil.autowidth(10),}}>{name}</Text>
            {
              shadow &&
              <LinearGradient colors={shadowname == "未认证" ?['#FF0A2F','#FFD083']:["#FFFFFF","#FFFFFF"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{height: ScreenUtil.autoheight(18), borderRadius: ScreenUtil.autoheight(9), justifyContent: 'center',}}>
                <Text style={{color: '#2C2E3C',fontSize:ScreenUtil.setSpText(10), paddingHorizontal: ScreenUtil.autowidth(8),}}>{shadowname}</Text>
              </LinearGradient>
            }
          </View>
          <View style={styles.listInfoRight}>
            {
              subName ? (
                <Text style={{color: '#FFFFFF', fontSize: ScreenUtil.setSpText(14), letterSpacing: subletterSpacing ? subletterSpacing : ScreenUtil.autowidth(0),}}>{subName}</Text>
              ) : null
            } 
            {
              redDot ? (
                <View style={{width: ScreenUtil.autowidth(7), height: ScreenUtil.autowidth(7), borderRadius: 5, backgroundColor: '#FF3D3D'}} />
              ) : null
            } 
            {
              photo ? (
                <View style={{backgroundColor: '#FFFFFF', padding: ScreenUtil.autowidth(1), borderRadius: ScreenUtil.autowidth(18),}}>
                  <Image source={photo} style={{width: ScreenUtil.autowidth(35), height: ScreenUtil.autowidth(35), resizeMode: "contain", overflow:"hidden", borderRadius:ScreenUtil.autowidth(17.5),}}/>
                </View>
              ) : null
            }          
            {
              disable ? null : (
                <Font.Ionicons name="ios-arrow-forward" size={ScreenUtil.autowidth(20)} color='#B5B5B5' style={{paddingLeft: ScreenUtil.autowidth(20),}} />
              )
            }
            {!swt ? null : ( 
                <Switch 
                tintColor={UColor.bgColor}
                onTintColor={UColor.tintColor}
                thumbTintColor={UColor.fontrice}
                value={this.state.value} onValueChange={(value)=>{
                this.setState({value:value})}}
              />
              )
            }
          </View>
        </View>
      </View>
    )
  }

  render(){
    let { onPress, first, disable } = this.props
    onPress = onPress || (() => {})
    return (
      <View>
        <Button onPress={() => {NoDoublePress.onPress(onPress)}}>{this._render()}</Button> 
      </View>
    )

    // return onPress ?
    // this._render():
    // <Button onPress={onPress}>{this._render()}</Button>
  }
}
Item.Button = ItemButton
const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button:{
    backgroundColor: UColor.mainColor,
    justifyContent: "center",
    alignItems: "center"
  },
  listInfo: {
    flex: 1,
    paddingHorizontal: ScreenUtil.autowidth(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listInfoRight: {
    flexDirection: "row",
    alignItems: "center",
  }
})
