interface Gallery {
    length: number
    getUrl(index: number, baseUrl: string, ext: string): string
    getRandomIndex(currentIndex: number): number
}

interface Slideshow {
    stop(): void
    start(interval?: number): void
}

export class Config {
    public logo: string
    public slideshowInterval: number
    private slideshow: Slideshow

    constructor(path: string, slideshowInterval: number, slideshow: Slideshow) {
        this.slideshow = slideshow
        this.slideshowInterval = slideshowInterval
        
        this.logo = this.setLogo(path)

        // stop any current execution and re-initialize with the new interval
        this.slideshow.stop()
        this.slideshow.start(this.slideshowInterval)
    }

    update(settings: { path?: string, interval?: number }) {
        if (settings.path) {
            this.setLogo(settings.path)
        }
        if (settings.interval !== undefined) {
            this.setSlideshowInterval(settings.interval)
        }
    }

    setLogo(path: string): string {
        this.logo = path
        const logoElem = document.getElementById('logo-image') as HTMLImageElement
        if (logoElem) {
            logoElem.src = this.logo
        }
        return this.logo
    }

    setSlideshowInterval(milliseconds: number, slideshow?: Slideshow) {
        if (slideshow) {
            this.slideshow = slideshow
        }

        this.slideshowInterval = milliseconds

        // reset the cycle with the new timing
        this.slideshow.stop()
        this.slideshow.start(this.slideshowInterval)
    }
}