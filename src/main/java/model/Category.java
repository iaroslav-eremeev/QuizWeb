package model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import repositories.CategoryRepository;

import javax.persistence.*;
import java.io.IOException;
import java.util.Objects;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "name", nullable = false)
    @NonNull
    private String name;
    @OneToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    public Category(String name) throws IOException {
        CategoryRepository categoryRepository = new CategoryRepository();
        categoryRepository.downloadCategories();
        for (Category category : categoryRepository.getCategories()) {
            if (category.getName().equals(name)) {
                this.id = category.getId();
                this.name = category.getName();
            }
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return id == category.id && Objects.equals(name, category.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
