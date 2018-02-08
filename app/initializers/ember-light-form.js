import ENV from '../config/environment';
import Configuration from 'ember-light-form/configuration';

export default {
  name: 'ember-light-form',

  initialize() {
    const config = ENV['ember-light-form'] || {};
    Configuration.load(config);
  }
};
