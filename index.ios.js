/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import {styles} from './styles.ios.js';
import {ChoicePage} from './pages/choice-page.ios.js';
import {WelcomePage} from './pages/welcome-page.ios.js';
import {SetPage} from './pages/set-page.ios.js';
import {DB} from './db.js';

let React = require('react-native');

let {
  AppRegistry,
  Navigator,
} = React;

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var BaseConfig = Navigator.SceneConfigs.HorizontalSwipeJump;

var CustomLeftToRightGesture = Object.assign({}, BaseConfig.gestures.pop, {
  // Make it snap back really quickly after canceling pop
  snapVelocity: 8,
  // Make it so we can drag anywhere on the screen
  edgeHitWidth: SCREEN_WIDTH,
});

var CustomSceneConfig = Object.assign({}, BaseConfig, {
  // A very tighly wound spring will make this transition fast
  springTension: 100,
  springFriction: 1,
  // Use our custom gesture defined above
  gestures: {
    pop: CustomLeftToRightGesture,
  }
});

let reactNativeProject = React.createClass({
  _renderScene(route, navigator) {
    if (route.id === 1) {
      return <WelcomePage navigator={navigator} />
    } else if (route.id === 2) {
      return <SetPage navigator={navigator} set={route.set}/>
    } else if (route.id === 3) {
      return <ChoicePage navigator={navigator} set={route.set}/>
    }
  },

  _configureScene(route) {
    return Navigator.SceneConfigs.HorizontalSwipeJump;
  },

  render() {
    return (
      <Navigator initialRoute={{id: 1}}
      style={styles.navigator}
      renderScene={this._renderScene}
      configureScene={this._configureScene} />
    );
  }
});

AppRegistry.registerComponent('reactNativeProject', () => reactNativeProject);
