#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "secrets.h"

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

void makeGetRequest(char url[]) {
  HTTPClient http;
  String serverUrl = SERVER_IP + url;
  http.begin(serverUrl);

  int httpCode = http.GET();

  if(httpCode > 0) {
    Serial.printf("HTTP GET code: %d \n", httpCode);

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
  Serial.println("Hello, World from ESP32!");
  delay(500);
}