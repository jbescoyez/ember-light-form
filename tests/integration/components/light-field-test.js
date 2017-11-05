import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import { triggerEvent, find, fillIn } from 'ember-native-dom-helpers';

let { Component } = Ember;

const modelWithErrorsStub = (modelName, modelId) => {
  return Ember.Object.create({
    constructor: { modelName: modelName },
    id: modelId,
    validations: { attrs: { test: { messages: ['errorMessage'] } } }
  });
};

const controlStub = () => {
  return Component.extend({
    tagName: 'input',
    classNames: ['dummy-control'],
    attributeBindings: ['value', 'onblur', 'onfocus', 'oninput', 'onchange']
  });
};

const renderField = (world) => {
  world.register('component:dummy-control', controlStub());

  if (!world.get('fieldName')) { world.set('fieldName', 'test') }

  world.render(
    hbs`{{light-field fieldName
      label=label
      model=model
      isErrorDisplayForced=isErrorDisplayForced
      control=(component 'dummy-control')
    }}`
  );
}

moduleForComponent(
  'light-field', 'Integration | Component | light field', { integration: true }
);

test('has "field" class', function(assert) {
  renderField(this);

  assert.ok(find('.field'));
});

test('has a specific label for the model', function(assert) {
  const modelName = 'modelName';
  const modelId = 'modelId';
  const fieldName = 'modelId';

  this.set('model', modelWithErrorsStub(modelName, modelId));
  this.set('fieldName', fieldName);

  renderField(this);

  assert.ok(find(`.field input#${modelName}-${modelId}-${fieldName}`));
});

test('label is visible if set', function(assert) {
  const label = 'Fooabr';
  this.set('label', label);

  renderField(this);

  assert.ok(find('label').textContent.includes(label));
});

test('model is updated when field is filled in', async function(assert) {
  const fieldName = 'stub';
  const value = 'some text';

  this.set('model', modelWithErrorsStub());
  this.set('fieldName', fieldName);

  renderField(this);

  await fillIn('.dummy-control', value);

  assert.equal(this.get(`model.${fieldName}`), value);
});

moduleForComponent(
  'light-field', 'Integration | Component | light field with errors', {
    integration: true,
    beforeEach() { this.set('model', modelWithErrorsStub()); }
  }
);

test('errors are not displayed by default', function(assert) {
  renderField(this);

  assert.notOk(find('.field').classList.contains('field--with-errors'));
});

test('errors are displayed when forced', function(assert) {
  this.set('isErrorDisplayForced', true);

  renderField(this);

  assert.ok(find('.field').classList.contains('field--with-errors'));
});

test('errors are displayed when control is changed', async function(assert) {
  renderField(this);

  await triggerEvent('.dummy-control', 'change');

  assert.ok(find('.field').classList.contains('field--with-errors'));
});

test('errors are displayed when control is touched and not edited',
  async function(assert) {
    renderField(this);

    await triggerEvent('.dummy-control', 'focus');
    await triggerEvent('.dummy-control', 'input');
    await triggerEvent('.dummy-control', 'blur');

    assert.ok(find('.field').classList.contains('field--with-errors'));
  }
);

test('errors are not displayed when control is edited without errors and then \
  touched',
  async function(assert) {
    renderField(this);

    await triggerEvent('.dummy-control', 'focus');
    await triggerEvent('.dummy-control', 'input');

    assert.notOk(find('.field').classList.contains('field--with-errors'));
  }
);

test('errors are displayed when control is edited with errors',
  async function(assert) {
    renderField(this);

    await triggerEvent('.dummy-control', 'focus');
    await triggerEvent('.dummy-control', 'input');
    await triggerEvent('.dummy-control', 'blur');
    await triggerEvent('.dummy-control', 'focus');

    assert.ok(find('.field').classList.contains('field--with-errors'));
  }
);

test('errors are cleared when model is changed', async function(assert) {
  renderField(this);

  await triggerEvent('.dummy-control', 'change');

  assert.ok(find('.field').classList.contains('field--with-errors'));

  this.set('model', modelWithErrorsStub());

  assert.notOk(find('.field').classList.contains('field--with-errors'));
});
