import Component from '@ember/component';
import layout from 'ember-light-form/templates/components/default-field-template';

const DefaultField = Component.extend({
  classNames: ['light-field'],
  classNameBindings: ['field.isDisplayingErrors:light-field--with-errors'],
  layout
})

export default DefaultField;
