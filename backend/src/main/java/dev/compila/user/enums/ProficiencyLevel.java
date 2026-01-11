package dev.compila.user.enums;

/**
 * Proficiency levels for user skills
 */
public enum ProficiencyLevel {
    BEGINNER("Básico", 1),
    INTERMEDIATE("Intermediário", 2),
    ADVANCED("Avançado", 3);

    private final String displayName;
    private final int level;

    ProficiencyLevel(String displayName, int level) {
        this.displayName = displayName;
        this.level = level;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getLevel() {
        return level;
    }
}
