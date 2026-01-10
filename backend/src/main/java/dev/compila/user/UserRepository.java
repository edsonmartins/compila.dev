package dev.compila.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.oauthProvider = :provider AND u.oauthId = :oauthId")
    Optional<User> findByOAuthProviderAndOAuthId(@Param("provider") String provider, @Param("oauthId") String oauthId);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u ORDER BY u.xp DESC")
    java.util.List<User> findTopByXpDesc();
}
