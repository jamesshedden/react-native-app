var ReactNativeDBModels = require('react-native-db-models');

export const DB = {
  app: new ReactNativeDBModels.create_db('app'),
  choices: new ReactNativeDBModels.create_db('choices'),
  sets: new ReactNativeDBModels.create_db('sets'),
};
