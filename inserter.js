
let lastLatenessVoting;
let iframe;

const br = typeof browser === "undefined" ? chrome : browser;

async function replace() {

    // We have to check here instead of in the manifest because the script isnt loaded when navigating client-side
    if(location.pathname !== "/channel/linustechtips/live") return;

    const element = document.querySelector("div.av-player-control-wrapper > div.livestream-offline-container");
    if(element != null) {

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

        /*if(initialInterval) {
            clearInterval(initialInterval);
            initialInterval = undefined;
        }*/
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