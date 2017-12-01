import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';

import { find, triggerEvent } from 'ember-native-dom-helpers';

let { get, set } = Ember;
let { Promise } = Ember.RSVP;

const modelStub = (modelName, modelId) => {
  return Ember.Object.create({
    constructor: { modelName: modelName },
    id: modelId,
    isValid: true,
    validate() { return new Promise((resolve) => { resolve(); }); }
  });
};

const modelWithErrorsStub = (modelName, modelId) => {
  let model = modelStub(modelName, modelId);

  set(model, 'isValid', false)

  return model;
};

const renderForm = () => {
  return render(
    hbs`
      {{light-form model
        action=action
        onError=onError
        onDestroy=onDestroy
      }}
    `
  );
}

module('light-form', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    set(this, 'model', modelStub('aModel', 'anId'));
  });

  test('has "light-form" class', async function(assert) {
    await renderForm(this);

    assert.ok(find('.light-form'));
  });

  test(
    'has no "light-form--validating" class after submit',
    async function(assert) {
      await renderForm(this);

      await triggerEvent('.light-form', 'submit');

      assert.notOk(find('.light-form--validating'));
    }
  );

  test(
    'validate on submit',
    async function(assert) {
      assert.expect(1);

      const originalModel = get(this, 'model');
      originalModel.validate = () => {
        return new Promise((resolve) => { assert.ok(true); resolve(); });
      }

      await renderForm(this);

      triggerEvent('.light-form', 'submit');
    }
  );

  test(
    'invoke "action" on submit',
    async function(assert) {
      assert.expect(1);


      const originalModel = get(this, 'model');
      set(this, 'action', (model) => {
        assert.equal(get(model, 'id'), get(originalModel, 'id'))
      });

      await renderForm(this);

      triggerEvent('.light-form', 'submit');
    }
  );

  test(
    'invoke "onDestroy" when removed from DOM',
    async function(assert) {
      assert.expect(1);

      const originalModel = get(this, 'model');
      set(this, 'onDestroy', (model) => {
        assert.equal(model, originalModel);
      });

      await renderForm(this);
    }
  );

  module('with errors', function(hooks) {
    hooks.beforeEach(function() {
      set(this, 'model', modelWithErrorsStub());
    });

    test(
      'invoke "onError" on submit',
      async function(assert) {
        assert.expect(1);

        const originalModel = get(this, 'model');
        set(this, 'onError', (model) => {
          assert.equal(model, originalModel);
        });

        await renderForm(this);

        triggerEvent('.light-form', 'submit');
      }
    );

    test('has "light-form--validating" class after submit', async function(assert) {
      await renderForm(this);

      await triggerEvent('.light-form', 'submit');

      assert.ok(find('.light-form--validating'));
    });
  });
});


