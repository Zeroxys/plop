import React, { Component } from 'react';
import { Animated, StyleSheet, View, TouchableOpacity, Vibration, Text} from 'react-native';
import SoundPlayer from 'react-native-sound-player'
import Icon from 'react-native-vector-icons/MaterialIcons';
import randomColor from 'randomcolor'

import {
  PanGestureHandler, State,
} from 'react-native-gesture-handler';

export class DraggableBox extends Component {
  constructor(props) {
    super(props);
    this._translateX = new Animated.Value(0);
    this._translateY = new Animated.Value(0);

    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX,
            translationY: this._translateY,
          },
        },
      ],
      { useNativeDriver: false }
    );

  }

  onHandlerStateEvent = e => {
    if(e.nativeEvent.oldState == State.ACTIVE) {
      Animated.timing(this._translateX, {toValue:0, duration: 250, useNativeDriver:true}).start()
      Animated.timing(this._translateY, {toValue:0, duration: 250, useNativeDriver:true}).start()
      this.props.setBackgroundColor()
      this.props.setScore()
      if(this.props.isVibrate){
        Vibration.vibrate()
      }


      if(this.props.isMute) {
        try {
          SoundPlayer.playSoundFile('bubble', 'mp3')
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        }
      }

    }

    
  }

  render() {
    return (
      <PanGestureHandler
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this.onHandlerStateEvent}
        >

        <Animated.View
          style={[
            styles.box,
            {
              backgroundColor:this.props.circleColor
            },
            {
              transform: [
                { translateX: this._translateX },
                { translateY: this._translateY },
              ],
            },
            this.props.boxStyle,
          ]}
        />
      </PanGestureHandler>
    );
  }
}



export default class Example extends Component {

  constructor(props) {
    super(props)
    this.state = {
      setVolume : true,
      setVibrate : true,
      backgroundMainColor : randomColor(),
      circleColor : randomColor(),
      score : 0
    }
  }

  muteVolume = () => {
    this.setState({setVolume: !this.state.setVolume})
  }

  cancelVibrate = () => {
    this.setState({setVibrate: !this.state.setVibrate})
  }
 
  setBackground = () => {
    let random = randomColor()
    this.setState({backgroundMainColor : random, circleColor:randomColor()})
  }

  setScore = () => {
    this.setState({score : this.state.score + 1})
  }

  render() {
    return (
      <View style={[styles.mainContent, {backgroundColor:this.state.backgroundMainColor}]}>
        
        <View style={{position:"absolute", top:20, right:30, height:80, justifyContent:"space-between"}}>
          <TouchableOpacity onPress={this.cancelVibrate}>
            <Icon name="vibration" size={30} color={this.state.setVibrate ? "lightgray": "black"}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.muteVolume}>
            <Icon name={this.state.setVolume ? "volume-up" : "volume-off"} size={30} color={this.state.setVolume ? "lightgray" : "black"} />
          </TouchableOpacity>
        </View>


        <View style={{position:"absolute", top:"7%"}}>
            <Text style={{color:"lightgray", fontWeight:"bold", fontSize:20}}>{`Plop! Score: ${this.state.score}`}</Text>
        </View>


        <DraggableBox
          setScore = {this.setScore}
          circleColor = {this.state.circleColor}
          setBackgroundColor={this.setBackground}
          isVibrate={this.state.setVibrate}
          isMute={this.state.setVolume}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center"
  },
  box: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    //backgroundColor: randomColor(),
    borderRadius:100/2
  },
});