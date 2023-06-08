import request from "./request";

const API_URL = "api/order";

const placeOrder = async (order) => {
    const url = `${API_URL}`;
    return request
        .post(url, order)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return Promise.reject(e);
        });
};

const orderService = { placeOrder };

export default orderService;
