'use strict';

angular
  .module('mm.reclass')
  .factory('ReclassUtils', ReclassUtils);

ReclassUtils.$inject = ['$timeout'];

function ReclassUtils($timeout) {

  var factory = {};
  var timeout;
  factory.debounce = debounce;

  return factory;

  ////////////

  /**
   * Debounce
   * http://stackoverflow.com/a/22056002/58795
   *
   * @param func
   * @param wait
   * @param immediate
   */
  function debounce(func, wait, immediate) {
    /*jshint validthis:true */
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    if (timeout) {
      $timeout.cancel(timeout);
    }
    timeout = $timeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  }

}