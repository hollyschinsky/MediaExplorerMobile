'use strict';

/* Directives */
mediaApp.directive('videoLoader', function(){
    return function (scope, element, attrs){
        //console.log(scope.url);
        scope.$watch("url",  function(newValue, oldValue){ //watching the scope url value
            element[0].children[0].attributes[3].value=newValue; //set the URL on the src attribute
            element[0].load();
            element[0].play();
        }, true);
        scope.$watch("showFlag",  function(newValue, oldValue){
            if (!newValue) // if the showFlag is false, stop playing the video (modal was closed)
                element[0].pause();
        }, true);
    }
});

// Added for fading status bar
mediaApp.directive('fadeBar', function($timeout) {
    return {
        restrict: 'E',
        template: '<div class="fade-bar"></div>',
        replace: true,
        link: function($scope, $element, $attr) {
            $timeout(function() {
                $scope.$watch('sideMenuController.getOpenRatio()', function(ratio) {
                    $element[0].style.opacity = Math.abs(ratio);
                });
            });
        }
    }
});