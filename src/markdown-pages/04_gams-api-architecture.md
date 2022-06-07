---
slug: "/blog/gams-api-architecture"
date: "2022-06-07"
title: "Software architecture draft for GAMS-API"
draft: false
short: "Draft / prototype description for a (hypothetical) monolothical REST-API designed for the digital archive GAMS at ZIM Graz operating with fedora 6.x"
language: "english"
---

# Software architecture and code design

GAMS-API is designed as __monolithic server side MVC web application__ (built via spring boot)

It follows the __3-tier-architecture__ approach, structuring the application's code fundamentally into __business- (services and model), presentation- (controller and view) and data-layer__ (database-access). 

Further, the __Domain-driven design pattern__ is used to organize the code in terms of the domain's business logic. (digital long term archiving) 

The architecture and design decisions are represented in the code in the following ways:
1. Presentation layer:
  controller package and view templates (in resources)
2. Business layer:
  services and model packages (with domain classes)
3. Data layer:
  repository package
4. Utilitiy / non-functional layer
  config / utility / security package etc.
5. Individual Filenames
  using filenames according to the domain e.g. DigitalObject.java etc.


## Major non-functional workflows

### Securing transactions / transaction-safety

__Integrated fedora6 transaction-safety mechanism__ in the __Spring JPA__ layer. This
allows to include additional external transaction mechanisms (like writing dependent triples 
onto a database)

Details:
- handled via __Spring JPA integration layer__
- implemented __FedoraPlatformTransactionManager.java__ as extension of AbstractPlatformTransactionManager.java.
- __injecting__ FedoraPlatformTransactionManager.java as custom TransactionManager inside PersistenceJPAConfig.java

This allows (next to other things) the __@Transactional__ annotation (at spring service layer) to handle standardized transaction workflows.


### Exception Handling

controlled by spring exception mechanism

Custom __ResourceRepositoryException__ extends from ResponseStatusException and is given upwards to controller layer. Includes e.g. original thrown status code / message from fedora 6 and defines a custom error message. 


### Authentication + authorization

Preliminary notes:
fedora auth is based on linked data (linked data platform) - and therefoe complex / first level of security might be implemented via spring and oauth processes. (more later on at authorization)

Because of security concerns GAMS decided in the past for a __JWT / OAuth2 based auth workflow__. (and against Basic Authorization or Form Based Authorization). This approach will be followed along.

In contrast to the current implementation at GAMS4 where a seperate client application exists - this repo tries to implement a __server side web client__ - where the security necessities are different. 

Therefore the __authorization-code-flow__ OAuth2 pattern is being used to secure thymeleaf based web client.

As authorization server  __keycloak__ is being used - and __spring-boot-oauth2-client__ via __Spring Security__ as integration layer for the spring based application.


Some additional important notes:

- keycloak adapters are deprecated therefore best way is to use spring-ouauth2-client library for spring integration. (e.g. spring-boot-keycloak adapter is deprecated https://www.keycloak.org/2022/02/adapter-deprecation)

- simplest OAauth2 authorization workflow is the authorization-code-flow for spring based web clients using keycloak as authorization server


#### Implementation-details

**Dependencies**:
- Spring Security 
- Spring oauth2 client (spring-boot-starter-oauth2-client)
- External keycloak authorization server (with applied configuration from above)

**Configuration**:
- Required OAUTH2 properites set in application.properties 
    (client-id / client-secret / scope / authorization-grant-type=authorization_code / 
    redirect-uri / issuer-uri)
- See security configuration classes in security package (no extra config needed - but supplied enhanced functionality like deactivate on specific profiles.)


### Validation

is built in top of __spring-validation__ and therefore supports the full feature set of spring validation like validation on different levels (controller, services, domain classes)

Because of legacy the validation is currently focused on the __controller level__.

