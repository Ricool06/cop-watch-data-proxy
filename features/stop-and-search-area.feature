Feature: Stop and searches
  As a user
  I want to get up to date stop and search data
  So that I can monitor recent searches of people in my community

  Scenario: Get basic stop and search data in rectangle
    Given the police data API is up
    When a "GET" message is received from the gateway with topic "request-id:GET:police-data" and query:
    """
    {
      stopsStreet(poly: "52.2,0.5:52.8,0.2:52.1,0.88") {
        location {
          latitude
          longitude
        }
      }
    }
    """
    Then I receive a valid stop and search response:
    """
    {
      "status": 200,
      "body": {
        "data": {
          "stopsStreet": [
            {
              "location": {
                "latitude": "0.00000",
                "longitude": "0.00000"
              }
            }
          ]
        }
      }
    }
    """

  Scenario: Get stop and search data in rectangle
    Given the police data API is up
    When a "GET" message is received from the gateway with topic "request-id:GET:police-data" and query:
    """
    {
      stopsStreet(poly: "52.2,0.5:52.8,0.2:52.1,0.88") {
        location {
          latitude
          longitude
        }
        datetime
        type
        object_of_search
        self_defined_ethnicity
        age_range
        gender
        outcome
      }
    }
    """
    Then I receive a valid stop and search response:
    """
    {
      "status": 200,
      "body": {
        "data": {
          "stopsStreet": [
            {
              "location": {
                "latitude": "0.00000",
                "longitude": "0.00000"
              },
              "datetime": "2018-11-10T12:01:00+00:00",
              "type": "Person and Vehicle search",
              "object_of_search": "Evidence of offences under the Act",
              "self_defined_ethnicity": "White - English/Welsh/Scottish/Northern Irish/British",
              "age_range": "over 34",
              "gender": "Male",
              "outcome": "A no further action disposal"
            }
          ]
        }
      }
    }
    """
  
  Scenario: Handle bad arguments for getting stop and search data in rectangle
    Given the police data API is up
    When a "GET" message is received from the gateway with topic "request-id:GET:police-data" and query:
    """
    {
      stopsStreet(badArgument: "oh no!") {
        location {
          latitude
          longitude
        }
      }
    }
    """
    Then I receive a valid error response:
    """
    {
      "status": 400,
      "body": {
        "errors": {
        }
      }
    }
    """

  Scenario: Handle malformed graphql for getting stop and search data in rectangle
    Given the police data API is up
    When a "GET" message is received from the gateway with topic "request-id:GET:police-data" and query:
    """
    {{ this}is }

    not 
     ....__ graphql
    """
    Then I receive a valid error response:
    """
    {
      "status": 400,
      "body": {
        "errors": {
        }
      }
    }
    """

  Scenario: Handle remote API error for getting stop and search data in rectangle
    Given the police data API is returning errors
    When a "GET" message is received from the gateway with topic "request-id:GET:police-data" and query:
    """
    {
      stopsStreet(poly: "52.2,0.5:52.8,0.2:52.1,0.88") {
        location {
          latitude
          longitude
        }
      }
    }
    """
    Then I receive a valid error response:
    """
    {
      "status": 500,
      "body": {
        "errors": {
        }
      }
    }
    """
