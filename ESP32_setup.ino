#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <time.h>

const char* ssid = "nsubash38_wifi";
const char* password = "CLB283A586";
const char* serverUrl = "http://192.168.1.70:5000/api/sensor/data";

#define DHTPIN 4
#define DHTTYPE DHT22
#define READING_INTERVAL 10000
#define WIFI_TIMEOUT 30000
#define SENSOR_RETRY 3

DHT dht(DHTPIN, DHTTYPE);

unsigned long lastReadingTime = 0;
bool wifiConnected = false;

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n[SYSTEM] Initializing...");
    
    dht.begin();
    Serial.println("[SYSTEM] DHT22 sensor initialized");
    
    connectToWiFi();
    
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    Serial.println("[SYSTEM] NTP time synchronized");
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        wifiConnected = false;
        Serial.println("[WIFI] Connection lost. Reconnecting...");
        connectToWiFi();
    } else if (!wifiConnected) {
        wifiConnected = true;
        Serial.println("[WIFI] Connection restored");
    }
    
    unsigned long currentMillis = millis();
    if (currentMillis - lastReadingTime >= READING_INTERVAL) {
        lastReadingTime = currentMillis;
        readAndSendData();
    }
}

void connectToWiFi() {
    Serial.print("[WIFI] Connecting to ");
    Serial.println(ssid);
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    
    unsigned long startAttemptTime = millis();
    
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_TIMEOUT) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("");
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.print("[WIFI] Connected. IP: ");
        Serial.println(WiFi.localIP());
        wifiConnected = true;
    } else {
        Serial.println("[WIFI] Connection failed. Will retry in loop.");
        wifiConnected = false;
    }
}

void readAndSendData() {
    float temperature = 0.0;
    float humidity = 0.0;
    bool sensorValid = false;
    
    for (int attempt = 0; attempt < SENSOR_RETRY; attempt++) {
        temperature = dht.readTemperature();
        humidity = dht.readHumidity();
        
        if (!isnan(temperature) && !isnan(humidity)) {
            sensorValid = true;
            break;
        }
        delay(100);
    }
    
    if (!sensorValid) {
        Serial.println("[SENSOR] Failed to read after multiple attempts");
        return;
    }
    
    Serial.println("--- Sensor Reading ---");
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" C");
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    Serial.println("----------------------");
    
    sendToBackend(temperature, humidity);
}

void sendToBackend(float temperature, float humidity) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[HTTP] No WiFi connection. Data not sent.");
        return;
    }
    
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    char jsonPayload[128];
    snprintf(jsonPayload, sizeof(jsonPayload), 
             "{\"temperature\":%.2f,\"humidity\":%.2f}", 
             temperature, humidity);
    
    Serial.print("[HTTP] Sending: ");
    Serial.println(jsonPayload);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
        Serial.print("[HTTP] Response code: ");
        Serial.println(httpResponseCode);
        
        String response = http.getString();
        if (response.length() > 0) {
            Serial.print("[HTTP] Server response: ");
            Serial.println(response);
        }
    } else {
        Serial.print("[HTTP] Error code: ");
        Serial.println(httpResponseCode);
        
        if (httpResponseCode == -1) {
            Serial.println("[HTTP] Connection refused. Check server URL and firewall.");
        } else if (httpResponseCode == -11) {
            Serial.println("[HTTP] Connection timeout. Server not responding.");
        }
    }
    
    http.end();
}