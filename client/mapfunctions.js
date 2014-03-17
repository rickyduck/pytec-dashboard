var markerCluster;
function createPins() {
	if(!window.pins && typeof google != 'undefined' && google){
		window.pins = { 
			Other   : new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|5ab953",
			          new google.maps.Size(21, 34),
			          new google.maps.Point(0,0),
			          new google.maps.Point(10, 34)),
		    '.NET'  : new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|209eff",
			          new google.maps.Size(21, 34),
			          new google.maps.Point(0,0),
			          new google.maps.Point(10, 34)),
		    Java	: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|E57104",
				      new google.maps.Size(21, 34),
				      new google.maps.Point(0,0),
				      new google.maps.Point(10, 34)),
			PHP		: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|5A69A6",
				      new google.maps.Size(21, 34),
				      new google.maps.Point(0,0),
				      new google.maps.Point(10, 34)),
	   		Shadow	: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
				      new google.maps.Size(40, 37),
				      new google.maps.Point(0, 0),
				      new google.maps.Point(12, 35))
		}
	}
}
function initializeLeftMap() {
	if(!window.initalizedLeft){
    createPins();
	var location = MapLocationsCollection.findOne();
	geocoder = new google.maps.Geocoder();
	var jobs = JobsCollection.find().fetch();
	
	
	
	var json = JSON.parse(location.view_port);
	var myLatlng = new google.maps.LatLng(json.center[0],json.center[1]);

   
        
    
		
	var mapOptions = {
    	zoom: 7,
    	center: myLatlng,
    	disableDefaultUI: true,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
  	}
 	leftMap = new google.maps.Map(document.getElementById('map-canvas-left'), mapOptions);
 	leftMap.fitBounds( new google.maps.LatLngBounds(
                      new google.maps.LatLng(json.bounds[0][0],json.bounds[0][1]),
                      new google.maps.LatLng(json.bounds[1][0],json.bounds[1][1])
                   ) );
    var keyword_categories = KeywordCategoriesCollection.find().fetch();
		// get all the keyword categories
		var categories_o = [];
		var total_jobs = [];
		$.each(keyword_categories, function(index, keyword_category){
			var keywords = KeywordsCollection.find( {"keyword_id" : {$in : keyword_category.keywords }}).fetch();
			var job_count = 0;
			var keyword_total = [];
			$.each(keywords, function(index, keyword){
				var job_keywords_array = [];
				var job_keywords = JobKeywordsCollection.find({"keyword_id": keyword.keyword_id}).fetch();
				$.each(job_keywords, function(index, job_keyword){
					job_keywords_array.push(job_keyword.job_id);
					total_jobs.push(job_keyword.job_id);
					keyword_total.push(job_keyword.job_id);
				});
				
				
				
				//job_count += jobs.length;
			});
			var jobs = JobsCollection.find( {"job_id" : {$in : keyword_total }}).fetch();
				
			
			$.each(jobs, function(index, job){
				if(job.lat == 0 || job.lng == 0){
					geocoder.geocode( { 'address': job.address}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
						    var myLatlng = (results[0].geometry.location);
						    
						    JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
						} else {
							JobsCollection.update(job._id, {$set: {geocode: false}});
							return false;
						}
					});
				}else{
					var myLatlng = new google.maps.LatLng(job.lat, job.lng);
					
				}
				
				var marker = new google.maps.Marker({
				    position: myLatlng,
				    map: leftMap,
				    icon: window.pins[keyword_category.category_name],
	                shadow: window.pins["Shadow"],
	                
				    title:job.job_title
				});
				
			});
		});
		//Below covers all jobs that haven't been detected above
	 	var other_jobs = JobsCollection.find({job_id: {$nin: total_jobs}}).fetch();
	 	$.each(other_jobs, function(index, job){
					if(job.lat == 0 || job.lng == 0){
						geocoder.geocode( { 'address': job.address}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
							    var myLatlng = (results[0].geometry.location);
							    
							    JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
							} else {
								JobsCollection.update(job._id, {$set: {geocode: false}});
								return false;
							}
						});
					}else{
						var myLatlng = new google.maps.LatLng(job.lat, job.lng);
						
					}
					
					var marker = new google.maps.Marker({
					    position: myLatlng,
					    map: leftMap,
					    icon: window.pins["Other"],
		                shadow: window.pins["Shadow"],
		                
					    title:job.job_title
					});
				
				});
	 	
	 	
 	/*$.each(jobs, function(index, job){
		if(job.lat == 0 || job.lng == 0){
			setTimeout(function(){ 
				geocoder.geocode( { 'address': job.address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
					    var myLatlng = (results[0].geometry.location);
					    
					    JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
					    
					} else {
						JobsCollection.update(job._id, {$set: {geocode: false}});
						return false;
					}
				});
			},500);
		}else{
			var myLatlng = new google.maps.LatLng(job.lat, job.lng);
			
		}
		
		var marker = new google.maps.Marker({
		    position: myLatlng,
		    map: leftMap,
		    icon: window.pins[job.job_type],
            shadow: window.pins["Shadow"],
		});
		console.log(marker);
	})*/
	Session.set("current_location", location._id);
	initializeRightMap();
	window.changeMapTimeout = setTimeout(function(){
		
		changeMap();
	},location.time_to_show*1000);
	
  window.initializedLeft = true;
  }
}
function serializeViewport(map){
    var json = '{"bounds":'+map.getBounds().toString() + 
               ',"center":'+map.getCenter().toString()+"}";

    //'toString' returns values in '()', we need to replace them by '[]'
    json = json.replace(/\(/g,"[").replace(/\)/g,"]");
    return json;
}
function deserializeViewport(map, json, useCenter ){
    json = JSON.parse(json);
    if( useCenter ){
        map.setCenter( new google.maps.LatLng(json.center[0],json.center[1]) );
    }else{
        map.fitBounds( new google.maps.LatLngBounds(
                      new google.maps.LatLng(json.bounds[0][0],json.bounds[0][1]),
                      new google.maps.LatLng(json.bounds[1][0],json.bounds[1][1])
                   ) );
    }
}



