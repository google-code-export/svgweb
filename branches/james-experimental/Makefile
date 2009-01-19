# To use the examples, copy the html, swf, and svg files to your web server directory.

com/sgweb/svg/build/svgviewer.swf: com/svgweb/svg/SVGViewerWeb.as com/svgweb/svg/nodes/*.as com/svgweb/svg/core/*.as com/svgweb/svg/utils/*.as
	(cd com/svgweb/svg;mxmlc -output build/SVGViewerWeb.swf -use-network=false -compiler.source-path ../../../ -- SVGViewerWeb.as)
	cp com/svgweb/svg/build/SVGViewerWeb.swf ../james-branch/testing/SvgViewer.swf	

clean:
	rm -f com/sgweb/svg/build/*


