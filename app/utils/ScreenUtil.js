'use strict'
import React from 'react';
import {Dimensions, Platform, NativeModules, DeviceInfo, PixelRatio,} from 'react-native';
const { PlatformConstants = {} } = NativeModules;
const { minor = 0 } = PlatformConstants.reactNativeVersion || {};


var ScreenUtil = {
    uiWidth: 375,//这里的值，是设计稿中的宽度，你们根据自己的设计稿改动，本人拿到的设计稿是iphone6的
    uiHeight: 667,//这里的值，是设计稿中的高度，你们根据自己的设计稿改动，本人拿到的设计稿是iphone6的
    X_WIDTH: 375,
    X_HEIGHT: 812,
    XR_WIDTH: 414,
    XR_HEIGHT: 896,
    pixel: 1 / PixelRatio.get(),
    screenWidth: Dimensions.get('window').width,
    screenHeith: Dimensions.get('window').height,
    pixelRatio: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),

    scale: Math.min(Dimensions.get('window').height / 667, Dimensions.get('window').width / 375),
    widthRadio: Dimensions.get('window').width / 375,
    heightRadio: Dimensions.get('window').height / 667,

    //IPX
    scaleIpx: Math.min(Dimensions.get('window').height / 812, Dimensions.get('window').width / 375),
    widthRadioIpx: Dimensions.get('window').width / 375,
    heightRadioIpx: Dimensions.get('window').height / 812,//比例时用有效区域 754=812-24-34

    //IPXR IPXSMAX
    scaleIpxR: Math.min(Dimensions.get('window').height / 896, Dimensions.get('window').width / 414),
    widthRadioIpxR: Dimensions.get('window').width / 414,
    heightRadioIpxR: Dimensions.get('window').height / 896,//比例时用有效区域 754=812-24-34

    getRadio:function(){
        if(this.isIpX()){
            return this.widthRadioIpx;
        }else if(this.isIpXR()){
            return this.widthRadioIpxR;
        }else{
            return this.widthRadio;
        }
    },

    getScale:function(){
        if(this.isIpX()){
            return this.scaleIpx;
        }else if(this.isIpXR()){
            return this.scaleIpxR;
        }else{
            return this.scale;
        }
    },

    /*宽度适配，例如我的设计稿某个样式宽度是50pt，那么使用就是：ScreenUtil.autowidth(50)*/
    autowidth: function (value) {
        return this.getRadio()* value;
    },
    /*高度适配，例如我的设计稿某个样式高度是50pt，那么使用就是：ScreenUtil.autoheight(50)*/
    autoheight: function (value) {
        return this.getScale() * value;
    },
    get: function (url, successCallback, failCallback) {
        fetch(url).then((response) => response.text())
            .then((responseText) => {
                successCallback(JSON.parse(responseText));
            }).catch(function (err) {
            failCallback(err);
        });
    },
    /*字体大小适配，例如我的设计稿字体大小是17pt，那么使用就是：ScreenUtil.setSpText(17)*/
    setSpText: function (number) {
        number = Math.round((number * this.getScale() + 0.5) * this.pixelRatio / this.fontScale);
        return number / PixelRatio.get();
    },
    /*判断是不是苹果 iPhoneX / iPhoneXS，那么使用就是：ScreenUtil.isIphoneX()*/
    isIphoneX: function(){
        if (Platform.OS === 'web') return false;
        // if (minor >= 50) {
        //     return DeviceInfo.isIPhoneX_deprecated;
        // }
        return (this.isIpX()||this.isIpXR());
    },
    /*判断是不是苹果 iPhoneX / iPhoneXS，那么使用就是：ScreenUtil.isIphoneX()*/
    isIpX: function(){
        return (
            Platform.OS === 'ios' &&
            ((this.screenHeith === this.X_HEIGHT && this.screenWidth === this.X_WIDTH) ||
                (this.screenHeith === this.X_WIDTH && this.screenWidth === this.X_HEIGHT))

        );
    },
    /*判断是不是苹果 iPhoneXR / iPhoneXSMax，那么使用就是：ScreenUtil.isIphoneXR()*/
    isIpXR: function(){
        return (
            Platform.OS === 'ios' &&
            ((this.screenHeith === this.XR_HEIGHT && this.screenWidth === this.XR_WIDTH) ||
                (this.screenHeith === this.XR_WIDTH && this.screenWidth === this.XR_HEIGHT))
        );
    },
    /*通过value删除数组元素*/
    removeByValue: function (arr, value) {
        let i = arr.length;
        while (i--) {
            if (arr[i] === value) {
                arr.splice(i, 1);
            }
        }
    },
    /*判断是否存在数组*/
    isInArray: function (arr, value) {
        let i = arr.length;
        while (i--) {
            if (arr[i] === value) {
                return true
            }
        }
    }
};

module.exports = ScreenUtil;