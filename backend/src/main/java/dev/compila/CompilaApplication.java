package dev.compila;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for compila.dev
 */
@SpringBootApplication
@EnableJpaAuditing
public class CompilaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompilaApplication.class, args);
    }
}
