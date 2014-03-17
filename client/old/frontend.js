jQuery.fx.interval = 100;

Template.applicationHolder.rendered = function(){
	Session.set("localPath", "C:\\server\\pytec-kpi-dashboard-app");

}
Template.applicationHolder.helpers({
	isSiteLoaded: function(){
		system_dep.depend();
		return typeof(Session.get("system")) !== "undefined"
	},
	isSystemFrontend: function(){
		return Session.get("system")=="frontend";
	},
	isSystemAdmin: function(){
		
		return Session.get("system")=="admin";
	},
	isSystemAdminLogin: function(){
		return Session.get("system")=="adminLogin";
	},
	momentumStartColour: function(){
		return SettingsCollection.findOne({key:"momentum_start", type:"colour"}).colour;
	},
	momentumEndColour: function(){
		return SettingsCollection.findOne({key:"momentum_end", type:"colour"}).colour;
	}
});
Template.applicationHolder.page = function(){
	return Session.get("page");
}
Template.applicationHolder.category = function(){
	return Session.get("category");
}












/* FRONT END STUFF */


notification = function (key){
		if(!window.audio){
			var settings = SettingsCollection.findOne({type:"main"});
			window.audio = document.createElement("audio");
			window.audio.src = settings[key];
			window.audio.addEventListener("ended", function () {
			   // document.removeChild(this);
			}, false);
		}
        window.audio.play();   
    }
loopContainer = function (){
	var height = ($("main .left .result").parent().height()) - ($("main .left .result").outerHeight() * 5)-40;
	var time = (Session.get("timeout")-15000)/2;
	
	$("main .left > div").delay(5000).animate({marginTop:"-"+height+"px"},time, function(){
		
		$("main .left > div").delay(5000).animate({marginTop: 0}, time);
	});
	$("main .right > div").delay(5000).animate({marginTop:"-"+height+"px"},time, function(){
		
		$("main .right  > div").delay(5000).animate({marginTop: 0}, time);
	});
}
$(document).keyup(function(e) {

  if (e.keyCode == 27) { $(".pause_play").trigger("click").trigger("mouseover").delay(1000).trigger("mouseout");}   // esc
});
var $wrapper;
var $main;
var targets;
var target;

deleteGraph = function (){
	Session.set("current_page",null)
	Session.set("target", null);
	Session.set("current_page", null);
	Session.set("target_title", null);
	Session.set("period", null);
	Session.set("period_title",null);
	Session.set("period_previous", null);
	Session.set("period_previous_title", null);
	Session.set("target_number", null);
	Session.set("target", null);
	Session.set("target_period",0);
	$("#wrapper").removeAttr("style");
	$wrapper.remove();
	$main.remove();
	$wrapper = null;
	$main = null;
	targets = null;
}

