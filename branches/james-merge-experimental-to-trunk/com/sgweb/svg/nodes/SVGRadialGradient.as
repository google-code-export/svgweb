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
            
            var cx:Number = this.getAttribute('cx', 0, false);            
            var cy:Number = this.getAttribute('cy', 0, false);
           
            var fx:Number = this.getAttribute('fx', 0, false);
            var fy:Number = this.getAttribute('fy', 0, false);
            
            var r:Number = this.getAttribute('r', 0, false);

            var objectX:Number = node.getAttribute('x', 0);
            var objectY:Number = node.getAttribute('y', 0);            
            
            var tx:Number = cx;
            var ty:Number = cy;

            var sx:Number = r*2 / 1638.4;
            var sy:Number = r*2 / 1638.4;

            matrix.scale(sx, sy);
            matrix.translate(tx, ty);
            matrix.translate(-objectX, -objectY);
            
            if (stopData.colors.length > 0) {
                node.graphics.beginGradientFill(GradientType.RADIAL, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);        
            }    
        }
        
        override public function lineGradientStyle(node:SVGNode):void {            
            var matrix:Matrix = this.getMatrix(node);            
            var stopData:Object = this.getStopData();     
            var spreadMethod:String = this.getSpreadMethod();
            
            var cx:Number = this.getAttribute('cx', 0, false);            
            var cy:Number = this.getAttribute('cy', 0, false);
           
            var fx:Number = this.getAttribute('fx', 0, false);
            var fy:Number = this.getAttribute('fy', 0, false);
            
            var r:Number = this.getAttribute('r', 0, false);

            var objectX:Number = node.getAttribute('x', 0);
            var objectY:Number = node.getAttribute('y', 0);

            var tx:Number = cx;
            var ty:Number = cy;

            var sx:Number = r*2 / 1638.4;
            var sy:Number = r*2 / 1638.4;

            matrix.scale(sx, sy);
            matrix.translate(tx, ty);
            matrix.translate(-objectX, -objectY);

            if (stopData.colors.length > 0) {
                node.graphics.lineGradientStyle(GradientType.RADIAL, stopData.colors, stopData.alphas, stopData.ratios, matrix, spreadMethod, InterpolationMethod.RGB);
            }
        }
        
        
    }
}