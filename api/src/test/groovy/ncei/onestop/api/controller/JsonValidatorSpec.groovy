package ncei.onestop.api.controller

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.github.fge.jsonschema.core.report.ProcessingReport
import com.github.fge.jsonschema.main.JsonSchema
import com.github.fge.jsonschema.main.JsonSchemaFactory
import groovy.json.JsonSlurper
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class JsonValidatorSpec extends Specification {

    def 'OneStop schema is a valid schema'() {
        when: "The OneStop schemas are validated"
        ObjectMapper mapper = new ObjectMapper()
        JsonNode jsonSchema = mapper.readTree(this.getClass().classLoader.getResource('json-schema-draft4.json').text)
        JsonNode requestSchema = mapper.readTree(this.getClass().classLoader.getResource('onestop-request-schema.json').text)

        final JsonSchemaFactory factory = JsonSchemaFactory.byDefault()
        final JsonSchema schema = factory.getJsonSchema(jsonSchema)

        ProcessingReport globalReport = schema.validate(requestSchema)
        System.out.println(globalReport);

        then: "The validation is successful"
        globalReport.success
    }


    def 'valid requests return success true and no errors'() {
        when: 'valid json is validated'
        def jsonSlurper = new JsonSlurper()
        def params = jsonSlurper.parseText(request)
        def validation = JsonValidator.validateSearchRequestSchema(params)

        then: 'success is true'
        println("validation:${validation}")
        validation.success

        and: 'no errors are returned'
        !validation.errors

        where:
        request << [
          """\
{
}""",
          """\
{
  "queries": [
    {"type": "queryText", "value": "temperature"}
  ]
}""",
          """\
{
  "queries": [
    {"type": "queryText", "value": "temperature"},
    {"type": "queryText", "value": "pressure"}
  ]
}""",
          """\
{
  "filters": [
    {"type": "datetime", "before": "2016-06-15T20:20:58Z", "after": "2015-09-22T10:30:06.000Z"}
  ]
}""",
          """\
{
  "filters": [
    {"type": "facet", "name": "platform", "values": ["Healy"]}
  ]
}""",
          """\
{
  "filters": [
    {"type": "geopoint", "coordinates": {"lat": 22.123, "lon": -45.245}}
  ]
}""",
          """\
{
  "filters": [
    {"type": "bbox", "topLeft": {"lat": 45.99, "lon": -5.99}, "bottomRight": {"lat": 30.01, "lon": 36.49}, "relation": "intersects"}
  ]
}""",
          """\
{
  "filters": [
    {"type": "facet", "name": "platform", "values": ["Healy"]},
    {"type": "datetime", "before": "2016-06-15T20:20:58Z", "after": "2015-09-22T10:30:06.000Z"},
    {"type": "geopoint", "coordinates": {"lat": 22.123, "lon": -45.245}},
    {"type": "bbox", "topLeft": {"lat": 45.99, "lon": -5.99}, "bottomRight": {"lat": 30.01, "lon": 36.49}, "relation": "within"}
  ]
}""",
          """\
{
  "sort": "title",
}""",
          """\
{
  "page": { "number": 42, "size": 10 }
}""",
          """\
{
  "sort": "title",
  "page": { "number": 42, "size": 10 }
}""",
          """\
{
  "queries": [
    {"type": "queryText", "value": "temperature"}
  ],
  "filters": [
    {"type": "facet", "name": "apiso_TopicCategory_s", "values": ["oceans", "oceanography"]},
    {"type": "datetime", "before": "2016-06-15T20:20:58Z", "after": "2015-09-22T10:30:06.000Z"},
    {"type": "geopoint", "coordinates": {"lat": 22.123, "lon": -45.245}}
  ],
  "sort": "title",
  "page": { "number": 42, "size": 10 }
}"""
        ]
    }

    def 'invalid requests return success false and a list of errors'() {
        when: "invalid json is validated"
        def jsonSlurper = new JsonSlurper()
        def params = jsonSlurper.parseText(request)
        def validation = JsonValidator.validateSearchRequestSchema(params)

        then: "success is false"
        println("validation:${validation}")
        !validation.success

        and: 'errors are returned'
        validation.errors instanceof List
        validation.errors.every { it.status == '400' }
        validation.errors.every { it.detail instanceof String }
        validation.errors.every { it.title == "JSON request failed validation" }

        where:
        request << [
          """\
{
  "queries": {
    "queryText": {"value": "temperature", "poo": "xxx"}
  }
}
""",
          """\
{
  "filters": [
    { "type": "datetime", "before": "2012-12-31", "after": "2012-01-01"}
  ]
}""",
          """\
{
  "filters": [
    { "type": "datetime", "before": "2016-06-15T20:20:58Z"}
  ]
}""",
          """\
{
  "filters": [
    { "type": "geopoint", "coordinates": {"lat": -100, "lon": -100}}
  ]
}""",
          """\
{
  "filters": [
    { "type": "geopoint", "coordinates": {"lat": 50, "lon": 200}}
  ]
}""",
          """\
{
  "filters": [
    { "type": "geopoint", "lat": -45.123, "lon": 75.245}
  ]
}""",
          """\
{
  "filters": [
    { "type": "bbox", "topLeft": {"lat": 45.99, "lon": -5.99}, "bottomRight": {"lat": 30.01, "lon": 36.49}}
  ]
}"""
        ]
    }

}