changeGraph = function (){
	var targets = 	TargetsCollection.find({charts:1},{sort:{order:1}}).fetch();
	
	$("#wrapper").css("background-image","none");
	$wrapper = $("#wrapper");
	$main = $('main');
	if(window.pageTimer){
		clearTimeout(window.pageTimer);
	}
		
	if( targets && targets.length){
		var timeout=0;
		if(!Session.get("current_page")){
			//var t = 0;
			var useTarget;
			var usePeriod;
			for (var i = 0; i < targets.length; i++) {
				
				for(var t = 0; t < targets[i].target_periods.length; t++){
					if(targets[i].target_periods[t].active){
						useTarget = i;
						usePeriod = t;
						break;
					}
				}	
			}
			Session.set("current_page", targets[0].target_for);
			Session.set("target_title", targets[0].target_title);
			Session.set("period", targets[0].target_periods[0].target_period);
			Session.set("period_title", targets[0].target_periods[0].target_period_title);
			Session.set("period_previous", targets[0].target_periods[0].target_period_previous);
			Session.set("period_previous_title", targets[0].target_periods[0].target_period_previous_title);
			Session.set("target_number", targets[0].target_periods[0].target_number);
			Session.set("target", targets[0]);
			Session.set("target_period",0);
		//	$wrapper.attr("style",'background-image:url(\'' +targets[0].target_image+'\');');
			timeout = (targets[0].target_periods[0].seconds_to_show)*1000;
			
		}else{
			var currentPage = Session.get("current_page");
			var currentPeriod = Session.get("period");
			
			$.each(targets, function(index, target){
				var moveNext = false;
				var nextPeriodIndex = null;
				if(target.target_for==currentPage){
					$.each(target.target_periods, function(periodIndex, period){
						
						if(period.target_period == currentPeriod){
							nextPeriodIndex = periodIndex+1;
						}
						if(nextPeriodIndex){
							if(nextPeriodIndex == (target.target_periods).length){
								moveNext = true;
							}else{
								if(targets[index].target_periods[nextPeriodIndex].active){
									Session.set("period", targets[index].target_periods[nextPeriodIndex].target_period);
									Session.set("period_title", targets[index].target_periods[nextPeriodIndex].target_period_title);
									Session.set("period_previous", targets[index].target_periods[nextPeriodIndex].target_period_previous);
									Session.set("period_previous_title", targets[index].target_periods[nextPeriodIndex].target_period_previous_title);
									Session.set("target_number", targets[index].target_periods[nextPeriodIndex].target_number);
									Session.set("target", targets[index]);
									Session.set("target_period",nextPeriodIndex);
								//	$wrapper.css("background-image", targets[index].target_image);
								//	$wrapper.attr("style",'background-image:url(\'' +targets[index].target_image+'\');');

								///	$wrapper.css("background-image", targets[index].target_periods[usePeriod].target_image);
									timeout = targets[index].target_periods[nextPeriodIndex].seconds_to_show*1000;
								}else{
									nextPeriodIndex += 1;
								}
							}
						}
						
					});
					if(moveNext){
						targetIndex = index+1;
						var useTarget;
						var usePeriod;
						if(targetIndex==(targets.length)){
							targetIndex=0;
							deleteGraph();
							Router.navigate("/frontend/map/",true);
						}
						var breakOut = false;
						for (var i = targetIndex; i < targets.length; i++) {
							if(breakOut){
								break;
							}
							for(var t = 0; t < targets[i].target_periods.length; t++){
								if(targets[i].target_periods[t].active){
									useTarget = i;
									usePeriod = t;
									breakOut = true;
									break;
								}
							}	
							//targetIndex++;
						}
						
						
						var nextTarget = targets[useTarget];
						Session.set("current_page", nextTarget.target_for);
						Session.set("target_title", nextTarget.target_title);
						Session.set("period", nextTarget.target_periods[usePeriod].target_period);
						Session.set("period_title", nextTarget.target_periods[usePeriod].target_period_title);
						Session.set("period_previous", nextTarget.target_periods[usePeriod].target_period_previous);
						Session.set("period_previous_title", nextTarget.target_periods[usePeriod].target_period_previous_title);
						Session.set("target_number", nextTarget.target_periods[usePeriod].target_number);
						timeout = nextTarget.target_periods[usePeriod].seconds_to_show*1000;
					//	$wrapper.attr("style",'background-image:url(\'' +nextTarget.target_image+'\');');
						
					}
					
				}
				//Meteor.setTimeout(function(){ changeGraph();}, timeout);
			});
		}
		Session.set("timeout",timeout);
		loopContainer();
		
		window.pageTimer = Meteor.setTimeout(function(){ 
			Meteor.call("makeCall",function(){
				cvsSentHit.changed();
				$("#cvsSentFlash").fadeIn(500,function(){
					Meteor.setTimeout(function(){
						$("#cvsSentFlash").fadeOut(500);
					},3000);
				});
				changeGraph();
			})
			}, timeout);
		//	$wrapper.delay(500).css("background-image","none");
		//	$wrapper.delay(500).css("background-size","cover");
		//	$main.find(".image img").delay(500).attr("src","");
	}
	targets = null;
	delete targets;
}

