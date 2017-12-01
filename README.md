# ember-light-form

This addon provides a flexible framework to manage form states and validations.
It allows to use any form control component (e.g. one-way-controls, ember-power-select,...) .

## Example

```hbs
{{#light-form (changeset post PostValidations) action=(action "createPost") as |f| }}
  {{f.field "title" label="Title" control=(component f.text autofocus=true)}}
  {{f.field "description" label="Description" control=f.textarea}}

  <div class="form-actions">
    <button class="action-button action-button__main">
      {{if f.isRunning "Saving..." "Save"}}
    </button>

    {{link-to 'Cancel' 'index' class="cancel-button"}}
  </div>
{{/light-form}}
```
