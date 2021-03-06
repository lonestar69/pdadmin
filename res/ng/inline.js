/**
 * ngInline
 * an AngularJs directive for inline editing
 * By: Andrew Mead
 **/

(function() {
  'use strict';

angular.module('inline', [])
.directive('inline', function () {
    console.log('inline.js');
  return {
    template: '<span ng-switch on="edit" >' +
              '<span ng-switch-default>{{value}}<img class="pencil" src="img/pencil.png"/></span>' +
              '<input ng-switch-when="true" type="text" ng-model="$parent.value"/>' +
              '</span>',
    restrict: 'A',
    scope: {
      inline: '='
    },
    link: function (scope, element, attribs) {
      scope.value = scope.inline;

      /* watch for changes from the controller */
      scope.$watch('inline', function (val) {
        scope.value = val;
      });

      /* enable inline editing functionality */
      var enablingEditing = function () {
        scope.edit = true;

        setTimeout(function () {
          console.log(element.children().children('input'));
          element.children().children('input')[0].focus();
          element.children().children('input').bind('blur', function (e) {
            scope.$apply(function () {
              disablingEditing();
            });
          });
        }, 100);
      };


      /* disable inline editing functionality */
      var disablingEditing = function () {
        scope.edit = false;
        scope.inline = scope.value;
      };


      /* set up the default */
      disablingEditing();


      /* when the element with the inline attribute is clicked, enable editing */
      element.bind('click', function (e) {

        if ((e.target.nodeName.toLowerCase() === 'span') || (e.target.nodeName.toLowerCase() === 'img')) {
          scope.$apply(function () { // bind to scope
            enablingEditing();
          });
        }
      });

      /* allow editing to be disabled by pressing the enter key */
      element.bind('keypress', function (e) {

        if (e.target.nodeName.toLowerCase() != 'input') return;

        var keyCode = (window.event) ? e.keyCode : e.which;

        if (keyCode === 13) {
          scope.$apply(function () { // bind scope
            disablingEditing();
          });
        }
      });
    }
  }
});

})();