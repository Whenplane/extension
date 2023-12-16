// js for the about.html popup since you can't embed js for some reason

const showLatenessVotingCheckbox = document.getElementById("lateness-voting")

(browser.storage ?? chrome.storage).local.get("showLatenessVoting")
    .then(r => r.showLatenessVoting)
    .then(existing => {
        document.getElementById("lateness-voting-div").classList.remove("disabled")
        if(typeof existing != "undefined") {
            showLatenessVotingCheckbox.checked = existing
        }
        showLatenessVotingCheckbox.onchange = async e => {
            await (browser.storage ?? chrome.storage).local.set({showLatenessVoting: e.target.checked})
        }
    })

document.getElementById("version").innerText = chrome.runtime.getManifest().version