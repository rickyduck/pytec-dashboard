/* ADMIN STUFF */

Template.adminNav.listArray = function(){
	var listArr = [
		{name: "Dashboard", href: "/admin/", iconClass: "dash", activeClass:"inactive", subMenu: false},
		{name: "Employees", href: "/admin/employees/", iconClass: "contacts", activeClass:"inactive", subMenu: false},
		{name: "Targets", href: "/admin/targets/", iconClass: "graphs", activeClass:"inactive", subMenu: false},
		{name: "Momentum", href: "#", iconClass: "strategy", activeClass:"inactive", subMenu: true, 
			subItems: [
				{name:"Percentages", href: "/admin/momentum/percentages/"},
				{name:"Threshold", href: "/admin/momentum/threshold/"},
				{name:"Settings", href: "/admin/momentum/settings/"},
				
			]
		},
		{name: "Map Controls", href: "/admin/map-controls/", iconClass: "map", activeClass:"inactive", subMenu: false},
		{name: "Colours", href: "/admin/colours/", iconClass: "colour", activeClass:"inactive", subMenu: false},
	/*	{name: "Settings", href: "/admin/settings/", iconClass: "cog", activeClass:"inactive"},*/
		{name: "Users", href: "/admin/users/", iconClass: "user", activeClass:"inactive", subMenu: false}
	];
	
	var currentCategory = Session.get("category");
	listArr.filter(function(list){
		if(((list.name).toLowerCase()).replace(" ","-") == (currentCategory.toLowerCase()).replace(" ","-")){
			list.classToShow="active";
			if(list.subMenu){
				list.classToShow += " opened";
			}
		}else{
			if(list.subMenu){
				list.classToShow = "exp";
			}
		}
	});
	//currentPageItem.activeClass="active";
	return listArr;
	
}

//navigation events
Template.adminNav.events({
	"click a": function(event, template){
		event.preventDefault();
		Router.navigate(this.href,true);
	}
})

/*
 * Actual controllers for the pages - this tells the app what to do on each page
 *
*
 * Admin page display controllers0 - these tell the app which pages should and shouldn't be displayed
 * the below could probably be changed to a better method
 */
