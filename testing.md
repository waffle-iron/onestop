# OneStop Testing Strategy

The following outlines our strategy for testing OneStop


## Table of contents
1. [Types](#types-of-tests)
1. [Structure](#testing-Structure)
  2. [Unit Tests](#unit-tests)
    3. [Sociable](#sociable-unit-testing)
    4. [Solitary](#solitary-unit-testing)
  5. [Integration](#integration-tests)
    6. [Gateway](#gateway-integrations-tests)
    7. [Persistence](#persistence-integrations-tests)
2. [Test types](#types-of-tests)

## Types of Tests
1. [Unit](#unit-tests): Exercise the smallest piece of testable software within
the application to see if it behaves as expected
1. [Integration](#integration-tests): Model interactions between components and
verify communication paths to detect interface defects
1. [Component](#component-tests): Test a portion of the system by using
doubles/stubs to isolate that portion (component) from the others
1. [Contract](#contract-tests): Verify interactions with an external service
confirming it meets the contract expected by a consuming service
2. [End-to-end](#end-to-end-tests): Verify that a system meets its business
requirements, testing the entire system from one end to the other
3. [Exploratory](#exploratory-tests): Manually exploring the system in ways
which haven't been covered by tests to understand and improve automated testing
strategies


## Testing Structure
### Unit Tests
Typically written at the class-level or specific to a small group of related
classes. If it's difficult to write a unit test for a discrete measure of some
functionality, this may be a sign that the module under test should be broken
down into smaller, independent pieces.

Unit testing can be broken down into 2 categories:
#### Sociable Unit Testing
Test module behavior through changes in state. Focuses on the unit's interface
treating it as a black box. If behavior manifests as complex calculations,
changes to the state (often represented in the domain) can be the best way to
measure the success of the unit under test.
#### Solitary Unit Testing
Focus on the interactions between an object and its dependencies. Dependencies
are stubbed out to allow the flow of communication to continue as specified by
the test.

Both sociable and solitary unit tests are complementary and help solve different
testing problems. Tests may constrain a unit's implementation so it's beneficial
to keep unit tests small and targeted. If it's still difficult to write or
maintain a unit test, it may be worth questioning the utility of the test in
this case.

### Integration Tests
Test modules as a sub-system to confirm they collaborate effectively to
accomplish a goal. Unlike unit tests, integrations tests use real
communication between units to check assumptions on their interactions.
Granularity of integration tests can vary though generally in a microservice
architecture, tests will verify communications between microservices, data
stores, etc. In short, integration tests can be thought of as "communication
tests" rather than tests for acceptance tests of connected components. With
this in mind, all success/error paths should be covered for a given module.

#### Gateway Integration Tests
Capture communication protocol level errors. Some communications can be
difficult to model, in these cases it can be appropriate to use a stub
version of external components in order to force a failure in predictable ways.

Some tests may rely on certain data being available in different environments.
For this reason, it may be beneficial to agree on a fixed set of harmless but
representative test data.

#### Persistence Integrations Tests
Test that the schema described in the code matches the data in the data store.
Data stores are nearly always accessed via a network therefore tests should
handle timeouts and network failure gracefully.

It can make sense to separate out integration tests in the Continuous
Integration Pipeline. Integrations tests can be supplemented with Unit and
Contract tests ensuring adequate coverage that doesn't present any major
development hurdles in a network outage.

### Component Tests

A component can be defined as any well-encapsulated, replaceable chunk of the
system. Acceptance-testing components is quicker than full E2E tests and still
reasonably tests large swaths of system functionality. Using test doubles can
effectively isolate the component from other parts of the system and also allow
simulation of error cases. In a microservice architecture, the services are the
components and isolation is achieved by using test doubles of other system
components.

If a microservice communicates with collaborators via a network connection,
it's possible to set up the microservice to run in-memory thus removing
network issues from testing concerns. This approach however requires setting
up the microservice to run in a different state. This would exclude any
communication with a datastore however tests on the datastore should be
covered by integration tests. Some embeddable, lightweight solutions for
in-memory datastore tests are provided by Cassandra, Elastic and H2.
Alternatively, a test harness can be used to initialize the test process
with appropriate interacting pieces stubbed out.

### Contract Tests

Contract tests cover the expected input/output data structures and performance
of a component's interface. When working with a microservice, that interface
is the API. Verifying that interface provides expected responses ensures
the component provides an expected business value to the system. Unlike
component tests, these tests don't duplicate what's covered in component tests
but rather ensure messages for input/output are acceptable and that latency
is reasonable. The primary stakeholders of contract tests are the consumers.

Maintaining contract compatibility allows developers to add new features while
allowing, but perhaps deprecating, older features.

### End-to-End Tests

Similar to contract tests, E2E tests are less concerned with the specific
implementation details of a system and more concerned with its ability to meet
the business goals. To test the system, E2E tests treat the system as a black
box interacting with it via the GUI and/or API. E2E tests help to instill
confidence that the system is capable of performing the tasks required.

Test results are verified by observing changes to the application state or
by observing events.

When services required by the system are managed by a third party, it might be
reasonable to exclude them or stub them out. This does compromise E2E
confidence can provide greater confidence in the overall test suite.

Strategies for managing E2E tests include:

1. Write as few as possible. E2E tests are meant to test untested gaps in the
system. Other test types cover system functionality at a more granular level.
One strategy for keeping E2E tests to a minimum is to agree on an amount of time
the team is comfortable with running the tests. When this time is exceeded,
tests should be reduced to again fall under the alotted time.
1. Tests should be modeled around personas and user journeys
1. If a specific external service causes difficulty, it may be worth excluding
that component from the E2E so long as the component is tested by another means
1. Leverage infrastructure-as-code to build your test environment on the fly
1. Tests should be data-independent to reduce the possibility of introduced
bugs when new data is added to the system

### Exploratory Tests

The most flexible and least defined manner of system testing. Involves
exploring the system to determine where weak testing areas might lie or
developing tests around areas given user feedback. Despite a comprehensive
strategy for business testing, there will likely always be areas for improvement
or new business cases which emerge through development.
