// ==UserScript==
// @name            Auto Space Companeer
// @namespace       https://sparticle999.github.io/SpaceCompany/
// @include         *sparticle999.github.io/SpaceCompany*
// @version         1
// @grant           none
// @description:en  Plays space company.
// ==/UserScript==

var script = document.createElement('script');
script.id = 'Space Companeer';
// Development
script.src = 'https://rawgit.com/franksnightmare/space-companeer/master/spacecompaneer.js';
// Production
// script.src = 'https://cdn.rawgit.com/franksnightmare/space-companeer/master/spacecompaneer.js';
document.head.appendChild(script);
