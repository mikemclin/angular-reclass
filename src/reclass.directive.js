'use strict';

angular
  .module('mm.reclass')
  .directive('reclass', reclass);

reclass.$inject = ['$window', '$timeout', 'ReclassConfig', 'ReclassUtils'];

function reclass($window, $timeout, ReclassConfig, ReclassUtils) {

  var directive = {
    restrict: 'A',
    scope: {},
    link: link
  };

  return directive;

  ////////////

  function link(scope, element, attrs) {
    var timeout, elementWidth, currentClasses = [];

    scope.config = ReclassConfig;
    scope.config.reclassDefault = sanitizeStatement(scope.config.reclassDefault);

    activate();

    ////////////

    function activate() {
      renderBreakpointClasses();
      addListeners();
    }

    function addListeners() {
      angular.element($window).on('resize', debounceRenderBreakpointClasses);

      scope.$on('$destroy', function () {
        angular.element($window).off('resize', debounceRenderBreakpointClasses);
      });
    }

    /**
     * Debounces `renderBreakpointClasses` by adding a small delay
     * between calls to prevent overloading
     */
    function debounceRenderBreakpointClasses() {
      ReclassUtils.debounce(renderBreakpointClasses, scope.config.maxRefreshRate, true);
    }

    /**
     * Handles the removing and and adding of classes to the element
     */
    function renderBreakpointClasses() {
      var classes = generateClasses();

      removeBreakpointClasses();
      element.addClass(classes);
      setCurrentClasses(classes);
    }

    /**
     * Returns a string of class names based on config and element width
     *
     * @returns {String}
     */
    function generateClasses() {
      var statements = getStatements(),
        length = statements.length,
        classes = [];

      elementWidth = getElementWidth();

      for (; length--;) {
        classes.push(getClassName(statements[length]));
      }

      return classes.join(' ');
    }

    /**
     * Get statements
     *
     * @returns {Array}
     */
    function getStatements() {
      return (attrs.reclass) ? sanitizeStatement(attrs.reclass) : scope.config.reclassDefault;
    }

    /**
     * Sanitize statements and split into an array
     *
     * @param statement
     * @returns {Array}
     */
    function sanitizeStatement(statement) {
      return statement.toLowerCase().replace(/\s+/g, '').split(',');
    }

    /**
     * Generates the class name based on config and element width
     *
     * @param statement
     * @returns {String}
     */
    function getClassName(statement) {
      var statementParts;
      if (statement.indexOf('<=') !== -1) {
        statementParts = statement.split('<=');
        if (elementWidth <= parseInt(statementParts[1])) {
          return statementParts[0];
        }
      } else if (statement.indexOf('<') !== -1) {
        statementParts = statement.split('<');
        if (elementWidth < parseInt(statementParts[1])) {
          return statementParts[0];
        }
      } else if (statement.indexOf('>=') !== -1) {
        statementParts = statement.split('>=');
        if (elementWidth >= parseInt(statementParts[1])) {
          return statementParts[0];
        }
      } else if (statement.indexOf('>') !== -1) {
        statementParts = statement.split('>');
        if (elementWidth > parseInt(statementParts[1])) {
          return statementParts[0];
        }
      } else if (statement.indexOf('==') !== -1) {
        statementParts = statement.split('==');
        if (elementWidth === parseInt(statementParts[1])) {
          return statementParts[0];
        }
      }
      return '';
    }

    /**
     * Get the width of the element
     *
     * @returns {number}
     */
    function getElementWidth() {
      return parseInt(element[0].clientWidth);
    }

    /**
     * Sets the classes that we've applied to the element
     *
     * @param classes
     */
    function setCurrentClasses(classes) {
      currentClasses = classes;
    }

    /**
     * Gets the classes that we've applied to the element
     *
     * @returns {Array}
     */
    function getCurrentClasses() {
      return currentClasses;
    }

    /**
     * Removes classes that we previously added to the element
     */
    function removeBreakpointClasses() {
      element.removeClass(getCurrentClasses());
    }
  }
}