function initializeRightMap() {
	if(!window.initalizedRight){
	createPins();
	window.rightMarkers = [];
	
	geocoder = new google.maps.Geocoder();
	var jobs = JobsCollection.find().fetch();
	geocoder.geocode( { 'address': "England"}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		    var myLatlng = (results[0].geometry.location);
		    
		} else {
			var myLatlng = new google.maps.LatLng(52.722986,-1.494141);
		};
		
		var mapOptions = {
	    	zoom: 7,
	    	center: myLatlng,
	    	disableDefaultUI: true,
	    	mapTypeId: google.maps.MapTypeId.ROADMAP
	  	}
	 	window.map = new google.maps.Map(document.getElementById('map-canvas-right'), mapOptions);
	 	
	 	
	 	
	 	var keyword_categories = KeywordCategoriesCollection.find().fetch();
		// get all the keyword categories
		var categories_o = [];
		var total_jobs = [];
		$.each(keyword_categories, function(index, keyword_category){
			var keywords = KeywordsCollection.find( {"keyword_id" : {$in : keyword_category.keywords }}).fetch();
			var job_count = 0;
			var keyword_total = [];
			$.each(keywords, function(index, keyword){
				var job_keywords_array = [];
				var job_keywords = JobKeywordsCollection.find({"keyword_id": keyword.keyword_id}).fetch();
				$.each(job_keywords, function(index, job_keyword){
					job_keywords_array.push(job_keyword.job_id);
					total_jobs.push(job_keyword.job_id);
					keyword_total.push(job_keyword.job_id);
				});
				
				
				
				//job_count += jobs.length;
			});
			var jobs = JobsCollection.find( {"job_id" : {$in : keyword_total }}).fetch();
				
			
			$.each(jobs, function(index, job){
				if(job.lat == 0 || job.lng == 0){
					geocoder.geocode( { 'address': job.address}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
						    var myLatlng = (results[0].geometry.location);
						    
						    JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
						} else {
							JobsCollection.update(job._id, {$set: {geocode: false}});
							return false;
						}
					});
				}else{
					var myLatlng = new google.maps.LatLng(job.lat, job.lng);
					
				}
				
				var marker = new google.maps.Marker({
				    position: myLatlng,
				    map: window.map,
				    icon: window.pins[keyword_category.category_name],
	                shadow: window.pins["Shadow"],
	                
				    title:job.job_title
				});
				marker.job_type =  keyword_category.category_name;
				window.rightMarkers.push(marker);
				
				window.refreshMap = true; showMarkers();
				
			});
		});
		//Below covers all jobs that haven't been detected above
	 	var other_jobs = JobsCollection.find({job_id: {$nin: total_jobs}}).fetch();
	 	$.each(other_jobs, function(index, job){
					if(job.lat == 0 || job.lng == 0){
						geocoder.geocode( { 'address': job.address}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
							    var myLatlng = (results[0].geometry.location);
							    
							    JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
							} else {
								JobsCollection.update(job._id, {$set: {geocode: false}});
								return false;
							}
						});
					}else{
						var myLatlng = new google.maps.LatLng(job.lat, job.lng);
						
					}
					
					var marker = new google.maps.Marker({
					    position: myLatlng,
					    map: window.map,
					    icon: window.pins["Other"],
		                shadow: window.pins["Shadow"],
		                
					    title:job.job_title
					});
					marker.job_type =  "Other";
					window.rightMarkers.push(marker);
					
					window.refreshMap = true; showMarkers();
					
				});
	 	
	 	
		/*$.each(jobs, function(index, job){
			if(job.lat == 0 || job.lng == 0){
				geocoder.geocode( { 'address': job.address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
					    var myLatlng = (results[0].geometry.location);
					    
					    JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
					} else {
						JobsCollection.update(job._id, {$set: {geocode: false}});
						return false;
					}
				});
			}else{
				var myLatlng = new google.maps.LatLng(job.lat, job.lng);
				
			}
			
			var marker = new google.maps.Marker({
			    position: myLatlng,
			    map: window.map,
			    icon: window.pins[job.job_type],
                shadow: window.pins["Shadow"],
                
			    title:job.job_title
			});
			marker.job_type =  job.job_type;
			window.rightMarkers.push(marker);
			
			window.refreshMap = true; showMarkers();
			
		});*/
	});
  	window.initializedRight = true;
  	}
} 
function initializeJobMap() {
	if(!Session.get("job_flash_map_initialized")){
	createPins();
	window.jobMapMarkers = [];
	this.marker = null;
	geocoder = new google.maps.Geocoder();
	var job = JobsCollection.findOne({}, {sort: {'added_date': -1}});
	geocoder.geocode( { 'address': job.address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		    var myLatlng = (results[0].geometry.location);
		    var mapOptions = {
		    	zoom: 7,
		    	center: myLatlng,
		    	disableDefaultUI: true,
		    	mapTypeId: google.maps.MapTypeId.ROADMAP
		  	}
		  	if(this.marker){
		  		this.marker.setMap(null);
		  	}
		 	window.jobMap = new google.maps.Map(document.getElementById('map-holder'), mapOptions);
		 	JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
			this.marker = new google.maps.Marker({
			    position: myLatlng,
			    map: window.jobMap,
			    icon: window.pins[job.job_type],
                shadow: window.pins["Shadow"],
                
			    title:job.job_title
			});
			window.jobMap.setCenter(myLatlng);
			marker.job_type =  job.job_type;
			//window.jobMapMarkers.push(marker);
		} 
		Session.set("job_flash_map_initialized",true)
		
	});
  	
  	}
} 
function showLatestJobOnMap(){
	/*if(!Session.get("job_flash_map_initialized")){
		initializeJobMap();
	}*/
	
	createPins();
	this.marker = null;
	//google.maps.event.trigger(window.jobMap, 'resize'); 
	geocoder = new google.maps.Geocoder();
	var job = JobsCollection.findOne({}, {sort: {'job_id': -1}});
	geocoder.geocode( { 'address': job.address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			$("#jobHolder").fadeIn(750, function(){
				notification();
			});
		    var myLatlng = (results[0].geometry.location);
		    var mapOptions = {
		    	zoom: 8,
		    	center: myLatlng,
		    	disableDefaultUI: true,
		    	mapTypeId: google.maps.MapTypeId.ROADMAP
		  	}
		  		window.jobMap = new google.maps.Map(document.getElementById('map-holder'), mapOptions);

		  	if(this.marker){
		  		this.marker.setMap(null);
		  	}
		  	
		 		
		 	
		 	JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
			this.marker = new google.maps.Marker({
			    position: myLatlng,
			    map: window.jobMap,
			    icon: window.pins[job.job_type],
                shadow: window.pins["Shadow"],
                
			    title:job.job_title
			});
			marker.job_type =  job.job_type;
			var settings = SettingsCollection.findOne();
			if(settings){
			$("#jobHolder").delay(settings.job_duration*1000).fadeOut(750);
			}
			//window.jobMapMarkers.push(marker);
		}else{
			alert("invalid geocode");
		}
		Session.set("job_flash_map_initialized",true)
		
	});
}

