package com.contoso.socialapp.api;

import com.contoso.socialapp.config.OpenApiDocumentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OpenApiController {
    private final OpenApiDocumentService openApiDocumentService;

    public OpenApiController(OpenApiDocumentService openApiDocumentService) {
        this.openApiDocumentService = openApiDocumentService;
    }

    @GetMapping(value = "/openapi.yaml", produces = "text/yaml")
    public ResponseEntity<String> getOpenApiYaml() {
        return ResponseEntity.ok(openApiDocumentService.getOpenApiYaml());
    }

    @GetMapping(value = "/openapi.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Object getOpenApiJson() {
        return openApiDocumentService.getOpenApiJson();
    }

        @GetMapping(value = "/docs", produces = MediaType.TEXT_HTML_VALUE)
        public String getDocs() {
                return """
                                <!DOCTYPE html>
                                <html lang=\"en\">
                                    <head>
                                        <meta charset=\"UTF-8\" />
                                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
                                        <title>Simple Social Media Application API Docs</title>
                                        <link rel=\"stylesheet\" href=\"https://unpkg.com/swagger-ui-dist@5/swagger-ui.css\" />
                                    </head>
                                    <body>
                                        <div id=\"swagger-ui\"></div>
                                        <script src=\"https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js\"></script>
                                        <script>
                                            window.ui = SwaggerUIBundle({
                                                url: '/api/openapi.json',
                                                dom_id: '#swagger-ui',
                                                presets: [SwaggerUIBundle.presets.apis],
                                                layout: 'BaseLayout'
                                            });
                                        </script>
                                    </body>
                                </html>
                                """;
        }
}
