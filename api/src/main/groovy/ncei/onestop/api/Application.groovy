package ncei.onestop.api

import java.util.function.Predicate
import static com.google.common.base.Predicates.*
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.support.SpringBootServletInitializer
import org.springframework.context.annotation.Bean
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling
import static springfox.documentation.builders.PathSelectors.*
import springfox.documentation.builders.RequestHandlerSelectors
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spring.web.plugins.Docket
import springfox.documentation.swagger2.annotations.EnableSwagger2

@EnableAsync
@EnableScheduling
@EnableSwagger2
@SpringBootApplication
class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Application)
    }

    static void main(String[] args) {
        SpringApplication.run(Application.class, args)
    }

    @Bean
    Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
          .select()
          .apis(RequestHandlerSelectors.any())
          .paths(paths())
          .build()
    }

    private Predicate<String> paths() {
        return or(
          regex("/metrics.*"),
          regex("/admin.*"),
          regex("/search.*"))
    }
}

