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

void makeGetRequest(String url) {
  HTTPClient http;
  String serverUrl = String(SERVER_IP) + url;
  Serial.printf("Making GET petition to: ");
  Serial.println(serverUrl);
  http.begin(serverUrl);

  //Adding the cookie if present
  if(sessionCookie.length() > 0) {
    http.addHeader("token", sessionCookie);
  }
  
  int httpCode = http.GET();
  Serial.printf("HTTP GET code: %d \n", httpCode);
  
  if(httpCode > 0) {
    //Checking for a set cookie heather
    String setCookie = http.header("Set-Cookie");
    if(setCookie.length() > 0) { //There is a cookie to be set
      // Extract only the "name=value" part
      // This part lives before the first ";"
      int semicolonPos = setCookie.indexOf(';');

      if(semicolonPos != -1) {
        setCookie = setCookie.substring(0, semicolonPos);
      }

      //Storing or overwritting the value
      sessionCookie = setCookie;
      Serial.println("Cookie saved: " + sessionCookie);
    }
    
    //If the response is OK, read the payload
    if(httpCode == 200) {
      String payload = http.getString();
      Serial.println("Response payload:");
      Serial.println(payload);
    }
  }
  else {
    Serial.printf("GET request failed, error: %s \n", http.errorToString(httpCode).c_str());
  }

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