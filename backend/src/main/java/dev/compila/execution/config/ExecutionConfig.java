package dev.compila.execution.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "code-execution")
public class ExecutionConfig {

    private boolean enabled = true;
    private String dockerImage = "compila/executor:latest";
    private Duration defaultTimeout = Duration.ofSeconds(10);
    private int maxMemoryMb = 256;
    private int maxCpuCores = 1;
    private boolean useDocker = true;
    private String workDir = "/tmp/compila-exec";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getDockerImage() {
        return dockerImage;
    }

    public void setDockerImage(String dockerImage) {
        this.dockerImage = dockerImage;
    }

    public Duration getDefaultTimeout() {
        return defaultTimeout;
    }

    public void setDefaultTimeout(Duration defaultTimeout) {
        this.defaultTimeout = defaultTimeout;
    }

    public int getMaxMemoryMb() {
        return maxMemoryMb;
    }

    public void setMaxMemoryMb(int maxMemoryMb) {
        this.maxMemoryMb = maxMemoryMb;
    }

    public int getMaxCpuCores() {
        return maxCpuCores;
    }

    public void setMaxCpuCores(int maxCpuCores) {
        this.maxCpuCores = maxCpuCores;
    }

    public boolean isUseDocker() {
        return useDocker;
    }

    public void setUseDocker(boolean useDocker) {
        this.useDocker = useDocker;
    }

    public String getWorkDir() {
        return workDir;
    }

    public void setWorkDir(String workDir) {
        this.workDir = workDir;
    }
}
