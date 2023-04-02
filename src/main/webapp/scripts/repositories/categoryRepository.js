import { Category } from '../model/category.js';
import fetch from 'node-fetch';

class CategoryRepository {
    constructor() {
        this.categories = [];
    }

    async downloadCategories() {
        const url = `https://opentdb.com/api_category.php`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { trivia_categories } = await response.json();
            this.categories = trivia_categories.map(category => new Category(category.id, category.name));
            return this.categories;
        } catch (error) {
            throw new Error(`Failed to download categories: ${error}`);
        }
    }

    getCategories() {
        return this.categories;
    }

    setCategories(categories) {
        this.categories = categories;
    }

    toString() {
        return `CategoryRepository{categories=${this.categories}}`;
    }
}

export { CategoryRepository };
