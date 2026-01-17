package dev.compila.social.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Sealed interface replacement for post metadata with type-safe implementations.
 * Each post type can have its specific metadata structure.
 * Using a base class with discriminators instead of sealed interface for JPA compatibility.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostMetadata {
    @JsonProperty("type")
    private String type;

    @JsonProperty("challengeId")
    private String challengeId;

    @JsonProperty("challengeTitle")
    private String challengeTitle;

    @JsonProperty("xpGained")
    private Integer xpGained;

    @JsonProperty("challengeSlug")
    private String challengeSlug;

    @JsonProperty("badgeId")
    private String badgeId;

    @JsonProperty("badgeName")
    private String badgeName;

    @JsonProperty("badgeIcon")
    private String badgeIcon;

    @JsonProperty("badgeDescription")
    private String badgeDescription;

    @JsonProperty("technologies")
    private List<String> technologies;

    @JsonProperty("availability")
    private String availability;

    @JsonProperty("duration")
    private String duration;

    @JsonProperty("timezone")
    private String timezone;

    @JsonProperty("title")
    private String title;

    @JsonProperty("description")
    private String description;

    @JsonProperty("url")
    private String url;

    // Default constructor
    public PostMetadata() {
    }

    // Private constructor for factory methods
    private PostMetadata(String type) {
        this.type = type;
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getChallengeId() { return challengeId; }
    public void setChallengeId(String challengeId) { this.challengeId = challengeId; }

    public String getChallengeTitle() { return challengeTitle; }
    public void setChallengeTitle(String challengeTitle) { this.challengeTitle = challengeTitle; }

    public Integer getXpGained() { return xpGained; }
    public void setXpGained(Integer xpGained) { this.xpGained = xpGained; }

    public String getChallengeSlug() { return challengeSlug; }
    public void setChallengeSlug(String challengeSlug) { this.challengeSlug = challengeSlug; }

    public String getBadgeId() { return badgeId; }
    public void setBadgeId(String badgeId) { this.badgeId = badgeId; }

    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }

    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }

    public String getBadgeDescription() { return badgeDescription; }
    public void setBadgeDescription(String badgeDescription) { this.badgeDescription = badgeDescription; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    // Factory methods for specific types
    public static PostMetadata challengeCompleted(String challengeId, String challengeTitle, int xpGained) {
        PostMetadata metadata = new PostMetadata("CHALLENGE_COMPLETED");
        metadata.challengeId = challengeId;
        metadata.challengeTitle = challengeTitle;
        metadata.xpGained = xpGained;
        return metadata;
    }

    public static PostMetadata achievement(String badgeId, String badgeName, String badgeIcon) {
        PostMetadata metadata = new PostMetadata("ACHIEVEMENT");
        metadata.badgeId = badgeId;
        metadata.badgeName = badgeName;
        metadata.badgeIcon = badgeIcon;
        return metadata;
    }

    public static PostMetadata pairRequest(List<String> technologies, String availability, String duration) {
        PostMetadata metadata = new PostMetadata("PAIR_REQUEST");
        metadata.technologies = technologies;
        metadata.availability = availability;
        metadata.duration = duration;
        return metadata;
    }

    public static PostMetadata generic(String title, String description) {
        PostMetadata metadata = new PostMetadata("GENERIC");
        metadata.title = title;
        metadata.description = description;
        return metadata;
    }

    public static PostMetadata empty() {
        return new PostMetadata("EMPTY");
    }
}
