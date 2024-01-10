const axois = require('axios');
const crypto = require('crypto');

class IyzioClient extends axois.Axios {

    /*
    * @param {string} apiKey 
    * @param {string} secretKey
    * @param {string} baseUrl
    * @return {IyzioClient}
    * */
    constructor(apiKey, secretKey, baseUrl = 'https://api.iyzipay.com') {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.baseUrl = baseUrl;

        super({
            baseURL: baseUrl,
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                'x-iyzi-client-version': 'emirmuminoglu/iyzipay-node-client <PLEASE MAINTAIN YOUR DAMN LIBRARY>',
            }
        });

        this.interceptors.request.use((config) => {
            config.headers = { ...config.headers, ...this.headers(JSON.stringify(config.data)) };
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    /*
    * @param {string} body
    * @return {string}
    */
    static createPkiString(body) {
        var isArray = Array.isArray(body);
        var requestString = '[';
        for (var i in body) {
            var val = body[i];
            if (typeof val !== 'undefined' && typeof val !== 'function') {
                // Eliminate number keys of array elements
                if (!isArray) {
                    requestString += i + '=';
                }
                if (typeof val === 'object') {
                    requestString += createPkiString(val);
                } else {
                    requestString += val;
                }
                requestString += isArray ? ', ' : ',';
            }
        }
        requestString = requestString.slice(0, (isArray ? -2 : -1));
        requestString += ']';
        return requestString;
    }

    /*
    * @param {string}
    * @return {string}
    * */
    static createHash(body) {
        var hash = crypto.createHash('sha1');
        hash.update(body);
        return hash.digest('base64');
    }

    /*
    * @return {string}
    * */
    static createRandomString() {
        return crypto.randomBytes(16).toString('hex');
    }

    /*
    * @param {string}
    * @return {object}
    * */
    static headers(body) {
        let headers = {}
        const randomString = this.createRandomString();
        headers['Authorization'] = 'IYZWS ' + this.apiKey + ':' + this.createHash(this.apiKey + randomString + this.secretKey + this.createPkiString(body));
        headers['x-iyzi-rnd'] = randomString;

        return headers;
    }
}

const defaultClient = new IyzioClient(process.env.IYZIPAY_API_KEY, process.env.IYZIPAY_SECRET_KEY, process.env.IYZIPAY_BASE_URL);

module.exports = defaultClient
module.exports.IyzioClient = IyzioClient