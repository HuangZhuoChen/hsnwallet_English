import React from 'react';
import {StatusBar,Platform,View} from 'react-native';
import Route from "./route/Nav";
import {Toast} from './components/Toast';
import {LoadingDialog} from './components/EasyShow'
console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];
console.disableYellowBox = true // 关闭全部黄色警告

const App = () => (
 <View style={{flex:1,paddingBottom: 0,}}>
    <Toast />
    <LoadingDialog />
    <StatusBar barStyle="light-content" backgroundColor={'rgba(0, 0, 0, 0.0)'} translucent={true} />
    <Route/>
  </View>
);

export default App; 




