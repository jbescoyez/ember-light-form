import { computed, setProperties, set, get } from '@ember/object';
import { oneWay, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import layout from 'ember-light-form/templates/components/light-field';
import Configuration from './../configuration';

const Field = Component.extend({
  // -- Properties --
  layout,
  classNames: ['light-field'],
  classNameBindings: ['isDisplayingErrors:light-field--with-errors'],
  isEdited: false,
  isErrorDisplayForced: true,
  isTouched: false,
  wasDisplayingErrors: false,

  // -- Computed Properties --
  errors: null,
  hasErrors: notEmpty('errors'),

  isDisplayingErrors: computed(
    'hasErrors',
    'isErrorDisplayForced',
    'isEdited',
    'wasDisplayingErrors',
    'isTouched',
    function() {
      if(!get(this, 'hasErrors')) { return false; }

      if(get(this, 'isErrorDisplayForced')) { return true; }

      if(get(this, 'isEdited')) {
        return get(this, 'wasDisplayingErrors');
      } else {
        return get(this, 'isTouched');
      }
    }
  ),

  controlId: computed(function() {
    return `${this.get('model.constructor.modelName')}-` +
      `${this.get('model.id') || 'new'}-` +
      `${this.get('fieldName')}`;
  }),

  // -- Hooks --
  init(){
    this._super(...arguments);

    this._bindModelErrors();
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if(get(this, '_modelCache') !== get(this, 'model')) { this._resetAttrs(); }
  },

  didReceiveAttrs() {
    this._super(...arguments);

    set(this, '_modelCache', get(this, 'model'));
  },

  // -- Private Instance Methods --
  _bindModelErrors() {
    set(this, 'errors', oneWay(
      `model.${Configuration.errorMessagesPathFor(get(this, 'fieldName'))}`
    ));
  },

  _resetAttrs() {
    setProperties(this, {
      isTouched: false, wasDisplayingErrors: false, isEdited: false
    });
  },

  // -- Actions --
  actions: {
    update(value) {
      set(this, 'isTouched', true);
      set(get(this, 'model'), get(this, 'fieldName'), value);
    },
    enterEditMode() {
      set(this, 'wasDisplayingErrors', get(this, 'isDisplayingErrors'));
      set(this, 'isEdited', true);
    },
    leaveEditMode() {
      set(this, 'isEdited', false);
    }
  }
});

Field.reopenClass({
  positionalParams: ['fieldName']
});

export default Field;
