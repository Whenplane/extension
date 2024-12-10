

export function insertShowInfo() {

    if(!document.title.includes(" - WAN Show ")) {
        console.debug("[whenplane extension] page is not a wan show vod. skipping show info insertion");
        return;
    }

    const descriptionElement = document.querySelector("._postDescription_1ex24_1");

    if(!descriptionElement) {
        console.warn("[whenplane extension] Unable to find the description container!");
        return;
    }

    let hasShowInfoBox = false;
    for (let child of descriptionElement.children) {
        if(child.classList.contains("whenplane_widget-showInfoBox")) {
            hasShowInfoBox = true;
        }
    }

    if(hasShowInfoBox) return;

    const titleParts = /(January|February|March|April|May|June|July|August|September|October|November|December) [0-9]{1,2}, [0-9]{4}/
        .exec(document.title);

    const rawDate = titleParts?.[0];

    if(!rawDate) {
        console.error("[whenplane extension] Unable to extract date from title!", document.title, titleParts, rawDate);
        return;
    }

    const date = new Date(rawDate);
    const utcDateString = date.getUTCFullYear() + "/" + addZero(date.getUTCMonth() + 1) + "/" + addZero(date.getUTCDate());


    const infoBox = document.createElement("div");
    infoBox.classList.add("whenplane_widget-showInfoBox");
    infoBox.innerHTML = `
        <a href="https://whenplane.com/history/show/${utcDateString}">
            <div class="whenplane_widget-text-center">
                <b>Show Info from Whenplane</b><br>
                <iframe src="https://whenplane.com/history/show/${utcDateString}/frame" class="whenplane_widget-showInfoFrame"></iframe>
<!--                <iframe src="http://localhost:5173/history/show/${utcDateString}/frame" class="whenplane_widget-showInfoFrame"></iframe>-->
            </div>
        </a>
    `;

    descriptionElement.appendChild(infoBox);
}


function addZero(n: number): string {
    return n > 9 ? "" + n : "0" + n;
}