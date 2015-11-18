var ReactNativeDBModels = require('react-native-db-models');

var DB = {
  app: new ReactNativeDBModels.create_db('app'),
  choices: new ReactNativeDBModels.create_db('choices'),
};

module.exports = DB
