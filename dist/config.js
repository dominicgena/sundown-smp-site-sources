export class Config {
    logo;
    slideshowInterval;
    slideshow;
    constructor(path, slideshowInterval, slideshow) {
        this.slideshow = slideshow;
        this.slideshowInterval = slideshowInterval;
        const checkedRadio = document.querySelector('input[name="sundown-logo"]:checked');
        const initialPath = checkedRadio ? checkedRadio.value : "/assets/ui/sundown_mountains1.avif";
        this.logo = this.setLogo(initialPath);
        // stop any current execution and re-initialize with the new interval
        this.slideshow.stop();
        this.slideshow.start(this.slideshowInterval);
    }
    update(settings) {
        if (settings.path) {
            this.setLogo(settings.path);
        }
        if (settings.interval !== undefined) {
            this.setSlideshowInterval(settings.interval);
        }
    }
    setLogo(path) {
        this.logo = path;
        const logoElem = document.getElementById('logo-image');
        if (logoElem) {
            logoElem.src = this.logo;
        }
        return this.logo;
    }
    setSlideshowInterval(milliseconds, slideshow) {
        if (slideshow) {
            this.slideshow = slideshow;
        }
        this.slideshowInterval = milliseconds;
        // reset the cycle with the new timing
        this.slideshow.stop();
        this.slideshow.start(this.slideshowInterval);
    }
}
//# sourceMappingURL=config.js.map