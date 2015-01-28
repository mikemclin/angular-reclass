'use strict';

angular
    .module('mm.reclass')
    .provider('ReclassConfig', ReclassConfig);

function ReclassConfig() {
    var config = {
        maxRefreshRate: 5,
        reclassDefault: ''
    };
    return {
        config: function (userConfig) {
            angular.extend(config, userConfig);
        }, $get: function () {
            return config;
        }
    };
}