Template.admin.events({
	"click .logout": function(){
		Meteor.logout(function(){
			
			Router.navigate('/admin/login/',true);
			
		});
	},
	"click .fireCommand": function(){
		
	},
	"change .fileInput": function(e, template){
		//alert("change");
		var file = $(e.srcElement).val();
		$(e.srcElement).siblings(".filename").text(file);
	},
	"click .submitCommand": function(e, template){
		 var clicked = $(e.srcElement);
		 var $form = clicked.closest(".commandHolder");
		 var functionName = $form.find("select[name=functionName]").val();
		 var duration = (parseInt($form.find("input[name=duration]").val()));
		 var timestamp = new Date().getTime();
		 var command = Commands.findOne();
		 Commands.update(command._id, {$set:{functionName: functionName, duration:duration, timestamp:timestamp}})
	}
})
Template.admin.rendered = function(){
	$(".holder > input, .holder > select").uniform();	
}
Template.adminEmployeesIndex.employee = function() {
	Meteor.call("getEmployees");
	
	var find = EmployeeCollection.find({logged_on: 1});

//	Meteor.call("getEmployees");
	return find;
};
Template.adminPage.ifPage = function(v1, v2, options) {
  if(v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

Template.adminLogin.events({
	"click .logIn": function(e){
		e.preventDefault();
		$form = $(e.srcElement).closest("form");
		username = $form.find("input[name=username]").val();
		password = $form.find("input[name=password]").val();
		Meteor.loginWithPassword(username,password,function(error){
			if(error){
				
				$(".nFailure").fadeIn().delay(1500).fadeOut();
				
			}else{
				Router.navigate('/admin/dashboard/',true);
			}
		});
	}
})


Template.adminDashboard.helpers({
	dashboard:function(){
		return SettingsCollection.findOne({type:"main"});
	},
	isAdminDashboardIndex:function(){
		return Session.get("category") == 'dashboard' && Session.get("page") == 'index';
	}
});
Template.adminDashboard.events({
	"click .submitForm":function(e){
	var me = this;
		e.preventDefault();
		file = $("input#jobAudio")[0].files[0];
		if(file){
			var reader = new FileReader();
			reader.onload = function(e) {
			  // Add it to your model
			 // updateVariables["target_image"] = ;
			  //model.update(id, { $set: { src: e.target.result }});
				SettingsCollection.update(me._id, { $set: { job_audio: e.target.result }});;
			  // Update an image on the page with the data
			}
			reader.readAsDataURL(file);
			
		}
		$(".nSuccess").fadeIn().delay(1500).fadeOut();
		SettingsCollection.update(this._id, { $set: { message_text: $("input[name=message_text]").val(), job_duration: $("input[name=job_duration]").val() }});
		
	},
	"click .playSound": function(e){
		notification("job_audio");
	}
});



Template.adminPage.helpers({
	category: function(){
		return Session.get("category");
	},
	showDashboard: function(){
		if(!Meteor.user()){
	        Router.navigate('/admin/login/',true);
		}
	    return Session.get("category") == 'dashboard';
	},
	showEmployees: function(){
	    return Session.get("category") == 'employees';
	},
	showTargets: function(){
	    return Session.get("category") == 'targets';
	},
	showMomentum: function(){
	    return Session.get("category") == 'momentum';
	},
	showMomentumTargets: function(){
	    return Session.get("category") == 'momentum';
	},

	showMapControls: function(){
		return Session.get("category") == "map-controls";
	},
	showColours: function(){
	    return Session.get("category") == 'colours';
	},
	showUsers: function(){
		return Session.get("category") == "users";
	}
});
Template.adminPage.rendered = function(){	
		
	$('.exp').collapsible({
		defaultOpen: 'current',
		cookieName: 'navAct',
		cssOpen: 'active corner',
		cssClose: 'inactive',
		speed: 300
	});
	
}




/*
 *  
 * 
 * Admin employees controllers
 */
Template.adminEmployees.helpers({
	isAdminEmployeesIndex: function(){
		return Session.get("category") == 'employees' && Session.get("page") == 'index';
	},
	isAdminEmployeesView: function(){
		return Session.get("category") == 'employees' && Session.get("page") == 'view';
	}
});


Template.adminEmployeesIndex.rendered = function(){
	
}
Template.adminEmployeesIndex.helpers({
	isEmployeeActiveCheckbox :  function(){
		return this.active ? 'checked' : '';
	},
	nickname_text : function(){
		
		return this.nick_name ? '('+this.nick_name+')' : '';
	}

});

Template.adminEmployeesIndex.events({
	"click .active": function(e){
		EmployeeCollection.update(this._id, { $set: { active: e.srcElement.checked }});
	}
});


dataURItoBlob = function (dataURL) {
  // Decode the dataURL    
  var binary = atob(dataURL.split(',')[1]);
  // Create 8-bit unsigned array
  var array = [];
  for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  // Return our Blob object
  return new Blob([new Uint8Array(array)], {type: 'image/png'});
}

Template.adminEmployeesView.events({
	
	"click .savePhoto":function(e, template){
		e.preventDefault();
		 var MAX_WIDTH = 400;
        var MAX_HEIGHT = 300;
		var id = e.srcElement.id;
		var item = Session.get("employeeItem");
	    var file = template.find('input[name='+id+']').files[0];
	  // $(template).append("Loading...");
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      // Add it to your model
			var tempImg = new Image();
			tempImg.src = e.target.result;
			tempImg.onload = function(){
				//tempImg = e.target.result;
				var tempW = tempImg.width;
				var tempH = tempImg.height;
				if (tempW > tempH) {
					if (tempW > MAX_WIDTH) {
				   		tempH *= MAX_WIDTH / tempW;
				   		tempW = MAX_WIDTH;
					}
				} else {
					if (tempH > MAX_HEIGHT) {
				   		tempW *= MAX_HEIGHT / tempH;
				   		tempH = MAX_HEIGHT;
					}
				}
				var canvas = document.createElement('canvas');
				canvas.width = tempW;
				
				canvas.height = tempH;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(this, 0, 0, tempW, tempH);
				var dataURL = canvas.toDataURL("image/jpeg");
				if(id=="goodPhoto"){
					EmployeeCollection.update(item._id, { $set: { good_photo: dataURL }});
				}else{
					EmployeeCollection.update(item._id, { $set: { bad_photo: dataURL }});
				}
			  
			
				// Update an image on the page with the data
				$(template.find('img.'+id)).attr('src', dataURL);
			}
		}
	    reader.readAsDataURL(file);
	},
	"click .submitNickname": function(e, template){
		e.preventDefault();
		var id = e.srcElement.id;
		var item = Session.get("employeeItem");
		var nick_name = template.find("input#nick_name").value;
		$(".nSuccess").fadeIn().delay(2000).fadeOut();
		EmployeeCollection.update(item._id, { $set: { nick_name: nick_name }});
	},
	"click .active": function(e){
		var item = Session.get("employeeItem");
		EmployeeCollection.update(item._id, { $set: { active: e.srcElement.checked }});
	},
	"click .saveTarget": function(e){
		e.preventDefault();
		var $elem = $(e.srcElement);
		var $elemHolder = $elem.closest(".rowElem");
		var item = this;
		var updateVariables = {};
		var i =0;
		var employee = Session.get("employeeItem");
		$elemHolder.siblings(".rowElem").each(function(){
			var $this = $(this);
			var $targetinput = $(this).find("input[name=target]");
			var period = $targetinput.attr("data-period");
			var targetval = $targetinput.val();

			employee["targets"][(item.target_for)][period]["target_number"] = parseInt(targetval.replace(",",""));
			//console.log(updateVariables["target_periods."+i+".target_number"]);
			i++;
		});

		$(".nTargetsSuccess").fadeIn(function(){
			Meteor.setTimeout(function(){
				$(".nTargetsSuccess").fadeOut()
			},2000)
		});
		//console.log(updateVariables);
		
		EmployeeCollection.update(employee._id,{$set:{targets: employee.targets}});
		Session.set("employeeItem", employee);
	}
});
Template.adminEmployeesView.helpers({
	employee:function(){
		var find = EmployeeCollection.findOne({employee_id: Session.get("employeeID")});
		Session.set("employeeItem", find);
		return find;
	},
	isEmployeeActiveCheckbox :  function(){
		var item = Session.get("employeeItem");
		return item.active ? 'checked' : '';
	},
	targetCategory: function(){
		var employee = EmployeeCollection.findOne({employee_id: Session.get("employeeID")});
		var targets =  TargetsCollection.find({},{sort:{order:1}}).fetch();
		var makeTargets =  false;
		
		_.each(targets,function(target){
			var i = 0;
			var name = target.target_for;
			
			_.each(target.target_periods, function(period){
				
				if(typeof employee.targets[name] !== "undefined" && employee.targets[name][period.target_period]['target_number']){
					period['employee_target_number'] =employee.targets[name][period.target_period]['target_number'];
				}else{
					period['employee_target_number'] = period.target_number;
				}
			
				i++;
			});
			EmployeeCollection.update(employee._id,employee);
		})
		return targets;
	}
});




/*
 * Admin targets controllers
 */

Template.adminTargets.helpers({
	isAdminTargetsIndex: function(){
		return Session.get("category") == 'targets' && Session.get("page") == 'index';
	}
	
	
});


Template.adminTargetsIndex.helpers({
	targetCategory: function(){
		
		return TargetsCollection.find({},{sort:{order:1}}).fetch();
		
	},
	target_active_checkbox: function(){
		return this.active? "checked": "";
	},
	target_charts_checkbox: function(){
		return this.charts? "checked": "";
	},
	target_momentum_checkbox: function(){
		return this.momentum? "checked": "";
	}

});
Template.adminTargetsIndex.rendered = function(){
	$(".number").spinner();
	
}

Template.adminTargetsIndex.events({
	"click .submitForm": function(e){
		e.preventDefault();
		var $elem = $(e.srcElement);
		var $elemHolder = $elem.closest(".rowElem");
		var item = this;
		var updateVariables = {};
		var i =0;
		updateVariables.charts = $elem.closest(".widget").find("[name=charts]").is(":checked")?true:false;
		updateVariables.momentum = $elem.closest(".widget").find("[name=momentum]").is(":checked")?true:false;
		$elemHolder.siblings(".rowElem.targetPeriod").each(function(){
			var $this = $(this);
			var $targetinput = $(this).find("input[name=target]");
			var targetname = $targetinput.attr("name");
			var targetval = $targetinput.val();
			var $secondsinput = $(this).find("input[name=seconds]");
			if($(this).find("input[name=active]").is(":checked")){
				updateVariables["target_periods."+i+".active"] = true;
			}else{
				updateVariables["target_periods."+i+".active"] = false;
			}
			var secondsval = $secondsinput.val();
			updateVariables["target_periods."+i+".target_number"] = parseInt(targetval.replace(",",""));
			updateVariables["target_periods."+i+".seconds_to_show"] = parseInt(secondsval.replace(",",""));
			//console.log(updateVariables["target_periods."+i+".target_number"]);
			i++;
		});
		var file = $elemHolder.parent().find('input[type=file]')[0].files[0];
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      // Add it to your model
	     // updateVariables["target_image"] = ;
	      //model.update(id, { $set: { src: e.target.result }});
			TargetsCollection.update(item._id,{$set: {target_image: e.target.result}});
	      // Update an image on the page with the data
	    	$elemHolder.parent().find(".targetImage").attr('src', e.target.result);
	    }
	    if(file instanceof Blob){ reader.readAsDataURL(file); }
		$(".nSuccess").fadeIn().delay(2000).fadeOut();
		//console.log(updateVariables);
		TargetsCollection.update(item._id,{$set: updateVariables});
		
	}
});

