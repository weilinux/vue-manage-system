/*
 * 用户管理模块
 */
import request from "../../router/request";

function getUserList(page: number, limit: number) {
    return request({
        url: "/api/users",
        method: "get",
        params: {
            page: page,
            limit: limit
        }
    });
}

function showUser(id: string) {
    return request({
        url: "/api/users/" + id,
        method: "get"
    });
}

function updateUser(id: string, username: string) {
    return request({
        url: "/api/users/" + id,
        method: "put",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        data: {
            UserName: username
        }
    });
}

// //删除
// TODO: 注意这里, request封装获取数据后,前台删除用户之后,页面没有实时更新成功
function delUser(id: string) {
    return request({
        url: "/api/users/" + id,
        method: "delete"
    });
}

//注册
// signupUser(username, password) {
//     return request({
//         url: '/api/signup',
//         method: 'post',
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         data: {
//             UserName: username,
//             Password: password,
//         }
//     })
// }

//查询


// //增加
// addUser(id, username, password) {
//     return request({
//         url: '/api/users',
//         method: 'post',
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         data: {
//             ID: id,
//             UserName: username,
//             Password: password,
//         }
//     })
// }

export {getUserList, showUser, updateUser, delUser};