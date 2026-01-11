package dev.compila.social.enums;

/**
 * Types of kudos (developer recognition) that replace traditional likes
 * Each kudo type has a specific meaning in the developer community
 */
public enum KudoType {
    /**
     * 🔥 Impressive or optimized code
     * XP Value: +5
     */
    FIRE,

    /**
     * 🚀 Creative or innovative solution
     * XP Value: +5
     */
    ROCKET,

    /**
     * 💡 Taught me something new / educational
     * XP Value: +3
     */
    LIGHTBULB,

    /**
     * ✨ Clean, well-structured code
     * XP Value: +4
     */
    CLEAN,

    /**
     * 🎯 Answered my question perfectly
     * XP Value: +3
     */
    TARGET,

    /**
     * 🤝 Let's code together / pair programming
     * XP Value: +2
     */
    PAIR;

    /**
     * XP value gained when receiving this kudo
     */
    public int getXpValue() {
        return switch (this) {
            case FIRE, ROCKET -> 5;
            case CLEAN -> 4;
            case LIGHTBULB, TARGET -> 3;
            case PAIR -> 2;
        };
    }

    /**
     * Emoji representation for UI
     */
    public String getEmoji() {
        return switch (this) {
            case FIRE -> "🔥";
            case ROCKET -> "🚀";
            case LIGHTBULB -> "💡";
            case CLEAN -> "✨";
            case TARGET -> "🎯";
            case PAIR -> "🤝";
        };
    }
}
