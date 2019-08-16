import React from 'react';
import { StyleSheet, Animated,  View, Dimensions,} from 'react-native';
import UColor from '../utils/Colors'

var styles = StyleSheet.create({
    background: {
        backgroundColor: UColor.baseline,
        height: 5,
        overflow: 'hidden'
    },
    fill: {
        backgroundColor: '#3B80F4',
        height: '100%',
    }
});

export default class ProgressBar extends React.Component {
    
    constructor(props){
        super(props)
    }

    state  ={
      progress: new Animated.Value(0)
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.progress >= 0 && this.props.progress != prevProps.progress) {
        Animated.timing(this.state.progress, {
          toValue: parseInt(this.props.progress),
          duration: 100
        }).start()
      }
    }
    
    render() {
      return (
        <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
          <Animated.View style={[styles.fill,{width:this.state.progress}]}></Animated.View>
        </View>
      );
    }
}


