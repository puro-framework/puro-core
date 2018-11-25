# Puro REST Framework

> In anything at all, perfection is finally attained not when there is
no longer anything to add, but when there is no longer anything to take
away, when a body has been stripped down to its nakedness.

-- Antoine de Saint-Exupéry --

## Introduction

*Puro* is an API-driven REST Framework.

## Principles

- Don't repeat yourself!
- Don't write what you don't have to!

## The CRUD Functions

| CRUD Function | Target                 | HTTP Method | HTTP Status Code |
|---------------|------------------------|-------------|------------------|
| CREATE        | Collection             | POST        |              201 |
| READ          | Resource or Collection | GET         |              200 |
| UPDATE        | Resource               | PUT         |              204 |
| DELETE        | Resource or Collection | DELETE      |              204 |

## HTTP Exceptions

| Exception Class               | HTTP Status Code | HTTP Response Message |
|-------------------------------|------------------|-----------------------|
| HttpException                 |                - | -                     |
| BadRequestHttpException       |              400 | "Bad Request"         |
| AccessDeniedHttpException     |              403 | "Forbidden"           |
| NotFoundHttpException         |              404 | "Not Found"           |
| MethodNotAllowedHttpException |              405 | "Method Not Allowed"  |
| InvalidParameterHttpException |              422 | "Invalid Parameter"   |

## Getting Started

## Define a Controller

```ts
// controllers/HelloController.ts

import { Request } from 'pure/http';
import { Controller } from 'pure/controller';

export class HelloController extends Controller {
  async read(request: Request) {
    return `Hello ${request.user.displayName}!`;
  }
}
```

```
$ curl http://127.0.0.1/v1/hello
```

```json
{
  "status": 200,
  "content": "Hello John!"
}
```

## Under the Hood

![Request - Life Cycle](https://github.com/Wicker25/puro/blob/master/doc/life-cycle.png)

## The Request

TODO

## The Response

TODO

## Authors

* **Giacomo Trudu** - *Creator, Developer* - [Wicker25](https://github.com/Wicker25)

See also the list of [contributors](https://github.com/Wicker25/puro/contributors)
who participated in this project.
