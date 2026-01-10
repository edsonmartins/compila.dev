package dev.compila.auth.security.oauth2;

import dev.compila.auth.security.userdetails.UserDetailsImpl;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                registrationId,
                oAuth2User.getAttributes()
        );

        Optional<User> userOptional = userRepository.findByOAuthProviderAndOAuthId(
                registrationId.toUpperCase(),
                oAuth2UserInfo.getId()
        );

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getOauthProvider().equalsIgnoreCase(registrationId)) {
                throw new OAuth2AuthenticationException("Email already signed up with different provider");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(registrationId, oAuth2UserInfo);
        }

        return UserDetailsImpl.build(user);
    }

    private User registerNewUser(String registrationId, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();

        user.setOauthProvider(registrationId.toUpperCase());
        user.setOauthId(oAuth2UserInfo.getId());
        user.setUsername(oAuth2UserInfo.getName().replaceAll("\\s+", "").toLowerCase());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setFullName(oAuth2UserInfo.getName());
        user.setAvatarUrl(oAuth2UserInfo.getImageUrl());
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setLevel(1);
        user.setXp(0L);
        user.setStreakCurrent(0);
        user.setStreakBest(0);

        // Ensure unique username
        String baseUsername = user.getUsername();
        int counter = 1;
        while (userRepository.existsByUsername(user.getUsername())) {
            user.setUsername(baseUsername + counter);
            counter++;
        }

        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setAvatarUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }
}
