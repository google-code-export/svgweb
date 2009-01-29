/*
 Copyright (c) 2009 by contributors:

 * James Hight (http://labs.zavoo.com/)
 * Richard R. Masters

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/


package com.sgweb.svg.utils {
    
    import flash.utils.ByteArray;
    
    
    public class Base64 {
        private static var lookupTable:Array = new Array( 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
            'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 
            'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', 
            '8', '9', '+', '/');
            
        private static var reverseLookupTable:Object = null;
    
        //first 6 bits 0x3f;
        //second 6 bits 0xfc0;
        //third 6 bits 0x3f00;
        //fourth 6 bits 0xfc0000;
    
        //3 bytes => 4 ascii characters
        //
        //Place three bytes in a 24bit holder
        //Read 6 bits at at time
        //Use "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" as a lookup table to build string
        //Repeat process
        //zero pad the end if bytes not a multiple of 3 
        //Add a "=" at the end for each padded byte
            
        static public function encode(value:ByteArray):String {
            var data:String = "";
            var count:uint = 0;
            var charCount:uint = 0;
            
            for (var i:uint = 0; i < value.length; i++) {
                var byte:uint;
                count++;
                charCount++;
                
                if (count == 1) {
                    byte = value[i] >> 2;
                    data += lookupTable[byte];
                    
                    byte = (value[i] & 0x03) << 4;
                }
                else if (count == 2) {
                    byte = byte | (value[i] >> 4);
                    data += lookupTable[byte];
                    
                    byte = (value[i] & 0x0f) << 2;
                }
                
                else if (count == 3) {
                    byte = byte | (value[i] >> 6);
                    data += lookupTable[byte];
                    
                    byte = value[i] & 0x3f;
                    data += lookupTable[byte];
                    
                    count = 0;
                }
                
                if (charCount == 64) {
                    data += "\n";
                    charCount = 0;
                }
                
            }
            
            if (count == 1) {
                data += lookupTable[byte];
                data += "==";
            }
            else if (count == 2) {
                data += lookupTable[byte];
                data += "=";
            }
            
            
            return data;
        }
        
        static public function decode(value:String):ByteArray {
            //4 ascii characters => 3 bytes
            
            if (reverseLookupTable == null) {
                createReverseLookupTable();
            }
            
            var data:ByteArray = new ByteArray();
            var tmp:uint;
            var count:uint = 0;
            var char:String;
            var byte:uint;            
                        
            for (var i:uint = 0; i < value.length; i++) {
                
                char = value.charAt(i);
                
                if (char == "=") {
                    data.length--;
                    break;
                }    
                
                if (!reverseLookupTable.hasOwnProperty(char)) {
                    continue;
                }
                
                byte = reverseLookupTable[char];
                                
                count++;
                    
                if (count == 1) {
                    data[data.position] = byte << 2;                                            
                }
                else if (count == 2) {
                    data[data.position] = data[data.position] | byte >> 4;
                    data.position++;
                    data[data.position] = byte << 4;                                              
                }
                
                else if (count == 3) {
                    data[data.position] = data[data.position] | byte >> 2;
                    data.position++
                    data[data.position] = byte << 6;                                              
                }
                else if (count == 4) {
                    data[data.position] = data[data.position] | byte;
                    data.position++   
                    count = 0;                                           
                }
            }
            
            data.position = 0;
            
            return data;
            
        }
        
        private static function createReverseLookupTable():void {
            reverseLookupTable = new Object();
            for (var i:uint; i < lookupTable.length; i++) {
                reverseLookupTable[lookupTable[i]] = i;
            }
        }

    }
}
