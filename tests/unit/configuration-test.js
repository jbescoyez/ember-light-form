import { module, test } from 'ember-qunit';
import Configuration from 'ember-light-form/configuration';

module('configuration', function() {
  test('isValidPath defaults to "isValid"', function(assert) {
    Configuration.load({});
    assert.equal(Configuration.isValidPath, 'isValid');
  });

  test('it sets isValidPath correctly', function(assert) {
    Configuration.load({ isValidPath: 'validations.isValid' });
    assert.equal(Configuration.isValidPath, 'validations.isValid');
  });

  test('errorMessagePath defaults to "error.FIELD_NAME.validation"', function(assert) {
    Configuration.load({});
    assert.equal(Configuration.errorMessagePath, 'error.FIELD_NAME.validation');
  });

  test('it sets errorMessagePath correctly', function(assert) {
    Configuration.load({ errorMessagePath: 'validations.attrs.FIELD_NAME.messages' });
    assert.equal(Configuration.errorMessagePath, 'validations.attrs.FIELD_NAME.messages');
  });
});

