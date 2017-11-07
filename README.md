# fusion-test-utils

Provides test utility functions for FusionJS

---

```sh
yarn add fusion-test-utils
```

### Example

```js
import App from 'fusion-core';
import {mockContext} from 'fusion-test-utils';

const app = new App();
let ctx = mockContext();
await app.simulate(ctx);
// do assertions on ctx
```


#### Browser context

```js
const app = new App();
let ctx = mockContext.browser();
await app.simulate(ctx);
// do assertions on ctx
```

---
