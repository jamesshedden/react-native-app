import {styles} from '../styles.ios.js';
import {DB} from '../db.js';
import RNShakeEventIOS from 'react-native-shake-event-ios';

let React = require('react-native');

let {
  Text,
  View,
  TouchableOpacity,
  Animated,
} = React;

export const ChoicePage = React.createClass({
  getInitialState(){
  	return ({
      choice: [],
      set: this.props.set,
      options: this.props.set[0].options,
      setName: this.props.set[0].name,
      fadeAnim: new Animated.Value(0),
    });
	},

  _fadeInChoice() {
    Animated.sequence([
      Animated.timing(
        this.state.fadeAnim,
        {toValue: 0, duration: 0},
      ),
      Animated.timing(
        this.state.fadeAnim,
        {toValue: 1, duration: 500},
      ),
    ]).start();
  },

  componentWillMount() {
    RNShakeEventIOS.addEventListener('shake', this._randomChoice);
  },

  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake');
  },

  componentDidMount() {
    this._randomChoice();
  },

  _randomChoice() {
    this._fadeInChoice();
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
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center'}}>
            <Text style={styles.choiceSetText}>
              {this.state.setName}
            </Text>

            <Animated.Text style={[
              styles.choiceText,
              {opacity: this.state.fadeAnim},
            ]}>
              {this.state.choice}
            </Animated.Text>
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
