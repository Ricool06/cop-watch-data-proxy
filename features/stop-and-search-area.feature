Feature: Stop and searches
  As a user
  I want to get up to date stop and search data
  So that I can monitor recent searches of people in my community

  Scenario: Get stop and search data in rectangle
    Given the police data API is up
    When a "GET" message is received from the gateway with topic "request-id:get-police-data" and query:
    """
    {
      stopAndSearches(poly: "52.2,0.5:52.8,0.2:52.1,0.88") {
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
          "stopAndSearches": [
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
