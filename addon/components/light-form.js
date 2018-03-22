import { set, get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import layout from 'ember-light-form/templates/components/light-form';
import { invokeAction } from 'ember-invoke-action';
import Configuration from './../configuration';

const Form = Component.extend({
  layout,
  tagName: 'form',
  classNames: ['light-form'],
  classNameBindings: [
    'isRunning:light-form--running',
    'isValidating:light-form--validating'
  ],
  isValidating:false,
  isRunning: readOnly('submitTask.isRunning'),

  // Component Hooks
  willDestroyElement() {
    invokeAction(this, 'onDestroy', get(this, 'model'));
  },

  // Instance methods
  enterValidationMode() {
    set(this, 'isValidating', true);
  },

  leaveValidationMode() {
    set(this, 'isValidating', false);
  },

  // Events
  submit(event) {
    event.preventDefault();

    this.get('submitTask').perform();
  },

  // Tasks
  submitTask: task(function * () {
    if (typeof get(this, 'model').validate === 'function') {
      this.enterValidationMode();

      yield get(this, 'model').validate();

      if (get(this, `model.${Configuration.isValidPath}`)) {
        yield invokeAction(this, 'action', get(this, 'model'));

        this.leaveValidationMode(this);
      } else {
        invokeAction(this, 'onError', get(this, 'model'));
      }
    } else {
      yield invokeAction(this, 'action', get(this, 'model'));
    }
  }).drop(),
});

Form.reopenClass({
  positionalParams: ['model']
});

export default Form;
