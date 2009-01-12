/*
Copyright (c) 2008 James Hight
Copyright (c) 2008 Richard R. Masters, for his changes.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

package com.svgweb.svg.nodes
{
	import com.svgweb.svg.core.SVGGradient;
	import com.svgweb.svg.core.SVGNode;
	
	import flash.display.GradientType;
	import flash.display.InterpolationMethod;
	import flash.geom.Matrix;
    
    public class SVGRadialGradient extends SVGGradient
    {             
    	   
        public function SVGRadialGradient(svgRoot:SVGSVGNode, xml:XML = null, original:SVGNode = null):void {            
            super(svgRoot, xml, original);
        }    
        
        override public function beginGradientFill(node:SVGNode):void {
            var matrix:Matrix = this.getMatrix(node);            
            var stopData:Object = this.getStopData();     
            var spreadMethod:String = this.getSpreadMethod();
            
            var cx:Number = 0;
            if (this.xml.@cx != null) {
                cx = Number(this.xml.@cx);
            }
            var cy:Number = 0;
            if (this.xml.@cy != null) {
                cy = Number(this.xml.@cy);
            }
            var fx:Number = 0;
            if (this.xml.@fx != null) {
                fx = Number(this.xml.@fx);
            }
            var fy:Number = 0;
            if (this.xml.@fy != null) {
                fy = Number(this.xml.@fy);
            }
            var r:Number = 0;
            if (this.xml.@r != null) {
                r = Number(this.xml.@r);
            }

            var objectX:Number = 0;
            if (node.getAttribute('x') != null) {
                objectX = Math.round(Number(node.getAttribute('x')));
            }
            var objectY:Number = 0;
            if (node.getAttribute('y') != null) {
                objectY = Math.round(Number(node.getAttribute('y')));
            }

            var tx:Number = cx;
            var ty:Number = cy;

            var sx:Number = r*2 / 1638.4;
            var sy:Number = r*2 / 1638.4;

            matrix.scale(sx, sy);
            matrix.translate(tx, ty);
            matrix.translate(-objectX, -objectY);
            
            node.graphics.beginGradientFill(GradientType.RADIAL, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);            
        }
        
        override public function lineGradientStyle(node:SVGNode):void {            
            var matrix:Matrix = this.getMatrix(node);            
            var stopData:Object = this.getStopData();     
            var spreadMethod:String = this.getSpreadMethod();
            
            var cx:Number = 0;
            if (this.xml.@cx != null) {
                cx = Number(this.xml.@cx);
            }
            var cy:Number = 0;
            if (this.xml.@cy != null) {
                cy = Number(this.xml.@cy);
            }
            var fx:Number = 0;
            if (this.xml.@fx != null) {
                fx = Number(this.xml.@fx);
            }
            var fy:Number = 0;
            if (this.xml.@fy != null) {
                fy = Number(this.xml.@fy);
            }
            var r:Number = 0;
            if (this.xml.@r != null) {
                r = Number(this.xml.@r);
            }

            var objectX:Number = 0;
            if (node.getAttribute('x') != null) {
                objectX = Math.round(Number(node.getAttribute('x')));
            }
            var objectY:Number = 0;
            if (node.getAttribute('y') != null) {
                objectY = Math.round(Number(node.getAttribute('y')));
            }

            var tx:Number = cx;
            var ty:Number = cy;

            var sx:Number = r*2 / 1638.4;
            var sy:Number = r*2 / 1638.4;

            matrix.scale(sx, sy);
            matrix.translate(tx, ty);
            matrix.translate(-objectX, -objectY);

            node.graphics.lineGradientStyle(GradientType.RADIAL, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);
        }
        
        
    }
}
