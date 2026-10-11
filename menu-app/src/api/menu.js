import { deleteResult, getResult, postResult, putResult } from './client.js';

export async function fetchMenuPage({ page = 1, size = 8, sortBy = 'menuCode', direction = 'desc' }, signal) {
    const result = await getResult('/api/menus/pages/sort', {
        params: { page, size, sortBy, direction }, signal,
    });
    return {
        menus: result.content,
        page: result.number,
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        first: result.first,
        last: result.last,
    };
}

export async function fetchAllMenus(signal) {
    const result = await getResult('/api/menus', { signal });
    return result.menus;
}

export async function searchMenusOverPrice(menuPrice, signal) {
    const result = await getResult('/api/menus/search', { params: { menuPrice }, signal });
    return result.menus;
}

export async function fetchMenu(menuCode, signal) {
    const result = await getResult(`/api/menus/${menuCode}`, { signal });
    return result.menu;
}

export async function createMenu(menu) {
    const result = await postResult('/api/menus', menu);
    return result.menu;
}

export async function updateMenu(menuCode, menu) {
    const result = await putResult(`/api/menus/${menuCode}`, menu);
    return result.menu;
}

export async function removeMenu(menuCode) {
    const result = await deleteResult(`/api/menus/${menuCode}`);
    return result.deletedMenuCode;
}
