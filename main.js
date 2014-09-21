if (Meteor.isClient) {
  Meteor.startup(function() {
    Meteor.call('init');
  });
}

if (Meteor.isServer) {
  var submit;
  var readings = function() {
    return HTTP.post(submit, {
      params: {
        json: JSON.stringify({
          "command": "execute_script",
          "script": "PurpleRobot.readings();"
        })
      }
    }).data.payload;
  };
  var workout = function() {
    var data = HTTP.get('https://api.moves-app.com/api/1.1/user/summary/daily', {
      params: {
        pastDays: 2,
        access_token: Meteor.settings.moves_access_key
      }
    }).data;
    return !_.chain(data).pluck('summary').compact().flatten().some(summaries, function(summary) {
      return (summary.activity === 'cycling' && summary.distance > 20000) || (summary.activity === 'walking' && summary.steps > 10000);
    });
  };
  var notify = function() {
    if (workout() && readings().weatherundergroundfeature_weather === 'Clear') {
      HTTP.post(submit, {
        params: {
          json: JSON.stringify({
            "command": "execute_script",
            "script": "PurpleRobot.vibrate('buzz'); PurpleRobot.emitToast('Time for a workout!', true);"
          })
        }
      });
    }
  };
  Meteor.methods({
    init: function() {
      submit = 'http://' + this.connection.clientAddress + '/json/submit';
    }
  });
  Meteor.startup(function() {
    SyncedCron.options.collectionName = null;
    SyncedCron.add({
      name: 'notify',
      schedule: function(parser) {
        return parser.text('at 5:00pm');
      }, 
      job: notify
    });
    SyncedCron.start();
  });
}
