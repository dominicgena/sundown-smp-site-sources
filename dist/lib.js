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
export function setupNavigationRouting(event) {
    const contentReadyEvent = event;
    const { type, element, instance } = contentReadyEvent.detail;
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a');
        if (target && target.hash) {
            if (target.target === '_blank')
                return; // shouldn't prevent the default if we're doing a redirect
            e.preventDefault();
            navEventHandler(target);
        }
    });
    const routingSetupEvent = new CustomEvent('navRoutingSetup', {
        detail: {
            type: 'navigation',
            timestamp: Date.now(),
            source: element
        },
        bubbles: true
    });
    document.dispatchEvent(routingSetupEvent);
}
export function navEventHandler(target) {
    const intent = target.parentElement.id;
    const toggleables = document.querySelectorAll('.toggleable, .home');
    toggleables.forEach(toggleable => toggleable.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    populateLogoOptions(logos);
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
function populateLogoOptions(logos) {
    const logoSelectionElement = document.getElementById('logo-selection');
    // 1. Clear the div but immediately re-add the header
    logoSelectionElement.innerHTML = '<h3 class="menu-section-header">Logo</h3>';
    logos.forEach((logo) => {
        const labelElem = document.createElement('label');
        labelElem.htmlFor = logo.for;
        const inputElem = document.createElement('input');
        inputElem.id = logo.id;
        inputElem.name = 'sundown-logo';
        inputElem.type = 'radio';
        inputElem.value = logo.value;
        if (logo.id === 'mountains-1') {
            inputElem.checked = true;
        }
        const spanElem = document.createElement('span');
        spanElem.classList.add('radio-custom');
        spanElem.classList.add(logo.for);
        // 2. DOM ORDER: input first, then span (critical for the CSS + selector)
        labelElem.appendChild(inputElem);
        labelElem.appendChild(spanElem);
        // Add the text label
        labelElem.appendChild(document.createTextNode(` ${logo.text}`));
        logoSelectionElement.appendChild(labelElem);
        logoSelectionElement.appendChild(document.createElement('br'));
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
//# sourceMappingURL=lib.js.map