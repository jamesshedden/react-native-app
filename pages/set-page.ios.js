import {styles} from '../styles.ios.js';
import {DB} from '../db.js';
let React = require('react-native');

let {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} = React;

export const SetPage = React.createClass({
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

  _buildOptions() {

      let optionsElements = this.state.options.map((option, index) => {
        return (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>
                {option}
              </Text>
            </View>

            <TouchableOpacity style={styles.editButton}
            onPress={this._removeOption.bind(this, index)}>
              <Text style={styles.editButtonText}>Remove</Text>
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
    if (this.state.optionText === undefined) return false;
    let options = this.state.options || [];
    let optionTextArray = this.state.optionText.split(', ');

    optionTextArray.map((text) => {
      options.push(text);
    });

    this.setState({
      options,
      optionText: ''
    });

    this._buildOptions();
  },

  _renderNavTitle() {
    if (this.state.set) {
      return 'Edit set';
    } else {
      return 'New set';
    }
  },

  _removeSet() {
    DB.sets.remove_id(this.state.set[0]._id, this._handlePress);
  },

  _renderRemoveButton() {
    return (
      <Text style={[styles.navButton, {textAlign: 'right'}]}>
        Bin
      </Text>
    );
  },

  _makeChoice(setId) {
    if (this.state.setName !== '' && this.state.options.length) {
      this.props.navigator.push({id: 3, set: [
        {
          options: this.state.options,
          name: this.state.setName,
        }
      ]});
    }
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
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navButtonContainer}
          onPress={this._handlePress}>
            <Text style={styles.navButton}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.navTitle}>
            {this._renderNavTitle()}
          </Text>

          <TouchableOpacity style={styles.navButtonContainer}
          onPress={this._removeSet}>
            {this.state.set ? this._renderRemoveButton() : null}
          </TouchableOpacity>
        </View>

        <View style={styles.wrapper}>
          <TextInput style={styles.textInput}
          onChangeText={(setName) => this.setState({setName})}
          value={this.state.setName}
          placeholder='Title eg Coin flip'/>

          <TextInput style={styles.textInput}
          onChangeText={(optionText) => this.setState({optionText})}
          value={this.state.optionText}
          placeholder='Options eg Heads, Tails'
          onSubmitEditing={this._addOption}/>

          <ScrollView contentContainerstyle={styles.options} style={{flex: 1}}>
            <View style={styles.scrollViewInner}>
              {this.state.optionsElements}
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.buttonContainer, styles.buttonContainerHollow]}
          onPress={this._submitSet}>
            <Text style={[styles.button, styles.buttonHollow]}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonContainer}
          onPress={this._makeChoice}>
            <Text style={styles.button}>Choose</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
});
