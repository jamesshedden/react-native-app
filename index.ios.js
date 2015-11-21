/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let DB = require('./db.js');
let DBEvents = require('react-native-db-models').DBEvents;

DBEvents.on('all', function(){
  // console.log('Database changed');
});

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
    this.props.navigator.push({id: 2});
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

  _navigateToEditView(setId) {
    DB.sets.get_id(setId, (data) => {
      this.props.navigator.push({id: 2, set: data});
    })
  },

  _getSets() {
    let sets = [];

    // Get all current saved sets
    DB.sets.get_all((data) => {
      // Map over what we get back, and put in our own `sets` array
      Object.keys(data.rows).map((row) => {
        sets.push({
          name: data.rows[row].name,
          id: data.rows[row]._id,
        });
      });

      // Loop over that array to create some elements
      let setsRows = sets.map((set) => {
        return (
          <TouchableOpacity style={styles.optionTextContainer}
          onPress={this._navigateToEditView.bind(this, set.id)}>
            <Text style={styles.optionText}>
              {set.name}
            </Text>
          </TouchableOpacity>
        );
      });

      this.setState({sets: setsRows});
    });
  },

  componentWillMount() {
    this._getSets();
  },

  componentDidMount() {
    this._getSets();
  },

  componentDidUpdate() {
    setTimeout(() => {
      this._getSets();
    });
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>What are you doing today?</Text>
        <TouchableOpacity onPress={this._handlePress}
        style={styles.buttonContainer}>
          <Text style={styles.button}>Not sure, you choose</Text>
        </TouchableOpacity>

        <View style={styles.options}>
          {this.state.sets}
        </View>
      </View>
    )
  },
});

let ChoicePage = React.createClass({
  _handlePress() {
    this.props.navigator.pop();
  },

  getInitialState(){
    let options, setName;

    if (this.props.set) {
      options = this.props.set[0].options;
      setName = this.props.set[0].name;
    } else {
      options = [];
      setName = '';
    }

  	return ({
      choice: [],
      set: this.props.set,
      options,
      setName,
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
    this._buildOptions();
  },

  // <Text style={styles.welcome}>How about doing some {this.state.choice}?</Text>
  // <TouchableOpacity onPress={this._handlePress}
  // style={styles.buttonContainer}>
  //   <Text style={styles.button}>Sounds good!</Text>
  // </TouchableOpacity>

  _buildOptions() {
    if (this.state.options.length) {
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
    }
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
    this.setState({options, optionText: ''});
    this._buildOptions();
  },

  _submitSet() {
    if (this.state.set) {
      DB.sets.update(
        {
          _id: this.state.set[0]._id,
        },
        {
          name: this.state.setName,
          options: this.state.options,
        },
        this._handlePress
      );
    } else {
      if (this.state.setName !== '' && this.state.options.length) {
        DB.sets.add({
          name: this.state.setName,
          options: this.state.options
        }, this._handlePress);
      } else {
        // Something that happens when we don't have
        // the required info?
      }
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.textInput}
        onChangeText={(setName) => this.setState({setName})}
        value={this.state.setName}
        placeholder='Title eg Dinner'/>

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
    marginTop: 10,
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
    marginTop: 10,
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
