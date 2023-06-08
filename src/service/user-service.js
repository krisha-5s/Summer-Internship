import request from "./request";


const API_URL = "api/user";


const getAllUsers = async (filter) => {
    // book ? pageSize = 1 & pageIndex=0 & keyword=dog
    console.log('keyword' in filter)
    let url;
    if ('keyword' in filter) {
        url = `${API_URL}?pageSize=${filter.pageSize}&pageIndex=${filter.pageIndex}&keyword=${filter.keyword}`;
    }
    else {
        url = `${API_URL}?pageSize=${filter.pageSize}&pageIndex=${filter.pageIndex}`;

    }

    return request.get(url, { filter }).then((res) => {
        return res;
    });
}

const getAllRoles = async () => {
    const url = `${API_URL}/roles`;
    return request.get(url).then((res) => {
        return res;
    });
};

const getById = async (id) => {
    const url = `${API_URL}/byId?id=${id}`;
    return request.get(url).then((res) => {
        return res;
    });
};

const deleteUser = async (id) => {
    const url = `${API_URL}?id=${id}`;
    return request.delete(url).then((res) => {
        return res;
    });
};

const update = async (data) => {
    const url = `${API_URL}`;
    return request.put(url, data).then((res) => {
        return res;
    });
};

const updateProfile = async (data) => {
    const url = `${API_URL}`;
    return request.put(url, data).then((res) => {
        return res;
    });
};

const userService = {
    getAllUsers,
    getAllRoles,
    getById,
    deleteUser,
    update,
    updateProfile,
};

export default userService;
