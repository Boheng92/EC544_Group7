#include <SoftwareSerial.h>

SoftwareSerial XBee(2, 3); 

void setup() {
  pinMode(12, OUTPUT);
  XBee.begin(9600);
  Serial.begin(9600);
}

void loop() {
  Serial.write("loop Running\n");
  delay(1000);
  

  char stat = XBee.read();
  Serial.write(stat);
  Serial.write("\n"); 

  if(stat == '0')
  {
    Serial.write("OFF");
    Serial.write("\n");

    digitalWrite(12, LOW);

  }
  else if(stat == '1')
  {
    Serial.write("ON");
    Serial.write("\n"); 

    digitalWrite(12, HIGH);
   
  } 
}