/* 
 * 
 * Momentum
 */

Template.adminMomentum.rendered = function(){
	
	$(".number").spinner();
	
}
Template.adminMomentum.helpers({
	isAdminMomentumPercentages: function(){
		return Session.get("category") == 'momentum' && Session.get("page") == 'percentages';
	},
	isAdminMomentumSettings: function(){
		return Session.get("category") == 'momentum' && Session.get("page") == 'settings';
	},
	isAdminMomentumThreshold: function(){
		return Session.get("category") == 'momentum' && Session.get("page") == 'threshold';
	},
});


Template.adminMomentumThreshold.helpers({
	thresholds: function(){
		return MomentumThresholdCollection.find({},{sort:{order:1}}).fetch();
	}
});
Template.adminMomentumThreshold.events({
	"click .submitForm": function(e){
		e.preventDefault();
		$(".nNumberSuccess").fadeIn(function(){
				Meteor.setTimeout(function(){
					$(".nNumberSuccess").fadeOut();
				},2000);
			});
		var $elem = $(e.srcElement);
		var total = 0;
		$elem.closest(".mainForm").find(".threshold").each(function(){
			var _id = $(this).attr("data-id");
			var $orangeinput = $(this).find("input[name=orange]");
			var $greeninput = $(this).find("input[name=green]");
			
			
			MomentumThresholdCollection.update({_id:_id},{$set:{orange:parseInt($orangeinput.val().replace(/,/g, "")), green:parseInt($greeninput.val().replace(/,/g, ""))}});
		});
	}
});


