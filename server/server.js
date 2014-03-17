tedious = Npm.require('tedious');
Future = Npm.require('fibers/future');
databaseConf = {
	server : '62.49.170.185',
	//server : '192.168.1.102',
	userName : 'RickyD',
	password : 'rd',
	options : {
		database : "ITRIS"
	}

};
	
EmployeeCollection = 			new Meteor.Collection('EmployeeCollection');
SettingsCollection = 			new Meteor.Collection('SettingsCollection');
TargetsCollection = 			new Meteor.Collection('TargetsCollection');
MomentumCollection = 			new Meteor.Collection('MomentumCollection');
MomentumThresholdCollection = 	new Meteor.Collection("MomentumThresholdCollection");
MapLocationsCollection = 		new Meteor.Collection('MapLocationsCollection');
JobsCollection = 				new Meteor.Collection('JobsCollection');
KeywordsCollection= 			new Meteor.Collection('KeywordsCollection');
JobKeywordsCollection= 			new Meteor.Collection('JobKeywordsCollection');
KeywordCategoriesCollection = 	new Meteor.Collection('KeywordCategoriesCollection');
KeywordCategoryLinkCollection = new Meteor.Collection('KeywordCategoryLinkCollection');
Commands = new Meteor.Collection("Commands");
if(Commands.find().fetch().length === 0){
	Commands.insert({functionName:"", duration:0, timestamp:0});
}
console.log(Commands.find().fetch());
if (Meteor.users.find().fetch().length === 0) {
	Accounts.createUser({
		username : "admin",
		password : "admin",
		profile : {
			name : "Administrator",
			active : true
		}
	});
}
Meteor.users.allow({
	remove : function(userID, doc) {
		return true;
	},
	update : function(userID, doc) {
		return true;
	}
});
//JobsCollection.remove({});
//TargetsCollection.remove({});
if (TargetsCollection.find().fetch().length === 0) {
	targets = [];
	TargetsCollection.insert({
		target_title : "CVs Sent",
		target_for : "cvs_sent",
		target_periods : [{
			target_period_title : "Today",
			target_period : "day",
			target_period_previous_title : "Yesterday",
			target_period_previous : "yesterday",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Week",
			target_period : "week",
			target_period_previous_title : "Last Week",
			target_period_previous : "last_week",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Month",
			target_period : "month",
			target_period_previous_title : "Last Month",
			target_period_previous : "last_month",
			target_number : 30,
			seconds_to_show : 30,
			active: true
		}],
		order: 2,
		momentum:1,
		charts:1
	});
	TargetsCollection.insert({
		target_title : "Client Contacts",
		target_for : "client_contacts",
		target_periods : [{
			target_period_title : "Today",
			target_period : "day",
			target_period_previous_title : "Yesterday",
			target_period_previous : "yesterday",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Week",
			target_period : "week",
			target_period_previous_title : "Last Week",
			target_period_previous : "last_week",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Month",
			target_period : "month",
			target_period_previous_title : "Last Month",
			target_period_previous : "last_month",
			target_number : 30,
			seconds_to_show : 30,
			active: true
		}], 
		order: 1,
		momentum:1,
		charts:1
	});
	TargetsCollection.insert({
		target_title : "New Vacancies",
		target_for : "new_vacancies",
		target_periods : [{
			target_period_title : "Today",
			target_period : "day",
			target_period_previous_title : "Yesterday",
			target_period_previous : "yesterday",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Week",
			target_period : "week",
			target_period_previous_title : "Last Week",
			target_period_previous : "last_week",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Month",
			target_period : "month",
			target_period_previous_title : "Last Month",
			target_period_previous : "last_month",
			target_number : 30,
			seconds_to_show : 30
		}],
		order: 3,
		momentum:1,
		charts:1
	});
	TargetsCollection.insert({
		target_title : "First Interviews",
		target_for : "first_interviews",
		target_periods : [{
			target_period_title : "Today",
			target_period : "day",
			target_period_previous_title : "Yesterday",
			target_period_previous : "yesterday",
			target_number : 30,
			seconds_to_show : 30

		}, {
			target_period_title : "This Week",
			target_period : "week",
			target_period_previous_title : "Last Week",
			target_period_previous : "last_week",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Month",
			target_period : "month",
			target_period_previous_title : "Last Month",
			target_period_previous : "last_month",
			target_number : 30,
			seconds_to_show : 30,
			active: true
		}],
		order:4, 
		momentum:0,
		charts:1
	});
	TargetsCollection.insert({
		target_title : "Interviews Arranged",
		target_for : "interviews_arranged",
		target_periods : [{
			target_period_title : "Today",
			target_period : "day",
			target_period_previous_title : "Yesterday",
			target_period_previous : "yesterday",
			target_number : 30,
			seconds_to_show : 30

		}, {
			target_period_title : "This Week",
			target_period : "week",
			target_period_previous_title : "Last Week",
			target_period_previous : "last_week",
			target_number : 30,
			seconds_to_show : 30,
			active: true

		}, {
			target_period_title : "This Month",
			target_period : "month",
			target_period_previous_title : "Last Month",
			target_period_previous : "last_month",
			target_number : 30,
			seconds_to_show : 30,
			active: true
		}],
		order:5,
		momentum:1,
		charts:0
	});
}
if (SettingsCollection.find().fetch().length === 0) {
	var initialSettings = {
		message_text : ""
	}
	SettingsCollection.insert(initialSettings);
}
if (MomentumThresholdCollection.find().fetch().length === 0) {
	var initialSettings = [
		{day:"Monday", orange: 0, green:0},
		{day:"Tuesday", orange: 0, green:0},
		{day:"Wednesday", orange: 0, green:0},
		{day:"Thursday", orange: 0, green:0},
		{day:"Friday", orange: 0, green:0},
		{day:"Saturday", orange: 0, green:0},
		{day:"Sunday", orange: 0, green:0},
	]
	_.each(initialSettings, function(item){
		MomentumThresholdCollection.insert(item);	
	})
	
}
Meteor.methods({
	makeCall: function() {
		
	
		Meteor.call("getJobKeywords");
		Meteor.call("getKeywords");
		Meteor.call("getEmployees");
		Meteor.call("getJobs");
		
		//callTimeout = setTimeout(function() {
		//	makeCall(timeout);
		//}, timeout);
	

	},
	getEmployees : function() {

		var fut = new Future();

		con = new tedious.Connection(databaseConf);
		con.on('connect', function(err) {
			if (err) {
				console.log('connect error: ' + err);
				var fs = Npm.require('fs');
				fs.appendFile("/tmp/log", err, function(err) {
				    if(err) {
				        console.log(err);
				    } else {
				        console.log("The file was saved!");
				    }
				}); 
				//callTimeout = setTimeout(function() {
				//	makeCall(the_interval);
				//}, the_interval);
			}
			return getEmployeesFn();

		});

		getEmployeesFn = function() {
						
						var month;
			var curr = new Date; // get current date
			var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
			var last = first + 7; // last day is the first day + 6
			
			var firstday = new Date(curr.setDate(first));
			var d = firstday;
			var lastWeekStart = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
			var lastWeekStartString = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()+ " 00:00:00";
			var lastWeekStartDay = d.getDate();
			var lastWeekEnd = d.setDate(d.getDate() + 7);

			var lastWeekEndDay = d.getDate();
			
				month = (d.getMonth()+1);
			
			var lastWeekEndString = d.getFullYear() + "-" + month + "-" + (d.getDate()-1)  + " 23:59:59";
			
			var thisWeekStartString = firstday.getFullYear()  + "-" + (firstday.getMonth()+1) + "-" + firstday.getDate()+ " 00:00:00";
			var lastday = new Date(curr.setDate(last));
			if(lastday.getDate() < firstday.getDate()){
				month = (lastday.getMonth()+1);
			}else{
				month = (lastday.getMonth()+1);
			}
			if(lastday.getDate() < firstday.getDate()){
				month++;
			}
			var thisWeekEndString = lastday.getFullYear()  + "-" + (month ) + "-" + lastday.getDate()+ " 23:59:59";			
			var lm = new Date();
			lm.setMonth(lm.getMonth() - 1);
			var lastMonthStart = new Date(lm.getFullYear(), lm.getMonth(), 1);
			var lastMonthStartString = lastMonthStart.getFullYear() + "-" + (lastMonthStart.getMonth()+1) + "-" + lastMonthStart.getDate()+ " 00:00:00";
			var lastMonthEnd = new Date(lm.getFullYear(), lm.getMonth() + 3, 0);
			var lastMonthEndString = lastMonthEnd.getFullYear() + "-" + (lastMonthEnd.getMonth())+ "-1 00:00:00";//lastMonthStartString = "2013-05-01";
			//lastMonthEndString = "2013-05-31";
			if (!EmployeeCollection) {
				EmployeeCollection = new Meteor.Collection('EmployeeCollection');
			}
			sql = "SET DEADLOCK_PRIORITY -10\n DECLARE @FirstDayOfWeek DATETIME, @LastDayOfWeek DATETIME \n";
			sql += "SELECT @FirstDayOfWeek = DATEADD(wk, DATEDIFF(wk, 6, GETDATE()), 6) + ' 00:00:00', @LastDayOfWeek = DATEADD(wk, DATEDIFF(wk, 5, GETDATE()), 5)+ ' 23:59:59'\n";
			sql += 'SELECT e.*, ';

			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews  AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE  cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (i.DATE_TIME >= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0) AND i.DATE_TIME <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 1))) AS INTERVIEW_COUNT_DAY, ';
			sql += '(SELECT TOP 1 COUNT(INTERVIEW_ID) FROM dbo.Interviews i WITH (NOLOCK) JOIN dbo.CVsSent cvt ON i.CVSENT_ID = cvt.CVSENT_ID  WHERE  cvt.EMP_ID = e.EMP_ID   AND NUM = 1   AND (i.DATE_TIME BETWEEN \''+ thisWeekStartString + '\' AND \''+ thisWeekEndString + '\') ) AS INTERVIEW_COUNT_WEEK, ';
			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE  cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (YEAR(i.DATE_TIME) = YEAR(GetDate())   AND MONTH(i.DATE_TIME)  = MONTH(GetDate()))) AS INTERVIEW_COUNT_MONTH, ';

			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (i.DATE_TIME >= DATEADD(day, DATEDIFF(day, 1, GETDATE()), 0) AND i.DATE_TIME <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0))) AS INTERVIEW_COUNT_YESTERDAY, ';
			sql += '(SELECT TOP 1 COUNT(INTERVIEW_ID) FROM dbo.Interviews i WITH (NOLOCK) JOIN dbo.CVsSent cvt ON i.CVSENT_ID = cvt.CVSENT_ID  WHERE cvt.EMP_ID = e.EMP_ID AND NUM = 1     AND (i.DATE_TIME BETWEEN  \'' + lastWeekStartString + '\' AND \'' + lastWeekEndString + '\')) AS INTERVIEW_COUNT_LASTWEEK, ';
			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (i.DATE_TIME >= \'' + lastMonthStartString + '\' AND i.DATE_TIME <= \'' + lastMonthEndString + '\')) AS INTERVIEW_COUNT_LASTMONTH, ';
			///INTERVIEWS FOR MOMENTUM 
			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews  AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE  cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (i.DATE_TIME >= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0) AND i.ARRANGE_ON <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 1))) AS INTERVIEWS_ARRANGED_COUNT_DAY, ';
			sql += '(SELECT TOP 1 COUNT(INTERVIEW_ID) FROM dbo.Interviews i WITH (NOLOCK) JOIN dbo.CVsSent cvt ON i.CVSENT_ID = cvt.CVSENT_ID  WHERE  cvt.EMP_ID = e.EMP_ID   AND NUM = 1   AND (i.ARRANGE_ON BETWEEN \''+ thisWeekStartString + '\' AND \''+ thisWeekEndString + '\') ) AS INTERVIEWS_ARRANGED_COUNT_WEEK, ';
			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE  cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (YEAR(i.ARRANGE_ON) = YEAR(GetDate())   AND MONTH(i.ARRANGE_ON)  = MONTH(GetDate()))) AS INTERVIEWS_ARRANGED_COUNT_MONTH, ';

			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (i.ARRANGE_ON >= DATEADD(day, DATEDIFF(day, 1, GETDATE()), 0) AND i.ARRANGE_ON <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0))) AS INTERVIEWS_ARRANGED_COUNT_YESTERDAY, ';
			sql += '(SELECT TOP 1 COUNT(INTERVIEW_ID) FROM dbo.Interviews i WITH (NOLOCK) JOIN dbo.CVsSent cvt ON i.CVSENT_ID = cvt.CVSENT_ID  WHERE cvt.EMP_ID = e.EMP_ID AND NUM = 1     AND (i.ARRANGE_ON BETWEEN  \'' + lastWeekStartString + '\' AND \'' + lastWeekEndString + '\')) AS INTERVIEWS_ARRANGED_COUNT_LASTWEEK, ';
			sql += '(SELECT COUNT(INTERVIEW_ID) FROM Interviews AS i WITH (NOLOCK) INNER JOIN CVsSent AS cvt ON i.CVSENT_ID = cvt.CVSENT_ID   WHERE cvt.EMP_ID = e.EMP_ID AND NUM = 1 AND (i.ARRANGE_ON >= \'' + lastMonthStartString + '\' AND i.ARRANGE_ON <= \'' + lastMonthEndString + '\')) AS INTERVIEWS_ARRANGED_COUNT_LASTMONTH, ';

			//CVS SENT
			sql += '(SELECT COUNT(CVSENT_ID) FROM CVsSent AS cv WITH (NOLOCK) WHERE cv.EMP_ID = e.EMP_ID AND (cv.DATE_SENT >= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0) AND cv.DATE_SENT <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 1))) AS CVS_SENT_DAY, ';
			sql += '(SELECT COUNT(CVSENT_ID) FROM CVsSent AS cv WITH (NOLOCK) WHERE cv.EMP_ID = e.EMP_ID AND (cv.DATE_SENT BETWEEN \''+ thisWeekStartString + '\' AND \''+ thisWeekEndString + '\') ) AS CVS_SENT_WEEK, ';
			sql += '(SELECT COUNT(CVSENT_ID) FROM CVsSent AS cv WITH (NOLOCK) WHERE cv.EMP_ID = e.EMP_ID AND (YEAR(cv.DATE_SENT) = YEAR(GetDate())   AND MONTH(cv.DATE_SENT)  = MONTH(GetDate()))) AS CVS_SENT_MONTH, ';

			sql += '(SELECT COUNT(CVSENT_ID) FROM CVsSent AS cv WITH (NOLOCK) WHERE cv.EMP_ID = e.EMP_ID AND (cv.DATE_SENT >= DATEADD(day, DATEDIFF(day, 1, GETDATE()), 0) AND cv.DATE_SENT <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0))) AS CVS_SENT_YESTERDAY, ';
			sql += '(SELECT TOP 1 COUNT(CVSENT_ID) FROM dbo.CVsSent cv WITH (NOLOCK) WHERE cv.EMP_ID = e.EMP_ID AND cv.DATE_SENT BETWEEN \'' + lastWeekStartString + '\' AND \'' + lastWeekEndString + '\') AS CVS_SENT_LASTWEEK, ';
			sql += '(SELECT COUNT(CVSENT_ID) FROM CVsSent AS cv WITH (NOLOCK) WHERE cv.EMP_ID = e.EMP_ID AND (cv.DATE_SENT >= \'' + lastMonthStartString + '\' AND cv.DATE_SENT <= \'' + lastMonthEndString + '\')) AS CVS_SENT_LASTMONTH, ';

			sql += '(SELECT COUNT(COMMENT_ID) FROM Comments AS co WITH (NOLOCK) WHERE co.EMP_ID = e.EMP_ID AND CONTACT_ID IS NOT NULL AND SOURCE_FORM_ID IN (3) AND FLAG IN (24,18,20)  AND (co.CREATED >= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0) AND co.CREATED <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 1))) AS CLIENT_CONTACTS_DAY, ';
			sql += '(SELECT TOP 1 COUNT(COMMENT_ID) FROM dbo.Comments co WITH (NOLOCK) WHERE co.EMP_ID = e.EMP_ID AND CONTACT_ID IS NOT NULL AND SOURCE_FORM_ID IN (3) AND FLAG IN (24,18,20)  AND (co.CREATED BETWEEN \''+ thisWeekStartString + '\' AND \''+ thisWeekEndString + '\') ) AS CLIENT_CONTACTS_WEEK, ';
			sql += '(SELECT COUNT(COMMENT_ID) FROM Comments AS co WITH (NOLOCK) WHERE co.EMP_ID = e.EMP_ID AND CONTACT_ID IS NOT NULL AND SOURCE_FORM_ID IN (3) AND FLAG IN (24,18,20) AND (YEAR(co.CREATED) = YEAR(GetDate())   AND MONTH(co.CREATED)  = MONTH(GetDate()))) AS CLIENT_CONTACTS_MONTH, ';

			sql += '(SELECT COUNT(COMMENT_ID) FROM Comments AS co WITH (NOLOCK) WHERE co.EMP_ID = e.EMP_ID AND CONTACT_ID IS NOT NULL AND SOURCE_FORM_ID IN (3) AND FLAG IN (24,18,20) AND (co.CREATED >= DATEADD(day, DATEDIFF(day, 1, GETDATE()), 0) AND co.CREATED <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0))) AS CLIENT_CONTACTS_YESTERDAY, ';
			sql += '(SELECT TOP 1 COUNT(COMMENT_ID) FROM dbo.Comments co WITH (NOLOCK) WHERE co.EMP_ID = e.EMP_ID AND CONTACT_ID IS NOT NULL AND SOURCE_FORM_ID IN (3) AND FLAG IN (24,18,20) AND co.CREATED BETWEEN \'' + lastWeekStartString + '\' AND  \'' + lastWeekEndString + '\') AS CLIENT_CONTACTS_LASTWEEK, ';
			sql += '(SELECT COUNT(COMMENT_ID) FROM Comments AS co WITH (NOLOCK) WHERE co.EMP_ID = e.EMP_ID AND CONTACT_ID IS NOT NULL AND SOURCE_FORM_ID IN (3) AND FLAG IN (24,18,20) AND (co.CREATED >= \'' + lastMonthStartString + '\' AND co.CREATED <= \'' + lastMonthEndString + '\')) AS CLIENT_CONTACTS_LASTMONTH, ';

			sql += '(SELECT COUNT(JOB_ID) FROM Requirements AS r WITH (NOLOCK) WHERE r.EMP_ID = e.EMP_ID AND (r.CREATED_ON >= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0) AND r.CREATED_ON <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 1))) AS NEW_VACANCIES_DAY, ';
			sql += '(SELECT TOP 1 COUNT(JOB_ID) FROM dbo.Requirements r WITH (NOLOCK) WHERE r.EMP_ID = e.EMP_ID AND (r.CREATED_ON BETWEEN \''+ thisWeekStartString + '\' AND \''+ thisWeekEndString + '\')) AS NEW_VACANCIES_WEEK, ';
			sql += '(SELECT COUNT(JOB_ID) FROM Requirements AS r WITH (NOLOCK) WHERE r.EMP_ID = e.EMP_ID AND (YEAR(r.CREATED_ON) = YEAR(GetDate()) AND MONTH(r.CREATED_ON) = MONTH(GetDate()))) AS NEW_VACANCIES_MONTH, ';

			sql += '(SELECT COUNT(JOB_ID) FROM Requirements AS r WITH (NOLOCK) WHERE r.EMP_ID = e.EMP_ID AND (r.CREATED_ON >= DATEADD(day, DATEDIFF(day, 1, GETDATE()), 0) AND r.CREATED_ON <= DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0))) AS NEW_VACANCIES_YESTERDAY, ';
			sql += '(SELECT TOP 1 COUNT(JOB_ID) FROM dbo.Requirements r WITH (NOLOCK) WHERE r.EMP_ID = e.EMP_ID AND (r.CREATED_ON BETWEEN \'' + lastWeekStartString + '\' AND  \'' + lastWeekEndString + '\') ) AS NEW_VACANCIES_LASTWEEK, ';
			sql += '(SELECT COUNT(JOB_ID) FROM Requirements AS r WITH (NOLOCK) WHERE r.EMP_ID = e.EMP_ID AND (r.CREATED_ON >= \'' + lastMonthStartString + '\' AND r.CREATED_ON <= \'' + lastMonthEndString + '\')) AS NEW_VACANCIES_LASTMONTH ';
			sql += 'FROM Employees AS e WITH (NOLOCK)';
			var req, result;
			result = [];
		
			req = new tedious.Request(sql, function(err, rowCount) {
				if (err) {
					var currentdate = new Date(); 
					var datetime = "Error: " + currentdate.getDate() + "/"
					                + (currentdate.getMonth()+1)  + "/" 
					                + currentdate.getFullYear() + " @ "  
					                + currentdate.getHours() + ":"  
					                + currentdate.getMinutes() + ":" 
					                + currentdate.getSeconds() + " - ";
					var minutes = 0.5, the_interval = minutes * 60 * 1000;
					var fs = Npm.require('fs');
					fs.appendFile("/tmp/log", datetime+err+"\n", function(err) {
					    if(err) {
					        console.log(err);
					    } else {
					        console.log("The file was saved!");
					    }
					}); 
					callTimeout = setTimeout(function() {
						makeCall(the_interval);
					}, the_interval);
					return console.log(err);
					
				} else {
					return fut.ret(result);
				}
			});
			req.on('row', function(columns) {

				return result.push({
					employee_id : columns.EMP_ID.value,
					title : columns.TITLE.value,
					first_name : (columns.FIRST_NAME.value).replace(/\s+/g, ' '),
					last_name : (columns.LAST_NAME.value).replace(/\s+/g, ' '),
					nick_name : null,
					first_interviews : {
						day : columns.INTERVIEW_COUNT_DAY.value,
						week : columns.INTERVIEW_COUNT_WEEK.value,
						month : columns.INTERVIEW_COUNT_MONTH.value,
						yesterday : columns.INTERVIEW_COUNT_YESTERDAY.value,
						last_week : columns.INTERVIEW_COUNT_LASTWEEK.value,
						last_month : columns.INTERVIEW_COUNT_LASTMONTH.value
					},
					interviews_arranged : {
						day : columns.INTERVIEWS_ARRANGED_COUNT_DAY.value,
						week : columns.INTERVIEWS_ARRANGED_COUNT_WEEK.value,
						month : columns.INTERVIEWS_ARRANGED_COUNT_MONTH.value,
						yesterday : columns.INTERVIEWS_ARRANGED_COUNT_YESTERDAY.value,
						last_week : columns.INTERVIEWS_ARRANGED_COUNT_LASTWEEK.value,
						last_month : columns.INTERVIEWS_ARRANGED_COUNT_LASTMONTH.value
					},
					cvs_sent : {
						day : columns.CVS_SENT_DAY.value,
						week : columns.CVS_SENT_WEEK.value,
						month : columns.CVS_SENT_MONTH.value,
						yesterday : columns.CVS_SENT_YESTERDAY.value,
						last_week : columns.CVS_SENT_LASTWEEK.value,
						last_month : columns.CVS_SENT_LASTMONTH.value,
					},

					client_contacts : {
						day : columns.CLIENT_CONTACTS_DAY.value,
						week : columns.CLIENT_CONTACTS_WEEK.value,
						month : columns.CLIENT_CONTACTS_MONTH.value,
						yesterday : columns.CLIENT_CONTACTS_YESTERDAY.value,
						last_week : columns.CLIENT_CONTACTS_LASTWEEK.value,
						last_month : columns.CLIENT_CONTACTS_LASTMONTH.value
					},
					new_vacancies : {
						day : columns.NEW_VACANCIES_DAY.value,
						week : columns.NEW_VACANCIES_WEEK.value,
						month : columns.NEW_VACANCIES_MONTH.value,
						yesterday : columns.NEW_VACANCIES_YESTERDAY.value,
						last_week : columns.NEW_VACANCIES_LASTWEEK.value,
						last_month : columns.NEW_VACANCIES_LASTMONTH.value
					},
					good_photo : null,
					bad_photo : null,
					logged_on: columns.LOGGED_ON.value,
					end_date: columns.END_DATE.value,
					active : false
				});
			});
			return con.execSql(req);
		};
		result = fut.wait();

		//ResultsCollection.remove({});

		result.forEach(function(e) {
			
			var existingEmployee = EmployeeCollection.findOne({
				employee_id : e.employee_id

			});
			
			//console.log(e.employee_id);
			if (typeof existingEmployee == "undefined") {
				//console.log("add");
				return EmployeeCollection.insert(e);
			} else {
				var targets = TargetsCollection.find().fetch();
				
				if(typeof existingEmployee["targets"] == "undefined"){
					var targetsObj = {}
					
					
				}else{
					var targetsObj = existingEmployee.targets;
				}
				_.each(targets, function(target){
					var name = target.target_for;
					if(!targetsObj[name]){
					targetsObj[name] = {};
					_.each(target.target_periods, function(period){
						targetsObj[name][period.target_period] = {};
						targetsObj[name][period.target_period]['target_number'] = period.target_number;
						targetsObj[name][period.target_period]['target_hit'] = 0;
					});
					}
				});
				EmployeeCollection.update(existingEmployee._id, {$set: {targets: targetsObj}});
				existingEmployee.targets = targetsObj;
				if(e.employee_id=="HQ00000006"){
					console.log("CVS Sent - "+e.cvs_sent.week+" >= "+existingEmployee.targets.cvs_sent.week.target_number)
				}
				if(parseInt(e.cvs_sent.week) >= parseInt(existingEmployee.targets.cvs_sent.week.target_number) && parseInt(existingEmployee.targets.cvs_sent.week.target_hit == 0)){
					existingEmployee.targets.cvs_sent.week.target_hit = 1;
				}else if(parseInt(e.cvs_sent.week) >= parseInt(existingEmployee.targets.cvs_sent.week.target_number) && parseInt(existingEmployee.targets.cvs_sent.week.target_hit == 1)){
					existingEmployee.targets.cvs_sent.week.target_hit = 2;
				}else if(e.cvs_sent.week < existingEmployee.targets.cvs_sent.week.target_number){
					existingEmployee.targets.cvs_sent.week.target_hit = 0;
				}
				
				
				EmployeeCollection.update(existingEmployee._id, {
					$set : {

						first_interviews : e.first_interviews,
						cvs_sent : e.cvs_sent,
						interviews_arranged: e.interviews_arranged,
						client_contacts : e.client_contacts,
						new_vacancies : e.new_vacancies,
						logged_on: e.end_date?0:1,
						targets: existingEmployee.targets
					}
					
				});

			}
		});
		//		console.log(EmployeeCollection.find().fetch());
		//delete fut;
		//Meteor.call("getJobs");
	},
	
	
	
	
	
	
	
	
	
	
	
	
	/* 
	 * 
	 *  Build the keywords selection below.
	 * Jobs are linked to keywords. Keywords are linked to categories.
	 * Categories need to have both a colour and a logo assigned to it.
	 *  
	 * 
	 */
	
	
	
	
	
	
	
	
	getKeywords: function(){
		var fut = new Future();

		con = new tedious.Connection(databaseConf);
		con.on('connect', function(err) {
			if (err) {
				var minutes = 1, the_interval = minutes * 60 * 1000;

				callTimeout = setTimeout(function() {
					makeCall(the_interval);
				}, the_interval);
				console.log('connect error: ' + err);
			}
			return getKeywordsFn();

		});

		getKeywordsFn = function() {
			
			if (!KeywordsCollection) {
				KeywordsCollection= new Meteor.Collection('KeywordsCollection');
			}

			sql = "SET DEADLOCK_PRIORITY LOW\n";
			sql += "SELECT * FROM Keywords ";
			var req, keywordsresult;
			keywordsresult = [];
			req = new tedious.Request(sql, function(err, rowCount) {
				if (err) {
					
					return console.log(err);
				} else {
					return fut.ret(keywordsresult);
				}
			});
			req.on('row', function(columns) {

				
				e = {
					keyword_id: columns.DICT_ID.value,
					keyword : columns.KEYWORD.value,
					definition: columns.DEFINITION.value
				};
				return keywordsresult.push(e);

			});
			
			return con.execSql(req);
		};
		keywordsresult = fut.wait();
		
		keywordsresult.forEach(function(e) {
			var existingKeyword = KeywordsCollection.find({
				keyword_id : e.keyword_id

			}).fetch();
			
			
			//console.log(e.employee_id);
			if (!existingKeyword.length) {
				
				return KeywordsCollection.insert(e);
			}
		});
	
		//ResultsCollection.remove({});

		//		console.log(EmployeeCollection.find().fetch());
		delete fut;

	},
	
	getJobKeywords: function(){
		
		var fut = new Future();

		con = new tedious.Connection(databaseConf);
		con.on('connect', function(err) {
			if (err) {
				var minutes = 0.5, the_interval = minutes * 60 * 1000;

				callTimeout = setTimeout(function() {
					makeCall(the_interval);
				}, the_interval);
				console.log('connect error: ' + err);
			}
			
			return getJobKeywordsFn();

		});

		getJobKeywordsFn = function() {
			if (!JobKeywordsCollection) {
				JobKeywordsCollection= new Meteor.Collection('JobKeywordsCollection');
			}
			
			//sql = "SET DEADLOCK_PRIORITY -10\n";
			sql = "SELECT * FROM JobKeywords ";
			var req, jobkeywordsresult;
			jobkeywordsresult = [];
			req = new tedious.Request(sql, function(err, rowCount) {
				if (err) {
					
					return console.log(err);
				} else {
					return fut.ret(jobkeywordsresult);
				}
			});
			req.on('row', function(columns) {

				
				e = {
					job_id: columns.JOB_ID.value,
					keyword_id: columns.DICT_ID.value,
					
				};
				return jobkeywordsresult.push(e);

			});
			
			return con.execSql(req);
		};
		jobkeywordsresult = fut.wait();
		
		jobkeywordsresult.forEach(function(e) {
			var existingJobKeyword = JobKeywordsCollection.find({
				keyword_id : e.keyword_id,
				job_id : e.job_id
			}).fetch();
			
			
			//console.log(e.employee_id);
			if (!existingJobKeyword.length) {
				return JobKeywordsCollection.insert(e);
			}
		});
	
		//ResultsCollection.remove({});

		//		console.log(EmployeeCollection.find().fetch());
		delete fut;

	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	getJobs : function() {
		var fut = new Future();
		
		con = new tedious.Connection(databaseConf);
		con.on('connect', function(err) {
			console.log(con);
			if (err) {
				var minutes = 0.5, the_interval = minutes * 60 * 1000;

				callTimeout = setTimeout(function() {
					makeCall(the_interval);
				}, the_interval);
				console.log('connect error: ' + err);
			}
			return getJobsFn();

		});

		getJobsFn = function() {
			var jobtypes = [{
				".NET" : ["ASP.NET", "VB.net", "C#", "SQL SERVER"],
				"Java" : ["Java"],
				"PHP" : ["PHP"],
				"Other" : ["Default"]
			}];
			if (!JobsCollection) {
				JobsCollection = new Meteor.Collection('JobsCollection');
			}

			sql = "SELECT r.JOB_ID, r.EMP_ID, r.PAY_INT, r.PAYMENT_TO, r.JOB_TITLE, r.DURATION, k.KEYWORD, r.COMPANY, r.PAYMENT, r.DATE_START, r.ADDRESS, r.LOCATION, r.TELEPHONE FROM Requirements AS r LEFT JOIN JobKeywords AS jk ON jk.JOB_ID = r.JOB_ID LEFT JOIN Keywords AS k ON jk.DICT_ID = k.DICT_ID WHERE r.ISACTIVE = 1 AND r.ADDRESS IS NOT NULL ORDER BY r.JOB_ID DESC";
			var req, jobsresult, job_type, payment_type;
			jobsresult = [];
			req = new tedious.Request(sql, function(err, rowCount) {
				if (err) {
					var minutes = 0.5, the_interval = minutes * 60 * 1000;

					callTimeout = setTimeout(function() {
						makeCall(the_interval);
					}, the_interval);
					return console.log(err);
				} else {
					return fut.ret(jobsresult);
				}
			});
			netcount = 0;
			var jobTypeArr  = Array();
			req.on('row', function(columns) {

				//console.log(e.employee_id);
				var keyword = columns.KEYWORD.value;
				switch (keyword) {
					case "ASP.NET":
					case "VB.net":
					case "C#":
					case "SQL SERVER":
						jobTypeArr[columns.JOB_ID.value] = ".NET";
						break;
					case "Java":
						jobTypeArr[columns.JOB_ID.value] = "Java";
						break;
					case "PHP":
						netcount++;
						jobTypeArr[columns.JOB_ID.value] = "PHP";
						break;
					/*default:
						job_type = "Other";
						break;*/

				}
				var charge_int = columns.PAY_INT.value;
				switch (charge_int) {
					case 0:
						payment_type = "per hour";
						break;
					case 1:
						payment_type = "per day";
						break;
					case 2: 
						payment_type = "per week"
						break;
					case 3:
						payment_type = "per month";
					case 4:
						payment_type = "salary"
					case 5:
						payment_type = "salary";
						break;
					case 6:
						payment_type = "fixed fee";
						break;
					case 7:
						payment_type = "salary";
					break;
					default:
						payment_type = "";
						break;

				}
				if(!jobTypeArr[columns.JOB_ID.value]){
					job_type = "Other";
				}else{
					job_type = jobTypeArr[columns.JOB_ID.value];
				}
				e = {
					emp_id: columns.EMP_ID.value,
					job_id : columns.JOB_ID.value,
					job_title : columns.JOB_TITLE.value,
					job_type : job_type,
					job_duration : columns.DURATION.value,
					job_short_location : columns.LOCATION.value,
					job_telephone : columns.TELEPHONE.value,
					job_pay : columns.PAYMENT.value,
					job_pay_to: columns.PAYMENT_TO.value,
					job_company : columns.COMPANY.value,
					payment_type: payment_type,
					address : columns.ADDRESS.value,
					added_date : (new Date()).getTime(),
					lat : 0,
					lng : 0,
					geocode : true,
					displayed:false
				};
				return jobsresult.push(e);

			});
			
			return con.execSql(req);
		};
		jobsresult = fut.wait();
		var updateC = 0;
		var str = JSON.stringify(jobsresult)
		//Meteor.saveFile(str, "test.json", "/json/");
		var jobIDArray = Array();
		jobsresult.forEach(function(e) {
			var existingJob = JobsCollection.find({
				job_id : e.job_id

			}).fetch();
			jobIDArray.push(e.job_id);
			if(e.job_id==="HQ00005213"){
			}
			//console.log(e.employee_id);
			if (!existingJob.length) {
				
				return JobsCollection.insert(e);
			}else{
				
				
			
				JobsCollection.update(existingJob[0]._id, {$set: {
					payment_type: e.payment_type,
					payment_to: e.job_pay_to,
					emp_id: e.emp_id,
					job_type: e.job_type
				}});
				
				updateC ++;
			}
		});
		JobsCollection.remove({job_id: {$nin: jobIDArray}});
		
		//ResultsCollection.remove({});

		//		console.log(EmployeeCollection.find().fetch());
		//delete fut;

	},
	writeBase64: function(base64, name, path){

		var base64Data = base64.replace(/^data:image\/png;base64,/,"");

	
		var path = cleanPath(path), fs = Npm.require('fs'), name = cleanName(name || 'file'), encoding = encoding || 'binary', chroot = Meteor.chroot || 'public';
		// Clean up the path. Remove any initial and final '/' -we prefix them-,
		// any sort of attempt to go to the parent directory '..' and any empty directories in
		// between '/////' - which may happen after removing '..'
		path = chroot + ( path ? '/' + path + '/' : '/');
		//;TODO Add file existance checks, etc...
		fs.writeFile(path+name, base64Data, 'base64', function(err) {
			if (err) {
				console.log('Failed to save file. '+ err);
			} else {
				console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
			}
		});

		function cleanPath(str) {
			if (str) {
				return str.replace(/\.\./g, '').replace(/\/+/g, '').replace(/^\/+/, '').replace(/\/+$/, '');
			}
		}

		function cleanName(str) {
			return str.replace(/\.\./g, '').replace(/\//g, '');
		}
	},
	saveFile : function(blob, name, path, encoding) {
		console.log("SAVE FILE");
		var path = cleanPath(path), fs = Npm.require('fs'), name = cleanName(name || 'file'), encoding = encoding || 'binary', chroot = Meteor.chroot || 'public';
		// Clean up the path. Remove any initial and final '/' -we prefix them-,
		// any sort of attempt to go to the parent directory '..' and any empty directories in
		// between '/////' - which may happen after removing '..'
		path = chroot + ( path ? '/' + path + '/' : '/');
console.log(path);
		// TODO Add file existance checks, etc...
		fs.writeFile(path + name, blob, encoding, function(err) {
			if (err) {
				throw (new Meteor.Error(500, 'Failed to save file.', err));
			} else {
				console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
			}
		});

		function cleanPath(str) {
			if (str) {
				return str.replace(/\.\./g, '').replace(/\/+/g, '').replace(/^\/+/, '').replace(/\/+$/, '');
			}
		}

		function cleanName(str) {
			return str.replace(/\.\./g, '').replace(/\//g, '');
		}

	}
});

function makeCall(timeout) {
	//Fiber(function() {
		Meteor.call("getEmployees");
		Meteor.call("getJobs");
		Meteor.call("getKeywords");
		Meteor.call("getJobKeywords");
		//callTimeout = setTimeout(function() {
		//	makeCall(timeout);
		//}, timeout);
	//}).run();
}

var minutes = 0.5, the_interval = minutes * 60 * 1000;
makeCall(the_interval);

Meteor.startup(function() {
	// code to run on server at startup
	 var fs = Npm.require('fs');


//	JobKeywordsCollection.remove({});
}); 