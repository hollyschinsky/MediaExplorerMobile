var mediaApp = angular.module('mediaApp', ['ionic','ngResource'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "menu.html"
    })
      /* Could update home to be in it's own separate file */
    .state('menu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "views/home.html"
        }
      }
    })
    .state('menu.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "views/search.html",
          controller: "SearchCtrl"
        }
      }
    })

    .state('menu.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "views/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('menu.about', {
      url: "/about",
      views: {
          'menuContent' :{
              templateUrl: "views/about.html",
              controller: "AboutCtrl"
          }
      }
    });

    $urlRouterProvider.otherwise("/menu/home");
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate,SettingsService) {
    //alert("Main setting to 50");
    SettingsService.set('maxResults',"50");

    // Menu button
    $scope.leftButtons = [{
        type: 'button-icon button-clear ion-navicon',
        tap: function(e) {
            $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        }
    }];

    ionic.Platform.ready(function(){
        console.log("Cordova is ready, let's do this!");
        //alert("StatusBar");
        //StatusBar.hide();
        // hide the status bar using the StatusBar plugin
        //ionic.showStatusBar(false);
        //ionic.Platform.shofullScreen();
    });
})

.controller('SearchCtrl', function ($scope,MediaService,$ionicModal,$location,$ionicSideMenuDelegate,SettingsService) {
    $scope.navTitle = "iTunes Media Search";

    $scope.rightButtons =  [{
        type: 'button-icon button-clear ion-more',
        tap: function(e) {
            $scope.openSortModal();
        }
    }];
    $scope.request = {};
    $scope.showFlag = false;
    $scope.mediaTypes = {};
    $scope.mediaTypes.type = 'all';
    $scope.sortBy = "artistName";
    $scope.filterTerm = "";

    if ($scope.sideMenuController.isOpen())
        $scope.sideMenuController.toggleLeft();



    var doSearch = ionic.debounce(function(query) {
        var type = $scope.mediaTypes.type;
        if (type=="all")  type="";
        if (query!=null) {
            $scope.mediaResults = {};
            MediaService.search(query,type,SettingsService.get('maxResults')).then(function(resp) {
                $scope.mediaResults = resp;
                console.log("Results " + $scope.mediaResults.resultCount);
                $scope.$apply(function() {
                    $scope.mediaResults = resp;
                });

                if ($scope.mediaResults.resultCount == 0)
                    $scope.infoTxt = 'No matching results found';

            });
        }
    }, 500);


    $scope.search = function() {
        $scope.infoTxt = null;
        doSearch($scope.request.query);
    }


    $scope.checkMedia = function(item) {
        console.log("URL " + item.previewUrl + " " + item.kind);
        if (item.kind==='song' || item.kind==='music-video') {
            $scope.openModal(item);
            $scope.infoTxt = null;
        }
        else $scope.infoTxt = 'No suitable player available for the selected media type.'

    };

    $ionicModal.fromTemplateUrl('views/playModal.html', function(modal) {
        $scope.modal = modal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });

    $scope.openModal = function(item) {
        $scope.url = item.previewUrl;
        if  (item.trackName != null) $scope.title = item.trackName
        else $scope.title = item.collectionName;

        $scope.kind = item.kind;
        $scope.artist = item.artistName;
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $ionicModal.fromTemplateUrl('views/sortModal.html', function(sortModal) {
        $scope.sortModal = sortModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });

    $scope.openSortModal = function() {
        console.log("Sort Modal ");
        $scope.sortModal.show();
    };
    $scope.closeSortModal = function() {
        $scope.sortModal.hide();
    };

    $scope.saveSort = function() {
        console.log("This filter " + this.filterTerm + " query " + $scope.request.query + " sort " + this.sortBy);
        $scope.filterTerm = this.filterTerm;
        $scope.sortBy = this.sortBy;
        //$scope.search();
        $scope.sortModal.hide();
    }

})



.controller('SettingsCtrl', function ($scope,SettingsService,$window) {
    $scope.navTitle = "Settings";
    $scope.volume = "20";
    $scope.audio = "on";
    $scope.video = "on";
    $scope.maxResults = SettingsService.get('maxResults');

    $scope.leftButtons = [{
        type: 'button-icon button-clear ion-ios7-arrow-back',
        tap: function(e) {
            //$ionicSideMenuDelegate.back();
            $window.history.back();
        }
    }];
    if ($scope.sideMenuController.isOpen())
        $scope.sideMenuController.toggleLeft();

    $scope.toggleList = [
        { text: "Audio Mode", checked: true },
        { text: "Video Mode", checked: true }
    ];

    $scope.changeNumResults = function() {
        console.log("Results set to " + this.maxResults)
        $scope.maxResults = this.maxResults;
        SettingsService.set('maxResults',this.maxResults);
    };
})

.controller('AboutCtrl', function ($scope) {
    $scope.navTitle = "About Media Explorer";
    if ($scope.sideMenuController.isOpen())
        $scope.sideMenuController.toggleLeft();

    $scope.rightButtons =  [{
        type: 'button-icon button-clear ion-email',
        tap: function(e) {
            if (window.plugins && window.plugins.emailComposer ) {

                window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e), "Want to know more about Media Explorer...", "Please send me more details.", "hollyschinsky@gmail.com", null, null, false, null, null);
            }
            else {
                location.href = 'mailto:?subject=Question about media explorer&body=';
            }
        }
    }];
    $scope.linkTo = function(link){
        console.log("Link to " + link);
        var ref = window.open(link, '_blank', 'location=yes');
    }
})


