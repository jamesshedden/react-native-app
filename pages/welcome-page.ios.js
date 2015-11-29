import {styles} from '../styles.ios.js';
import {DB} from '../db.js';
let React = require('react-native');

let {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} = React;

const WelcomePageContent = React.createClass({
  render() {

    if (this.props.sets && this.props.sets.length) {
      return (
        <View style={styles.wrapper}>
          <ScrollView contentContainerstyle={styles.options}>
            <View style={styles.scrollViewInner}>
              {this.props.sets}
            </View>
          </ScrollView>

          <TouchableOpacity onPress={this.props._toEditView}
          style={styles.buttonContainer}>
            <Text style={styles.button}>New set</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.wrapper}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 30, marginBottom: 10, color: 'orangered'}}>
            Let's get started!
          </Text>
          <TouchableOpacity onPress={this.props._toEditView}
          style={styles.buttonContainer}>
            <Text style={styles.button}>Add your first set</Text>
          </TouchableOpacity>
        </View>
        </View>
      );
    }
  },
});

export const WelcomePage = React.createClass({
  getInitialState(){
  	return ({ choices: null });
	},

  _toEditView() {
    this.props.navigator.push({id: 2});
  },

  _getChoices() {
    DB.choices.get_all((data) => {
      let choicesRows = Object.keys(data.rows).map((row) => {
        return <Text style={styles.row}>{row}</Text>;
      });

      this.setState({ choices: choicesRows });
    });
  },

  _toViewWithData(set, view) {
    DB.sets.get_id(set, (data) => {
      this.props.navigator.push({
        id: view,
        set: data,
      });
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
          onPress={this._toViewWithData.bind(this, set.id, 3)}>
            <Text style={styles.optionText}>
              {set.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}
          onPress={this._toViewWithData.bind(this, set.id, 2)}>
            <Text style={styles.editButtonText}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        );
      });

      this.setState({ sets: setsRows });
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
          <Text style={styles.navTitle}>wisechoice</Text>
        </View>

        <WelcomePageContent
        sets={this.state.sets}
        _toEditView={this._toEditView}></WelcomePageContent>
      </View>
    )
  },
});
