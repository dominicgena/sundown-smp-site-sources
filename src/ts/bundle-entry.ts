// src/ts/bundle-entry.ts
import { initSite } from './main.js';
import { initDiscordPage } from './discord.js';

// 1. Define global window function so the inline HTML onclick can find it
declare global {
    interface Window {
        openVoteModal: (urls: string[]) => void;
    }
}

// 2. Attach the modal logic globally to the window object
window.openVoteModal = function(urls: string[]): void {
    const overlay = document.getElementById('vote-modal-overlay');
    const yesBtn = document.getElementById('vote-modal-yes');
    const noBtn = document.getElementById('vote-modal-no');

    if (!overlay || !yesBtn || !noBtn) return;

    overlay.classList.add('active');

    const newYesBtn = yesBtn.cloneNode(true) as HTMLElement;
    const newNoBtn = noBtn.cloneNode(true) as HTMLElement;
    yesBtn.parentNode?.replaceChild(newYesBtn, yesBtn);
    noBtn.parentNode?.replaceChild(newNoBtn, noBtn);

    newYesBtn.addEventListener('click', () => {
        let blockedCount = 0;

        // Try to open every link and track if any get blocked
        urls.forEach((url, index) => {
            const newTab = window.open(url, '_blank');
            // If the tab returned null or undefined, the browser blocked it!
            if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                blockedCount++;
            }
        });

        // IF TABS WERE BLOCKED: Don't close the modal! Transform it into a helpful guide.
        if (blockedCount > 0) {
            const modalBox = overlay.querySelector('.vote-modal-box');
            if (modalBox) {
                modalBox.innerHTML = `
                    <h3 style="color: #ffaa00;">Popups Blocked!</h3>
                    <p style="font-size: 1.3rem; margin-bottom: 15px;">
                        Your browser allowed the first tab, but blocked the remaining <strong>${blockedCount} voting site(s)</strong>!
                        To fix this, you must disable pop-up blockers for this site in your browser.
                    </p>
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #000000; padding: 12px; border-radius: 6px; margin-bottom: 20px; text-align: left; font-size: 1.2rem;">
                        <strong>How to open the rest:</strong><br>
                        1. Look at the top right of your URL address bar.<br>
                        2. Click the tiny <em>"Pop-up blocked"</em> icon <span>(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
  <image x="-15" y="-7" width="43" height="30" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAeCAYAAAC16ufeAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAVNJREFUWMPtlz9uwjAYxZ+r3gBfAeFvTheGcAQk9wgs3TtkYc7ioUdhyBEAyUsyG4kjxD3D1wVoClL+VgmR8rZPsqWfnp7eZ4v5nBgj0QtGpAl2gh0b7GtxEALgmt1wPjvxHwBN2uiPs9ywxIz54ija8iDONpX339BaAwAbEwsAqAN/OjkkyU70CmtMLLTWfA98mUukkec+tXb/1hvsZvNxc/EOmKuAiSiwdt+fs1cdDvsHYO89Sykfzko5Qxiu+s/sVVH0ectrEXi5XKVEFPxmPM8AIAxXwWCwxQwXIsDGxIKIWKkFiAjOueB4PGaDtEFd4KvrUs6Gq64mwN57PCVsmcPr9Xv6dLBlwANtsBwAYG1aubWKwEoRO+eyXmEvK5OVosqzUs7Q1eHOMUiSnUiSun287RSJ1k/ELhlWSrW6L9r+bod4z4rpKz7BTrAT7PhgfwBd9adin4V3OQAAAABJRU5ErkJgggA=" />
</svg>
)</span>.<br>
                        3. Select <strong>"Always allow pop-ups and redirects"</strong>.<br>
                        4. Click the button below to launch them!
                    </div>
                    <button id="retry-vote-btn" class="vote-modal-btn yes" style="width: 100%;">Click Here to Try Again!</button>
                `;

                // Re-bind the click event to retry launching the tabs!
                document.getElementById('retry-vote-btn')?.addEventListener('click', () => {
                    let stillBlocked = 0;
                    
                    urls.forEach(url => {
                        const retryTab = window.open(url, '_blank');
                        if (!retryTab || retryTab.closed || typeof retryTab.closed === 'undefined') {
                            stillBlocked++;
                        }
                    });

                    // Only close the modal if the browser actually let the tabs through!
                    if (stillBlocked === 0) {
                        overlay.classList.remove('active');
                    } else {
                        // Optional: give visual feedback that it's still blocked
                        const retryBtn = document.getElementById('retry-vote-btn');
                        if (retryBtn) retryBtn.innerText = `Still Blocked! Allow Popups & Try Again (${stillBlocked} left)`;
                    }
                });
            }
        } else {
            // If nothing was blocked (or they already whitelisted the site), close cleanly!
            overlay.classList.remove('active');
        }
    });

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