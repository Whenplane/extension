
function replace() {

    const element = document.querySelector("div.av-player-control-wrapper > div.livestream-offline-container");
    if(element != null) {

        let hasIframe = false;
        for (let child of element.children) {
           if( child.tagName.toLowerCase() === "iframe") {
               hasIframe = true;
               continue;
           }
           child.classList.add("whenplane_widget_hidden");
        }

        if(!element.innerHTML.includes("<iframe")) {
            console.debug("Inserting whenplane widget into: ", element)

            const iframe = document.createElement("iframe");
            iframe.src = "https://whenplane.com?frame";
            iframe.innerText = "Something went wrong when loading the Whenplane integration";
            iframe.className = "whenplane_widget";

            element.appendChild(iframe);

            // element.innerHTML += `<iframe src= style="width:100%;height:100%;">Something went wrong when inserting whenplane frame</iframe>`;
        }

        /*if(initialInterval) {
            clearInterval(initialInterval);
            initialInterval = undefined;
        }*/
    }
}

// reminder: 500ms breaks the page for some reason
let initialInterval = setInterval(replace, 1e3);