Template.adminMomentumPercentages.helpers({
	momentums: function(){
		return MomentumCollection.find().fetch();
	}
});
Template.adminMomentumPercentages.events({
	"click .submitNumberForm": function(e){
		e.preventDefault();
		window.scrollTo(0,0);
		var $elem = $(e.srcElement);
		var total = 0;
		$elem.closest(".mainForm").find(".momentumHolder").each(function(){
			var $input = $(this).find("input");
			var name = $input.attr("name");
			total = total+ parseInt($input.val());
		});
		if(total == 100){
			$(".nNumberSuccess").fadeIn(function(){
				Meteor.setTimeout(function(){
					$(".nNumberSuccess").fadeOut();
				},2000);
			});
			$elem.closest(".mainForm").find(".momentumHolder").each(function(){
				var $input = $(this).find("input");
				var name = $input.attr("name");
				var value = $input.val();
				MomentumCollection.update({_id:parseInt(name)},{$set:{value:value}});
			});
			
		}else{
			$(".nFailure ").fadeIn(function(){
				Meteor.setTimeout(function(){
					$(".nFailure").fadeOut();
				},2000);
			});
		}
	},
})
Template.adminMomentumSettings.helpers({

	settings:function(){
		return SettingsCollection.findOne({type:"main"});
	},
	dayIs: function(day){
		var setting = SettingsCollection.findOne({type:"main"});
		return setting.momentum_scheduled_day === day
	}
});
Template.adminMomentumSettings.events({
	"click .playMomentumSound": function(e){
		e.preventDefault();
		notification("momentum_audio");
	
	},
	"click .playScheduledSound": function(e){
		e.preventDefault();
		notification("scheduled_audio");
	
	},
	
	"click .submitSettingsForm": function(e){
		var settings = SettingsCollection.findOne({type:"main"});
		var item = this;
		file = $("input#momentumAudio")[0].files[0];
		if(file){
			var reader = new FileReader();
			reader.onload = function(e) {
			  // Add it to your model
			 // updateVariables["target_image"] = ;
			  //model.update(id, { $set: { src: e.target.result }});
				SettingsCollection.update(settings._id, { $set: { momentum_audio: e.target.result }});;
			  // Update an image on the page with the data
			}
			reader.readAsDataURL(file);
			
		}
		file = $("input#momentumImage")[0].files[0];
		if(file){
			var reader = new FileReader();
			reader.onload = function(e) {
			  // Add it to your model
			 // updateVariables["target_image"] = ;
			  //model.update(id, { $set: { src: e.target.result }});
				SettingsCollection.update(settings._id, { $set: { momentum_image: e.target.result }});;
			  // Update an image on the page with the data
			}
			reader.readAsDataURL(file);
			
		}
		file = $("input#scheduledAudio")[0].files[0];
		if(file){
			var reader = new FileReader();
			reader.onload = function(e) {
			  // Add it to your model
			 // updateVariables["target_image"] = ;
			  //model.update(id, { $set: { src: e.target.result }});
				SettingsCollection.update(settings._id, { $set: { scheduled_audio: e.target.result }});;
			  // Update an image on the page with the data
			}
			reader.readAsDataURL(file);
			
		}
		file = $("input#scheduledImage")[0].files[0];
		if(file){
			var reader = new FileReader();
			reader.onload = function(e) {
			  // Add it to your model
			 // updateVariables["target_image"] = ;
			  //model.update(id, { $set: { src: e.target.result }});
				SettingsCollection.update(settings._id, { $set: { scheduled_image: e.target.result }});;
			  // Update an image on the page with the data
			}
			reader.readAsDataURL(file);
			
		}
		var settings_update = {
			momentum_scheduled_day: ($("select[name=momentumScheduledDay]").val()),
			momentum_scheduled_time: ($("input[name=momentumScheduledTime]").val()),
			momentum_interval: parseInt(($("input[name=momentum_interval]").val()).replace(",","")),
			momentum_time_to_show: parseInt($("input[name=momentum_time_to_show]").val().replace(",",""))
		}
		$(".nSuccess").fadeIn(function(){
			Meteor.setTimeout(function(){
				$(".nSuccess").fadeOut();
			},2000);
		});
		SettingsCollection.update(settings._id,{$set: settings_update});
		
	}
});
/* 
 * 
 * Colours
 */

