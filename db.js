var ReactNativeDBModels = require('react-native-db-models');

var DB = {
  app: new ReactNativeDBModels.create_db('app'),
  choices: new ReactNativeDBModels.create_db('choices'),
  sets: new ReactNativeDBModels.create_db('sets'),
};

module.exports = DB