changeMap = function (){
//console.log("Page:"+Session.get("page"));
	if(Session.get("page") == "map"){
	clearTimeout(window.changeMapTimeout);
	var currentLocation = Session.get("current_location");
	var locations = MapLocationsCollection.find().fetch();
	var useNext = false;
	if( typeof currentLocation == "undefined"){
	//	window.location.href = "/frontend/charts/";
	}
	$.each(locations, function(index, location){
		if(useNext){
			Session.set("current_location", location._id);
			return false;
		}
		if(location._id == currentLocation || typeof currentLocation == "undefined" || ! currentLocation){
			if(index == locations.length-1){
				
				//window.location.href = "/frontend/charts/";
			destroyMaps();
				
			}else{
				useNext = true;
			}
		}
	});
	var locationToUse = MapLocationsCollection.findOne(Session.get("current_location"));
	deserializeViewport(window.leftMap, locationToUse.view_port, false);
	
	window.changeMapTimeout = Meteor.setTimeout(function(){
		window.refreshMap = true;
		showMarkers();
		changeMap();
	},locationToUse.time_to_show*1000);
	}
}
destroyMaps = function () {
	//window.leftMap = null;
	//window.map = null;
	
	window.$leftMap = $("#map-canvas-left");
	window.$rightMap = $("#map-canvas-right");
	Router.navigate('/frontend/charts/',true);
	geocoder = null;
	for (var i=0; i<window.rightMarkers.length; i++) {
        window.rightMarkers[i].setMap(null);
        window.rightMarkers[i] = null;
    }
	window.rightMarkers = null;
	//$("#map-canvas-right").remove();
	
	for (var i=0; i<window.leftMarkers.length; i++) {
        window.leftMarkers[i].setMap(null);
        window.leftMarkers[i] = null;
    }
	window.leftMarkers = null;
//	delete window.leftMap;
//	delete window.leftMap; 
	//markerCluster.clearMarkers();
	//markerCluster.remove();  
	markerCluster = null;
	
}
initializeRightMap = function () {
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
	  	if(!window.map){
	  		window.map = new google.maps.Map(document.getElementById('map-canvas-right'), mapOptions);	
	  	}else{
	  		$(".map_right").html(window.$rightMap);
	  	}
	 	
	 	
	 	
	 	
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
				marker = null;
				window.refreshMap = true; 
				
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
					marker = null;
					window.refreshMap = true; 
					
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
initializeLeftMap = function () {
	if(!window.initalizedLeft){
	window.leftMarkers = [];
    createPins();
	var tlocation = MapLocationsCollection.findOne();
	geocoder = new google.maps.Geocoder();
	var jobs = JobsCollection.find().fetch();
	
	
	if(typeof tlocation == "undefined"){
	location.reload(true);
	}
	var json = JSON.parse(tlocation.view_port);
	var myLatlng = new google.maps.LatLng(json.center[0],json.center[1]);

   
        
    
		
	var mapOptions = {
    	zoom: 7,
    	center: myLatlng,
    	disableDefaultUI: true,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
  	}
  	if(!window.leftMap){
 		window.leftMap = new google.maps.Map(document.getElementById('map-canvas-left'), mapOptions);
 	}else{
  		$(".map").html(window.$leftMap);
  	}
 	window.leftMap.fitBounds( new google.maps.LatLngBounds(
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
				    map: window.leftMap,
				    icon: window.pins[keyword_category.category_name],
	                shadow: window.pins["Shadow"],
	                
				    title:job.job_title
				});
				window.leftMarkers.push(marker);
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
					    map: window.leftMap,
					    icon: window.pins["Other"],
		                shadow: window.pins["Shadow"],
		                
					    title:job.job_title
					});
					window.leftMarkers.push(marker);
				});
	 	
	 	
 	/*$.each(jobs, function(index, job){
		if(job.lat == 0 || job.lng == 0){
			Meteor.setTimeout(function(){ 
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
		    map: window.leftMap,
		    icon: window.pins[job.job_type],
            shadow: window.pins["Shadow"],
		});
		console.log(marker);
	})*/
	Session.set("current_location", location._id);
	initializeRightMap();
	window.changeMapTimeout = Meteor.setTimeout(function(){
		
		changeMap();
	},location.time_to_show*1000);
	
  window.initializedLeft = true;
  }
}
var cvsSentHit = new Deps.Dependency;
Template.frontend.helpers({
	isChartPage: function(){
		return Session.get("system")=="frontend" && Session.get("page") == "charts";	
	},
	chart_background_image: function(){
		//alert("HELLO");
		if(TargetsCollection.find().fetch().length){
			var timePeriod = Session.get("current_page");
			var target = TargetsCollection.find({target_for: timePeriod}).fetch();
			if(target && target[0].target_image){
			//	return 'style=background-image:url(\'' +target[0].target_image+'\');" ';
			}
			delete target;
		}
	},
	isMapPage: function(){
		return Session.get("system")=="frontend" && Session.get("page") == "map";	
	},
	employees: function(){
		var employees = EmployeeCollection.find({active: true}).fetch();
		var height = 795;
		var width = 1710;
		var minimum = ((width/employees.length)-40)+150;
		var bar_height = height - minimum; 
		
		var momentums = MomentumCollection.find().fetch();
		_.each(employees, function(employee){
			weight = 0;
			_.each(momentums, function(momentum){
				var count = employee[momentum.target][momentum.target_period];
				var target = TargetsCollection.findOne({target_for: momentum.target});
				var target_period = 0;
				var i = 0;
				_.each(target.target_periods, function(period){
					if(period.target_period == momentum.target_period){
						target_period = period.target_period;
					};
					i++;
				});
				var target_number = employee['targets'][target.target_for][target_period ]["target_number"];
				var percentage = (count/target_number)*100;
				weight = weight + (percentage*parseInt(momentum.value));
				delete target;
			});
			var threshold = MomentumThresholdCollection.findOne({day:moment().format('dddd')});
			employee.weight = Math.floor(weight);
			if(employee.weight<threshold.orange){
				employee.colour = "red";
			}else if(employee.weight<threshold.green){
				employee.colour = "orange";
			}else if(employee.weight>=threshold.green){
				employee.colour = "green";
			}
			var percentage = (employee.weight/threshold.green)*100;
			percentage = percentage>100?100:percentage;
			employee.percentage = (percentage>20?percentage:20);
			var fraction = employee.percentage/100;
			employee.height = (fraction * bar_height)+minimum;
		});

		employees =  _.sortBy(employees, function(employee){
	 		
			
			return -Math.abs(employee.weight);
		});
		
		return employees;
	},
	employee_image: function(){
		var employee = this;
		var photo = employee.colour=="green"?employee.good_photo:employee.bad_photo;
		return photo?photo:"/frontend/img/no_photo.jpg";
	},
	chart: function(){
		var employees = EmployeeCollection.find({active: true}).fetch();
		var width = 1710;
		var chart =  {};
		chart.count = employees.length;
		chart.width = (width/chart.count)-40;
		return chart;
	},
	cv_employee: function(){
		cvsSentHit.depend();
		var employee = EmployeeCollection.findOne({"targets.cvs_sent.week.target_hit":1});
		return employee;
	},
	employee_name: function(){
		var employee = this;
		if(employee.nick_name){
			return employee.nick_name;
		}else{
			return employee.first_name;
		}
	},
	momentum_image: function(){
		var setting = SettingsCollection.findOne({type:"main"});
		return setting.momentum_image;
	}
});
showMomentum = function(timeout){
	$("#momentumFlash").fadeIn(500, function(){
		notification("momentum_audio");
		Meteor.setTimeout(function(){
			$("#momentumFlash").fadeOut(500);
		},timeout);
	})
}
Template.frontend.rendered = function(){
	var settings = SettingsCollection.findOne({type:"main"});
	if(typeof window.momentumInterval == "undefined"){
		window.momentumInterval = Meteor.setInterval(function(){
			showMomentum(settings.momentum_time_to_show*1000);
		},settings.momentum_interval*1000);
	}
}
Template.frontend.events({
	"click .pause_play":  function(event, template){
		var toSetting = $.trim($(template.find('.pause_play > div')).text().replace(/\s+/g, ' '));
		if(toSetting == "Playing"){
			if(Session.get("page")=="charts"){
				clearTimeout(window.pageTimer);
				
			}else if(Session.get("page")=="map"){
				clearTimeout(window.markerTimeout);
				clearTimeout(window.changeMapTimeout);
			}
			$(template.find('.pause_play > div')).text("Paused").addClass("active");
		}else if(toSetting == "Paused"){
			if(Session.get("page")=="charts"){
				window.pageTimer = Meteor.setTimeout(function(){ changeGraph();}, 10000);
			}else if(Session.get("page")=="map"){
				window.changeMapTimeout = Meteor.setTimeout(function(){
					changeMap();
					window.refreshMap = true; 
					showMarkers();
				},5000);
				window.markerTimeout = Meteor.setTimeout(function(){ },5000);

			}
			$(template.find('.pause_play > div')).text("Playing").removeClass("active");
		}
	}
})
lengthArr = Array();
countLengthArr = Array();

