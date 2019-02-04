# @tomko/lt-monkberry

Lesser Than Monkberry.

This package helps to use the [monkberry](https://github.com/antonmedv/monkberry) template engine as a library. It provides a modified API `render` and a special directive `:ref` which exposes DOM elements.

## Install

```bash
npm install monkberry @tomko/lt-monkberry
```

## How to use

A `template.monk` file:

```html
<form>
  <input type="text" :ref="myInput">
  <button type="submit">Click here</button>
</form>
```

Some JavaScript code:

```js
import { render } from "@tomko/lt-monkberry"

const template = require("./template.monk")

let view = render(template)
let formEl = view.rootEl()
document.body.appendChild(formEl)

formEl.addEventListener("submit", ev => {
  let inputEl = view.ref("myInput")
  console.log("Submit:", inputEl.value)
})
```

## The modified API

The `render` function no longer takes a `parentElement` parameter, and it returns a modified `LtMonkberryView` object.

The additional API of `LtMonkberryView`:

* `view.rootEl()` returns the single root DOM `Element` of the template. If there is zero or several root elements, an `Error` is thrown.
* `view.ref("myRefName")` returns the single DOM `Element` that is referenced by the directive `:ref="myRefName"`. If there is zero or several matched elements, an `Error` is thrown.
* `view.references` is an object of type `LtMonkberryReferences`.

The type `LtMonkberryReferences`: each reference name in the template is a property name, with a list of DOM elements as value. For example:

```html
<form>
  <input type="text" :ref="myInput">
  <input type="text" :ref="myInput">
  <button type="submit" :ref="btn">Click here</button>
</form>
```

```js
import { render } from "@tomko/lt-monkberry"
let view = render(require("./template.monk"))
console.log(view.references) // {"myInput": [-dom-input-1-, -dom-input-2-], "btn": [-dom-button-1-]}
```
