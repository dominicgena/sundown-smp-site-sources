// src/ts/bundle-entry.ts
import { initSite } from './main.js';
import { initDiscordPage } from './discord.js';
// 2. Attach the modal logic globally to the window object
window.openVoteModal = function (urls) {
    const overlay = document.getElementById('vote-modal-overlay');
    const yesBtn = document.getElementById('vote-modal-yes');
    const noBtn = document.getElementById('vote-modal-no');
    if (!overlay || !yesBtn || !noBtn)
        return;
    // Show the modal
    overlay.classList.add('active');
    // Clean up old event listeners by cloning elements
    const newYesBtn = yesBtn.cloneNode(true);
    const newNoBtn = noBtn.cloneNode(true);
    yesBtn.parentNode?.replaceChild(newYesBtn, yesBtn);
    noBtn.parentNode?.replaceChild(newNoBtn, noBtn);
    // If they click Yes, open all tabs instantly (trusted user gesture bypasses popup blockers!)
    newYesBtn.addEventListener('click', () => {
        urls.forEach(url => {
            window.open(url, '_blank');
        });
        overlay.classList.remove('active');
    });
    // If they click Cancel or click outside the modal box, close it
    newNoBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
};
// 3. Initialize page-specific scripts on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the Discord redirect page
    if (document.getElementById('countdown')) {
        initDiscordPage();
    }
    // Check if we are on the main landing page
    if (document.getElementById('server-title')) {
        initSite();
    }
});
//# sourceMappingURL=bundle-entry.js.map