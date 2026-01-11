package dev.compila.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Temporary password fixer for development
 * Removes after use by deleting this file
 */
@Component
public class PasswordFixer {

    @Bean
    public CommandLineRunner fixPasswords(JdbcTemplate jdbcTemplate) {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

            // Generate hash for "secret123"
            String hash = encoder.encode("secret123");
            System.out.println("Generated hash for 'secret123': " + hash);

            jdbcTemplate.update("UPDATE users SET password_hash = ? WHERE email = ?", hash, "admin@compila.dev");
            System.out.println("✓ Password updated for admin@compila.dev -> secret123");

            jdbcTemplate.update("UPDATE users SET password_hash = ? WHERE email = ?", hash, "joao@compila.dev");
            System.out.println("✓ Password updated for joao@compila.dev -> secret123");

            jdbcTemplate.update("UPDATE users SET password_hash = ? WHERE email = ?", hash, "test@compila.dev");
            System.out.println("✓ Password updated for test@compila.dev -> secret123");

            jdbcTemplate.update("UPDATE users SET password_hash = ? WHERE email = ?", hash, "maria@compila.dev");
            System.out.println("✓ Password updated for maria@compila.dev -> secret123");

            jdbcTemplate.update("UPDATE users SET password_hash = ? WHERE email = ?", hash, "pedro@compila.dev");
            System.out.println("✓ Password updated for pedro@compila.dev -> secret123");

            System.out.println("=== All passwords set to: secret123 ===");
        };
    }
}
