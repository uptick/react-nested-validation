# react-nested-validation

A toolkit for performing nested validation of forms in React. Please find
a [live demo here](https://uptick.github.io/react-nested-validation/).

## Rationale

There is a diverse array of React packages designed to help render
and validate forms. However there was no obvious choice that provided
the following features:

 * Ability to deeply nest forms and collate errors at the top level.
 
 * Allow for complex validation rules.
 
 * Unopinionated about how to render presentational components.
 
We found a need for a light weight validation toolkit that could be
used with a variety of presentational frameworks, and so we made
`react-nested-validation`.

## Design

No components are offered to help render your presentational components.
You are able to render them any way you choose, using any framework.
Three main categories of components are provided:

 * Forms.
 
 * Validator functions.
 
 * React component wrappers.
 
Forms are the main interface for designing both the validation, and
the nested structure of your validation. Forms are ES6 classes that
contain links to nested forms, and allow for methods to be overidden in
order to validate both fields and general form errors.

Validator functions are conveniences for performing common validation
operations, e.g. required fields. Presently there are only two prepackaged
validators: `required` and `emptyWarning`.

The React component wrappers are two higher-order components to help
apply `Form`s to your presentational React comonents. They wrap any
other React component, transforming it into a managed form. A single
prop, `form`, is given to the inner component which contains all the
information not just for the current form, but all nested forms too.

## More to come

While we're working on improving the design documentation, please
take a look at the [live examples](https://uptick.github.io/react-nested-validation/)
for more of an idea how to get started.
