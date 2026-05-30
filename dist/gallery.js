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
    getRandomIndex(currentIndex, targetSeason) {
        // if a season is provided, filter for images matching that season's prefix
        if (targetSeason !== undefined) {
            const seasonPrefix = `gal-s${targetSeason}-`;
            const matchingIndices = [];
            for (let i = 0; i < this.length; i++) {
                if (this[i] && this[i].name.includes(seasonPrefix)) {
                    matchingIndices.push(i);
                }
            }
            if (matchingIndices.length > 0) {
                // Try to avoid picking the image that is currently being displayed
                const availableIndices = matchingIndices.filter(index => index !== currentIndex);
                // If the only image available is the current one, just return it
                if (availableIndices.length === 0) {
                    return matchingIndices[0];
                }
                return availableIndices[Math.floor(Math.random() * availableIndices.length)];
            }
        }
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