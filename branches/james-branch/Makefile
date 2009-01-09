# To use the examples, copy the html, swf, and svg files to your web server directory.

com/sgweb/svg/build/svgviewer.swf: com/sgweb/svg/SVGViewer.as com/sgweb/svg/data/*.as com/sgweb/svg/nodes/*.as com/sgweb/svg/utils/*.as com/sgweb/svg/nodes/mask/*.as
	(cd com/sgweb/svg;mxmlc -output build/svgviewer.swf -use-network=false -compiler.source-path ../../../ -- SVGViewer.as)
	cp com/sgweb/svg/build/svgviewer.swf testing/SvgViewer.swf	

clean:
	rm -f com/sgweb/svg/build/*


