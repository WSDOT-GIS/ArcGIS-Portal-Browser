dojo.require("esri.arcgis.Portal");

var portal;
/*
 * --------------------------------------
 * |			| Title		|			|	
 * |  Image		| Snippet	|	[Add]	|
 * |			|			|			|
 * |-------------------------------------
 */

function createResultItem(portalItem) {
	var output, thumbDiv, linksDiv, textDiv;
	output = $("<section>").addClass("portal-item");
	$("<h1>").text(portalItem.title).appendTo(output);
	thumbDiv = $("<div>").addClass("thumb").appendTo(output);
	if (portalItem.thumbnailUrl) {
		$("<img>").attr({
			src: portalItem.thumbnailUrl
		}).appendTo(thumbDiv);
	}
	linksDiv = $("<div>").appendTo(thumbDiv);
	
	$("<div><a href='#'>Add</a></div>").appendTo(linksDiv);
	$("<div><a href='#'>Details</a></div>").appendTo(linksDiv);
	textDiv = $("<div>").addClass("text").appendTo(output);
	// $("<p>").html(portalItem.description).appendTo(output);
	$("<p>").html(portalItem.snippet).appendTo(textDiv);
	$("<p>").text(portalItem.type + " by " + portalItem.owner).appendTo(textDiv);
	return output;
}

function createResultsDisplay(queryResults) {
	var container;
	container = $("<div>").attr({
		id: "queryResults"
	});
	if (queryResults.results.length > 0) {
		for (var i = 0, l = queryResults.results.length; i < l; i += 1) {
			createResultItem(queryResults.results[i]).appendTo(container);
		}
	} else {
		container.text("No results found.");
	}
	return container;
}

function onQueryComplete(result) {
	$("#queryResults").remove();
	createResultsDisplay(result).appendTo("body");
}

function search() {
	var searchText, qParams;
	searchText = $("#searchBox").val();
	qParams = {
		q: searchText + " type:Service"
	}
	portal.queryItems(qParams).then(onQueryComplete);
}

function init(){
	
	// Get the protocol of this page
	protocol = window.location.protocol; // http: or https:
	
	portal = esri.arcgis.Portal(protocol + "//www.arcgis.com");

	dojo.connect(portal, "onLoad", function() {
		//console.debug(portal);
		$("#searchBox, #searchButton").attr("disabled", null);
		$("#searchButton").click(search);
	});
}

dojo.ready(init);


