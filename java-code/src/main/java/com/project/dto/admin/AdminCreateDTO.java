package com.project.dto.admin;

import lombok.Data;

@Data
public class AdminCreateDTO {

    private String account;

    private String password;

    private String nickname;

    private String role;

    private String avatar;
}