Template.chartPage.rendered = function(){
	loopContainer();
	lengthArr = Array();
	countLengthArr = Array();
	var names = this.findAll(".name")
	_.each(names, function(name){
		lengthArr.push(name.offsetWidth);
	})
	var counts = this.findAll(".count")
	_.each(counts, function(count){
		countLengthArr.push(count.offsetWidth);
	})
//	
	if(!Session.get("current_page") && Session.get("system") == "frontend"){
		changeGraph();
	}
	
}
Template.chartPage.destroyed = function ( ) { 
	//console.log(this);
	//delete this;
	//$(this).remove();
	//this = null;
	target = null;
}
Template.chartPage.helpers({
	dashboard:function(){
		return SettingsCollection.findOne({type:"main"});
	},
	chart_title: function(){
		return Session.get("target_title") + " " + Session.get("period_title");
	},
	chart_previous_title: function(){
		return Session.get("period_previous_title");
	},
	
	employee:function(){
		var timePeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		if(!currentPage){
			return false;
		}
		var findArr = {};
		findArr["active"] = true;
		//findArr[currentPage+'.'+timePeriod] = {$gt: 0};
		sortArr = [];
		sortArr[currentPage+'.'+timePeriod] = "asc";
		employees = EmployeeCollection.find(findArr, {sort: [[currentPage+'.'+timePeriod, "desc"]]}).fetch();
		var timePeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		var target = Session.get("target_number");
		var target = Session.get("target");
		var target_period = Session.get("target_period");
	 	return _.sortBy(employees, function(employee){
	 		
			var count = employee[currentPage][timePeriod];
			
			var target_number = employee['targets'][currentPage][timePeriod]["target_number"];
			var percentage = (count/target_number)*100;
			return -Math.abs(percentage);
		})
	},
	employee_name: function(){
		var employee = this;
		if(employee.nick_name){
			return employee.nick_name;
		}else{
			return employee.first_name;
		}
	},
	
	
	
	employee_count:function(){
		var employee = this;
		var timePeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		var count = employee[currentPage][timePeriod];
		if(count){
			return count;
		}else{
			return 0;
		}
	},
	employee_count_class:function(){
		var employee = this;
		var theclass = "large";
		var timePeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		var count = employee[currentPage][timePeriod];
		
		if(count && count.toString().length>3){
			theclass = "small";
		}
		return theclass;
	},
	bar_color: function(){
		var employee = this;
		var timePeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		var count = employee[currentPage][timePeriod];
		var target = Session.get("target_number");
		var target = Session.get("target");
		var target_period = Session.get("target_period");
		var target_number = employee['targets'][currentPage][timePeriod]["target_number"];
		var percentage = (count/target_number)*100;
		//console.log(percentage);
		
		//console.log(percentage);
		if(percentage>99){
			return "green";
		}else if(percentage>60){
			return "orange";
		}else{
			return "red";
		}
	},
	
	bar_width: function(){
		//Content._dep.depend();
		var timePeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		var findArr = {};
		findArr["active"] = true;
		findArr[currentPage+'.'+timePeriod] = {$gt: 0};
		sortArr = [];
		sortArr[currentPage+'.'+timePeriod] = "asc";
		var employees = EmployeeCollection.find(findArr, {sort: [[currentPage+'.'+timePeriod, "desc"]]}).fetch();
		var longestWidth = 0;
		var name="";
		
		
		var i = 0;
		/*for (var key in employees ) {
  			if (employees.hasOwnProperty(key)) {
  				var fEmployee = employees[key];
				if(fEmployee.nick_name){
					name = fEmployee.nick_name;
				}else{
					name = fEmployee.first_name;
				}
				name = name.replace(/\s+/g, ' ');
				lengthArr[i] = name.length;
				i++;
			}
		}*/
		if(lengthArr.length == 0){
			lengthArr[0] = 300;
		}
		if(countLengthArr.length == 0){
			countLengthArr[0] = 200;
		}
		var longestWidth = Math.max.apply( Math, lengthArr);
		var countWidth =  Math.max.apply( Math, countLengthArr);
		console.log(longestWidth);
		var employee = this;
		var timePeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		var count = employee[currentPage][timePeriod];
		var target = Session.get("target");
		var target_period = Session.get("target_period");
		var target_number = employee['targets'][currentPage][timePeriod]["target_number"];
		var percentage = (count/target_number)*100;
		if(percentage>100){
			percentage = 100;
		}
		var imageSize = 200;
	// 
		var barWidth = 1470-longestWidth-countWidth-200;
		var total = ((barWidth/100)*percentage) +longestWidth + countWidth + 30;
		if(!parseInt(total)){
			total = longestWidth+countWidth;
			if(!parseInt(total)){
				return 320;
			}else{
				return total;
			}
		}else{
			return total;
		}
	},
	previous_employee:function(){
		var timePeriod = Session.get("period_previous");
		var currentPage = Session.get("current_page");
		var findArr = {};
		findArr["active"] = true;
		//findArr[currentPage+'.'+timePeriod] = {$gt: 0};
		sortArr = [];
		sortArr[currentPage+'.'+timePeriod] = "asc";
		var employees = EmployeeCollection.find(findArr, {sort: [[currentPage+'.'+timePeriod, "desc"]]}).fetch();
		var target = Session.get("target");
		var target_period = Session.get("period");
		return _.sortBy(employees, function(employee){
	 		
			var count = employee[currentPage][timePeriod];
			
			var target_number = employee['targets'][currentPage][target_period]["target_number"];
			var percentage = (count/target_number)*100;
			return -Math.abs(percentage);
		})
	},
	
	
	
	previous_employee_count:function(){
		var employee = this;
		var timePeriod = Session.get("period_previous");
		var currentPage = Session.get("current_page");
		var count = employee[currentPage][timePeriod];
		
		if(count){
		return count;
		}else{
			return "0";
		}
	},
	previous_employee_count_class:function(){
		var employee = this;
		var theclass = "large";
		var timePeriod = Session.get("period_previous");
		var currentPage = Session.get("current_page");
		var count = employee[currentPage][timePeriod];
		if(count && count.toString().length>3){
			theclass = "small";
		}
		return theclass;
	},
	previous_bar_color: function(){
		var employee = this;
		var timePeriod = Session.get("period_previous");
		var targetPeriod = Session.get("period");
		var currentPage = Session.get("current_page");
		var count = employee[currentPage][timePeriod];
		var target = Session.get("target");
		var target_period = Session.get("target_period");
		var target_number = employee['targets'][currentPage][targetPeriod]["target_number"];
		var percentage = (count/target_number)*100;
		if(percentage>100){
			percentage = 100;
		}
		if(percentage==100){
			return "green";
		}else if(percentage>60){
			return "orange";
		}else{
			return "red";
		}
	},
})
Template.mapPage.rendered = function(){
	initializeLeftMap();
	
	
}
Template.mapPage.helpers({
	keyword_categories: function(){
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
				
			});
			var jobs = JobsCollection.find( {"job_id" : {$in : keyword_total }}).fetch();
			//console.log(jobs);
			job_count += jobs.length;
			var job_width = job_count+"%";
			if(job_count>100){
				job_count = "100+";
				job_width = "100%";
			}
			var category_o = {
				category_name: keyword_category.category_name,
				colour: keyword_category.colour,
				logo: keyword_category.logo,
				count: job_count,
				width: job_width
			};
			categories_o.push(category_o);
		});
		var other_jobs = JobsCollection.find({job_id: {$nin: total_jobs}}).fetch();
		var other_job_count = other_jobs.length;
	
		var other_job_width = other_job_count+"%";
			if(other_job_count>100){
				other_job_count = "100+";
				other_job_width = "100%";
			}
		var setting = SettingsCollection.findOne({type:"colour",key:"other"});
		var other = {
			category_name: "Other",
			colour: setting.colour,
			logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABGCAYAAACQRffVAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQgSURBVHic7ZvNceM2FMd/yeRud7DqwEoFZk48rnZ002VZgraCMBVEHUS+8MYZ7VGnUB3IFay2g2UHOeDJkSngAeCXtR7+ZjyeASAAf75HfD7CxMTExMTt8stQFa/2yxmQAOf/AHPgzlL8GfgBnIAjcCzSshqiX70KXu2XCZBhBH7oWF0NVMC2SMtdx7pe6EXwar/MgJzuIl18B7bApkjLH10q6iR4tV8ugA3DCW1SA+siLbdtK2gleLVf3mOe+Me2DXfkACzaWDta8Gq/nGPEPsT+tmdqICnS8hjzoyjBIrbCPtK6OrVDRl7gVKTlyVJvAtxjRvEF4Q8zWnSw4EixT8Cu7egqU1omf77xIUp0kGB5Z48BjR8wg0qUm3nazoE1+oOugbnNe5r8GtjuDr/YL0VaRr9TPoq0zDHz+rNS7A7TRy9ewav9cg08KkVq4FORlpuQBtsgDzFBF/0g3qCiurS48gndnT71uRIK6E+FPqj9rnmZz8IbdLFfxhILIPPuAuNVLlRPc1pYRspvym8PRVomWuVDIUvZf5Qif7g2H5qFM0+7vvzBkKXlQSmydmW0FfwUMgUMTK7kfRQPvcIqWDYF2jSkNTYK4rLaqL2wJbosbC0sHG7Aume2Sl5mS3QJTlo2MjbaDPEg09grrgSL72vuXEV3ayDE0zS3TpoJNgvPlQq+35A7n6mUvCstsYK1yt8Kbe2eNBNiBZ8iOzMGmuBZM8Em+OpFv6CK7MzgeHZnV2NRrIVvFefaWg4uXrAJdm4Whjoc7wHNyq88NvQA4N0wCX7vTILfO5Pg984kGHMXa0XugG4R7dz81aLEJvjUa1femOaVaqzgpM/O9IHH664OB2IFz+K6MwozJe/UTLAJrpQKkqiujIO2u7vaVFwJ9uyIPrjOe9+QRMmrmgmuaUk71dcaGBV5+K6LtdpmPJdg7fgzi+rVsGjn55UtsY3gxxtya+cdEg4NVsEB5715cJcGQqYj1/l57Yrl0paW2j3r5xuwcq7kOfvuFCxPyLnM5A2vXDxhGDVK33ybh1zJe5SGR0U8K1eKbLTbEVVwgJX/lqvVUZDLsR3uk9UaT8hDyPYw8+Rvx9hFBQa0ZL74S69gmbz/UorcAf8O6d4XUYCa2KeQAJuY0MMKfd8JZoWW9XXDKFZdA396ij4XaRl0Y/JbRPsL/E/5Efi22i+fMJHsVUT9L1zEWvpCDsGsF5LQumOjaUPeo0u80bRS5xxzJZLIX2j9z5jA0uC46Tbx0veYkfBz7G975isBg1ST1p8AyCCVEx473Rc1kLeN7ez6zcMMI3osa3/FhCef2lbQ11ctM4zwBcNYvNMgeEnf3y3dY0QndBN//mZph4ms7/TpziWDfZkGL5af8f+0kTiKHjFfpp1H8l6DzCcmJiZ+Wv4DdOhTWFDefzMAAAAASUVORK5CYII=",
			count: other_job_count,
			width: other_job_width
		}
		
		
		categories_o.push(other);
		return categories_o;
	},
	php_count: function(){
		var count = JobsCollection.find({job_type: "PHP"}).fetch().length;
		if(count>100){
			return "100+";
		}else{
			return count;
		}
	},
	php_width: function(){
		var count = JobsCollection.find({job_type: "PHP"}).fetch().length;
		if(count>100){
			return "100%";
		}else{
			return count+"%";
		}
	},
	net_count: function(){
		var count = JobsCollection.find({job_type: ".NET"}).fetch().length;
		if(count>100){
			return "100+";
		}else{
			return count;
		}
	},
	net_width: function(){
		var count = JobsCollection.find({job_type: ".NET"}).fetch().length;
		if(count>100){
			return "100%";
		}else{
			return count+"%";
		}
	},
	java_count: function(){
		var count = JobsCollection.find({job_type: "Java"}).fetch().length;
		if(count>100){
			return "100+";
		}else{
			return count;
		}
	},
	java_width: function(){
		var count = JobsCollection.find({job_type: "Java"}).fetch().length;
		if(count>100){
			return "100%";
		}else{
			return count+"%";
		}
	},
	other_count: function(){
		var count = JobsCollection.find({job_type: "Other"}).fetch().length;
		if(count>100){
			return "100+";
		}else{
			return count;
		}
	},
	other_width: function(){
		var count = JobsCollection.find({job_type: "Other"}).fetch().length;
		if(count>100){
			return "100%";
		}else{
			return count+"%";
		}
	},
	background_image: function(){
		if(SettingsCollection.find().fetch().length){
			//var timePeriod = Session.get("current_page");
			var settings = SettingsCollection.findOne({type:"main"});
			if(settings && settings.map_image){
				return 'style=background-image:url(\'' +settings.map_image+'\');" ';
			}
		}
	},
})

