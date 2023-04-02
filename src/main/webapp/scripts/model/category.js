import { CategoryRepository } from '../repositories/categoryRepository.js';

class Category {
    constructor(name) {
        this.id = 0;
        this.name = name;
        const categoryRepository = new CategoryRepository();
        categoryRepository.downloadCategories()
            .then(() => {
                for (const category of categoryRepository.getCategories()) {
                    if (category.getName() === this.name) {
                        this.id = category.getId();
                        break;
                    }
                }
            })
            .catch(error => {
                throw new Error(`Failed to download categories: ${error}`);
            });
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setId(id) {
        this.id = id;
    }

    setName(name) {
        this.name = name;
    }

    toString() {
        return `Category{id=${this.id}, name='${this.name}'}`;
    }
}

export { Category };
