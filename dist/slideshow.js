export class Slideshow {
    currentIndex = 0;
    timer = null;
    layerCurrent;
    layerNext;
    gallery;
    baseUrl;
    format;
    transitionTimer = null;
    isRunning = false;
    constructor(gallery, baseUrl, format) {
        this.gallery = gallery;
        this.baseUrl = baseUrl;
        this.format = format;
        // select existing images from the html
        this.layerCurrent = document.getElementById('layer-current');
        this.layerNext = document.getElementById('layer-next');
        // initialize first image immediately
        this.currentIndex = this.gallery.getRandomIndex(-1);
        this.initFirstImage();
    }
    initFirstImage() {
        this.layerCurrent.src = this.gallery.getUrl(this.currentIndex, this.baseUrl, this.format);
        this.layerCurrent.style.opacity = '1';
        this.layerNext.style.opacity = '0';
    }
    start(interval = 10000) {
        this.stop();
        if (interval == 0)
            return;
        this.isRunning = true;
        this.timer = window.setInterval(() => {
            const nextIndex = this.gallery.getRandomIndex(this.currentIndex);
            const preloader = new Image();
            preloader.src = this.gallery.getUrl(nextIndex, this.baseUrl, this.format);
            preloader.onload = () => {
                // only proceed if the slideshow wasn't stopped while loading
                if (this.isRunning) {
                    this.performTransition(preloader.src, nextIndex);
                }
            };
        }, interval);
    }
    performTransition(newSrc, nextIndex) {
        // prepare the hidden layer with the new image
        this.layerNext.style.transition = 'none';
        this.layerNext.src = newSrc;
        this.layerNext.style.opacity = '0';
        this.layerNext.style.zIndex = '2';
        this.layerCurrent.style.zIndex = '1';
        // trigger reflow so the 'none' transition and opacity 0 take effect
        this.layerNext.offsetHeight;
        // fade it in
        this.layerNext.style.transition = 'opacity 5s ease-in-out';
        this.layerNext.style.opacity = '1';
        this.transitionTimer = window.setTimeout(() => {
            if (!this.isRunning)
                return;
            const temp = this.layerCurrent;
            this.layerCurrent = this.layerNext;
            this.layerNext = temp;
            // move the 'new' current to the bottom of the stack so 
            // the 'new' next can be prepared on top of it next time.
            this.layerCurrent.style.zIndex = '1';
            this.layerNext.style.zIndex = '0';
            this.layerNext.style.opacity = '0';
            this.currentIndex = nextIndex;
            this.transitionTimer = null;
        }, 5000);
    }
    stop() {
        this.isRunning = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.transitionTimer) {
            clearTimeout(this.transitionTimer);
            this.transitionTimer = null;
        }
        // reset layers to a clean state
        this.layerNext.style.opacity = '0';
    }
}
//# sourceMappingURL=slideshow.js.map