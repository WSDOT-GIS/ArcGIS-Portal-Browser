(function($){
	function init(){
		
		$("<div>").appendTo("body").portalSearch({
			num: 10,
			addLinkClick: function() {
				console.debug(arguments);
			}
		});
	}
	
	dojo.ready(init);
}(jQuery));