pm
==================
[![Build Status](https://travis-ci.org/pussinboots/pm.svg?branch=master)](https://travis-ci.org/pussinboots/pm)
[![Coverage Status](https://img.shields.io/coveralls/pussinboots/pm.svg)](https://coveralls.io/r/pussinboots/pm?branch=master)
[![Dependencies](https://david-dm.org/pussinboots/pm.png)](https://david-dm.org/pussinboots/pm)
[![Heroku](http://heroku-badge.heroku.com/?app=poman)](https://poman.herokuapp.com)

##Description

An very simple project management tool to handle open source project specially by github. It is complete client based and need no backend at the moment. The idea is to have a overview site like you know from jenkins for all of your open source projects. And on that overview you have all project relevant informations like code coverage, dependencies, build status and so on. There are a lot of open source free to use tools like travis ci, coveralls, david dm, heroku and so on but i need a site where all this information is integrated and updated for all of my relevant projects. 

I start with my first mobile experience in that project so open the page maybe on your smartphone a desktop version will come in the future (maybe). My focus was to build a mobile web app and the next step is to publish it with apache cordova at least for android. I'am not willing to pay 300 dollars to apple for a free to use application but fork it and do it of course.

##Live

It is ready to use so click on the heroku badge at the top. Then you will see all my projects under this repo. You can change the display repository projects by set that one of your choice in the settings page. 

There is also a second page [New Project](http://poman.herokuapp.com/new) which support to create new project enter the repo and the project name than there is some useful commands for travis, heroku and github and also a README-md markdown code with contains the most badges. This page helps me to get a new project integrated with travis, heroku and github in some minutes.

##Todo
* Desktop version
* store the settings locally 
* compact and highlighted build log view
* new project site
 * integrate github per api to create new project (github oauth)
 * integrate travis per api to enable build (github oauth)
 * integrate heroku per api to create new app (oauth???)
 * download link with bash script contains all commands to setup the new project (travis, heroku, github)
 * support other providers like (coveralls, ...) for the project setup

##Features
* job filter to display only jobs for the configurate github repo (settings -> job filter)
* realtime update of created and finished jobs at travis with pusher (settings -> job push)
* project overview based travis registered projects under a configurable repo
* project overview contains badge of Travis Ci, Coveralls, David DM, Sourcegraph, [Heroku](https://github.com/pussinboots/heroku-badge), Gitter
* project overview configurable refresh period (min 1 second, default 20 seconds) that fetch the new badges be careful with that can be a lot of load for the badges provider
* new project page
 * contains markdown with all badges
 * git first commit commands
 * travis enable commands
 * heroku create app commands

License
--------------

pm is released under the [MIT License](http://opensource.org/licenses/MIT).
