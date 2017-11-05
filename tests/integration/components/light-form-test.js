import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import { find, triggerEvent } from 'ember-native-dom-helpers';

let { get, set } = Ember;
let { Promise } = Ember.RSVP;


const modelStub = (modelName, modelId) => {
  return Ember.Object.create({
    constructor: { modelName: modelName },
    id: modelId,
    validations: { isValid: true },
    validate() { return new Promise((resolve) => { resolve(); }); }
  });
};

const modelWithErrorsStub = (modelName, modelId) => {
  let model = modelStub(modelName, modelId);

  set(model, 'validations', { isValid: false })

  return model;
};

const renderForm = (world) => {
  world.render(
    hbs`
      {{light-form model
        action=action
        onError=onError
        onDestroy=onDestroy
      }}
    `
  );
}

moduleForComponent(
  'light-form', 'Integration | Component | light form', {
    integration: true,
    beforeEach() { set(this, 'model', modelStub('aModel', 'anId')); }
  }
);

test('has "light-form" class', function(assert) {
  renderForm(this);

  assert.ok(find('.light-form'));
});

test(
  'has no "light-form--validating" class after submit',
  async function(assert) {
    renderForm(this);

    await triggerEvent('.light-form', 'submit');

    assert.notOk(find('.light-form--validating'));
  }
);

test(
  'validate on submit',
  function(assert) {
    assert.expect(1);

    const originalModel = get(this, 'model');
    originalModel.validate = () => {
      return new Promise((resolve) => { assert.ok(true); resolve(); });
    }

    renderForm(this);

    triggerEvent('.light-form', 'submit');
  }
);

test(
  'invoke "action" on submit',
  function(assert) {
    assert.expect(1);


    const originalModel = get(this, 'model');
    set(this, 'action', (model) => {
      assert.equal(get(model, 'id'), get(originalModel, 'id'))
    });

    renderForm(this);

    triggerEvent('.light-form', 'submit');
  }
);

test(
  'invoke "onDestroy" when removed from DOM',
  function(assert) {
    assert.expect(1);

    const originalModel = get(this, 'model');
    set(this, 'onDestroy', (model) => {
      assert.equal(model, originalModel);
    });

    renderForm(this);
  }
);

moduleForComponent(
  'light-form', 'Integration | Component | light form with errors', {
    integration: true,
    beforeEach() { set(this, 'model', modelWithErrorsStub()); }
  }
);

test(
  'invoke "onError" on submit',
  function(assert) {
    assert.expect(1);

    const originalModel = get(this, 'model');
    set(this, 'onError', (model) => {
      assert.equal(model, originalModel);
    });

    renderForm(this);

    triggerEvent('.light-form', 'submit');
  }
);

test('has "light-form--validating" class after submit', async function(assert) {
  renderForm(this);

  await triggerEvent('.light-form', 'submit');

  assert.ok(find('.light-form--validating'));
});
