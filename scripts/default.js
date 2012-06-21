dojo.require("esri.arcgis.Portal");

var portal;

function createResultItem(portalItem) {
	var resultItem, key, portalItem, value;
	resultItem = $("<dl>");
	for (key in portalItem) {
		if (portalItem.hasOwnProperty(key)) {
			value = portalItem[key];
			if (value !== null & typeof(value) !== "undefined") {
				$("<dt>").text(key).appendTo(resultItem);
				if (key === "description") {
					$("<dd>").html(value).appendTo(resultItem);
				} else {
					$("<dd>").text(value).appendTo(resultItem);
				}
			}
		}
	}
	
	return resultItem;
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
		q: searchText
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


