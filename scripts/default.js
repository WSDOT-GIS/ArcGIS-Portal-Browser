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
			var $this = this, portalItem = $this.options.portalItem, rootElem = $($this.element), link, showDetails;
			
			showDetails = function(/*evt*/) {
				/**
				 * Shows the details of the portal item in a jQuery UI dialog.
				 */
				$("<div>").html(portalItem.description).dialog({
					modal: true,
					title: portalItem.title,
					close: function(/*evt, data*/) {
						/**
						 * Destroys the dialog and removes the DOM element from the document.
						 */
						$(this).dialog("destroy").remove();
					}
				});
				return false;
			}
			
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
					href: "#",
					target: "_blank"
				}).click(showDetails);
				
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
	
	// function onQueryComplete(result) {
		// $("#queryResults").remove();
		// createResultsDisplay(result).appendTo("body");
	// }
	
	$.widget("ui.portalSearch", {
		options: {
			portalUrl: "www.arcgis.com"
		},
		_portal: null,
		_searchBox: null,
		_queryResultsSection: null,
		_search: function() {
			var $this = this, searchText, qParams, portal;
				function onQueryComplete(result) {
					if ($this._queryResultsSection) {
						$this._queryResultsSection.remove();
					}
					$this._queryResultsSection = $("<div>").searchResultsPage({
						queryResults: result
					}).appendTo($this.element);
				}
			searchText = $this._searchBox.val();
			qParams = {
				num: 1000,
				q: [searchText, "type:Service"].join(" ")
			}
			portal = $this._portal;
			portal.queryItems(qParams).then(onQueryComplete);
		},
		_create: function() {
			var $this = this, root = $this.element;
			
			// Make sure the portal option was specified before proceeding any further.
			if (!$this.options.portalUrl) {
				throw new Error("No portal object was specified.");
			} else {
				// protocol will be either http: or https:.
				$this._portal = esri.arcgis.Portal([window.location.protocol, $this.options.portalUrl].join("//"));
			}
			
			// Add the search box.
			$this._searchBox = $("<input>").attr({
				type: "search",
				disabled: true
			}).appendTo(root);
			
			dojo.connect($this._portal, "onLoad", function() {
				//console.debug(portal);
				$this._searchBox.attr("disabled", null).keyup(function(eventObject) {
					if (eventObject.keyCode === 13) {
						$this._search();
					}
				});
			});
			
			return this;
		},
		_setOption: function(key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		destroy: function() {
			
		}
	});
	
	// function createResultItem(portalItem) {
		// return $("<section>").portalItem({
			// portalItem: portalItem
		// });
	// }
// 	
	// function createResultsDisplay(queryResults) {
		// return $("<div id='queryResults'>").searchResultsPage({
			// queryResults: queryResults 
		// });
	// }
	
	
	// function search() {
		// var searchText, qParams;
		// searchText = $("#searchBox").val();
		// qParams = {
			// num: 1000,
			// q: [searchText, "type:Service"].join(" ")
		// }
		// portal.queryItems(qParams).then(onQueryComplete);
	// }
	
	function init(){
		
		$("<div>").appendTo("body").portalSearch();
		
		// // Get the protocol of this page
		// protocol = window.location.protocol; // http: or https:

		// portal = esri.arcgis.Portal(protocol + "//www.arcgis.com");

		// dojo.connect(portal, "onLoad", function() {
			// //console.debug(portal);
			// $("#searchBox, #searchButton").attr("disabled", null);
			// $("#searchButton").click(search);
			// $("#searchBox").keyup(function(eventObject) {
				// if (eventObject.keyCode === 13) {
					// search();
				// }
			// });
		// });
	}
	
	dojo.ready(init);
}(jQuery));