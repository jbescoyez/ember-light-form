import { getWithDefault } from '@ember/object';
import { typeOf } from '@ember/utils';

const DEFAULTS = {
  isValidPath: 'isValid',
  errorMessagePath: 'error.FIELD_NAME.validation',
  defaultFieldTemplate: 'defaults/light-field'
};

/**
  Ember Light Form's configuration object.

  To change any of these values, set them on the application's environment
  object, e.g. for :

  ```js
  // config/environment.js
  ENV['ember-light-form'] = {
    isValidPath: 'validations.isValid',
    errorMessagePath: 'validations.attrs.FIELD_NAME.messages'
  };
  ```

  @class Configuration
  @extends Object
  @module ember-light-form/configuration
  @public
*/
export default {
  /**
    The name of the component to be used by default for the field layout.

    @property defaultFieldTemplate
    @readOnly
    @static
    @type String
    @default ''
    @public
  */
  defaultFieldTemplate: DEFAULTS.defaultFieldTemplate,

  /**
    The isValidPath of the application as configured in `config/environment.js`.

    @property isValidPath
    @readOnly
    @static
    @type String
    @default ''
    @public
  */
  isValidPath: DEFAULTS.isValidPath,

  /**
    The errorMessagePath of the application as configured in `config/environment.js`.

    @property errorMessagePath
    @readOnly
    @static
    @type String
    @default ''
    @public
  */
  errorMessagePath: DEFAULTS.errorMessagePath,

  errorMessagesPathFor(fieldName) {
    return this.errorMessagePath.replace('FIELD_NAME', fieldName);
  },

  load(config) {
    for (let property in this) {
      if (this.hasOwnProperty(property) && typeOf(this[property]) !== 'function') {
        this[property] = getWithDefault(config, property, DEFAULTS[property]);
      }
    }
  }
};
