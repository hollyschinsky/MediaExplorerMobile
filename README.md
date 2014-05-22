MediaExplorerMobile
===================

An iTunes Media Explorer mobile application built with [Cordova](http://cordova.apache.org/) and [Ionic Framework](http://http://ionicframework.com/)

- Try the [hosted sample](http://devgirl.org/files/MediaExplorerMobile/www/#/menu/home)

- [Read more](http://devgirl.org/2014/03/12/sample-phonegap-application-itunes-explorer-with-angularjsionic/) about it

##Run it yourself

#### Create Project
You can create your own new project locally using the Cordova CLI based on my code (after you've cloned or downloaded) with:

    $ cordova create MyMediaExplorer "com.mediaexplorer.app" "MediaExplorerApp" --copy-from /MediaExplorerMobile/www 

Or create a new project and manually replace the www folder with mine.

    $ cordova create MyMediaExplorer

#### Add Plugins

Add the following plugins to the application:

    $ cordova plugin add org.apache.cordova.console 
    $ cordova plugin add org.apache.cordova.device 
    $ cordova plugin add org.apache.cordova.inappbrowser 
    $ cordova plugin add org.apache.cordova.statusbar
    $ cordova plugin add https://github.com/jcjee/email-composer

#### Add a Platform
    $ cordova platform add ios

#### Run the App

    $ cordova run ios

