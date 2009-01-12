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

package com.svgweb.svg.nodes {
	
	import com.svgweb.svg.core.SVGNode;
    import com.svgweb.svg.utils.SVGColors;
    import com.svgweb.svg.utils.SVGUnits;
    
    import flash.text.TextField;
    import flash.text.TextFieldAutoSize;
    import flash.text.TextFormat;
    import flash.text.TextLineMetrics;
    
    /** SVG Text element node **/
    public class SVGTextNode extends SVGNode {    
        
        /**
         * Hold node's text
         **/
        private var _text:String = '';
        
        /**
         * Hold text path node if text follows a path
         **/
        private var _textPath:SVGNode = null;
        
        /**
         * TextField to render nodes text
         **/
        private var _textField:TextField;
        
        /**
         * Bitmap to display text rendered by _textField
         **/
        //private var _textBitmap:Bitmap;
        
        public function SVGTextNode(svgRoot:SVGSVGNode, xml:XML = null, original:SVGNode = null):void {            
            super(svgRoot, xml, original);            
        }       
        
        
        /**
         * Get any child text (not text inside child nodes)
         * If this node has any text create a TextField at this._textField
         * Call SVGNode.parse()
         **/
        override protected function parseNodes():void {
            this._text = '';
            
            for each(var childXML:XML in this._xml.children()) {
                if (childXML.nodeKind() == 'text') {
                    this._text += childXML.toString();
                }
            }
            
            if (this._text != '') {
                this._textField = new TextField();
                this._textField.autoSize = TextFieldAutoSize.LEFT;
            }
            
            super.parseNodes();
        } 
        
        /**
         * Call SVGNode.setAttributes()
         * If this node contains text load text format (font, font-size, color, etc...)
         * Render text to a bitmap and add bitmap to node
         **/
        override protected function setAttributes():void {
            
            super.setAttributes();
            
            if (this._textField != null) {
                var fontFamily:String = this.getAttribute('font-family');                
                var fontSize:String = this.getAttribute('font-size');
                var fill:String = this.getAttribute('fill');
                var fontWeight:String = this.getAttribute('font-weight');
				var textAnchor:String = this.getAttribute('text-anchor');
                
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
				currentNode = this;
				while (fontWeight == 'inherit') {					
					if (currentNode.parent is SVGNode) {
						currentNode = SVGNode(currentNode.parent);
						fontWeight = currentNode.getAttribute('font-weight');
					}
					else {
						fontWeight = null;
					}
				}					
				if (fontWeight != null && fontWeight != 'normal') {
					textFormat.bold = true;
				}
                                
                this._textField.text = this._text;
                this._textField.setTextFormat(textFormat);
                
                var textLineMetrics:TextLineMetrics = this._textField.getLineMetrics(0);
				
				var currentNode:SVGNode = this;
				while (textAnchor == 'inherit') {					
					if (currentNode.parent is SVGNode) {
						currentNode = SVGNode(currentNode.parent);
						textAnchor = currentNode.getAttribute('text-anchor');
					}
					else {
						textAnchor = null;
					}
				}	
				
				//Handle text-anchor attribute
				switch (textAnchor) {					
					case 'middle':
						this._textField.x = textLineMetrics.x - 2 - Math.floor(textLineMetrics.width / 2);
						break;
					case 'end':
						this._textField.x = textLineMetrics.x - 2 - textLineMetrics.width;
						break;
					default: //'start'
						// 2 pixel gutter
						this._textField.x = -2;
						break;
				}
				
				//SVG Text elements position y attribute as baseline of text, not the
				//top
				//this._textField.y = 0 - textLineMetrics.ascent - 2;	
				this._textField.x = -2;
               
            }
        }    
        
        /**
         * Add _textField to node
         **/
        override protected function draw():void {
            super.draw();


            if (this._textField != null) {
                var textLineMetrics:TextLineMetrics = this._textField.getLineMetrics(0);
                //this.x = this.x -textLineMetrics.x - 2; //account for 2px gutter
                this.y = this.y - textLineMetrics.ascent - 1;

                this.addChild(this._textField);            
            } 
        }             
    }
}
