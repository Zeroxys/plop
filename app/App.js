import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import SoundPlayer from 'react-native-sound-player'

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
      try {
        SoundPlayer.playSoundFile('bubble', 'mp3')
      } catch (e) {
          console.log(`cannot play the sound file`, e)
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
  render() {
    return (
      <View style={styles.scrollView}>
        <DraggableBox />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center"
  },
  box: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    backgroundColor: 'plum',
    borderRadius:100/2
  },
});