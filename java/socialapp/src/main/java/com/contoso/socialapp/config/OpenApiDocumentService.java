package com.contoso.socialapp.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class OpenApiDocumentService {
    private final ObjectMapper jsonMapper = new ObjectMapper();
    private final ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
    private String openApiYaml;
    private Object openApiJson;

    @PostConstruct
    public void loadOpenApi() throws IOException {
        Path openApiPath = Paths.get("").toAbsolutePath()
                .resolve("..")
                .resolve("..")
                .resolve("openapi.yaml")
                .normalize();
        openApiYaml = Files.readString(openApiPath);
        openApiJson = yamlMapper.readValue(openApiYaml, Object.class);
        openApiJson = jsonMapper.convertValue(openApiJson, Object.class);
    }

    public String getOpenApiYaml() {
        return openApiYaml;
    }

    public Object getOpenApiJson() {
        return openApiJson;
    }
}