Template.jobFlash.helpers({
	latest_job: function(){
		if(Session.get("latestJob")!=""){
			
			return JobsCollection.findOne({}, {sort: {'added_date': -1}});
		}
	},
	job_type: function(){
		if(Session.get("latestJob")!="" && JobsCollection && JobsCollection.findOne()){
			job = JobsCollection.findOne({}, {sort: {'added_date': -1}});
			return job.job_type.toLowerCase().replace(".","");
		}
	}
	
});

Template.jobFlash.rendered = function(){
	
}
Handlebars.registerHelper('employee_image', function(){
	var employee = this;
	var timePeriod = Session.get("period");
	var currentPage = Session.get("current_page");
	var targetNumber = Session.get("target_number");
	var employeeCount = employee[currentPage][timePeriod];
	var percentage = (employeeCount/targetNumber)*100;
	if(percentage>99){
		if(employee.good_photo){
			return employee.good_photo;
		}else{
			return "/frontend/img/no_photo.jpg";
		}
	}else{ 
		if(employee.bad_photo){
			return employee.bad_photo;
		}else{
			return "/frontend/img/no_photo.jpg";
		}
	}
})
Handlebars.registerHelper('previous_employee_image', function(){
	var employee = this;
	var timePeriod = Session.get("period_previous");
	var currentPage = Session.get("current_page");
	var targetNumber = Session.get("target_number");
	var employeeCount = employee[currentPage][timePeriod];
	var percentage = (employeeCount/targetNumber)*100;
	if(percentage>99){
		if(employee.good_photo){
			return employee.good_photo;
		}else{
			return "/frontend/img/no_photo.jpg";
		}
	}else{ 
		if(employee.bad_photo){
			return employee.bad_photo;
		}else{
			return "/frontend/img/no_photo.jpg";
		}
	}
})
Deps.autorun(function(){ 
	if(!Session.get("current_page") && Session.get("system")=="frontend"){
	changeGraph();
	//$(".jobHolder").show();
	}
	if(MapLocationsCollection.find().fetch().length && typeof google != 'undefined' && google){
		//initializeLeftMap();
	}
});
Deps.autorun(function(){
	var command = Commands.findOne();
	if(command && command.functionName && typeof window[command.functionName] == "function"  && Session.get("system")=="frontend"){
		window[command.functionName](command.duration*1000);
	}
		
	
});
Deps.autorun(function(){
	var settings = SettingsCollection.findOne({type:"main"});
	
	if(settings && $("footer").text() != settings.message_text){
		$("footer").text(settings.message_text);
	}
	
		
	
});
Deps.autorun(function(){
	var job = JobsCollection.findOne({}, {sort: {'added_date': -1}});
	var startTime = Session.get("startTime");
	var currTime = new Date().getTime();
	if(typeof startTime == "undefined"){
		Session.set("startTime", currTime);
		return false;
	}else if((currTime - startTime )>7000){
	
		
		sortArr = [];
		sortArr['_id'] = "asc";
		var oldJob = Session.get("latestJob");
		var oldJobID = Session.get("latestJobID");
		var oldJobDate = Session.get("latestJobDate");
		var rendered = Session.get("rendered");
		Meteor.setTimeout(function(){
			Session.set("rendered",JobsCollection.find().fetch().length);
			
		},2000)
		if(job && rendered && !job.displayed && ((oldJobDate < job.added_date && parseInt(oldJobID.replace("HQ","")) < parseInt((job.job_id).replace("HQ",""))) || typeof oldJob == "undefined" || typeof oldJobID == "undefined")){
			Session.set("latestJobID", job.job_id);
			Session.set("latestJob", job._id);
			Session.set("latestJobDate", job.added_date);
			//console.log(job); 
			var employee = EmployeeCollection.find({employee_id: job.emp_id}).fetch();
			JobsCollection.update(job._id, {$set: {displayed: true}});
			if(Session.get("system")=="frontend" && Session.get("page") == "charts"){
				var timeout = Session.get("timeout");
				clearTimeout(window.pageTimer);
				window.pageTimer = Meteor.setTimeout(function(){ changeGraph();}, timeout);

			}
			if(Session.get("system")=="frontend" && Session.get("page") == "map"){
				var timeout = Session.get("timeout");
				clearTimeout(window.changeMapTimeout);
				window.pageTimer = Meteor.setTimeout(function(){ 
					changeMap();
					
					window.refreshMap = true; 
					showMarkers();
				}, timeout);

			}	
			var $jobHolder = $("#jobHolder");
			$jobHolder.find("h1").text(job.job_title);
			var h2HTML = job.job_company+"<br/>";
			if(job.job_pay_to > job.job_pay){
				h2HTML += "&pound;"+job.job_pay+" - &pound;"+job.job_pay_to;
				
				 
			}else{
				h2HTML +="&pound;"+job.job_pay;
			} 
			h2HTML += " "+job.payment_type+"<br>"+job.job_short_location;
			$jobHolder.find("h2").html(h2HTML);
			//console.log(employee);
			$jobHolder.find("img.emp").attr("src", employee[0].good_photo);
			showLatestJobOnMap();
			
		}
	}

	
})


