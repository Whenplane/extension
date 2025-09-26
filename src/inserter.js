import {insertShowInfo} from "./showInfo.ts";
import {insertLiveStatus} from "./liveStatus.ts";

let lastLatenessVoting;
let iframe;
let chatIframe;


const br = typeof browser === "undefined" ? chrome : browser;

async function replace() {


    const domain = location.hostname.toLowerCase();

    const isFloatplane = domain.includes("floatplane.com");
    const isTwitch = domain.includes("twitch.tv");
    const isYoutube = domain.includes("youtube.com");

    const isBoca = isTwitch && location.pathname.toLowerCase() === "/bocabola";

    if(

        (isFloatplane && location.pathname.startsWith("/post/")) ||
        (isYoutube && location.pathname === "/watch")
    ) {
        insertShowInfo(br);
    }

    if(isFloatplane && location.pathname === "/channel/linustechtips/live") {
        insertLiveStatus(br)
    }

    if(isYoutube) return; // no live widget for youtube

    // We have to check here instead of in the manifest because the script isnt loaded when navigating client-side
    if(isFloatplane && !["/channel/linustechtips/live", "/live/linustechtips"].includes(location.pathname)) return;
    if(isTwitch && location.pathname.toLowerCase() !== "/linustech" && !isBoca) return;

    let element = null;
    if(isFloatplane) element =
        document.querySelector("._offlineContainer_1l3w1_1") ??
        document.querySelector("._offlineContainer_n75ld_1") ??
        document.querySelector("div.av-player-control-wrapper > div.livestream-offline-container");
    if(isTwitch) element = document.querySelector("div.fHKOqA:nth-child(1) > div:nth-child(1):not(.SugpE)");

    let chatElement = null
    if(isFloatplane) chatElement =
        document.querySelector("div.chat-message-list:nth-child(1)") ??
        document.querySelector(".live-chat-panel-container > .live-chat-message-list-wrapper") ??
        document.querySelector(".live-chat-message-list-wrapper");
    if(isTwitch) chatElement = document.querySelector(".etHxQt > div:nth-child(2)");

    if(!isBoca && element != null) {

        let hasIframe = false;
        for (let child of element.children) {
           if( child.tagName.toLowerCase() === "iframe") {
               hasIframe = true;
               continue;
           }
           // Hide existing elements in the offline box.
           // We don't remove them because it seems like react blows up sometimes if the elements are removed
           child.classList.add("whenplane_widget_hidden");
        }

        const showLatenessVoting = await br.storage.local.get("showLatenessVoting")
            .then(r => {
                return r;
            })
            .then(r => !!r.showLatenessVoting)

        if(!hasIframe) {
            lastLatenessVoting = showLatenessVoting;
            console.debug("Inserting whenplane widget into: ", element)

            iframe = document.createElement("iframe");
            iframe.src = `https://whenplane.com?frame&showLatenessVoting=${showLatenessVoting}`;
            iframe.classList.add("whenplane_widget");
            iframe.innerText = "Something went wrong when loading the Whenplane integration";
            iframe.className = "whenplane_widget";

            element.appendChild(iframe);

            // element.innerHTML += `<iframe src= style="width:100%;height:100%;">Something went wrong when inserting whenplane frame</iframe>`;
        } else if(showLatenessVoting !== lastLatenessVoting) {
            lastLatenessVoting = showLatenessVoting;
            iframe.src = `https://whenplane.com?frame&showLatenessVoting=${showLatenessVoting}`;
        }

    }

    const showChatLTTTime = await br.storage.local.get("showChatLTTTime")
        .then(r => {
            return r;
        })
        .then(r => !!r.showChatLTTTime)

    if(chatElement) {
        let hasIframe = false;
        for (let child of chatElement.children) {
            if( child.tagName.toLowerCase() === "iframe") {
                hasIframe = true;
                break;
            }
        }

        if(hasIframe && !showChatLTTTime) {
            chatElement.removeChild(chatIframe)
        } else if(!hasIframe && showChatLTTTime) {
            chatElement.classList.add("whenplane_widget-relative");

            chatIframe = document.createElement("iframe");
            chatIframe.style.backgroundColor = "transparent";
            chatIframe.allowTransparency = "true";
            chatIframe.src = `https://whenplane.com/ltt-time?frame` + (isBoca ? "&boca" : "");
            chatIframe.classList.add("whenplane_widget-ltttime");
            chatIframe.innerText = "Something went wrong when loading the Whenplane integration";
            chatIframe.className = "whenplane_widget-ltttime";

            chatElement.appendChild(chatIframe);
        }
    }
}

// todo: find a way to detect url changes so we only need to run the interval on the live page
// function checkForInterval() {
//     if(location.pathname !== "/channel/linustechtips/live") {
//         if(interval) {
//             clearInterval(interval);
//             interval = undefined;
//         }
//     } else {
//         replace();
//         if(!interval) {
//             interval = setInterval(replace, 1e3);
//         }
//     }
// }
// checkForInterval();

// reminder: 500ms breaks the page for some reason
let interval = setInterval(replace, 1e3);