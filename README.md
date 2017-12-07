# ember-light-form

This addon provides a flexible framework to manage form states and validations.
It allows to use any form control component (e.g. one-way-controls, ember-power-select,...) .

## Install

```
ember install ember-light-form
```

## Example

```hbs
{{#light-form (changeset post PostValidations) action=(action "createPost") as |f| }}
  {{!-- A basic textfield --}}
  {{f.field 'title' control=f.text}}

  {{!-- A basic textfield with custom label --}}
  {{f.field 'tags' label='Keywords' control=f.text}}

  {{!-- A textarea with custom attributes (here required and placeholder) --}}
  {{f.field 'content' control=(component f.textarea required=true placeholder='Your content')}}

  {{!-- A field with a custom component (here ember-power-select) --}}
  {{#f.field 'author' as |field|}}
    {{field.label}}

    {{#power-select options=authors selected=field.value onchange=field.update as |author|}}
      {{author.name}}
    {{/power-select}}
  {{/f.field}}

  <div class="form-actions">
    <button class="action-button action-button__main">
      {{if f.isRunning "Saving..." "Save"}}
    </button>

    {{link-to 'Cancel' 'index' class="cancel-button"}}
  </div>
{{/light-form}}
```

## Built-in controls

Built-in controls rely on (ember-one-way-controls)[https://github.com/DockYard/ember-one-way-controls/].

The available controls are:

* `f.checkbox` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-checkbox.md])
* `f.color` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.date` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.datetime` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.email` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.file` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.hidden` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.input` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.month` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.number` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.password` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.radio` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-radio.md])
* `f.range` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.search` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.select` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-select.md])
* `f.tel` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.text` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.textarea` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-textarea.md])
* `f.time` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.url` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])
* `f.week` ((doc)[https://github.com/DockYard/ember-one-way-controls/blob/master/docs/one-way-input.md])

## Custom controls

You can use any plug-in control and bind them to ember-light-form fields as illustrated below:

```hbs
{{#f.field 'author' as |field|}}
  {{field.label}}

  {{#power-select options=authors selected=field.value onchange=field.update as |author|}}
    {{author.name}}
  {{/power-select}}
{{/f.field}}
```

The available attributes you can access are:

* `field.value`: the value of the field attribute
* `field.update`: the action that updates of the field attribute
* `field.controlId`: the id of the control (match the label `for` attribute)

