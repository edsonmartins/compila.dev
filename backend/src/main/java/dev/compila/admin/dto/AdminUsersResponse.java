package dev.compila.admin.dto;

import java.util.List;

public record AdminUsersResponse(
    List<AdminUserDTO> content,
    long totalElements
) {}
