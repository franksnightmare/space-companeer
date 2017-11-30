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
script.src = 'https://github.com/franksnightmare/space-companeer/blob/master/spacecompaneer.js';
document.head.appendChild(script);
