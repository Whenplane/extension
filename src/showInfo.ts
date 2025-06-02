

export async function insertShowInfo(br: any) {

    if(!document.title.includes(" - WAN Show ")) {
        console.debug("[whenplane extension] page is not a wan show vod. skipping show info insertion");
        return;
    }

    const domain = location.hostname.toLowerCase();

    const isFloatplane = domain.includes("floatplane.com");
    const isYoutube = domain.includes("youtube.com");

    let descriptionElement: Element | null = null;
    if(isFloatplane) descriptionElement = document.querySelector("._postDescription_57mke_1");
    if(isYoutube) descriptionElement = document.querySelector("#bottom-row");

    if(!descriptionElement) {
        console.warn("[whenplane extension] Unable to find the description container!");
        return;
    }

    let showInfoBox = descriptionElement.querySelector(".whenplane_widget-showInfoBox");
    const hasShowInfoBox = showInfoBox !== null;

    const showShowInfoBox = await br.storage.local.get("showShowInfoBox")
        .then((r: {showShowInfoBox: boolean}) => r.showShowInfoBox ?? true);

    if(!hasShowInfoBox && !showShowInfoBox) return;
    if(hasShowInfoBox && !showShowInfoBox) {
        descriptionElement.removeChild(showInfoBox);
        return;
    }


    if(hasShowInfoBox) return;

    const titleParts = / - WAN Show ((January|February|March|April|May|June|July|August|September|October|November|December) [0-9]{1,2}, [0-9]{4})/
        .exec(document.title);

    const rawDate = titleParts?.[0];

    if(!rawDate) {
        console.error("[whenplane extension] Unable to extract date from title!", document.title, titleParts, rawDate);
        return;
    }

    const date = new Date(rawDate);
    const dateString = date.getFullYear() + "/" + addZero(date.getMonth() + 1) + "/" + addZero(date.getDate());


    const infoBox = document.createElement("div");
    infoBox.classList.add("whenplane_widget-showInfoBox");
    infoBox.innerHTML = `
        <a href="https://whenplane.com/history/show/${dateString}">
            <div class="whenplane_widget-text-center">
                <b>Show Info from Whenplane</b><br>
                <iframe src="https://whenplane.com/history/show/${dateString}/frame" class="whenplane_widget-showInfoFrame"></iframe>
<!--                <iframe src="http://localhost:5173/history/show/${dateString}/frame" class="whenplane_widget-showInfoFrame"></iframe>-->
            </div>
        </a>
    `;

    descriptionElement.appendChild(infoBox);
}


function addZero(n: number): string {
    return n > 9 ? "" + n : "0" + n;
}