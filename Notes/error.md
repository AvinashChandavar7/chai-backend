### Complete guide for router and Controller with debugging [https://www.youtube.com/watch?v=HqcGLJSORaA]

```bash
 C:\Users\yoyo\OneDrive\Desktop\chai-backend\node_modules\express\lib\router\route.js:211
        throw new Error(msg);
              ^

Error: Route.get() requires a callback function but got a [object Undefined]
    at Route.<computed> [as get] (C:\Users\yoyo\OneDrive\Desktop\chai-backend\node_modules\express\lib\router\route.js:211:15)
    at proto.<computed> [as get] (C:\Users\yoyo\OneDrive\Desktop\chai-backend\node_modules\express\lib\router\index.js:521:19)
    at file:///C:/Users/Avinash/OneDrive/Desktop/chai-backend/src/routes/user.routes.js:10:8
    at ModuleJob.run (node:internal/modules/esm/module_job:217:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
    at async loadESM (node:internal/process/esm_loader:34:7)
    at async handleMainPromise (node:internal/modules/run_main:66:12)

Node.js v20.9.0
[nodemon] app crashed - waiting for file changes before starting...
```

- issue was in asyncHandler.js

```javascript
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
```

- issue was `**return**` key in asyncHandler.js

```javascript
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
```
