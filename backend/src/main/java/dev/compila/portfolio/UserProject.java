package dev.compila.portfolio;

import dev.compila.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * User project (portfolio) entity
 */
@Entity
@Table(name = "user_projects")
public class UserProject extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Size(max = 300)
    @Column(name = "short_description", length = 300)
    private String shortDescription;

    @Column(name = "project_url", length = 500)
    private String projectUrl;

    @Column(name = "repository_url", length = 500)
    private String repositoryUrl;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column
    private String[] technologies;

    @Column
    private String[] tags;

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(name = "public", nullable = false)
    private Boolean publicProject = true;

    @Column(name = "views_count", nullable = false)
    private Integer viewsCount = 0;

    @Column(name = "likes_count", nullable = false)
    private Integer likesCount = 0;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String[] getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String[] technologies) {
        this.technologies = technologies;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getPublicProject() {
        return publicProject;
    }

    public void setPublicProject(Boolean publicProject) {
        this.publicProject = publicProject;
    }

    public Integer getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(Integer viewsCount) {
        this.viewsCount = viewsCount;
    }

    public Integer getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(Integer likesCount) {
        this.likesCount = likesCount;
    }
}
