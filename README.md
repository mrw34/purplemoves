Purple Moves
============

This is a proof-of-concept app developed for the [UKRSE Hackday 2014](https://github.com/UKRSE/hackday/wiki).

It checks daily 5pm if you've done any exercise in the last two days and if not then reminds to you to do so, as long as the weather is clear.

It uses [Purple Robot](http://tech.cbits.northwestern.edu/purple-robot/) to check the weather at your location and for notifications, and the (Moves API)[https://dev.moves-app.com] to check your recent activity.

The app itself is written using [Meteor/Cordova](https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration). The server-side logic exists to workaround a same-origin issue with the Purple Robot client library.