/*
 * Map Stuff
 */
var markerCluster;
createPins = function () {
	if(!window.pins && typeof google != 'undefined' && google){
		var keywordCategories = KeywordCategoriesCollection.find().fetch();
		var otherColour = SettingsCollection.findOne({type:"colour", key:"other"})
		window.pins = {};
		window.pins["Shadow"] =	new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
							    new google.maps.Size(40, 37),
							    new google.maps.Point(0, 0),
							    new google.maps.Point(12, 35));
		window.pins["Other"] =	new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+otherColour.colour,
							    new google.maps.Size(40, 37),
							    new google.maps.Point(0, 0),
							    new google.maps.Point(12, 35));					    
		_.each(keywordCategories, function(category){
			
			window.pins[category.category_name] = 	new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+category.colour,
			        								new google.maps.Size(21, 34),
											        new google.maps.Point(0,0),
											        new google.maps.Point(10, 34));
		})
			
	}
	
}

serializeViewport = function (map){
    var json = '{"bounds":'+map.getBounds().toString() + 
               ',"center":'+map.getCenter().toString()+"}";

    //'toString' returns values in '()', we need to replace them by '[]'
    json = json.replace(/\(/g,"[").replace(/\)/g,"]");
    return json;
}
deserializeViewport = function (map, json, useCenter ){
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




initializeJobMap = function () {
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
showLatestJobOnMap = function (time){
	/*if(!Session.get("job_flash_map_initialized")){
		initializeJobMap();
	}*/
	var settings = SettingsCollection.findOne({type:"main"});
	if(typeof time == "undefined"){
		time = settings.job_duration*1000;	
	}
	createPins();
	this.marker = null;
	//google.maps.event.trigger(window.jobMap, 'resize'); 
	geocoder = new google.maps.Geocoder();
	var job = JobsCollection.findOne({}, {sort: {'job_id': -1}});
	geocoder.geocode( { 'address': job.address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		var myLatlng = (results[0].geometry.location);
			Meteor.setTimeout(function(){
				$("#jobHolder").fadeIn(750, function(){
					google.maps.event.trigger(window.jobMap, "resize");
					window.jobMap.setCenter(myLatlng);
					notification("job_audio");
					
					if(settings){
						Meteor.setTimeout(function(){
							$("#jobHolder").fadeOut(750);
						},time);
					}else{
						$("#jobHolder").delay(10000).fadeOut(750);
					}
				});
			},5000);
		    
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
			
			//window.jobMapMarkers.push(marker);
		}else{
			console.log("invalid geocode");
			console.log(job);
		}
		Session.set("job_flash_map_initialized",true);
		
	});
}

showMarkers = function () {
	if(window.refreshMap){
		clearTimeout(window.markerTimeout);
		window.refreshMap = false;
		var jobType="";
		var useNext = false;
		if(Session.get("right_map_marker")){
			var nextOne = false;
			var jobSet = false;
			var i = 0;
			var firstJob = "";
			var currentJobType = Session.get("right_map_marker");
			var keywordCategories = KeywordCategoriesCollection.find().fetch();
			_.each(keywordCategories, function(category){
				
				if(useNext){
					jobType = category.category_name;
				}else{
					useNext = false;
					if(currentJobType == category.category_name){
						if(i == keywordCategories.length){
							jobType = "Other";
						}
						useNext = true;
					}else if(currentJobType == "Other"){
						jobType = "";
					}
				}
				i++;
			});
			
		}else{
			jobType = "";
		}
		if(jobType==""){
			jobType = KeywordCategoriesCollection.findOne().category_name;
		}
		Session.set("right_map_marker",jobType);
		
		var visibleMarkers = [];
		for (var i=0; i<window.rightMarkers.length; i++) {
			if (window.rightMarkers[i].job_type == Session.get("right_map_marker")) {
		    	window.rightMarkers[i].setVisible(true);
		    	visibleMarkers.push(window.rightMarkers[i]);
		   }else{
		   		window.rightMarkers[i].setVisible(false);
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
		if(!markerCluster){
			markerCluster = new MarkerClusterer(window.map, visibleMarkers, {}, color);
		}
		
	}
}

  // == hides all markers of a particular category, and ensures the checkbox is cleared ==
  hideMarkers = function (jobType) {
    for (var i=0; i<window.rightMarkers.length; i++) {
      if (window.rightMarkers[i].job_type == jobType) {
        window.rightMarkers[i].setVisible(false);
      }
    }
    // == clear the checkbox ==
// == close the info window, in case its open on a marker that we just hid
  }

  
  
  


$("a.changeUrl").live("click", function(event, template){
		event.preventDefault();
		Router.navigate($(this).attr("href"),true);
	});

