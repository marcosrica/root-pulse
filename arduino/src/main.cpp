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

void startRequest(HTTPClient &http, String url) {
    //Getting the server's full url
  String serverUrl = String(SERVER_IP) + url;
  Serial.print("Starting petition to: ");
  Serial.println(serverUrl);

  //Starting the connection
  http.begin(serverUrl);
  
  //Adding the cookie if present
  if(sessionCookie.length() > 0) {
    http.addHeader("sensor-token", sessionCookie);
  }
}

void parseToken(String payload) {
  //First, remove the first half of the payload
  int colonPos = payload.indexOf(':');
  String halfPayload = payload.substring(colonPos + 2);

  //Then, remove the last noisy characters and store the cookie
  int lastCommas = halfPayload.indexOf('"');
  sessionCookie = halfPayload.substring(0, lastCommas);
}

void makeGetRequest(String url) {
  //Setting up the HTTP client
  HTTPClient http;
  startRequest(http, url);

  //Making the petition
  int httpCode = http.GET();
  Serial.printf("HTTP GET code: %d \n", httpCode);

  //Checking if everything went fine
  if(httpCode > 0) {    
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

void makePostRequest(String &payload, String url, String body) {
  //Setting up the HTTP client
  HTTPClient http;
  startRequest(http, url);

  //Adding a header so that the body will be read
  http.addHeader("Content-Type", "application/json");

  //Making the petition
  int httpCode = http.POST(body);
  Serial.printf("HTTP POST response code: %d \n", httpCode);

  //Checking if everything went fine
  if(httpCode > 0) {
    //If the response is OK, read the payload
    if(httpCode == 200) {
      payload = http.getString();
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

  String body = "{ \"name\": \"" + String(SENSOR_NAME) + "\", \"password\": \"" + String(SENSOR_PASSWORD) + "\" }";
  Serial.println("Making starting auth petition");

  String authPayload = "";
  makePostRequest(authPayload, "/auth/sensor", body);
  parseToken(authPayload);
}

void loop() {
  makeGetRequest("/sensor/health");
  delay(500);
}