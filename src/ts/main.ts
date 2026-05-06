import { galleryDivDisplay, getConfig, configHandler, setupNavigationRouting, syncSlideshowWithGalleryVisibility } from './lib.js'
import { Slideshow } from './slideshow.js'
import { Gallery } from './gallery.js'
import { Content } from './content.js'
import { Config } from './config.js'

async function initSite() {
    const config = await getConfig('src/data/config.json')
    const content = new Content(config.web.title, config.server.version, config.web.navigation, config.server.ip, config.web.staff)
    const imgCdnBase = "https://cdn.jsdelivr.net/gh/dominicgena/sundown-image-uploads@main/img/"
    const format = config.web.gallery_format.name
    document.addEventListener('headerReady', setupNavigationRouting)
    content.populate()

    const gallery = new Gallery(config.web.gallery)
    const slideshow = new Slideshow(gallery, imgCdnBase, config.web.gallery_format.name)
    galleryDivDisplay(gallery, imgCdnBase, format)
    const personalization = new Config('/assets/ui/sundown_beach.avif', 10000, slideshow)
    configHandler(personalization, config.web.logo)
    syncSlideshowWithGalleryVisibility('.gallery-container', slideshow, personalization)
}

document.addEventListener('DOMContentLoaded', initSite)