Template.adminColours.rendered = function(){
	$(".colourpicker").ColorPicker({
	onSubmit: function(hsb, hex, rgb, el) {
		$(el).val(hex);
		$(el).ColorPickerHide();
	},
	onBeforeShow: function () {
		$(this).ColorPickerSetColor(this.value);
	}});
	
}
Template.adminColours.helpers({
	keyword_categories: function(){
		return KeywordCategoriesCollection.find().fetch();
	},
	colour_setting:function(){
		return SettingsCollection.find({type:"colour"}).fetch();
	}
});
Template.adminColours.events({
	"click .submitForm": function(e){
		e.preventDefault();
		var $elem = $(e.srcElement);
		$(".nSuccess").fadeIn(function(){
			Meteor.setTimeout(function(){
				$(".nSuccess").fadeOut();
			},2000);
		});
		$elem.closest(".mainForm").find(".keywordCategory").each(function(){
			var $input = $(this).find("input");
			var name = $input.attr("name");
			var value = $input.val();
			KeywordCategoriesCollection.update({_id:name},{$set:{colour:value}});
		});
		$elem.closest(".mainForm").find(".settingHolder").each(function(){
			var $input = $(this).find("input");
			var name = htmlId = new Meteor.Collection.ObjectID($input.attr("name"));
			
			var value = $input.val();
			SettingsCollection.update({_id:name},{$set:{colour:value}});
		});
		
	}
});
/*
 * Admin Map Controls Controllers
 */


