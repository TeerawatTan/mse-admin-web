# mse-admin-web

**Use yarn**

1. yarn install
2. yarn dev (For localhost)
3. yarn build (For prod)

**Use API**

1. Set Authorization Token
```javascript
  import {setAuthorizationToken} from "../../api"
  setAuthorizationToken(token: string | null);
```
2. Usage
```javascript
  import api from "../../api"
  const res = await api.{get | post | put | delete}(url: string, config?: AxiosRequestConfig)
```
