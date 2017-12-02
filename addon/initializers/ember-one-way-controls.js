import { get } from '@ember/object';
import OneWayInput from 'ember-one-way-controls/components/one-way-input';

OneWayInput.reopen({
  didInsertElement() {
    this._super(...arguments);

    if( get(this, 'autofocus') ) { this.element.focus(); }
  }
});

export function initialize() {}

export default { initialize };
