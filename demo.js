angular.module('app', ['realtime'])
.controller('appCtrl', function($rootScope, $scope, $interval, $realtime) {
    $realtime.setCredentials('JVE6un', 'my-auth-token-if-using-presence');

    $scope.connect = function() {
        $realtime.connect();
    };

    $scope.disconnect = function() {
        $realtime.disconnect();
    };

    $scope.subscribe = function(channel) {
        $realtime.subscribe(channel);
    };

    $scope.unsubscribe = function(channel) {
        $realtime.unsubscribe(channel);
    };

    $scope.send = function(channel, message) {
        $realtime.send(channel, { user: $scope.name, msg: message});
    };

    $scope.channels = [
        {
            id: 'angularRealtime1',
            messages: []
        },
        {
            id: 'angularRealtime2',
            messages: []
        },
        {
            id: 'angularRealtime3',
            messages: []
        }
    ];

    $scope.isConnected = false;
    $scope.$on('realtime:onConnected', function() {
        _.each($scope.channels, function(channel) {
            $scope.subscribe(channel.id);
        });

        $scope.$apply(function() {
            $scope.isConnected = true;
        });
    });

    $scope.$on('realtime:onDisconnected', function() {
        $scope.$apply(function() {
            $scope.isConnected = false;
        });
    });

    $scope.$on('realtime:onException', function(event, ortc, exception) {
        console.error('realtime:onException', exception);
    });

    $scope.$on('realtime:onReconnected', function() {
        console.info('realtime:onReconnected');
    });

    // Channel Events
    _.each($scope.channels, function(channel) {
        $rootScope.$on('realtime:'+channel.id+':onSubscribed', function(event, ortc) {
            $scope.$apply(function() {
                _.find($scope.channels, { id: channel.id }).isSubscribed = true;
            });
        });

        $scope.$on('realtime:'+channel.id+':onUnsubscribed', function(event, ortc) {
            $scope.$apply(function() {
                _.find($scope.channels, { id: channel.id }).isSubscribed = false;
            });
        });

        $scope.$on('realtime:'+channel.id+':onMessage', function(event, message) {
            $scope.$apply(function() {
                _.find($scope.channels, { id: channel.id }).messages.push(message);
            });
        });
    });
});
