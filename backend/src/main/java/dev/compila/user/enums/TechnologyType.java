package dev.compila.user.enums;

/**
 * Technology types for user skill stack
 */
public enum TechnologyType {
    // Frontend
    REACT("React", "frontend"),
    VUE("Vue.js", "frontend"),
    ANGULAR("Angular", "frontend"),
    NEXT_JS("Next.js", "frontend"),
    SVELTE("Svelte", "frontend"),
    HTML("HTML", "frontend"),
    CSS("CSS", "frontend"),
    TAILWIND("Tailwind CSS", "frontend"),
    TYPESCRIPT("TypeScript", "frontend"),
    JAVASCRIPT("JavaScript", "frontend"),

    // Backend
    JAVA("Java", "backend"),
    SPRING("Spring Boot", "backend"),
    NODE_JS("Node.js", "backend"),
    PYTHON("Python", "backend"),
    DJANGO("Django", "backend"),
    FLASK("Flask", "backend"),
    FASTAPI("FastAPI", "backend"),
    DOTNET(".NET/C#", "backend"),
    GO("Go", "backend"),
    RUST("Rust", "backend"),
    PHP("PHP", "backend"),
    RUBY("Ruby", "backend"),

    // Mobile
    REACT_NATIVE("React Native", "mobile"),
    FLUTTER("Flutter", "mobile"),
    SWIFT("Swift", "mobile"),
    KOTLIN("Kotlin", "mobile"),
    IONIC("Ionic", "mobile"),

    // DevOps
    DOCKER("Docker", "devops"),
    KUBERNETES("Kubernetes", "devops"),
    AWS("AWS", "devops"),
    AZURE("Azure", "devops"),
    GCP("GCP", "devops"),
    TERRAFORM("Terraform", "devops"),
    ANSIBLE("Ansible", "devops"),
    JENKINS("Jenkins", "devops"),
    GITHUB_ACTIONS("GitHub Actions", "devops"),
    GITLAB_CI("GitLab CI", "devops"),

    // Database
    POSTGRESQL("PostgreSQL", "database"),
    MYSQL("MySQL", "database"),
    MONGODB("MongoDB", "database"),
    REDIS("Redis", "database"),
    ELASTICSEARCH("Elasticsearch", "database"),
    SQLITE("SQLite", "database"),

    // Tools/Other
    GIT("Git", "tools"),
    LINUX("Linux", "tools"),
    FIGMA("Figma", "tools"),
    JIRA("Jira", "tools");

    private final String displayName;
    private final String category;

    TechnologyType(String displayName, String category) {
        this.displayName = displayName;
        this.category = category;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCategory() {
        return category;
    }
}
