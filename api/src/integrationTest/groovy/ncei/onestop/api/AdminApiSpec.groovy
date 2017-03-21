package ncei.onestop.api

import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import io.restassured.RestAssured
import com.atlassian.oai.validator.restassured.SwaggerValidationFilter
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification
import spock.lang.Unroll

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
import static io.restassured.matcher.RestAssuredMatchers.*
import static org.hamcrest.Matchers.*

@Unroll
@ActiveProfiles("integration")
@SpringBootTest(classes = [Application, IntegrationTestConfig], webEnvironment = RANDOM_PORT)
class AdminApiSpec extends Specification {

  @Value('${local.server.port}')
  private String port

  @Value('${server.context-path}')
  private String contextPath

  def setup() {
    def apiDocUrl = new URL("http://localhost:${port}/${contextPath}/v2/api-docs")
    def apiDocJson = new JsonSlurper().parse(apiDocUrl)
    apiDocJson.basePath = contextPath

    RestAssured.baseURI = "http://localhost"
    RestAssured.port = port as Integer
    RestAssured.basePath = contextPath
    RestAssured.filters([
        new SwaggerValidationFilter(JsonOutput.toJson(apiDocJson))
    ])
  }

  def 'rebuilds search index'() {
    expect:
    RestAssured.get('admin/index/search/rebuild')
        .then()
        .body('acknowledged', equalTo(true))
  }

  def 'updates search index'() {
    expect:
    RestAssured.get('admin/index/search/update')
        .then()
        .body('acknowledged', equalTo(true))
  }

  def 'recreates search index'() {
    expect:
    RestAssured.get('admin/index/search/recreate?sure=true')
        .then()
        .body('acknowledged', equalTo(true))
  }

  def 'recreates metadata index'() {
    expect:
    RestAssured.get('admin/index/metadata/recreate?sure=true')
        .then()
        .body('acknowledged', equalTo(true))
  }

}