Template.adminMapControls.helpers({
	isAdminMapControlsIndex: function(){
		return Session.get("category") == 'map-controls' && Session.get("page") == 'index';
	}
});
Template.adminMapControlsIndex.helpers({
	mapLocations: function(){
		return MapLocationsCollection.find({}, {sort: {location_order: 1}}).fetch();
	},
	mapImage: function(){
		var settings = SettingsCollection.findOne({type:"main"});
		return settings.map_image;
	}
});
Template.adminMapControlsIndex.events({
	"click .submitImageForm": function(e){
		e.preventDefault();
		var settings = SettingsCollection.findOne({type:"main"});
		var $elem = $(e.srcElement);
		var $elemHolder = $elem.closest(".rowElem");
		var file = $elemHolder.parent().find('input[type=file]')[0].files[0];
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      // Add it to your model
	     // updateVariables["target_image"] = ;
	      //model.update(id, { $set: { src: e.target.result }});
			SettingsCollection.update(settings._id,{$set: {map_image: e.target.result}});
	      // Update an image on the page with the data
	    	$elemHolder.parent().find(".mapImage").attr('src', e.target.result);
	    }
	    reader.readAsDataURL(file);
	},
	"click .arrow": function(e){
		e.preventDefault();
		var location = this;
		var $elem = $(e.srcElement);
		
		if($elem.hasClass("up")){
			var order = this.location_order;
			var newOrder = order+1;
			if(newOrder>MapLocationsCollection.find().fetch().length){return false;}
			var oldLocation = MapLocationsCollection.findOne({location_order: newOrder});
			
			MapLocationsCollection.update(this._id,{$set: {location_order: newOrder}});
			MapLocationsCollection.update(oldLocation._id,{$set: {location_order: order}});
		}else{
			
			var order = this.location_order;
			var newOrder = order-1;
			if(newOrder<0){ return false; }
			var oldLocation = MapLocationsCollection.findOne({location_order: newOrder});
			
			MapLocationsCollection.update(this._id,{$set: {location_order: newOrder}});
			MapLocationsCollection.update(oldLocation._id,{$set: {location_order: order}});
		}
	},
	"click .deleteLocation": function(e){
		e.preventDefault();
		var item = this;
		jConfirm('Please confirm you wish to delete this location', 'Confirmation Dialog', function(r) {
			if(r){
				MapLocationsCollection.remove(item._id);
			}
		});
	},
	"change input.time_to_show": function(e){
		var $elem = $(e.srcElement);
		var val = $elem.val();
		MapLocationsCollection.update(this._id,{$set: {time_to_show: val}});
	}
});

Template.adminMapControlsMap.events({
	"click input[name=find]": function(e){
		e.preventDefault();
		var $elem = $(e.srcElement);
		var $input = $elem.siblings("input[type=text]");
		
		
		
		
		geocoder.geocode( { 'address': $input.val()}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	        map.setCenter(results[0].geometry.location);
	        if (results[0].geometry.viewport){
          		map.fitBounds(results[0].geometry.viewport);
          		$(".zoom_level").text(window.map.getZoom());
          	}
	      } else {
	        alert("Geocode was not successful for the following reason: " + status);
	      }
	    });
		
		
	},
	"click .saveLocation": function(e){
		e.preventDefault();
		
		var _location = "";
		geocoder.geocode({
			latLng: window.map.getCenter()
		}, function(responses) {
			if (responses && responses.length > 0) {
				_location = responses[0].formatted_address;
				var _time = $("input[name=seconds]").val();
				var _view_port = serializeViewport(window.map);
				var insertItem = {
					location: _location,
					view_port: _view_port,
					time_to_show: _time
				}
				_
				MapLocationsCollection.insert(insertItem);
		
			} else {
				return false;
			}
		});
		
		
	}
});
Template.adminMapControlsMap.rendered = function(){
	
	if (! this.initialized){
     initializeMap();
     this.initialized = true;
    }
}


/*
 * Admin users controllers 
 * If admin 
 */
Template.adminUsers.helpers({
	isAdminUsersIndex: function(){
		return Session.get("category")=="users" && Session.get("page") == "index";
	},
	isAdminUsersAddUser: function(){
		return Session.get("category")=="users" && Session.get("page") == "add";
	},
	isAdminUsersEditUser: function(){
		return Session.get("category")=="users" && Session.get("page") == "edit";
	}
})
Template.adminUsersIndex.helpers({
	adminUsers: function(){
		return Meteor.users.find().fetch();
	},
	isUserActiveCheckbox :  function(){
		return this.profile.active ? 'checked' : '';
	}
	
});
Template.adminUsersIndex.events({
	"click .active": function(e){
		Meteor.users.update(this._id, { $set: { 'profile.active': e.srcElement.checked}});
		
	},
	"click .delete": function(e){
		e.preventDefault();
		var item = this;
		jConfirm('Please confirm you wish to delete this user', 'Confirmation Dialog', function(r) {
			if(r){
				Meteor.users.remove(item._id);
			}
		});
	}
})

