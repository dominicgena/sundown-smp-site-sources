import { galleryDivDisplay, getConfig, configHandler, setupNavigationRouting, syncSlideshowWithGalleryVisibility, attachStaticListeners, initUI } from './lib.js';
import { Slideshow } from './slideshow.js';
import { Gallery } from './gallery.js';
import { Config } from './config.js';
export async function initSite() {
    const config = await getConfig('src/data/config.json');
    const imgCdnBase = "https://cdn.jsdelivr.net/gh/dominicgena/sundown-image-uploads@main/img/";
    const format = config.web.gallery_format.name;
    setupNavigationRouting();
    const gallery = new Gallery(config.web.gallery);
    const slideshow = new Slideshow(gallery, imgCdnBase, config.web.gallery_format.name);
    const personalization = new Config('/assets/ui/sundown_beach.avif', 10000, slideshow);
    configHandler(personalization, config.web.logo);
    galleryDivDisplay(gallery, imgCdnBase, format);
    syncSlideshowWithGalleryVisibility('.gallery-container', slideshow, personalization);
    attachStaticListeners();
    initUI();
}
//# sourceMappingURL=main.js.map