import {styles} from '../styles.ios.js';
import {DB} from '../db.js';
let React = require('react-native');

let {
  Text,
  View,
  TouchableOpacity,
} = React;

export const ChoicePage = React.createClass({
  getInitialState(){
  	return ({
      choice: [],
      set: this.props.set,
      options: this.props.set[0].options,
      setName: this.props.set[0].name,
    });
	},

  componentDidMount() {
    this._randomChoice();
  },

  _randomChoice() {
    let choice = this.state.options[Math.floor(Math.random() * this.state.options.length)];
    this.setState({choice});
  },

  _handlePress() {
    this.props.navigator.pop();
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navButtonContainer}
          onPress={this._handlePress}>
            <Text style={styles.navButton}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.navTitle}>
            Your choice
          </Text>

          <View style={styles.navButtonContainer}></View>
        </View>

        <View style={styles.wrapper}>
          <View style={{flex: 1}}>
            <Text>{this.state.setName}</Text>
            <Text>{this.state.choice}</Text>
          </View>

          <TouchableOpacity style={styles.buttonContainer}
          onPress={this._randomChoice}>
            <Text style={styles.button}>Choose again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
});
