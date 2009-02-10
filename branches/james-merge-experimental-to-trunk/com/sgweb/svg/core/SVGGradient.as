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


package com.sgweb.svg.core
{
	import com.sgweb.svg.nodes.SVGSVGNode;
	import com.sgweb.svg.nodes.SVGStopNode;
	import com.sgweb.svg.utils.SVGColors;
	
	import flash.display.DisplayObject;
	import flash.display.SpreadMethod;
	import flash.geom.Matrix;
    
    public class SVGGradient extends SVGNode
    {   
    	   
        public function SVGGradient(svgRoot:SVGSVGNode, xml:XML = null, original:SVGNode = null):void {            
            super(svgRoot, xml, original);
        }    

        public function beginGradientFill(node:SVGNode):void {
        	
        }
        
        public function lineGradientStyle(node:SVGNode):void {            
        	
        }
        
        protected function isIdentityMatrix(matrix:Matrix):Boolean {
        	if ((matrix.a = 1)
        	   && (matrix.b = 0) 
        	   && (matrix.c = 0)
        	   && (matrix.d = 1)
        	   && (matrix.tx = 0)
        	   && (matrix.ty = 0)) {
        	   return true;   	
        	}
        	return false;
        }
        
        public function getMatrix(node:SVGNode):Matrix {   
        	var matrix:Matrix;
            
            var w:Number = node.xMax - node.xMin;
            var h:Number = node.yMax - node.yMin;
            
            if ((w == 0) || (h == 0)) { //We don't fill an object with area == 0
            	return null;
            }
            
            matrix = new Matrix();
                 
            var gradientUnits:String = this.getAttribute('gradientUnits', null, false);
                    
            var x1String:String = this.getAttribute('x1', '0%', false);
            var x2String:String = this.getAttribute('x2', '100%', false);         
            var y1String:String = this.getAttribute('y1', '0%', false);
            var y2String:String = this.getAttribute('y2', '0%', false);
            
            var x1:Number = SVGColors.cleanNumber(x1String);
            var x2:Number = SVGColors.cleanNumber(x2String);
            var y1:Number = SVGColors.cleanNumber(y1String);
            var y2:Number = SVGColors.cleanNumber(y2String);
                        
            if (x1String.search('%') > -1) {
            	x1 *= w / 100;
            }
            else if (gradientUnits == "objectBoundingBox") {
            	x1 *= w;
            }
            
            if (x2String.search('%') > -1) {
                x2 *= w / 100;
            }  
            else if (gradientUnits == "objectBoundingBox") {
                x2 *= w;
            }
            
            if (y1String.search('%') > -1) {
                y1 *= h / 100;
            }
            else if (gradientUnits == "objectBoundingBox") {
                y1 *= h;
            }
            
            if (y2String.search('%') > -1) {
                y2 *= h / 100;
            } 
            else if (gradientUnits == "objectBoundingBox") {
                y2 *= h;
            }      
                    
            var dx:Number = x2 - x1; 
            var dy:Number = y2 - y1; 

            var angle:Number = Math.atan2(dy, dx);
            
            if (dx == 0) {
            	dx = w;
            }

            matrix.createGradientBox(dx, dy, angle, x1, y1);
            
            var gradientTransform:String = this.getAttribute('gradientTransform');
            if (gradientTransform) {
                this.parseTransform(gradientTransform, matrix);                
            }
            
            return matrix;
        }
        
        public function getSpreadMethod():String {
        	var spreadMethod:String = SpreadMethod.PAD;
        	
        	var attr:String = this.getAttribute('spreadMethod');
            if (attr == 'reflect') {
                spreadMethod = SpreadMethod.REFLECT;
            }
            else if (attr == 'repeat') {
                spreadMethod = SpreadMethod.REPEAT;
            }
            
            return spreadMethod;
        }
        
        public function getStopData():Object {
        	        	
        	var href:String = this.getAttribute("href");
        	
        	if (href) {
        	   href = href.substr(1);
        	   var node:SVGNode = this.svgRoot.getNode(href);
        	   if (node is SVGGradient) {
        	       return SVGGradient(node).getStopData();
        	   }	
        	}
        	
        	var stopData:Object = new Object();
        	
        	var colors:Array = new Array();
            var ratios:Array = new Array();
            var alphas:Array = new Array();
            
            var color:String;
            var ratio:String;
            var alpha:String;
            var ratioNum:Number;
            
            
            var match:Array;
            
            var child:DisplayObject;
            
            var currentRatio:Number;
            
            for (var i:uint = 0; i < this.numChildren; i++) {
            	child = this.getChildAt(i);
            	if (child is SVGStopNode) {
            		color = SVGStopNode(child).getAttribute('stop-color');
            		ratio = SVGStopNode(child).getAttribute('offset');
            		alpha = SVGStopNode(child).getAttribute('stop-opacity', 1);
            		            		
            		match = ratio.match(/([^%]+)%/s);
            		if (match) {
            			ratioNum = 255 * (SVGColors.cleanNumber(match[1]) / 100);
            		}     
            		else {
            			ratioNum = 255 * SVGColors.cleanNumber(ratio);
            		}       		
            		
            		colors.push(SVGColors.getColor(color));
            		ratios.push(ratioNum);
            		alphas.push(SVGColors.cleanNumber(alpha));
            	}
            }
        	
        	stopData['colors'] = colors;
        	stopData['ratios'] = ratios;
        	stopData['alphas'] = alphas;
        	
        	return stopData;
        }


        
        
        
        
    }
}
