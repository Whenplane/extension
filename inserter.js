
function replace() {

    const now = new Date();

    const element = document.querySelector("div.av-player-control-wrapper > div.livestream-offline-container");
    if(element != null) {
        element.innerHTML = `<iframe src="https://whenplane.com?frame" style="width:100%;height:100%;">Something went wrong when inserting whenplane frame</iframe>`;

        if(initialInterval) {
            clearInterval(initialInterval);
            initialInterval = undefined;
        }
    }
}

// reminder: 500ms breaks the page for some reason
let initialInterval = setInterval(replace, 1e3);