Template.adminUsersAddUser.events({
	"click .submitForm": function(e){
		e.preventDefault();
		var $form = $(e.srcElement).closest("form");
		$form.validationEngine('validate');
		var username = $form.find("input[name=username]").val();
		var password = $form.find("input[name=password]").val();
		
		var fullname = $form.find("input[name=fullname]").val();
		var active = $form.find("input[name=active]").is(":checked");
		Accounts.createUser({username: username, password:password, profile:{
			name: fullname,
			active: active
		}});
		Router.navigate('/admin/users/',true);
	}
});

Template.adminUsersEditUser.helpers({
	adminUser: function(){
		return Meteor.users.findOne(Session.get("userID"));
	},
	isUserActiveCheckbox :  function(){
		return this.profile.active ? 'checked' : '';
	}
});
Template.adminUsersEditUser.events({
	"click .submitForm": function(e){
		e.preventDefault();
		var $form = $(e.srcElement).closest("form");
		$form.validationEngine('validate');
		var username = $form.find("input[name=username]").val();
		var password = $form.find("input[name=password]").val();
		
		var fullname = $form.find("input[name=fullname]").val();
		var active = $form.find("input[name=active]").is(":checked");
		var updateArray = {};
		updateArray["username"] = username;
		if(password){
			updateArray["password"] = password;
		}
		updateArray["profile.name"] = fullname;
		updateArray["profile.active"] = active;
		Meteor.users.update(Session.get("userID"), {$set: updateArray});
		Router.navigate("/admin/users/",true);
	}
})
/*Template..events({
	"click .savePhoto":function(e, template){
		e.preventDefault();
		var id = e.srcElement.id;
		var item = Session.get("employeeItem");
	    var file = template.find('input[name='+id+']').files[0];
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      // Add it to your model
	      if(id=="goodPhoto"){
	      	EmployeeCollection.update(item._id, { $set: { good_photo: e.target.result }});
	      }else{
	      	EmployeeCollection.update(item._id, { $set: { bad_photo: e.target.result }});
	      }
	
	      // Update an image on the page with the data
	      $(template.find('img.'+id)).attr('src', e.target.result);
	    }
	    reader.readAsDataURL(file);
	},
	"click .active": function(e){
		var item = Session.get("employeeItem");
		EmployeeCollection.update(item._id, { $set: { active: e.srcElement.checked }});
	}
});*/
Template.adminUsersEditUser.helpers({
	user:function(){
		var find = Meteor.users.findOne(Session.get("userID"));
		//Session.set("employeeItem", find);
		return find;
	}
});

/*
 * 
 */


Template.adminPage.showTargets = function(){
    return Session.get("category") == 'targets';
}
Template.adminPage.showMapControls = function(){
    return Session.get("category") == 'mapControls';
}
Template.adminPage.showSettings = function(){
    return Session.get("category") == 'settings';
}
Template.admin.is404 = function(){
    return Session.get("page") == '404';
}
initializeMap = function () {
	createPins();
	var markers = [];
	var jobs = JobsCollection.find().fetch();
	geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': "London"}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		    var myLatlng = (results[0].geometry.location);
		    
		} else {
			var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
		}
		
		var mapOptions = {
	    	zoom: 4,
	    	center: myLatlng,
	    	mapTypeId: google.maps.MapTypeId.ROADMAP
	  	}
	 	window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		$(".zoom_level").text(window.map.getZoom());
		
		google.maps.event.addListener(map, 'zoom_changed', function() {
	    	$(".zoom_level").text(window.map.getZoom());
		});
		
		
		$.each(jobs, function(index, job){
			if(job.lat == 0 || job.lng == 0){
				geocoder.geocode( { 'address': job.address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
					    var myLatlng = (results[0].geometry.location);
					    
					    JobsCollection.update(job._id, {$set: {lat: myLatlng.lat(), lng: myLatlng.lng()}})
					   //console.log(myLatlng);
					} else {
						console.log(job.address);
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
			markers.push(marker);
			
			
			
			
		});
		
	});
  
  
}
