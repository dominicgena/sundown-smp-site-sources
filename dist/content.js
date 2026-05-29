class Header {
    title;
    version;
    options;
    constructor(title, version, options) {
        this.title = title;
        this.version = version;
        this.options = options;
    }
    populate() {
        const titleElem = document.getElementById('server-title');
        const versionElem = document.getElementById('version');
        const navList = document.getElementById('nav-list');
        const navbarDropBtn = document.getElementById('navbar-drop');
        if (titleElem)
            titleElem.innerText = this.title;
        if (versionElem)
            versionElem.innerText = this.version;
        if (navbarDropBtn && navList) {
            navbarDropBtn.addEventListener('click', () => {
                navList.classList.toggle('show');
                navbarDropBtn.classList.toggle('active');
            });
        }
        // loop through the options passed in the constructor and put them in the nav bar
        this.options.forEach((option) => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            // access the name, url, and target properties directly through the interface
            li.id = option.name.toLowerCase();
            link.innerText = option.name;
            link.href = option.url;
            link.target = option.target;
            li.appendChild(link);
            navList.appendChild(li);
        });
        const readyEvent = new CustomEvent('headerReady', {
            bubbles: true,
            detail: {
                type: 'header',
                element: navList,
                instance: this
            }
        });
        navList?.dispatchEvent(readyEvent);
    }
}
class Footer {
    address;
    staff;
    constructor(address, staff) {
        this.address = address;
        this.staff = staff;
    }
    populate() {
        const expandBtnSvgCode = `<svg width="16" height="8" viewBox="0 0 16 8"><g><path style="fill:rgb(92%,92%,92%);" d="M0.9 -0.1c0.9 0 1.3 0.4 1.9 1l0.3 0.3c0.2 0.2 0.3 0.3 0.5 0.4l0.2 0.2q0.6 0.5 1.2 1a76 76 0 0 1 1.2 1q0.1 0.1 0.3 0.2c0.2 0.1 0.3 0.3 0.5 0.4l0.2 0.2 0.2 0.2c0.2 0.2 0.4 0.3 0.7 0.4l0.3 -0.3c0.8 -0.7 1.5 -1.4 2.3 -2.1 0.4 -0.4 0.9 -0.8 1.3 -1.1 0.5 -0.5 1.1 -1 1.7 -1.4 0.3 -0.2 0.3 -0.2 0.5 -0.5 0.3 0 0.3 0 0.8 0l0.4 0c0.3 0.2 0.3 0.2 0.6 0.2a2.8 2.8 0 0 1 0 1.4c-0.4 0.5 -0.8 0.8 -1.3 1.1q-0.3 0.3 -0.7 0.6 -0.2 0.1 -0.3 0.3a27 27 0 0 0 -1.6 1.3c-0.6 0.5 -1.1 1 -1.7 1.5a29.5 29.5 0 0 0 -1 0.9q-0.2 0.1 -0.3 0.3a11 11 0 0 0 -0.5 0.5c-0.3 0.3 -0.7 0.5 -1.1 0.5 -0.9 0 -1.4 -0.8 -2 -1.4q-0.3 -0.3 -0.7 -0.6a27.5 27.5 0 0 1 -1.4 -1.1 32.5 32.5 0 0 0 -1.8 -1.5 33 33 0 0 1 -1.3 -1.2c-0.3 -0.2 -0.3 -0.2 -0.6 -0.4c-0.3 -0.2 -0.3 -0.2 -0.4 -0.5l0 -0.4c0 -0.1 0 -0.2 0 -0.4c0 -0.1 0.4 -0.1 0.9 -0.1"/></g></svg>`;
        const footerElem = document.querySelector('.main-footer');
        if (!footerElem)
            return;
        const footerIpElem = document.getElementById('footer-server-ip');
        const h3Wrapper = document.createElement('h3');
        footerIpElem.appendChild(h3Wrapper);
        const addressElem = document.createElement('span');
        addressElem.innerText = this.address;
        addressElem.className = 'ip-text';
        h3Wrapper.appendChild(addressElem);
        addressElem.title = 'Click to copy IP';
        addressElem.addEventListener('click', () => {
            navigator.clipboard.writeText(this.address).then(() => {
                addressElem.innerText = "Copied!";
                setTimeout(() => {
                    addressElem.innerText = this.address;
                }, 2000);
            });
        });
        // initialize staff
        const staffCont = document.createElement('div');
        staffCont.className = 'staff-list';
        const staffHeader = document.getElementById('staff-header');
        const footerExpandBtn = document.createElement('button');
        footerExpandBtn.className = 'staff-expand';
        footerExpandBtn.title = "Toggle Staff List";
        footerExpandBtn.innerHTML = footerExpandBtn.innerHTML = expandBtnSvgCode;
        staffHeader.appendChild(footerExpandBtn);
        footerExpandBtn.addEventListener('click', () => {
            footerExpandBtn.classList.toggle('active');
            footerExpandBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        footerElem.appendChild(staffCont);
        const staffElem = document.querySelector('.staff-list');
        if (!staffElem)
            return;
        staffElem.innerHTML = '';
        this.staff.forEach((member) => {
            const memberElem = document.createElement('div');
            memberElem.className = 'member';
            // name and featured role (first role in the role list, the member's highest 'rank')
            const nameElem = document.createElement('h3');
            nameElem.className = 'name';
            // link
            const nameLinkElem = document.createElement('a');
            nameLinkElem.href = member.url;
            nameLinkElem.className = 'discord-name-link';
            nameLinkElem.textContent = member.name + ": ";
            // roles
            const firstRole = (member.rankRoles[0] || "").toLowerCase().replace(/^\w/, c => c.toUpperCase());
            const roleSpanElem = document.createElement('span');
            roleSpanElem.className = 'featured-role';
            roleSpanElem.textContent = firstRole;
            // append the name link and role span to the name heading
            nameElem.appendChild(nameLinkElem);
            nameElem.appendChild(roleSpanElem);
            // expand button for each individual staff member
            const staffExpandBtn = document.createElement('button');
            staffExpandBtn.className = 'expand-roles';
            staffExpandBtn.title = 'View all roles';
            staffExpandBtn.innerHTML = expandBtnSvgCode;
            // full role list (excluding the first/featured role already displayed)
            const rolesDisplay = member.rankRoles
                .slice(1)
                .map(r => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase())
                .join(", ");
            const rolesElem = document.createElement('div');
            rolesElem.className = 'all-roles';
            rolesElem.textContent = rolesDisplay;
            // hide the expand button if there are no additional roles to show
            if (member.rankRoles.length <= 1)
                staffExpandBtn.style.display = 'none';
            staffExpandBtn.addEventListener('click', () => {
                staffExpandBtn.classList.toggle('active');
                staffExpandBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            memberElem.appendChild(nameElem);
            memberElem.appendChild(staffExpandBtn);
            memberElem.appendChild(rolesElem);
            staffElem.appendChild(memberElem);
        });
    }
}
export class Content {
    header;
    footer;
    constructor(title, version, options, address, staff) {
        this.header = new Header(title, "Version " + version, options);
        this.footer = new Footer(address, staff);
    }
    populate() {
        this.header.populate();
        this.footer.populate();
    }
}
//# sourceMappingURL=content.js.map