import axios from 'axios';


export class ApiRequest {
    constructor(URL) {
        this.api = axios.create({
            baseURL: URL,
            timeout: 10000, // 요청 시간 제한 (10초)
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    request(config) {
        return new Promise((resolve, reject) => {
            this.api.request(config)
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    get(endpoint, options) {
        return this.request({
            method: 'get',
            url: endpoint,
            ...options
        });
    }

    post(endpoint, options) {
        return this.request({
            method: 'post',
            url: endpoint,
            ...options
        });
    }

    put(endpoint, options) {
        return this.request({
            method: 'put',
            url: endpoint,
            ...options
        });
    }

    delete(endpoint, options) {
        return this.request({
            method: 'delete',
            url: endpoint,
            ...options
        });
    }
}
