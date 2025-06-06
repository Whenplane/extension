

export async function insertLiveStatus(br: any) {

    const element = document.querySelector("._descriptionHeader_57mke_5") ?? document.querySelector("._descriptionHeader_1q79i_5");

    if(!element) {
        console.warn("[whenplane extension] Unable to find the description header! (for live status box)");
        return;
    }

    const liveStatusBox = element.querySelector<HTMLIFrameElement>(".whenplane_widget-fpLiveStatusBox");
    const hasStatusBox = liveStatusBox !== null;

    const showLiveStatusBox = await br.storage.local.get("showFpLiveStatusBox")
        .then((r: {showFpLiveStatusBox: boolean}) => r.showFpLiveStatusBox ?? true);

    if(!hasStatusBox && !showLiveStatusBox) return;
    if(hasStatusBox && !showLiveStatusBox) {
        const statusBoxParent = liveStatusBox.parentElement;
        if(!statusBoxParent) {
            console.warn("[whenplane extension] Unable to get parent of status box! (for removal)");
            return;
        }
        element.removeChild(statusBoxParent);
        return;
    }

    let detectedIsLive: boolean | null = null;
    const detectedStatusBox = document.querySelector<HTMLDivElement>("._postDate_1ex24_57");
    if(!detectedStatusBox) {
        console.warn("[whenplane extension] Unable to find postDate box (to detect live status)")
    } else {
        detectedIsLive = detectedStatusBox.innerText !== "Offline";
    }

    const existingIsLive = hasStatusBox ? new URL(liveStatusBox?.src).searchParams.get("live") : null;

    if(hasStatusBox && detectedIsLive+"" === existingIsLive+"") return;

    console.debug("[whenplane extension]", {hasStatusBox, detectedIsLive, existingIsLive})

    if(!hasStatusBox) {
        const newLink = document.createElement("a");

        newLink.href = "https://whenplane.com/floatplane";
        newLink.target = "_blank";

        const newLiveStatusBox = document.createElement("iframe");

        newLiveStatusBox.classList.add("whenplane_widget-fpLiveStatusBox");

        newLiveStatusBox.src = "https://whenplane.com/floatplane/liveStatusFrame" + (detectedIsLive !== null ? "?live=" + detectedIsLive : "");
        // newLiveStatusBox.src = "http://localhost:5173/floatplane/liveStatusFrame" + (detectedIsLive !== null ? "?live=" + detectedIsLive : "");

        newLiveStatusBox.scrolling = "no"; // i know its deprecated, but there is not an alternative.

        newLink.appendChild(newLiveStatusBox);
        element.appendChild(newLink);
    } else {
        liveStatusBox.src = "https://whenplane.com/floatplane/liveStatusFrame" + (detectedIsLive !== null ? "?live=" + detectedIsLive : "");
        // liveStatusBox.src = "http://localhost:5173/floatplane/liveStatusFrame" + (detectedIsLive !== null ? "?live=" + detectedIsLive : "");
    }

}