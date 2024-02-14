// js for the about.html popup since you can't embed js for some reason

const showLatenessVotingCheckbox = document.getElementById("lateness-voting");
const showChatLTTTimeCheckbox = document.getElementById("chat-ltt-time");

const br = typeof browser === "undefined" ? chrome : browser;

br.storage.local.get("showLatenessVoting")
    .then(r => r.showLatenessVoting)
    .then(existing => {
        document.getElementById("lateness-voting-div").classList.remove("disabled")
        if(typeof existing != "undefined") {
            showLatenessVotingCheckbox.checked = existing
        }
        showLatenessVotingCheckbox.onchange = async e => {
            await br.storage.local.set({showLatenessVoting: e.target.checked})
        }
    })

br.storage.local.get("showChatLTTTime")
    .then(r => r.showChatLTTTime)
    .then(existing => {
        document.getElementById("show-chat-ltt-time-div").classList.remove("disabled")
        if(typeof existing != "undefined") {
            showChatLTTTimeCheckbox.checked = existing
        }
        showChatLTTTimeCheckbox.onchange = async e => {
            await br.storage.local.set({showChatLTTTime: e.target.checked})
        }
    })

document.getElementById("version").innerText = chrome.runtime.getManifest().version