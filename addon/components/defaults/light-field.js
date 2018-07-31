import Component from '@ember/component';

const DefaultField = Component.extend({
  classNames: ['light-field'],
  classNameBindings: ['field.isDisplayingErrors:light-field--with-errors']
})

export default DefaultField;
