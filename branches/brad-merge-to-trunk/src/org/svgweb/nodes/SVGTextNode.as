/*
 Copyright (c) 2009 by contributors:

 * James Hight (http://labs.zavoo.com/)
 * Richard R. Masters
 * Google Inc. (Brad Neuberg -- http://codinginparadise.org)

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

package org.svgweb.nodes
{
    import org.svgweb.core.SVGNode;
    import org.svgweb.utils.SVGColors;
    import org.svgweb.utils.SVGUnits;

    
    import flash.text.TextField;
    import flash.text.TextFieldAutoSize;
    import flash.text.TextFormat;
    import flash.text.TextLineMetrics;
    
    import flash.filters.GlowFilter;
    
    /** SVG Text element node **/
    public class SVGTextNode extends SVGNode
    {    
        
        /**
         * Hold text path node if text follows a path
         **/
        private var _textPath:SVGNode = null;
        
        /**
         * TextField to render nodes text
         **/
        private var _textField:TextField;
        
        public function SVGTextNode(svgRoot:SVGSVGNode, xml:XML, original:SVGNode = null):void {
            super(svgRoot, xml, original);
        }
        
        override public function hasText():Boolean {
            return true;
        }
        
        override public function setText(newValue):String {
            this._xml.setChildren(newValue);
            this.invalidateDisplay();
            return newValue;
        }
        
        /**
         * Get any child text (not text inside child nodes)
         * If this node has any text create a TextField at this._textField
         * Call SVGNode.parse()
         **/
        override protected function parse():void {
            if (this._xml.text() && this._xml.text().toString() != '') {
                this._textField = new TextField();
                this._textField.autoSize = TextFieldAutoSize.LEFT;
            }
            
            super.parse();
        }
        
        /**
         * Call SVGNode.setAttributes()
         * If this node contains text load text format (font, font-size, color, etc...)
         * Render text to a bitmap and add bitmap to node
         **/
        override protected function setAttributes():void {
            super.setAttributes();
            
            if (this._textField != null) {
                var fontFamily:String = this.getStyleOrAttr('font-family');                
                var fontSize:String = this.getStyleOrAttr('font-size');
                var fill:String = this.getStyleOrAttr('fill');
                var fontWeight:String = this.getStyleOrAttr('font-weight');
                var textAnchor:String = this.getStyleOrAttr('text-anchor');
                
                var textFormat:TextFormat = this._textField.getTextFormat();
                
                if (fontFamily != null) {
                    fontFamily = fontFamily.replace("'", '');
                    textFormat.font = fontFamily;
                }
                
                if (fontSize != null) {
                    //Handle floating point font size
                    var fontSizeNum:Number = SVGUnits.cleanNumber(fontSize);
                    
                    //Font size can be in user units, pixels (px), or points (pt); if no
                    //measurement type given defaults to user units
                    if (SVGUnits.getType(fontSize) == SVGUnits.PT) {
                        fontSizeNum = SVGUnits.pointsToPixels(fontSizeNum);
                    }
                    
                    var fontScale:Number = Math.floor(fontSizeNum);
                    textFormat.size = fontScale;
                    
                    fontScale = fontSizeNum / fontScale;
                    
                    _textField.scaleX = fontScale;
                    _textField.scaleY = fontScale;
                }
                      
                if (fill != null) {
                    textFormat.color = SVGColors.getColor(fill);
                }
                
                // only bold/no bold supported for now (SVG has many levels of bold)
                var currentNode:SVGNode = this;
                while (fontWeight == 'inherit') {                    
                    if (currentNode.parent is SVGNode) {
                        currentNode = SVGNode(currentNode.parent);
                        fontWeight = currentNode.getStyleOrAttr('font-weight');
                    }
                    else {
                        fontWeight = null;
                    }
                }                    
                if (fontWeight != null && fontWeight != 'normal') {
                    textFormat.bold = true;
                }
                                
                this._textField.text = this._xml.text().toString();
                this._textField.setTextFormat(textFormat);
                var textLineMetrics:TextLineMetrics = this._textField.getLineMetrics(0);
                
                currentNode = this;
                while (textAnchor == 'inherit') {                    
                    if (currentNode.parent is SVGNode) {
                        currentNode = SVGNode(currentNode.parent);
                        textAnchor = currentNode.getStyleOrAttr('text-anchor');
                    }
                    else {
                        textAnchor = null;
                    }
                }    
                
                // Handle text-anchor attribute
                switch (textAnchor) {                    
                    case 'middle':
                        this._textField.x = textLineMetrics.x - Math.floor(textLineMetrics.width / 2);
                        break;
                    case 'end':
                        this._textField.x = textLineMetrics.x - textLineMetrics.width;
                        break;
                    default: //'start'
                        break;
                }
                
                
                if (this.getStyleOrAttr('visibility') == 'hidden') {
                    this.setVisibility('hidden');
                }
                
                // SVG Text elements position y attribute as baseline of text,
                // not the top
                this._textField.y = 0 - textLineMetrics.ascent - 1;
            }
        }
        
        override protected function setVisibility(visible:String, 
                                                  recursive:Boolean = false)
                                                                        :void {
            // Surprisingly, this.alpha does not work as expected on
            // text system fonts; a work around is needed. See
            // http://oddhammer.com/tutorials/alpha_dynamic_text/
            // for details. Basically you have to embed the text into
            // a filter which turns it into a bitmap, and then apply the
            // alpha!
            if (visible == 'hidden') {
                var filter:GlowFilter = new GlowFilter(0x000000, .1, 16, 16, 
                                                       0, 3, false, false);
                this.filters = new Array(filter);
                this.alpha = 0;
            }
        }
        /**
         * 
         **/
        override protected function draw():void {
            super.draw();

            if (this._textField != null) {
                this.addChild(this._textField);         
            }            
        }             
    }
}
