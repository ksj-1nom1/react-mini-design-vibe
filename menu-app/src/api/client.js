import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

export async function getResult(url, config) {
    const response = await api.get(url, config);
    return response.data.result;
}

export async function postResult(url, body) {
    const response = await api.post(url, body);
    return response.data.result;
}

export async function putResult(url, body) {
    const response = await api.put(url, body);
    return response.data.result;
}

export async function deleteResult(url) {
    const response = await api.delete(url);
    return response.data.result;
}

export function toMessage(error) {
    if (axios.isCancel(error)) return null;
    const data = error.response?.data;
    if (data?.description) return data.description;
    if (data?.detail) return data.detail;
    if (error.response) return `요청이 실패했습니다 (${error.response.status})`;
    return '서버에 연결하지 못했습니다. 8080 포트를 확인해 주세요.';
}
