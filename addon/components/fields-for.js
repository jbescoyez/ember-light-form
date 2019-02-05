import Form from 'ember-light-form/components/light-form';

const FieldsFor = Form.extend({
  tagName: 'div',
});

FieldsFor.reopenClass({
  positionalParams: ['model']
});

export default FieldsFor;
