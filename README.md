http://realtime.co

Wrapper for [Realtime Framework](http://messaging-public.realtime.co/documentation/javascript/2.1.0/OrtcClient.html)

## Demo
http://plnkr.co/edit/EVUDzF57RQe2cfdBznqp?p=preview

## Quick Start
Subscribe for Realtime Cloud Messaging at https://accounts.realtime.co/subscriptions/ and get your Application Key.


Install the module
```
bower install angular-realtime
```

Add ```realtime``` to your app dependency
```javascript
angular.module('app', ['realtime'])
```

Add ```$realtime``` to your controller, set credentials, listen for the onConnected event, subscribe to one or more channels, listen for the onSubscribed event, send a message.
```javascript
angular.module('app', ['realtime'])
.controller('appCtrl', function($scope, $realtime) {
    $realtime.setCredentials('SET YOUR APP KEY', 'SET YOUR USER AUTH TOKEN');
    
    var channel1 = 'MYCHANNEL1';
    var channel2 = 'MYCHANNEL2';
    
    // Once we're connected, subscribe to the channel
    $scope.$on('realtime:onConnected', function() {
      $realtime.subscribe(channel1);
      $realtime.subscribe(channel2);
    });

    // Listen for the onSubscribed event and send some messages
    // The event will be in the following format:
    // realtime:CHANNEL_NAME:onSubscribed
    $scope.$on('realtime:' + channel1 + ':onSubscribed', function(event, ortc) {
      $realtime.send(channel1, 'Message on Channel: ' + channel1); // string
      $realtime.send(channel1, { user: 'user1', message: 'Message on Channel: ' + channel1}); // object
    });

    $scope.$on('realtime:' + channel2 + ':onSubscribed', function(event, ortc) {
      $realtime.send(channel2, 'Message on Channel: ' + channel2); // string
      $realtime.send(channel2, { user: 'user2', message: 'Message on Channel: ' + channel2}); // object
    });
    
    // Listen for the onMessage event
    // realtime:CHANNEL_NAME:onMessage
    
    // If you are setting message to a $scope var, you might need to use $scope.$apply(); for changes to take effect
    $scope.$on('realtime:' + channel1 + ':onMessage', function(event, message) {
        console.log('got message1', message);
    });
    
    $scope.$on('realtime:' + channel2 + ':onMessage', function(event, message) {
        console.log('got message2', message);
    });
});
```
