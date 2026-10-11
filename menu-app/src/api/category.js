import { getResult } from './client.js';

export async function fetchCategories(signal) {
    const result = await getResult('/api/categories', { signal });
    return result.categories;
}

export function onlyChildren(categories) {
    return categories.filter((category) => category.refCategoryCode !== null);
}
