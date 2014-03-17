MediaExplorerMobile
===================

You can create your own new project locally using the Cordova CLI based on my code (after you've cloned or downloaded) with:

$ cordova create MyMediaExplorer "com.mediaexplorer.app" "MediaExplorerApp" --copy-from /MediaExplorerMobile/www 

$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-statusbar.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git

or

$ cordova plugin add org.apache.cordova.console
$ cordova plugin add org.apache.cordova.device
$ cordova plugin add org.apache.cordova.inappbrowser
$ cordova plugin add org.apache.cordova.statusbar

then build or run it 

$ cordova run ios
