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
			var $this = this, portalItem = $this.options.portalItem, rootElem = $($this.element), link;
			if (portalItem !== null) {
				rootElem.addClass("portal-item");
				rootElem.attr("title", portalItem.description);
				thumbDiv = $("<div>").addClass("thumb").appendTo(rootElem);
				if (portalItem.thumbnailUrl) {
					$("<img>").attr({
						src: portalItem.thumbnailUrl
					}).appendTo(thumbDiv);
				}
				linksDiv = $("<div>").appendTo(thumbDiv);
				
				link = $("<a href='#'>Add</a>");
				$("<div>").appendTo(linksDiv).append(link);
				
				link = $("<a>").text("Details").attr({
					href: portalItem.itemUrl,
					target: "_blank"
				});
				$("<div>").appendTo(linksDiv).append(link);
				textDiv = $("<div>").addClass("text").appendTo(rootElem);
				$("<h1>").text(portalItem.title).appendTo(textDiv);
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
			var $this = this, container, resultsList, i, l, queryResults = this.options.queryResults;
			if (queryResults === null || typeof(queryResults) === "undefined"){
				throw new Error("The queryResults option cannot be set to null or undefined.");
			}
			container = $this.element;
			resultsList = $("<div>").addClass("query-results").appendTo(container);
			if (queryResults.results.length > 0) {
				for (i = 0, l = queryResults.results.length; i < l; i += 1) {
					$("<section>").portalItem({
						portalItem: queryResults.results[i]
					}).appendTo(resultsList);
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
			num: 1000,
			q: [searchText, "type:Service"].join(" ")
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