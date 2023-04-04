class Category {

    constructor(id, name) {
        this.id = id;
        this.name = name;
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

class CategoryRepository {
    constructor() {
        this.categories = [];
    }

    async downloadCategories() {
        const xhr = new XMLHttpRequest();
        const url = `https://opentdb.com/api_category.php`;
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const { trivia_categories } = JSON.parse(xhr.responseText);
                        this.categories = trivia_categories.map(category => new Category(category.id, category.name));
                        resolve(this.categories);
                    } else {
                        reject(`Failed to download categories: HTTP error! status: ${xhr.status}`);
                    }
                }
            }.bind(this);

            xhr.onerror = function() {
                reject(`Failed to download categories: ${xhr.statusText}`);
            };

            xhr.open('GET', url, true);
            xhr.send();
        });
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

export { Category };
export { CategoryRepository };
