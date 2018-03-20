import Component from '@ember/component';
import layout from 'ember-light-form/templates/components/light-label';

const Label = Component.extend({
  layout,
  tagName: 'label',
  classNames: ['light-field__label'],
  attributeBindings: ['for'],
});

Label.reopenClass({
  positionalParams: ['labelText']
});

export default Label;
