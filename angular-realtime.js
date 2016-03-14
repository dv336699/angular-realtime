(function() {
    'use strict';

    angular.module('realtime', [])
    .provider('$realtime', function() {
        var applicationKey = null;
        var authenticationToken = null;
        var realtimeClusterUrl = 'https://ortc-developers.realtime.co/server/ssl/2.1';

        var realtimeClient = null;

        function Realtime($rootScope) {
            this.setClusterUrl = function(clusterUrl) {
                realtimeClient.setClusterUrl(clusterUrl);
            };

            this.setCredentials = function(key, token, connect) {
                applicationKey = key;
                authenticationToken = token;

                if (!angular.isDefined(connect) || connect === true) {
                    this.connect();
                }
            };

            this.connect = function() {
                if (realtimeClient && !realtimeClient.getIsConnected()) {
                    realtimeClient.connect(applicationKey, authenticationToken);
                }
            };

            this.disconnect = function() {
                if (realtimeClient && realtimeClient.getIsConnected()) {
                    realtimeClient.disconnect();
                }
            };

            this.send = function(channel, message) {
                if (realtimeClient) {
                    if (typeof message !== 'string') {
                        message = JSON.stringify(message);
                    }

                    realtimeClient.send(channel, message);
                }
            };

            this.subscribe = function(channel) {
                if (realtimeClient && !realtimeClient.isSubscribed(channel)) {
                    realtimeClient.subscribe(channel, true, function (ortc, channel, message) {
                        try {
                            message = JSON.parse(message);
                        } catch (e) {
                            $rootScope.$broadcast('realtime:' + channel + ':jsonParseException', e);
                        }

                       $rootScope.$broadcast('realtime:' + channel + ':onMessage', message);
                    });
                }
            };

            this.unsubscribe = function(channel) {
                if (realtimeClient && realtimeClient.isSubscribed(channel)) {
                    realtimeClient.unsubscribe(channel);
                }
            };

            if (typeof loadOrtcFactory !== 'undefined') {
                loadOrtcFactory(IbtRealTimeSJType, function (factory, error) {
                   if (error != null) {
                       $rootScope.$broadcast('realtime:loadOrtcFactoryError', error);
                   } else {
                       if (factory != null) {
                            realtimeClient = factory.createClient();
                            realtimeClient.setClusterUrl(realtimeClusterUrl);

                            realtimeClient.onConnected = function (ortc) {
                                $rootScope.$broadcast('realtime:onConnected', ortc);
                            };

                            realtimeClient.onDisconnected = function (ortc) {
                                $rootScope.$broadcast('realtime:onDisconnected', ortc);
                            };

                            realtimeClient.onException = function (ortc, exception) {
                                $rootScope.$broadcast('realtime:onException', ortc, exception);
                            };

                            realtimeClient.onReconnected = function (ortc) {
                                $rootScope.$broadcast('realtime:onReconnected', ortc);
                            };

                            realtimeClient.onReconnecting = function (ortc) {
                                $rootScope.$broadcast('realtime:onReconnecting', ortc);
                            };

                            realtimeClient.onSubscribed = function (ortc, channel) {
                                $rootScope.$broadcast('realtime:' + channel + ':onSubscribed');
                            };

                            realtimeClient.onUnsubscribed = function (ortc, channel) {
                                $rootScope.$broadcast('realtime:' + channel + ':onUnsubscribed', ortc);
                            };
                        }
                    }
                });
            } else {
                console.error('angular-realtime', 'loadOrtcFactory is undefined - make sure you\'re connected to the internet and that you can access http://messaging-public.realtime.co/js/2.1.0/ortc.js');
            }
        }

        this.$get = ['$rootScope', function($rootScope) {
            return new Realtime($rootScope);
        }];
    });
}());
