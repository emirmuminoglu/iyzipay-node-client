# iyzipay-node-client

**This is an unofficial library. Use at your own risk**

Node client for iyzipay. 

### Features
* Compatible with edge environment
* Compatible with Next.js /app directory 
* Extends AxiosInstance, build your own requests. This library is only for auth headers 
* Defualt client uses IYZIPAY_API_KEY, IYZIPAY_SECRET_KEY and IYZIPAY_BASE_URL environment variables

### Examples

Default client:
```js
const iyzico = require("iyzipay-node-client")

iyzico.post(...)
```

Custom client:
```js
const { IyzicoClient } = require("iyzipay-node-client")

const iyzico = new IyzicoClient("<api-key>", "<api-secret>", "<base-url>")

iyzico.post(...)
```


