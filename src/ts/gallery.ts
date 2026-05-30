interface GalleryImage {
    name: string
    altText: string
}

export class Gallery extends Array<GalleryImage> {
    constructor(images: GalleryImage[] = []) {
        super(...images)
        this.sortByDateDescending()// new - sort the images for the gallery display by date
    }

    sortAlphabetically(): void {// just in case, it might save me from having to manually alphabetize the config
        this.sort((a, b) => a.name.localeCompare(b.name))
    }

    sortByDateDescending(): void {
        this.sort((a, b) => {
            // Split the string by hyphens and grab the last element (the date)
            // Fallback to "0" just in case a filename doesn't match the convention
            const dateStrA = a.name.split('-').pop() || "0"
            const dateStrB = b.name.split('-').pop() || "0"
            
            // Parse them as base-10 integers
            const dateA = parseInt(dateStrA, 10)
            const dateB = parseInt(dateStrB, 10)

            // Return B - A for descending order (most recent first)
            return dateB - dateA
        })
    }

    // helper function to get the URL of any image
    getUrl(index: number, baseUrl: string, ext: string): string {
        const item = this[index]
        if (!item) return ""
        return `${baseUrl}/${item.name}.${ext}`
    }

    getAltText(index: number) {
        const item = this[index]
        if (!item) return ""
        return item.altText
    }

    // helper function to get a random index, which will be used by the slideshow
    getRandomIndex(currentIndex: number, targetSeason?: number): number {
        // if a season is provided, filter for images matching that season's prefix
        if (targetSeason !== undefined) {
            const seasonPrefix = `gal-s${targetSeason}-`;
            const matchingIndices: number[] = [];

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

        if (this.length <= 1) return 0;
        let nextIndex: number;
        do {
            nextIndex = Math.floor(Math.random() * this.length);
        } while (nextIndex == currentIndex);
        
        return nextIndex;
    }
}