package dev.compila.auth.security.oauth2;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId.toLowerCase()) {
            case "github" -> new GithubOAuth2UserInfo(attributes);
            case "google" -> new GoogleOAuth2UserInfo(attributes);
            default -> throw new IllegalArgumentException("Sorry! Login with " + registrationId + " is not supported yet.");
        };
    }
}
