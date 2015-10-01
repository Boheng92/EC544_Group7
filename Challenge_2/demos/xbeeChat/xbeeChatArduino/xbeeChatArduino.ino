#include <SoftwareSerial.h>
#include <Thermistor.h>

Thermistor temp(0);
SoftwareSerial XBee(2, 3); // RX, TX

void setup() {
  // put your setup code here, to run once:
  XBee.begin(9600);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  double temperature = temp.getTemp();
  int i = 3;
  //String s = "ab";
  XBee.write("{");
  XBee.print(i);
  XBee.write("}");
  XBee.write("[");
  XBee.print(temperature);
  XBee.write("]");
  XBee.write("\n");
  //Serial.print(temperature);
  delay(10000);
}
