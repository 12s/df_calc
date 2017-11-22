// ==UserScript==
// @name         Yahoo DF calc
// @namespace    https://sports.yahoo.com/dailyfantasy
// @version      0.1
// @description  calc percentages
// @author       --
// @include      https://sports.yahoo.com/dailyfantasy/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.clear();

    // Step 1: Add Banner UI
    
    // Step 1.1: Banner
    let bannerNode = document.createElement("div"); // top level
    // Banner style
    bannerNode.style.width = "100%";
    bannerNode.style.minHeight = "40px";
    bannerNode.style.background = "black";
    bannerNode.style.zIndex = "1001";
    bannerNode.style.fontFamily = "Courier New";
    bannerNode.style.display = "flex";
    // Banner into DOM
    const bodyNode = document.getElementsByTagName("body")[0];
    const documentNode = bodyNode.parentElement;
    documentNode.insertBefore(bannerNode, bodyNode);
    
    // Step 1.2: Board
    let boardNode = document.createElement("div");
    boardNode.classList.add("boardNode");
    // Board style
    boardNode.style.flex = "1";
    boardNode.style.color = "lightgray";
    
    boardNode.style.padding = "3px";
    
    // Board into DOM
    bannerNode.appendChild(boardNode);
    
    // Step 1.3: Config
    let configNode = document.createElement("div");
    // Config style
    configNode.style.color = "white";
    configNode.style.display = "flex";
    configNode.style.flexDirection = "column";
    configNode.style.color = "white";
    // Config into Dom
    bannerNode.appendChild(configNode);

    // Step 1.3.1 Threshold Wrapper, Text and Input
    let thresholdWrapper = document.createElement("div");
    thresholdWrapper.style.display = "flex";
    thresholdWrapper.style.color = "white";
    thresholdWrapper.style.alignItems = "center";
    let thresholdText = document.createElement("span");
    thresholdText.innerText = "Threshold % : ";
    let thresholdInput = document.createElement("input");
    thresholdInput.classList.add("thresholdInput");
    thresholdInput.style.width = "33px";
    thresholdInput.style.color = "black";
    thresholdInput.style.textAlign = "right";
    thresholdInput.style.fontFamily = "Courier New";
    thresholdInput.style.marginLeft = "6px";
    thresholdInput.style.height = "21px";
    thresholdInput.type = "text";
    thresholdInput.value = "90";
    thresholdInput.style.width = "40px";

    // Lineup
    let lineupWrapper = document.createElement("div");
    let lineupText = document.createElement("span");
    lineupText.innerText = "Lineup Index";
    let lineupInput = document.createElement("input");
    lineupInput.classList.add("lineupInput");
    lineupInput.style.width = "33px";
    lineupInput.style.color = "black";
    lineupInput.style.textAlign = "right";
    lineupInput.style.fontFamily = "Courier New";
    lineupInput.style.marginLeft = "6px";
    lineupInput.style.height = "21px";
    lineupInput.type = "text";
    lineupInput.value = "0";
    lineupInput.style.width = "40px";

    let savedLineupWrapper = document.createElement("div");
    savedLineupWrapper.style.display = "flex";
    savedLineupWrapper.style.color = "white";
    savedLineupWrapper.style.alignItems = "center";
    let savedLineupText = document.createElement("span");
    savedLineupText.innerText = "Saved Linup Index Value : ";
    let savedLineupInput = document.createElement("input");
    savedLineupInput.classList.add("savedLineupInput");
    savedLineupInput.style.width = "33px";
    savedLineupInput.style.color = "black";
    savedLineupInput.style.textAlign = "right";
    savedLineupInput.style.fontFamily = "Courier New";
    savedLineupInput.style.marginLeft = "6px";
    savedLineupInput.style.height = "21px";
    savedLineupInput.type = "text";
    savedLineupInput.value = "0";
    savedLineupInput.style.width = "40px";

    
    // Step 1.3.1 Threshold Wrapper, Text and Input into DOM
    thresholdWrapper.appendChild(thresholdText);
    thresholdWrapper.appendChild(thresholdInput);
    lineupWrapper.appendChild(lineupText);
    lineupWrapper.appendChild(lineupInput);
    configNode.appendChild(thresholdWrapper);
    configNode.appendChild(lineupWrapper);


        
    // Step 1.4: Enter Contest
    let contestNode = document.createElement("div");
    // Contest style
    contestNode.style.width = "200px";
    contestNode.style.textAlign = "right";
    contestNode.style.paddingRight = "5px";
    // Contest into DOM
    bannerNode.appendChild(contestNode);
    
    // Step 0.4.1 Submit Button
    let submitButton = document.createElement("input");
    submitButton.classList.add("submitButton");
    // Submit style
    submitButton.value = "Refresh Contests";
    submitButton.type  = "submit";
    submitButton.style.background = "lightblue";
    submitButton.style.fontFamily = "Courier New";
    submitButton.style.fontWeight = "bold";
    // Submit Logic
    submitButton.addEventListener("click", function() {
        console.clear();
        console.log(`Populate Contests`);
        let boardNode = document.getElementsByClassName("boardNode")[0];
        while (boardNode.hasChildNodes()) { // clear contests
            boardNode.removeChild(boardNode.lastChild);
        }
        
        let contestRows = $("tr[data-tst='contest-row']");
        let threshold = +document.getElementsByClassName("thresholdInput")[0].value;
        let nodeArray = [];

        for (let i = 0; i < contestRows.length; i++) {
            if (contestRows[i].children[6].children[0].disabled) {
                continue;
            }

            let c = contestRows[i].children[2].textContent;
            let nu = c.substr(0, c.indexOf("/"));
            let entry = contestRows[i].children[3].textContent;
            entry = Number(entry.substr(1, entry.length));
            let prizePool = contestRows[i].children[4].textContent;
            prizePool = Number(prizePool.substr(1, prizePool.length).replace(",",""));

            const d = prizePool / entry;

            if (nu.includes("K")) {
                nu = Number(nu.substr(0, nu.length - 1) * 1000);
            }

            const percent = Math.round((+nu + 2 ) / +d * 100);
            if (isNaN(percent) || threshold < percent) {
                continue;
            }
            
            const contestNameNode = document.createElement("span");
            contestNameNode.style.height = "10px";

            let n = contestRows[i].children[3].textContent;

            const name = contestRows[i].children[1].textContent;

            if (name.substr(name.length - 1) === "M") {
                n = n.concat(" - MULTI");

            }

            n = n.concat(" - " + contestRows[i].children[2].textContent);
            n = n.concat(" = " + percent.toString() + "%");
            if (contestRows[i].children[1].textContent.indexOf("[")+1) {
                n = n.concat(" - " + contestRows[i].children[1].textContent.substr(0, contestRows[i].children[1].textContent.indexOf("[")-1)); //strip text
            } else {
                n = n.concat(" - " + contestRows[i].children[1].textContent); //strip text
            }
            
            contestNameNode.innerHTML = n;
            contestNameNode.setAttribute("percent", percent);
            
            const checkbox = document.createElement("input");
            checkbox.style.marginRight = "3px";
            checkbox.classList.add("contestCheckbox");
            checkbox.type = "checkbox";
            checkbox.contestId = contestRows[i].getAttribute("data-tst-contest-id");
            
            const rowNode = document.createElement("div");
            rowNode.style.display = "flex";
            rowNode.style.alignItems = "center";
            rowNode.style.height = "12px";
            rowNode.append(checkbox);
            rowNode.append(contestNameNode);

            nodeArray.push(rowNode);
            // let boardNode = document.getElementsByClassName("boardNode")[0];
            // boardNode.appendChild(rowNode);
        }

        // sort nodeArray
        function sortNumber(a,b) {
            return a.lastChild.getAttribute("percent") - b.lastChild.getAttribute("percent");
        }
        nodeArray.sort(sortNumber);
        
        for (let k = 0; k < contestRows.length; k++) {
            if (nodeArray[k]){
                boardNode.appendChild(nodeArray[k]);
            }
        }
    });
    // Submit into DOM
    contestNode.appendChild(submitButton);
    
    // Step 0.4.1 Enter Contest Button
    let enterButton = document.createElement("input");
    enterButton.classList.add("enterButton");
    // Submit style
    enterButton.value = "Enter Contests!";
    enterButton.type  = "submit";
    enterButton.style.background = "lightpink";
    enterButton.style.fontFamily = "Courier New";
    enterButton.style.fontWeight = "bold";
    // Submit Logic
    enterButton.addEventListener("dblclick", function() {
        const checkboxes = document.querySelectorAll("input.contestCheckbox");

        const timeoutFunc = function(i) {
            let url = ""; // GOAL: https://sports.yahoo.com/dailyfantasy/contest/2019843/setlineup
            url = url.concat("https://sports.yahoo.com/dailyfantasy/contest/");
            url = url.concat(checkboxes[i].contestId);
            url = url.concat("/setlineup");
            window.open(url);
        };
        
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked){
                window.setTimeout(timeoutFunc(i), 1000);
            }
        }
    });
    contestNode.appendChild(enterButton);
    
    
    
    

    
    // Step 1: hide late contents



})();
