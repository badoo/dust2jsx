# dust2jsx

> Create JSX code from Dust template

```html
<header>
  {@Logo name="foo" shadow="true"/}
</header>

{?title}
  <h1 class="title">{title}</h1>
{/title}

{#images}
  <img src="{src}">
{/images}
```

### ➡️

```js
<header>
  <Logo name="foo" shadow="true"/>
</header>

{title ?
  <h1 className="title">{title}</h1>
 : null}

{images.map(item =>
  <img src="{item.src}">
)}
```

## Usage

```js
const dust2jsx = require('dust2jsx');

dust2jsx('<input type="checkbox" {?checked}checked{/checked}/>');
// Outputs: <input type="checkbox" {checked ? 'checked' : ''}/>
```
