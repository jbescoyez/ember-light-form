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

  {{!-- A textarea with custom attributes (here class) --}}
  {{f.field 'description' control=(component f.textarea class='light-textarea--description')}}

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
