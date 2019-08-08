/**
 * 二级页面的基类,实现物理返回键的监听
 */
import React, {Component} from 'react';
import {
    BackHandler,
    Platform,
} from 'react-native';

var dismissKeyboard = require('dismissKeyboard');
let isCalled = false, timer;
export default class BaseComponent extends React.Component {
    
    constructor(props){
        super(props)
    }

    //初始化,加载组件
    componentWillMount(){
        if(Platform.OS === 'android'){
            BackHandler.addEventListener('hardwareBackPress',this.onBackAndroid);
        }
    }
    //当组件被移除时调用
    componentWillUnmount(){
        if(Platform.OS === 'android'){
            BackHandler.removeEventListener('hardwareBackPress',this.onBackAndroid);
        }
    }
    
    //监听物理返回键
    onBackAndroid = () => {
        //返回，关闭弹框
        if(window.currentDialog){
            window.currentDialog.dimss();
        }
        if(this.props && this.props.navigation && this.props.navigation.state &&
             this.props.navigation.state.params && this.props.navigation.state.params.callback)
        {
            this.props.navigation.state.params.callback();
        }
        return false;
    };

    noDoublePress(callback, interval = 1000){
        if (!isCalled) {
            // console.log("first onpress");
            isCalled = true;
            clearTimeout(timer);
            timer = setTimeout(() => {
                isCalled = false;
            }, interval);
            return callback();
        }else{
            // console.log("repeat onpress refuse");
            return '';
        }
    };

    //收回键盘
    dismissKeyboardClick() {
        dismissKeyboard();
    }
}