(function($){

	dojo.require("esri.arcgis.Portal");
	
	var portal;
	/*
	 * ---------------------------
	 * |	Image	| Title		|	
	 * |			| Snippet	|
	 * |Add	Details	|			|
	 * |-------------------------
	 */
	$.widget("ui.portalItem", {
		options: {
			portalItem: null
		},
		_create: function() {
			var $this = this, portalItem = $this.options.portalItem, rootElem = $($this.element);
			if (portalItem !== null) {
				rootElem.addClass("portal-item");
				$("<h1>").text(portalItem.title).appendTo(rootElem);
				thumbDiv = $("<div>").addClass("thumb").appendTo(rootElem);
				if (portalItem.thumbnailUrl) {
					$("<img>").attr({
						src: portalItem.thumbnailUrl
					}).appendTo(thumbDiv);
				}
				linksDiv = $("<div>").appendTo(thumbDiv);
				
				$("<div><a href='#'>Add</a></div>").appendTo(linksDiv);
				$("<div><a href='#'>Details</a></div>").appendTo(linksDiv);
				textDiv = $("<div>").addClass("text").appendTo(rootElem);
				// $("<p>").html(portalItem.description).appendTo(rootElem);
				$("<p>").html(portalItem.snippet).appendTo(textDiv);
				$("<p>").text(portalItem.type + " by " + portalItem.owner).appendTo(textDiv);
			}
			return this;
		},
		_setOption: function(key,value){
			// Add custom option handling code here if necessary.
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		
		destroy: function() {
			
		}
		
	});
	
	$.widget("ui.searchResultsPage", {
		options: {
			queryResults: null
		},
		_create: function() {
			var $this = this, container, i, l, queryResults = this.options.queryResults;
			if (queryResults === null || typeof(queryResults) === "undefined"){
				throw new Error("The queryResults option cannot be set to null or undefined.");
			}
			// container = $("<div>").attr({
				// id: "queryResults"
			// });
			container = $this.element;
			container.addClass("query-results");
			if (queryResults.results.length > 0) {
				for (i = 0, l = queryResults.results.length; i < l; i += 1) {
					$("<section>").portalItem({
						portalItem: queryResults.results[i]
					}).appendTo(container);
				}
			} else {
				container.text("No results found.");
			}
			return this;
		},
		_setOption: function(key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		destroy: function() {
			
		}
	});
	
	function createResultItem(portalItem) {
		return $("<section>").portalItem({
			portalItem: portalItem
		});
	}
	
	function createResultsDisplay(queryResults) {
		return $("<div id='queryResults'>").searchResultsPage({
			queryResults: queryResults 
		});
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
}(jQuery));