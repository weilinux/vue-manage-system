import type {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from "axios";
import axios from "axios";

const service:AxiosInstance = axios.create({
    timeout: 5000,
})

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
    headers: AxiosRequestHeaders
}

service.interceptors.request.use(
    (config: AdaptAxiosRequestConfig) => {
        let tokenFull = JSON.parse(localStorage.getItem('Token'));
        if (tokenFull != null) {
            config.headers.Authorization = 'Bearer ' + tokenFull.Token
            console.log(tokenFull)
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse)=> {
        if (response.status === 200) {
            return response
        } else {
            return Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);


export default service


// import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
//
// interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
//     headers: AxiosRequestHeaders
// }
//
// export const axiosInstance = axios.create({
//     baseURL: SOME_URL
// });
//
// // Interceptors
// axiosInstance.interceptors.request.use(
//     (config): AdaptAxiosRequestConfig => {
//         return config;
//     },
//     (error): any => {
//         return Promise.reject(error);
//     }
// );
//
// axiosInstance.interceptors.response.use(
//     async (response): Promise<any> => {
//         return response;
//     },
//     async (error): Promise<any> => {
//         return Promise.reject(error);
//     }
// )