// ==UserScript==
// @name         Yahoo DF calc JOINER
// @namespace    https://sports.yahoo.com/dailyfantasy/contest
// @version      0.1
// @description  calc percentages
// @author       --
// @include      https://sports.yahoo.com/dailyfantasy/contest/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.clear();

    if (!window.location.href.includes("setlineup")) {
        console.log(`not on right page`);
        return;
    }


    console.log(`begin script`);

    const checkImport = function () {
        var importLink = document.querySelector("a[data-tst='import-lineup-button']");
        console.log(`importLink = ${importLink}`);

        if (!importLink) {
            console.log('try again later - 1 second');
            window.setTimeout(checkImport, 1000);
        } else {
            return importLink;
        }
    };
    let importLink = checkImport();

    window.setTimeout(importLink, 500);


    const checkLineup = function () {
        const lineupLink = document.querySelectorAll("a[data-tst='import-lineup-select']")[0];
        console.log("lineupLink link",lineupLink);
        if (!lineupLink) {
            console.log(`checkLineup again later - 1. second - j=${j}`);
            importLink.click();
            j++;
            if (j > 5) {
                console.log("Try clicking import again...");
                const importLink2 = document.querySelector("a[data-tst='import-lineup-button']");
                if (importLink2) {
                    console.log(`import successfully reclicked?`);
                    importLink2.click();
                }
            }
            window.setTimeout(checkLineup, 1000);
        } else {
            lineupLink.click();
            const checkContestLineup = function () {

                const enterContestLink = document.querySelector("button[data-tst='submit-lineup-button']");
                console.log(`entercontentLink ${enterContestLink}`);
                if (!enterContestLink) {
                    console.log(' checkContestLineuptry again later - 1.5 second');
                    window.setTimeout(checkContestLineup, 1000);
                } else {

                    enterContestLink.click();

                    const enterContestLineup = function () {
                        const submitLink = document.querySelector("button[data-tst='confirm-submit']");
                        console.log(`submit link = ${submitLink}, k = ${k}`);
                        if (!submitLink) {
                            k++;
                            console.log('try again later - .5 second');
                            enterContestLink.click();

                            if (k < 10) {
                                window.setTimeout(enterContestLineup, 500);
                            } else {
console.log("figure this part out....");
                            }
                        } else {
                            // *****ON BUTTON
                             //submitLink.click();
                            // *****ON BUTTON
                        }
                    };

                    let k = 0;
                    enterContestLineup();
                }
            };
            checkContestLineup();
        }
    };

    var j = 1;
    var err = checkLineup();
    if (err === "checkLineup fail") {
j = 1;
      window.setTimeout(checkLineup, 500);
    }
})();
