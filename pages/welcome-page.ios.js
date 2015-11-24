import {styles} from '../styles.ios.js';
import {DB} from '../db.js';
let React = require('react-native');

let {
  Text,
  TouchableOpacity,
  View,
} = React;

export const WelcomePage = React.createClass({
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

  _makeChoice(setId) {
    DB.sets.get_id(setId, (data) => {
      this.props.navigator.push({id: 3, set: data});
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
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.optionTextContainer}
          onPress={this._makeChoice.bind(this, set.id)}>
            <Text style={styles.optionText}>
              {set.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionTextContainer}
          onPress={this._navigateToEditView.bind(this, set.id)}>
            <Text style={styles.optionText}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.nav}>
          <Text style={styles.navTitle}>Choose</Text>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.options}>
            {this.state.sets}
          </View>

          <TouchableOpacity onPress={this._handlePress}
          style={styles.buttonContainer}>
            <Text style={styles.button}>New set</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  },
});
