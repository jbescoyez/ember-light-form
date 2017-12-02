import Component from '@ember/component';
import EmberObject, { set, get } from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { triggerEvent, find, fillIn, waitUntil }
  from 'ember-native-dom-helpers';

const modelWithErrorsStub = (modelName, modelId) => {
  return EmberObject.create({
    constructor: { modelName: modelName },
    id: modelId,
    error: { test: { validation: ['errorMessage'] } }
  });
};

const controlStub = () => {
  return Component.extend({
    tagName: 'input',
    classNames: ['dummy-control'],
    attributeBindings: ['value', 'onblur', 'onfocus', 'oninput', 'onchange'],
    input(event) { get(this, 'update')(event.target.value); },
    change(event) { get(this, 'update')(event.target.value); }
  });
};

const renderField = function () {
  this.owner.register('component:dummy-control', controlStub());

  if (!get(this, 'fieldName')) { set(this, 'fieldName', 'test') }

  return render(
    hbs`
    {{light-field fieldName
      label=label
      model=model
      isErrorDisplayForced=isErrorDisplayForced
      control=(component 'dummy-control')
    }}`
  );
}

module('light-field', function(hooks) {
  setupRenderingTest(hooks);

  test('has "light-field" class', async function(assert) {
    await renderField.call(this);
    assert.ok(find('.light-field'));
  });

  test('has a specific id for the model', async function(assert) {
    const modelName = 'modelName';
    const modelId = 'modelId';
    const fieldName = 'fieldName';

    set(this, 'model', modelWithErrorsStub(modelName, modelId));
    set(this, 'fieldName', fieldName);

    await renderField.call(this);

    assert.ok(find(`.light-field input#${modelName}-${modelId}-${fieldName}`));
  });

  test('label is visible if set', async function(assert) {
    const label = 'Foobar';
    set(this, 'label', label);

    await renderField.call(this);

    assert.ok(find('label').textContent.includes(label));
  });

  test('model is updated when field is filled in', async function(assert) {
    const fieldName = 'stub';
    const value = 'some text';

    set(this, 'model', modelWithErrorsStub());
    set(this, 'fieldName', fieldName);

    await renderField.call(this);

    await fillIn('.dummy-control', value);

    assert.equal(get(this, `model.${fieldName}`), value);
  });

  module('with errors',function(hooks) {

    hooks.beforeEach(function () {
      set(this, 'model', modelWithErrorsStub());
    });

    test('errors are not displayed by default', async function(assert) {
      await renderField.call(this);

      assert.notOk(
        find('.light-field').classList.contains('light-field--with-errors')
      );
    });

    test('errors are displayed when forced', async function(assert) {
      set(this, 'isErrorDisplayForced', true);

      await renderField.call(this);

      assert.ok(
        find('.light-field').classList.contains('light-field--with-errors')
      );
    });

    test('errors are displayed when control is changed', async function(assert) {
      await renderField.call(this);

      await triggerEvent('.dummy-control', 'change');

      assert.ok(
        find('.light-field').classList.contains('light-field--with-errors')
      );
    });

    test('errors are displayed when control is touched and not edited',
      async function(assert) {
        await renderField.call(this);

        await triggerEvent('.dummy-control', 'focus');
        await triggerEvent('.dummy-control', 'input');
        await triggerEvent('.dummy-control', 'blur');

        assert.ok(
          find('.light-field').classList.contains('light-field--with-errors')
        );
      }
    );

    test('errors are not displayed when control is edited without errors and then \
      touched',
      async function(assert) {
        await renderField.call(this);

        await triggerEvent('.dummy-control', 'focus');
        await triggerEvent('.dummy-control', 'input');

        assert.notOk(
          find('.light-field').classList.contains('light-field--with-errors')
        );
      }
    );

    test('errors are displayed when control is edited with errors',
      async function(assert) {
        await renderField.call(this);

        await triggerEvent('.dummy-control', 'focus');
        await triggerEvent('.dummy-control', 'input');
        await triggerEvent('.dummy-control', 'blur');
        await triggerEvent('.dummy-control', 'focus');

        assert.ok(
          find('.light-field').classList.contains('light-field--with-errors')
        );
      }
    );

    test('errors are cleared when model is changed', async function(assert) {
      await renderField.call(this);

      await triggerEvent('.dummy-control', 'change');

      assert.ok(find('.light-field').classList.contains('light-field--with-errors'));

      set(this, 'model', modelWithErrorsStub('test 2', 123));

      await triggerEvent('.dummy-control', 'change');

      await waitUntil(() => {
        return !find('.light-field').classList.contains('light-field--with-errors');
      });

      assert.notOk(
        find('.light-field').classList.contains('light-field--with-errors')
      );
    });
  });
});
