(function($){
	dojo.require("esri.arcgis.Portal");
	 
	function init(){
		
		var portal = new esri.arcgis.Portal([window.location.protocol, "wsdot.maps.arcgis.com"].join("//"));
		
		portal.signIn();
		
		$("<div>").appendTo("body").portalSearch({
			portal: portal,
			num: 10,
			addLinkClick: function() {
				console.debug(arguments);
			}
		});
	}
	
	dojo.ready(init);
}(jQuery));