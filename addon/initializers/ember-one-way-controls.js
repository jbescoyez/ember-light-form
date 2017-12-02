import Ember from 'ember';
import OneWayInput from 'ember-one-way-controls/components/one-way-input';

const { get } = Ember;

OneWayInput.reopen({
  didInsertElement() {
    this._super(...arguments);

    if( get(this, 'autofocus') ) { this.element.focus(); }
  }
});

export function initialize() {}

export default { initialize };