function showMarkers() {
	if(window.refreshMap){
		clearTimeout(window.markerTimeout);
		window.refreshMap = false;
		var jobType="";
		if(Session.get("right_map_marker")){
			var nextOne = false;
			var jobSet = false;
			var i = 0;
			var firstJob = "";
			var currentJobType = Session.get("right_map_marker")
			$.each(window.pins, function(key,value){
				i++;
				if(i==1){
					firstJob = key;
				}
				if(nextOne){
					
					jobType = key;
					jobSet = true;
					nextOne = false;
				}else{
					if(jobSet && key != jobType){
						hideMarkers(key);	
					}else if(!jobSet){
						hideMarkers(key);
					}
					
				}
				if(key==currentJobType && jobSet==false){
					nextOne = true;
					if(i == Object.keys(window.pins).length-1){
						jobType = firstJob;
						return false;
					}
				}
				
			});
			
		}else{
			jobType = "PHP";
			
		}
		
		Session.set("right_map_marker",jobType);
		var visibleMarkers = [];
		for (var i=0; i<window.rightMarkers.length; i++) {
			if (window.rightMarkers[i].job_type == Session.get("right_map_marker")) {
		    	window.rightMarkers[i].setVisible(true);
		    	visibleMarkers.push(window.rightMarkers[i]);
		    }
		}
		if(markerCluster){
			markerCluster.clearMarkers();
		}
		var color = "";
		switch (Session.get("right_map_marker")){
			case ".NET": 
			color = "blue";
			break;
			case "PHP":
			color = "purple";
			break;
			case "Java":
			color = "orange";
			break;
			default:
			color = "green";
			break;
		}
		markerCluster = new MarkerClusterer(window.map, visibleMarkers, {}, color);
		window.markerTimeout = setTimeout(function(){ window.refreshMap = true; showMarkers(); },5000);
	}
}

  // == hides all markers of a particular category, and ensures the checkbox is cleared ==
  function hideMarkers(jobType) {
    for (var i=0; i<window.rightMarkers.length; i++) {
      if (window.rightMarkers[i].job_type == jobType) {
        window.rightMarkers[i].setVisible(false);
      }
    }
    // == clear the checkbox ==
// == close the info window, in case its open on a marker that we just hid
  }