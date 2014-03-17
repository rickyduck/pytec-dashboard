system_dep = new Deps.Dependency();
var AppRouter = Backbone.Router.extend({
  routes: {
    "frontend/charts/":                 "frontendCharts", //this will be http://your_domain/
    "frontend/map/":                 "frontendMap", //this will be http://your_domain/
    //admin routers
    "admin/login/": "adminLogin",
    "admin/":  "adminDashboard",
    "admin/dashboard/":  "adminDashboard",  // http://your_domain/help
    //employee stuff
    "admin/employees/": 	"adminEmployees",
    "admin/employees/view/:employee_id/": "adminViewEmployee",
    "admin/targets/": "adminTargets",
    "admin/momentum/percentages/": "adminMomentumPercentages",
    "admin/momentum/settings/": "adminMomentumSettings",
    "admin/momentum/threshold/": "adminMomentumThreshold",
    "admin/colours/": "adminColours",
    "admin/map-controls/": "adminMapControls",
    "admin/users/": "adminUsers",
    "admin/users/add/": "adminUsersAddUser",
    "admin/users/edit/:user_id/": "adminUsersEditUser",
 //   "admin/*whatever": "adminNotFound"
  },

  frontendCharts: function() {
  	 Session.set("system", "frontend");
  	 Session.set("page", "charts");
  	 system_dep.changed();
  },
  frontendMap: function() {
  	 Session.set("system", "frontend");
  	 Session.set("page", "map");
  	 system_dep.changed();
  },
  // here we begin the control for the admin routers
  adminLogin: function(){
  	Session.set("system", "adminLogin");
  	system_dep.changed();
  },
  adminDashboard: function() {
  	//console.log("moving to dashboard");
    Session.set("system", "admin");
    system_dep.changed();
    Session.set("category", "dashboard");
  	Session.set("page", "index");
	Session.set("uniform", false);
  },
  
  /*
   * employees
   */
  adminEmployees: function(){
  	Session.set("uniform", false);
  	//console.log("moving to employees");
  	Session.set("rendered", false);
  	Session.set("system", "admin");
  	Session.set("category", "employees");
  	Session.set("page", "index");

  },
  adminViewEmployee: function(employeeID){
  	Session.set("uniform", false);
  	Session.set("system", "admin");
  	Session.set("category", "employees");
  	Session.set("page", "view");
  	Session.set("employeeID", employeeID);
  },
  
  /*
   * targets
   */
  adminTargets: function(){
  	Session.set("uniform", false);
  	//console.log("moving to targets");
  	Session.set("system", "admin");
  	Session.set("category", "targets");
  	Session.set("page", "index");
  },
  
  
  /*
   * map controls
   */
  adminMapControls: function(){
  	Session.set("uniform", false);
  	//console.log("moving to map controls");
  	Session.set("system", "admin");
  	Session.set("category", "map-controls");
  	Session.set("page", "index");
  },
  /*
   * admin momentum settings
   */
  adminMomentumPercentages: function(){
  	Session.set("uniform", false);
  	//console.log("moving to map controls");
  	Session.set("system", "admin");
  	Session.set("category", "momentum");
  	Session.set("page", "percentages");
  },
  adminMomentumSettings: function(){
  	Session.set("uniform", false);
  	//console.log("moving to map controls");
  	Session.set("system", "admin");
  	Session.set("category", "momentum");
  	Session.set("page", "settings");
  },
  adminMomentumThreshold: function(){
  	Session.set("uniform", false);
  	//console.log("moving to map controls");
  	Session.set("system", "admin");
  	Session.set("category", "momentum");
  	Session.set("page", "threshold");
  },
  /*
   * admin colour settings
   */
  adminColours: function(){
  	Session.set("uniform", false);
  	//console.log("moving to map controls");
  	Session.set("system", "admin");
  	Session.set("category", "colours");
  	Session.set("page", "index");
  },
  /* 
   * users
   */
  adminUsers: function(){
  	Session.set("uniform", false);
  	//console.log("moving to users");
  	Session.set("system", "admin");
  	Session.set("category", "users");
  	Session.set("page", "index");
  },
  adminUsersAddUser: function(){
  	Session.set("uniform", false);
  	Session.set("system", "admin");
  	Session.set("category", "users");
  	Session.set("page", "add");
  },
  adminUsersEditUser: function(userID){
  	Session.set("uniform", false);
  	Session.set("system", "admin");
  	Session.set("category", "users");
  	Session.set("page", "edit");
  	Session.set("userID", userID);
  },
  
  
  adminNotFound: function(){
  	Session.set("uniform", false);
  	//console.log("moving to not found");
  	Session.set("system", "admin");
  	Session.set("page", "404");
  }
});


Router = new AppRouter;
Router.on("route:adminDashboard", function(page){
	if(Meteor.user()){
        Router.navigate('/admin/dashboard/',true);
    } else{
        Router.navigate('/admin/login/',true);
	}
})
