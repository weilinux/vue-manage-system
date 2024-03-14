/*
 * 主机管理模块
 */
import request from "../../router/request";

const getUserHosts = (page: number, limit: number) => {
    return request({
        url: "/api/users/hosts?",
        method: "get",
        params: {
            page: page,
            limit: limit
        }
    });
};

const delUserHost = (id: string) => {
    return request({
        url: "/api/hosts/" + id,
        method: "delete"
    });
};

const getHost = (id: string) => {
    return request({
        url: "/api/hosts/" + id,
        method: "get"
    });
};

const addHost = (host: any) => {
    return request({
        url: "/api/hosts",
        method: "post",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        data: {
            HostName: host.HostName,
            HostIP: host.HostIP,
            HostPort: host.HostPort
        }
    });
};


const updateHost = (id: string, host: any) => {
    return request({
        url: "/api/hosts/" + id,
        method: "put",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        data: {
            HostName: host.HostName,
            HostIP: host.HostIP,
            HostPort: host.HostPort
        }
    });
};

const searchHosts = (host: any, page: number, limit: number) => {
    return request({
        url: "/api/users/searchhost?",
        method: "get",
        params: {
            host: host,
            page: page,
            limit: limit
        }
    });
};

export {getUserHosts, delUserHost, getHost, addHost, updateHost, searchHosts};