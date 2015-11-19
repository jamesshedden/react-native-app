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
  AsyncStorage,
  TextInput,
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

  _getSets() {
    let sets = [];

    DB.sets.get_all((data) => {
      let choicesRows = Object.keys(data.rows).map((row) => {
        sets.push(data.rows[row].name);
      });
      this.setState({sets});
    });
  },

  componentWillMount() {
    this._getChoices();
    this._getSets();
  },

  componentDidMount() {
    this._getChoices();
    this._getSets();
  },

  componentDidUpdate() {
    setTimeout(() => {
      this._getChoices();
      this._getSets();
    });
  },

  render() {
    var choices = this.state.choices;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>What are you doing today?</Text>
        <TouchableOpacity onPress={this._handlePress}
        style={styles.buttonContainer}>
          <Text style={styles.button}>Not sure, you choose</Text>
        </TouchableOpacity>

        <Text>{this.state.sets}</Text>
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
      choice: [],
      options: [],
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

  // <Text style={styles.welcome}>How about doing some {this.state.choice}?</Text>
  // <TouchableOpacity onPress={this._handlePress}
  // style={styles.buttonContainer}>
  //   <Text style={styles.button}>Sounds good!</Text>
  // </TouchableOpacity>

  _buildOptions() {
    let optionsElements = this.state.options.map((option, index) => {
      return (
        <View style={{flexDirection: 'row'}}>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>
              {option}
            </Text>
          </View>

          <TouchableOpacity style={styles.optionRemoveBtn}
          onPress={this._removeOption.bind(this, index)}>
            <Text style={styles.optionRemoveBtnText}>x</Text>
          </TouchableOpacity>
        </View>
      );
    });
    this.setState({optionsElements});
  },

  _removeOption(index) {
    let options = this.state.options || [];
    options.splice(index, 1);
    this.setState({options});
    this._buildOptions();
  },

  _addOption() {
    let options = this.state.options || [];
    options.push(this.state.optionText);
    this.setState({options});
    this._buildOptions();
  },

  _submitSet() {
    let options = this.state.options || [];
    let setName = this.state.setName || '';

    console.log(options);

    DB.sets.add({
      name: setName,
      options,
    }, this._handlePress);
  },

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.textInput}
        onChangeText={(setName) => this.setState({setName})}
        value={this.state.setName}
        placeholder='Title eg Dinner'
        onSubmitEditing={(a) => console.log(a)}/>

        <TextInput style={styles.textInput}
        onChangeText={(optionText) => this.setState({optionText})}
        value={this.state.optionText}
        placeholder='Option eg Pizza'
        onSubmitEditing={this._addOption}/>

        <View style={styles.options}>
          {this.state.optionsElements}
        </View>

        <TouchableOpacity style={styles.buttonContainer}
        onPress={this._submitSet}>
          <Text style={styles.button}>Submit</Text>
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
    padding: 20,
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
  options: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    backgroundColor: 'orangered',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    borderColor: 'orangered',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  optionText: {
    color: 'gold',
    fontSize: 20,
  },
  optionRemoveBtn: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: 'orangered',
    borderWidth: 1,
    borderStyle: 'solid',
    marginLeft: 5,
  },
  optionRemoveBtnText: {
    color: 'orangered',
    fontSize: 20,
  },
  textInput: {
    borderColor: 'orangered',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    fontSize: 20,
    color: 'orangered',
    marginTop: 10,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

AppRegistry.registerComponent('reactNativeProject', () => reactNativeProject);
