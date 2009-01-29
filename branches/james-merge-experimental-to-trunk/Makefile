# To use the examples, copy the html, swf, and svg files to your web server directory.

com/sgweb/svg/build/svgviewer.swf: com/sgweb/svg/SVGViewerWeb.as com/sgweb/svg/nodes/*.as com/sgweb/svg/core/*.as com/sgweb/svg/utils/*.as
	(cd com/sgweb/svg;mxmlc -output build/SVGViewerWeb.swf -use-network=false -compiler.source-path ../../../ -- SVGViewerWeb.as)
	cp com/sgweb/svg/build/SVGViewerWeb.swf ../james-branch/testing/SvgViewer.swf	

clean:
	rm -f com/sgweb/svg/build/*


