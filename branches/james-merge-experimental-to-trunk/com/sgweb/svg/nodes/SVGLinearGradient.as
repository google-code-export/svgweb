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

package com.sgweb.svg.nodes
{
    import com.sgweb.svg.core.SVGGradient;
    import com.sgweb.svg.core.SVGNode;
    import com.sgweb.svg.utils.SVGColors;
    
    import flash.display.GradientType;
    import flash.display.InterpolationMethod;
    import flash.geom.Matrix;
    import flash.geom.Point;
    
    public class SVGLinearGradient extends SVGGradient
    {             
           
        public function SVGLinearGradient(svgRoot:SVGSVGNode, xml:XML = null, original:SVGNode = null):void {            
            super(svgRoot, xml, original);
        }    
        
        override public function beginGradientFill(node:SVGNode):void {
            var stopData:Object = this.getStopData();     
            var spreadMethod:String = this.getSpreadMethod();
            
            var w:Number = node.xMax - node.xMin;
            var h:Number = node.yMax - node.yMin;
            
            if ((w == 0) || (h == 0)) { //We don't fill an object with area == 0
                return;
            }
            
                 
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
            
            var p1:Point = new Point(x1, y1);
            var p2:Point = new Point(x2, y2);
            
            var gradientTransform:String = this.getAttribute('gradientTransform');
            if (gradientTransform) {
                var gMatrix:Matrix = this.parseTransform(gradientTransform);
                p1 = gMatrix.transformPoint(p1);
                p2 = gMatrix.transformPoint(p2);                
            }
            
                    
            var dx:Number = p2.x - p1.x; 
            var dy:Number = p2.y - p1.y; 
            
            var angle:Number;
            
            if (gradientUnits == "objectBoundingBox") {
                 angle = Math.atan2(dy/h, dx/w);
            }
            else {
                angle = Math.atan2(dy, dx);
            }            
            
            if (dx == 0) {
                dx = w;
            }
            
            var matrix:Matrix = new Matrix();
            matrix.createGradientBox(dx, dy, angle, p1.x, p1.y);
            
            
            if (((x1 == x2) && (y1 == y2))
                || (stopData.colors.length == 1)) { //Solid color fill
                
            	node.graphics.beginFill(stopData.colors[stopData.colors.length-1], stopData.alphas[stopData.colors.length-1]);
            }
            else if (stopData.colors.length > 0) { //Don't fill if there are no stops
                node.graphics.beginGradientFill(GradientType.LINEAR, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);
            }            
        }
        
        override public function lineGradientStyle(node:SVGNode):void {            
            var stopData:Object = this.getStopData();     
            var spreadMethod:String = this.getSpreadMethod();
            
            var w:Number = node.xMax - node.xMin;
            var h:Number = node.yMax - node.yMin;
            
            if ((w == 0) || (h == 0)) { //We don't fill an object with area == 0
                return;
            }
            
                 
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
            
            var p1:Point = new Point(x1, y1);
            var p2:Point = new Point(x2, y2);
            
            var gradientTransform:String = this.getAttribute('gradientTransform');
            if (gradientTransform) {
                var gMatrix:Matrix = this.parseTransform(gradientTransform);
                p1 = gMatrix.transformPoint(p1);
                p2 = gMatrix.transformPoint(p2);                
            }
            
                    
            var dx:Number = p2.x - p1.x; 
            var dy:Number = p2.y - p1.y; 
            
            var angle:Number;
            
            if (gradientUnits == "objectBoundingBox") {
                 angle = Math.atan2(dy/h, dx/w);
            }
            else {
                angle = Math.atan2(dy, dx);
            }            
            
            if (dx == 0) {
                dx = w;
            }
            
            var matrix:Matrix = new Matrix();
            matrix.createGradientBox(dx, dy, angle, p1.x, p1.y);            
            
            if (((x1 == x2) && (y1 == y2))
                || (stopData.colors.length == 1)) { //Solid color fill                
                node.graphics.lineStyle(node.getAttribute('stroke-width'), stopData.colors[stopData.colors.length-1], stopData.alphas[stopData.colors.length-1]);
            }
            else if (stopData.colors.length > 0) { //Don't fill if there are no stops
                node.graphics.lineGradientStyle(GradientType.LINEAR, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);
            } 
        }        
        
    }
}
