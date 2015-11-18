/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let DB = require('./db.js');
let DBEvents = require('react-native-db-models').DBEvents;

DBEvents.on('all', function(){
  console.log('Database changed');
})

let {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Navigator,
  AsyncStorage
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

let WelcomePage = React.createClass({
  getInitialState(){
  	return ({
      choices: null,
    });
	},

  _handlePress() {
    this.props.navigator.push({id: 2,});
  },

  _getChoices() {
    DB.choices.get_all((data) => {
      let choicesRows = Object.keys(data.rows).map((row) => {
        return <Text style={styles.row}>{row}</Text>;
      });

      this.setState({
        choices: choicesRows,
      });
    });
  },

  componentWillMount() {
    this._getChoices();
  },

  componentDidMount() {
    this._getChoices();
  },

  componentDidUpdate() {
    setTimeout(() => {
      this._getChoices();
    });
  },

  render() {
    var choices = this.state.choices;
    // console.log(Object.keys(this.state.choices));

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>What are you doing today?</Text>
        <TouchableOpacity onPress={this._handlePress}
        style={styles.buttonContainer}>
          <Text style={styles.button}>Not sure, you choose</Text>
        </TouchableOpacity>
        <View style={styles.rows}>{this.state.choices}</View>
       </View>
    )
  },
});

let ChoicePage = React.createClass({
  _handlePress() {
    this.props.navigator.pop();
  },

  getInitialState(){
  	return ({
      choice: '',
    });
	},

  _chooseActivity() {
    let activities = ['music', 'illustration'];
    return activities[Math.floor(Math.random() * activities.length)];
  },

  _addChoice() {
    DB.choices.add({
      name: this._chooseActivity(),
    }, (data) => {
      this.setState({
        choice: data.name,
      });
    });
  },

  componentDidMount() {
    this._addChoice();
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>How about doing some {this.state.choice}?</Text>
        <TouchableOpacity onPress={this._handlePress}
        style={styles.buttonContainer}>
          <Text style={styles.button}>Sounds good!</Text>
        </TouchableOpacity>
       </View>
    )
  },
});

let reactNativeProject = React.createClass({
  _renderScene(route, navigator) {
    if (route.id === 1) {
      return <WelcomePage navigator={navigator} />
    } else if (route.id === 2) {
      return <ChoicePage navigator={navigator} />
    }
  },

  _configureScene(route) {
    return Navigator.SceneConfigs.HorizontalSwipeJump;
  },

  render() {
    return (
      <Navigator initialRoute={{id: 1, }}
      style={styles.navigator}
      renderScene={this._renderScene}
      configureScene={this._configureScene} />
    );
  }
});

let styles = StyleSheet.create({
  navigator: {
    flex: 1,
    backgroundColor: 'gold',
  },
  buttonContainer: {
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    backgroundColor: 'orangered',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'orangered',
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

AppRegistry.registerComponent('reactNativeProject', () => reactNativeProject);
