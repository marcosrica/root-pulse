#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "secrets.h"

String sessionCookie = "";

void connectToWifi() {
  Serial.println("Connecting to WIFI...");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Connected to wifi");

  Serial.print("IP adress: ");
  Serial.println(WiFi.localIP());
}

HTTPClient startRequest(String url) {
  //Instance the http client
  HTTPClient http;

  //Getting the server's full url
  String serverUrl = String(SERVER_IP) + url;
  Serial.print("Starting petition to: ");
  Serial.println(serverUrl);

  //Adding the cookie if present
  if(sessionCookie.length() > 0) {
    http.addHeader("sensor-token", sessionCookie);
  }

  //Returning a ready-made client
  return http;
}

void setCookies(HTTPClient http) {
  //First check for a set-cookie header
  String setCookie = http.header("Set-Cookie");

  //There was a cookie to be set with our session
  if(setCookie.length() > 0) {
    //We only need the information up until the semicolon
    int semicolonPos = setCookie.indexOf(';');

    //Checking if there was indeed a semicolon
    if(semicolonPos != -1) {
      //Storing the cookie for future queries
      sessionCookie = setCookie.substring(0, semicolonPos);
      Serial.println("Cookie saved: " + sessionCookie);
    }
  }
}

void makeGetRequest(String url) {
  //Setting up the HTTP client
  HTTPClient http = startRequest(url);

  //Making the petition
  int httpCode = http.GET();
  Serial.printf("HTTP GET code: %d \n", httpCode);

  //Checking if everything went fine
  if(httpCode > 0) {
    //Setting the possible cookies returned
    setCookies(http);
    
    //If the response is OK, read the payload
    if(httpCode == 200) {
      String payload = http.getString();
      Serial.println("Response payload:" + payload);
    }
  }
  else {
    //Something failed in the request process
    Serial.printf("GET request failed, error: %s \n", http.errorToString(httpCode).c_str());
  }

  //Close the connection
  http.end();
}

void makePostRequest(String url, String body) {
  //Setting up the HTTP client
  HTTPClient http = startRequest(url);

  //Making the petition
  int httpCode = http.POST(body);
  Serial.printf("HTTP POST response code: %d \n", httpCode);

  //Checking if everything went fine
  if(httpCode > 0) {
    //Setting the possible cookies returned
    setCookies(http);

    //If the response is OK, read the payload
    if(httpCode == 200) {
      String payload = http.getString();
      Serial.println("POST payload: " + payload);
    }
  }
  else {
    //Something failed in the request process
    Serial.printf("POST request failed. Error: %s \n", http.errorToString(httpCode).c_str());
  }

  //Close the connection
  http.end();
}

void setup() {
  Serial.begin(115200);

  connectToWifi();
}

void loop() {
  makeGetRequest("/health");
  delay(500);
}