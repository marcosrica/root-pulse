#include <Arduino.h>
#include <WIFI.h>
#include "secrets.h"


void setup() {
  Serial.begin(115200);

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

void loop() {
  Serial.println("Hello, World from ESP32!");
  delay(500);
}