#include <SoftwareSerial.h>

SoftwareSerial XBee(2, 3); 

void setup() {
  pinMode(11, OUTPUT);
  XBee.begin(9600);
  Serial.begin(9600);
}

void loop() {
  // For #0
  Serial.write("loop Running\n");
  delay(1000);
  

  char stat = XBee.read();
  Serial.write(stat);
  Serial.write("\n"); 

  if(stat == 'G')
  {
    Serial.write("OFF");
    Serial.write("\n");

    digitalWrite(11, LOW);
    XBee.write("{3}");
    XBee.write("[");
    XBee.write("G");
    XBee.write("]\n");

    //Serial.write("OFFACK");
    //Serial.write("\n");

    stat = 'X';
  }
  else if(stat == 'H')
  {
    Serial.write("ON");
    Serial.write("\n"); 

    digitalWrite(11, HIGH);
    XBee.write("{3}");
    XBee.write("[");
    XBee.write("H");
    XBee.write("]\n");

    //Serial.write("ONACK");
    //Serial.write("\n");

    stat = 'X';
  }    
}

