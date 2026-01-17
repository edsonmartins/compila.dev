package dev.compila.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProjectRepository extends JpaRepository<UserProject, UUID> {

    List<UserProject> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<UserProject> findByUserIdAndPublicProjectTrueOrderByCreatedAtDesc(UUID userId);

    Optional<UserProject> findByIdAndUserId(UUID id, UUID userId);
}
