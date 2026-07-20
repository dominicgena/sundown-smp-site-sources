export async function getConfig(configFile: string) {
    try {
        const response = await fetch(configFile)
        if (!response.ok) { throw new Error(`HTTP Error. Status: ${response.status}`) }
        const config = await response.json()
        return config
    } catch (error) {
        console.error("Error loading site configuration:", error)
        throw error
    }
}

export function setupNavigationRouting() {
    document.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('a')
        if (target && target.hash) {
            if(target.target === '_blank') return // shouldn't prevent the default if we're doing a redirect
            e.preventDefault()
            navEventHandler(target)
        }
    })
}

export function navEventHandler(target: HTMLAnchorElement) {
    // Extract the intent directly from the link's hash, removing the '#' symbol
    const intent = target.hash.replace('#', '');
    
    const toggleables = document.querySelectorAll('.toggleable, .home');
    toggleables.forEach(toggleable => toggleable.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const navList = document.getElementById('nav-list');
    const navbarDropBtn = document.getElementById('navbar-drop');
    if (navList?.classList.contains('show')) {
        navList.classList.remove('show');
        navbarDropBtn?.classList.remove('active');
    }

    if (intent === 'home') {
        const homeSections = document.querySelectorAll('.home');
        homeSections.forEach(section => section.classList.add('active'));
    } else if (intent === 'join') {
        document.querySelector('.join')?.classList.add('active');
    } else if (intent === 'gallery') {
        document.querySelector('.gallery-container')?.classList.add('active');
    } else if (intent === 'rules') {
        document.querySelector('.rules')?.classList.add('active');
    } else if (intent === 'downloads' || intent === 'map-downloads') {
        document.querySelector('.downloads')?.classList.add('active');
    }
}

interface Gallery {
    length: number
    getUrl(index: number, baseUrl: string, ext: string): string
    getAltText(currentIndex: number): string
    getRandomIndex(currentIndex: number): number
}

export function galleryDivDisplay(gallery: Gallery, imgCdnBase: string, format: string ='avif') {
    const galleryElem = document.querySelector('.gallery')
    const imageViewElem = document.getElementById('image-view') as HTMLImageElement
    // now, we show the display with the very first image
    const activeImgElem = document.createElement('img') as HTMLImageElement
    activeImgElem.id = 'active-gallery-image'

    let currentIndex = 0
    activeImgElem.src = gallery.getUrl(currentIndex, imgCdnBase, format)
    imageViewElem.appendChild(activeImgElem)

    const imageDescriptionElement = document.getElementById('image-description') as HTMLHeadingElement
    imageDescriptionElement.textContent = gallery.getAltText(currentIndex)

    // now, we need an event listener for the image cycling buttons
    galleryElem?.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.cycle-img')
        if (!btn) return

        if (btn.id === 'next-image') {
            currentIndex = (currentIndex + 1) % gallery.length
        } else if (btn.id === 'previous-image') {
            currentIndex = (currentIndex - 1 + gallery.length) % gallery.length
        }
        activeImgElem.src = gallery.getUrl(currentIndex, imgCdnBase, format)
        imageDescriptionElement.textContent = gallery.getAltText(currentIndex)
    })
}

interface Config {
    logo: string
    slideshowInterval: number
    update(settings: { path?: string, interval?: number }): void
}

interface Logo {
    text: string
    for: string
    id: string
    value: string
}

export function configHandler(config: Config, logos: Array<Logo>) {
    const personalizationContainerElem = document.querySelector('.personalization-config') as HTMLDivElement
    const dropdownElem = document.querySelector('.cog-dropdown') as HTMLDivElement
    closePopupOnOutsideClick(dropdownElem, personalizationContainerElem)
    personalizationContainerElem.addEventListener('click', (e) => {
        const target = e.target as Element
        const btn = target.closest('button')
        const intervalInput = (target.closest('input[name="interval-rad"]') || 
            target.closest('label')?.querySelector('input[name="interval-rad"]')) as HTMLInputElement
        const logoInput = (target.closest('input[name="sundown-logo"]') || 
                target.closest('label')?.querySelector('input[name="sundown-logo"]')) as HTMLInputElement

        if (btn) {
            dropdownElem.classList.toggle('active')
        } else if (intervalInput){
            const seconds = parseInt(intervalInput.value)
            const milliseconds = seconds * 1000
            config.update({ interval: milliseconds })
            console.log(`Slideshow interval set to: ${milliseconds}ms`)
        } else if (logoInput) {
            config.update({ path: logoInput.value })
        }
    })
}

function closePopupOnOutsideClick(dropdownElem: HTMLDivElement, personalizationContainerElem: HTMLDivElement) {
    document.addEventListener('click', (e) => {
        const target = e.target as Element
        if (dropdownElem.classList.contains('active') && !personalizationContainerElem.contains(target))
            dropdownElem.classList.remove('active')
    })
}

interface Slideshow {
    stop(): void
    start(interval: number): void
}

export function syncSlideshowWithGalleryVisibility(selector: string, slideshow: Slideshow, config: Config): void {
    const galleryContainer = document.querySelector(selector)
    if(!galleryContainer) return

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) slideshow.stop()
            // accessing the config inside the function prevents desync if user changes slideshow interval while looking at gallery
            else slideshow.start(config.slideshowInterval)
        })
    }, {
        threshold: 0.1
    })

    observer.observe(galleryContainer)
}

export function attachStaticListeners() {
    const ipText = document.querySelector('.ip-text') as HTMLElement
    ipText?.addEventListener('click', () => {
        const ip = ipText.innerText
        navigator.clipboard.writeText(ip)
        ipText.innerText = "Copied!"
        setTimeout(() => ipText.innerText = ip, 2000)
    })

    document.querySelectorAll('.staff-expand, .expand-roles').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active')
            btn.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
    })
}

export function initUI() {
    const navbarDropBtn = document.getElementById('navbar-drop')
    const navList = document.getElementById('nav-list')
    navbarDropBtn?.addEventListener('click', () => {
        navList?.classList.toggle('show')
        navbarDropBtn.classList.toggle('active')
    })
}