export async function getConfig(configFile) {
    try {
        const response = await fetch(configFile);
        if (!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        const config = await response.json();
        return config;
    }
    catch (error) {
        console.error("Error loading site configuration:", error);
        throw error;
    }
}
export function setupNavigationRouting() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a');
        if (target && target.hash) {
            if (target.target === '_blank')
                return; // shouldn't prevent the default if we're doing a redirect
            e.preventDefault();
            navEventHandler(target);
        }
    });
}
export function navEventHandler(target) {
    const intent = target.parentElement.id;
    const toggleables = document.querySelectorAll('.toggleable, .home');
    toggleables.forEach(toggleable => toggleable.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const navList = document.getElementById('nav-list');
    const navbarDropBtn = document.getElementById('navbar-drop');
    if (navList?.classList.contains('show')) {
        navList.classList.remove('show');
        navbarDropBtn?.classList.remove('active');
    }
    if (intent == 'home') {
        const homeSections = document.querySelectorAll('.home');
        homeSections.forEach(section => section.classList.add('active'));
    }
    else if (intent == 'join') {
        document.querySelector('.join')?.classList.add('active');
    }
    else if (intent == 'gallery') {
        document.querySelector('.gallery-container')?.classList.add('active');
    }
    else if (intent == 'rules') {
        document.querySelector('.rules')?.classList.add('active');
    }
    else if (intent == 'downloads' || intent == 'map-downloads') {
        document.querySelector('.downloads')?.classList.add('active');
    }
}
export function galleryDivDisplay(gallery, imgCdnBase, format = 'avif') {
    const galleryElem = document.querySelector('.gallery');
    const imageViewElem = document.getElementById('image-view');
    // now, we show the display with the very first image
    const activeImgElem = document.createElement('img');
    activeImgElem.id = 'active-gallery-image';
    let currentIndex = 0;
    activeImgElem.src = gallery.getUrl(currentIndex, imgCdnBase, format);
    imageViewElem.appendChild(activeImgElem);
    const imageDescriptionElement = document.getElementById('image-description');
    imageDescriptionElement.textContent = gallery.getAltText(currentIndex);
    // now, we need an event listener for the image cycling buttons
    galleryElem?.addEventListener('click', (e) => {
        const btn = e.target.closest('.cycle-img');
        if (!btn)
            return;
        if (btn.id === 'next-image') {
            currentIndex = (currentIndex + 1) % gallery.length;
        }
        else if (btn.id === 'previous-image') {
            currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        }
        activeImgElem.src = gallery.getUrl(currentIndex, imgCdnBase, format);
        imageDescriptionElement.textContent = gallery.getAltText(currentIndex);
    });
}
export function configHandler(config, logos) {
    const personalizationContainerElem = document.querySelector('.personalization-config');
    const dropdownElem = document.querySelector('.cog-dropdown');
    closePopupOnOutsideClick(dropdownElem, personalizationContainerElem);
    personalizationContainerElem.addEventListener('click', (e) => {
        const target = e.target;
        const btn = target.closest('button');
        const intervalInput = (target.closest('input[name="interval-rad"]') ||
            target.closest('label')?.querySelector('input[name="interval-rad"]'));
        const logoInput = (target.closest('input[name="sundown-logo"]') ||
            target.closest('label')?.querySelector('input[name="sundown-logo"]'));
        if (btn) {
            dropdownElem.classList.toggle('active');
        }
        else if (intervalInput) {
            const seconds = parseInt(intervalInput.value);
            const milliseconds = seconds * 1000;
            config.update({ interval: milliseconds });
            console.log(`Slideshow interval set to: ${milliseconds}ms`);
        }
        else if (logoInput) {
            config.update({ path: logoInput.value });
        }
    });
}
function closePopupOnOutsideClick(dropdownElem, personalizationContainerElem) {
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (dropdownElem.classList.contains('active') && !personalizationContainerElem.contains(target))
            dropdownElem.classList.remove('active');
    });
}
export function syncSlideshowWithGalleryVisibility(selector, slideshow, config) {
    const galleryContainer = document.querySelector(selector);
    if (!galleryContainer)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting)
                slideshow.stop();
            // accessing the config inside the function prevents desync if user changes slideshow interval while looking at gallery
            else
                slideshow.start(config.slideshowInterval);
        });
    }, {
        threshold: 0.1
    });
    observer.observe(galleryContainer);
}
export function attachStaticListeners() {
    const ipText = document.querySelector('.ip-text');
    ipText?.addEventListener('click', () => {
        const ip = ipText.innerText;
        navigator.clipboard.writeText(ip);
        ipText.innerText = "Copied!";
        setTimeout(() => ipText.innerText = ip, 2000);
    });
    document.querySelectorAll('.staff-expand, .expand-roles').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
export function initUI() {
    const navbarDropBtn = document.getElementById('navbar-drop');
    const navList = document.getElementById('nav-list');
    navbarDropBtn?.addEventListener('click', () => {
        navList?.classList.toggle('show');
        navbarDropBtn.classList.toggle('active');
    });
}
//# sourceMappingURL=lib.js.map