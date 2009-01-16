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
    
    public class SVGLinearGradient extends SVGGradient
    {             
    	   
        public function SVGLinearGradient(svgRoot:SVGSVGNode, xml:XML = null, original:SVGNode = null):void {            
            super(svgRoot, xml, original);
        }    
        
        override public function beginGradientFill(node:SVGNode):void {
            var matrix:Matrix = this.getMatrix(node);            
            var stopData:Object = this.getStopData();     
            var spreadMethod:String = this.getSpreadMethod();
            
            //Don't fill if there are no stops
            if (stopData.colors.length > 0) {
                node.graphics.beginGradientFill(GradientType.LINEAR, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);
            }            
        }
        
        override public function lineGradientStyle(node:SVGNode):void {            
            var matrix:Matrix = this.getMatrix(node);            
            var stopData:Object = this.getStopData();     
            var spreadMethod:String = this.getSpreadMethod();
            if (stopData.colors.length > 0) {
                node.graphics.lineGradientStyle(GradientType.LINEAR, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);
            }
        }
        
        
    }
}
