package com.project;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.util.Collections;

/**
 * MyBatis-Plus Code Generator
 * Run this class directly to generate code for the specified tables.
 */
public class CodeGenerator {

    // ===== DB connection =====
    private static final String DB_URL      = "jdbc:mysql://localhost:3306/your_db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai";
    private static final String DB_USERNAME = "your_username";
    private static final String DB_PASSWORD = "your_password";

    // ===== Output =====
    private static final String PROJECT_PATH  = System.getProperty("user.dir");
    private static final String JAVA_PATH     = PROJECT_PATH + "/src/main/java";
    private static final String MAPPER_XML_PATH = PROJECT_PATH + "/src/main/resources/mapper";

    // ===== Package =====
    private static final String PARENT_PACKAGE = "com.project";
    private static final String MODULE_NAME    = "";   // e.g. "user", or "" for no sub-module

    // ===== Tables to generate (comma-separated, or leave empty for all tables) =====
    private static final String[] TABLES = {"your_table"};

    public static void main(String[] args) {
        FastAutoGenerator.create(DB_URL, DB_USERNAME, DB_PASSWORD)
            .globalConfig(builder -> builder
                .author("dev")
                .outputDir(JAVA_PATH)
                .disableOpenDir()
            )
            .packageConfig(builder -> builder
                .parent(PARENT_PACKAGE)
                .moduleName(MODULE_NAME)
                .entity("entity")
                .mapper("mapper")
                .service("service")
                .serviceImpl("service.impl")
                .controller("controller")
                .pathInfo(Collections.singletonMap(OutputFile.xml, MAPPER_XML_PATH))
            )
            .strategyConfig(builder -> builder
                .addInclude(TABLES)
                .addTablePrefix("t_", "tb_")   // strip table prefixes if any
                .entityBuilder()
                    .enableLombok()
                    .enableTableFieldAnnotation()
                    .logicDeleteColumnName("deleted")
                    .build()
                .mapperBuilder()
                    .enableMapperAnnotation()
                    .build()
                .controllerBuilder()
                    .enableRestStyle()
                    .build()
            )
            .templateEngine(new FreemarkerTemplateEngine())
            .execute();
    }
}
