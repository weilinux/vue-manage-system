/*
 * 主机管理模块
 */
import request from "../../router/request";
import { HostData } from "./data";

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

const addHost = (host: HostData) => {
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


const updateHost = (host: HostData) => {
    let hostId = host.id.toString()
    return request({
        url: "/api/hosts/" + hostId,
        method: "put",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        data: {
            HostName: host.HostName,
            HostIP: host.HostIP,
            HostPort: host.HostPort
        }
    });
};

const searchHosts = (host: string, page: number, limit: number) => {
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