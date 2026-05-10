// src/ts/bundle-entry.ts
import { initSite } from './main.js';
import { initDiscordPage } from './discord.js';

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