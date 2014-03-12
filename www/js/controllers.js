'use strict';

mediaApp.controller('MainCtrl', function($scope, $ionicSideMenuDelegate,SettingsService) {
    SettingsService.set('maxResults',"50");

    // Menu button
    $scope.leftButtons = [{
        type: 'button-icon button-clear ion-navicon',
        tap: function(e) {
            $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        }
    }];

    ionic.Platform.ready(function(){
        console.log("Cordova is ready");
        // Add device specific stuff here
    });
})


mediaApp.controller('AboutCtrl', function ($scope) {
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


mediaApp.controller('SettingsCtrl', function ($scope,SettingsService,$window) {
        $scope.navTitle = "Settings";
        $scope.volume = "20";
        $scope.audio = "on";
        $scope.video = "on";
        $scope.maxResults = SettingsService.get('maxResults');

        $scope.leftButtons = [{
            type: 'button-icon button-clear ion-ios7-arrow-back',
            tap: function(e) {
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

mediaApp.controller('SearchCtrl', function ($scope,MediaService,$ionicModal,$location,$ionicSideMenuDelegate,SettingsService) {
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
                // Pass in the query string, the media type and the # of results to return (from SettingsService)
                MediaService.search(query,type,SettingsService.get('maxResults')).then(function(resp) {
                    $scope.mediaResults = resp;
                    console.log("Result Count " + $scope.mediaResults.resultCount);
                    $scope.mediaResults = resp;

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
                $scope.openPlayModal(item);
                $scope.infoTxt = null;
            }
            else $scope.infoTxt = 'No suitable player available for the selected media type.'

        };

        $ionicModal.fromTemplateUrl('views/playModal.html', function(modal) {
            $scope.playModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.openPlayModal = function(item) {
            $scope.url = item.previewUrl;
            if  (item.trackName != null) $scope.title = item.trackName
            else $scope.title = item.collectionName;

            $scope.kind = item.kind;
            $scope.artist = item.artistName;
            $scope.playModal.show();
        }

        $scope.closePlayModal = function() {
            $scope.playModal.hide();
        }

        $ionicModal.fromTemplateUrl('views/sortModal.html', function(sortModal) {
            $scope.sortModal = sortModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.openSortModal = function() {
            $scope.sortModal.show();
        }

        $scope.closeSortModal = function() {
            $scope.sortModal.hide();
        }

        $scope.saveSort = function() {
            console.log("This filter " + this.filterTerm + " query " + $scope.request.query + " sort " + this.sortBy);
            $scope.filterTerm = this.filterTerm;
            $scope.sortBy = this.sortBy;
            $scope.sortModal.hide();
        }
})




