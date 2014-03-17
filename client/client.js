EmployeeCollection = new Meteor.Collection('EmployeeCollection');
SettingsCollection = new Meteor.Collection('SettingsCollection');
TargetsCollection = new Meteor.Collection('TargetsCollection');
MapLocationsCollection = new Meteor.Collection('MapLocationsCollection');
MomentumCollection = new Meteor.Collection('MomentumCollection');
MomentumThresholdCollection = new Meteor.Collection('MomentumThresholdCollection');
JobsCollection = new Meteor.Collection('JobsCollection');
JobKeywordsCollection = new Meteor.Collection('JobKeywordsCollection');
KeywordsCollection = new Meteor.Collection('KeywordsCollection');
KeywordCategoriesCollection = new Meteor.Collection('KeywordCategoriesCollection');
KeywordCategoryLinkCollection = new Meteor.Collection('KeywordCategoryLinkCollection');
Commands = new Meteor.Collection("Commands");
marker = null;

//Main template stuff

//global events

	

//admin template stuff

//navigation


/****************************
 *                          * 
 *                          *
 *   Handlebars helpers     *
 *                          *
 *                          *
 ***************************/




Meteor.saveFile = function(blob, name, path, type, callback) {
	$(".playSound").text("Loading...");
  var fileReader = new FileReader(),
    method, encoding = 'binary', type = type || 'binary';
  switch (type) {
    case 'text':
      // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
      method = 'readAsText';
      encoding = 'utf8';
      break;
    case 'binary': 
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
    default:
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
  }
  fileReader.onload = function(file) {
    Meteor.call('saveFile', file.srcElement.result, name, path, encoding, callback);
  }
  fileReader[method](blob);
  $(".playSound").text("Click to play current sound: "+name);
}




Meteor.startup(function () {
  Backbone.history.start({pushState: true});

});