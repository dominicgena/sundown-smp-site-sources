function initDiscordPage() {
    const inviteLink = "https://discord.gg/wExHHDzt3z";
    const countdownElem = document.getElementById('countdown');
    const tabTitle = document.getElementById('tabbar-title');

    let seconds = 5;

    const interval = setInterval(() => {
        seconds--;
        
        if (countdownElem) {
            countdownElem.innerText = seconds.toString();
        }
        
        if (tabTitle) {
            tabTitle.innerText = `Joining in ${seconds}s...`;
        }

        if (seconds <= 0) {
            clearInterval(interval);
            window.location.href = inviteLink;
        }
    }, 1000);
}

// Run immediately since we don't need external data anymore
document.addEventListener('DOMContentLoaded', initDiscordPage);