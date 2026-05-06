export class Gallery extends Array {
    constructor(images = []) {
        super(...images);
    }
    sortAlphabetically() {
        this.sort((a, b) => a.name.localeCompare(b.name));
    }
    // helper function to get the URL of any image
    getUrl(index, baseUrl, ext) {
        const item = this[index];
        if (!item)
            return "";
        return `${baseUrl}/${item.name}.${ext}`;
    }
    getAltText(index) {
        const item = this[index];
        if (!item)
            return "";
        return item.altText;
    }
    // helper function to get a random index, which will be used by the slideshow
    getRandomIndex(currentIndex) {
        if (this.length <= 1)
            return 0;
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * this.length);
        } while (nextIndex == currentIndex);
        return nextIndex;
    }
}
//# sourceMappingURL=gallery.js.map