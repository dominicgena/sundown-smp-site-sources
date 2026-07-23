import urllib.request
import json

class HtmlPopulator:
    def __init__(self, file_name):
        # global config
        self.html = self.populate_html_placeholders(file_name)

    def __str__(self):
        return self.html

    def populate_html_placeholders(self, file_name):
        config = json.load(open('../src/data/config.json'))
        CONFIG_WEB: dict = dict.get(config, "web")
        CONFIG_SERVER: dict = dict.get(config, "server")

        title = CONFIG_SERVER.get("title")
        ip = CONFIG_SERVER.get("ip")
        version = self.fetch_server_version(CONFIG_SERVER.get("status_api"))
        navs = self.generate_nav_elements(list(dict.get(CONFIG_WEB, "navigation")))
        logos = self.generate_logo_options(list(dict.get(CONFIG_WEB, "logo")))
        downloads = self.generate_download_options(list(dict.get(CONFIG_WEB, "downloads")))
        staff = self.generate_staff_list(list(dict.get(CONFIG_WEB, "staff")))
        inv_link = CONFIG_SERVER.get("invite_link")
        vote = self.generate_vote_options(list(dict.get(CONFIG_WEB, "vote")))
        vote_all = self.generate_vote_all_button(list(dict.get(CONFIG_WEB, "vote")))

        html = ''
        with open(f'../{file_name}', 'r') as file:
            html = file.read()

        if file_name == 'discord.html':
            html = html.replace("{{ INVITE_LINK }}", inv_link)
            return html

        html = html.replace("{{ SERVER_TITLE }}", title)
        html = html.replace("{{ SERVER_VERSION }}", version)
        html = html.replace("{{ NAV_ELEMENTS }}", navs)
        html = html.replace("{{ LOGO_OPTIONS }}", logos)
        html = html.replace("{{ DOWNLOADS_SECTION }}", downloads)
        html = html.replace("{{ STAFF_LIST }}", staff)
        html = html.replace("{{ SERVER_IP }}", ip)
        html = html.replace("{{ VOTE_OPTIONS }}", vote)
        html = html.replace("{{ VOTE_ALL_BUTTON }}", vote_all)
        return html

    def generate_nav_elements(self, data: list[dict[str, str]]):
        elements = ""
        for item in data:
            name = item.get("name")
            id = name.lower().replace(" ", "-")
            url = item.get("url")
            target = item.get("target")
            category = item.get("category")

            # create the element
            element = f"<li id=\"{id}\"><a href=\"{url}\" target=\"{target}\" category=\"{category}\""
            element = ((element[:element.rfind("category=")] if category is None else element).rstrip()) + f">{name}</a></li>"
            # conditional expression that handles indentation
            elements += element + ("\n" if item != data[-1] else "") + " " * 28
        return elements

    def generate_logo_options(self, data: list[dict[str, str]]):
        elements = ""
        for item in data:
            text = str(item.get("text"))
            _for = item.get("for")
            id = item.get("id")
            value = item.get("value")

            checked_attr = ' checked' if id == 'mountains-1' else '' # check mountains 1 by default
            # create the element
            element = f"<label for=\"{_for}\"><input id=\"{id}\" name=\"sundown-logo\" type=\"radio\" value=\"{value}\"{checked_attr}><span class=\"radio-custom {id}\"></span>{" "+ text}</label><br>"
            elements += element + ("\n" if item != data[-1] else "") + " " * 36
        return elements

    def generate_download_options(self, data: list[dict[str, str]]):
        elements = ""
        for item in data:
            season_number = str(item.get("season"))
            download = str(item.get("download"))
            src = str(item.get("featured_image_src"))

            element = (f"<div class=\"download-season-{season_number}\">"
                       f"<h2>Season {season_number}</h2>"
                       f"<img class=\"season-preview-image\" src=\"{src}\">"
                       f"<a href=\"{download}\" target=\"_blank\" class=\"download-link-btn\">Download World</a>"
                       f"</div>\n")
            elements += element
        return elements

    def generate_staff_list(self, data: list[dict[str, str]]):
        elements = ""
        for item in data:
            name = str(item.get("name"))
            url = str(item.get("url"))
            rank_roles = item.get("rankRoles")

            element = (f"<div class=\"member\">"
                       f"<h3 class=\"name\">"
                       f"<a href=\"{url}\" class=\"discord-name-link\">{name}: </a>"
                       f"<span class=\"featured-role\">{rank_roles[0]}</span>"
                       f"</h3>")

            if len(rank_roles) > 1:
                expand_btn_html = """<button class="expand-roles" title="View all roles"><svg width="16" height="8" viewBox="0 0 16 8"><g><path style="fill:rgb(92%,92%,92%);" d="M0.9 -0.1c0.9 0 1.3 0.4 1.9 1l0.3 0.3c0.2 0.2 0.3 0.3 0.5 0.4l0.2 0.2q0.6 0.5 1.2 1a76 76 0 0 1 1.2 1q0.1 0.1 0.3 0.2c0.2 0.1 0.3 0.3 0.5 0.4l0.2 0.2 0.2 0.2c0.2 0.2 0.4 0.3 0.7 0.4l0.3 -0.3c0.8 -0.7 1.5 -1.4 2.3 -2.1 0.4 -0.4 0.9 -0.8 1.3 -1.1 0.5 -0.5 1.1 -1 1.7 -1.4 0.3 -0.2 0.3 -0.2 0.5 -0.5 0.3 0 0.3 0 0.8 0l0.4 0c0.3 0.2 0.3 0.2 0.6 0.2a2.8 2.8 0 0 1 0 1.4c-0.4 0.5 -0.8 0.8 -1.3 1.1q-0.3 0.3 -0.7 0.6 -0.2 0.1 -0.3 0.3a27 27 0 0 0 -1.6 1.3c-0.6 0.5 -1.1 1 -1.7 1.5a29.5 29.5 0 0 0 -1 0.9q-0.2 0.1 -0.3 0.3a11 11 0 0 0 -0.5 0.5c-0.3 0.3 -0.7 0.5 -1.1 0.5 -0.9 0 -1.4 -0.8 -2 -1.4q-0.3 -0.3 -0.7 -0.6a27.5 27.5 0 0 1 -1.4 -1.1 32.5 32.5 0 0 0 -1.8 -1.5 33 33 0 0 1 -1.3 -1.2c-0.3 -0.2 -0.3 -0.2 -0.6 -0.4c-0.3 -0.2 -0.3 -0.2 -0.4 -0.5l0 -0.4c0 -0.1 0 -0.2 0 -0.4c0 -0.1 0.4 -0.1 0.9 -0.1"></path></g></svg></button>"""
                element += expand_btn_html
                element += f"<div class=\"all-roles\">{", ".join(rank_roles[1:])}</div>"

            element += "</div>"
            elements += element
        return elements

    def generate_vote_options(self, data: list[dict[str, str]]):
        elements = ""
        for i, item in enumerate(data, start=1):
            name = item.get("site_name")
            url = item.get("vote_link")

            # Open the wrapper divs
            element = '<div class="table-item first">' if i == 1 else '<div class="table-item">'
            element += '<div class="item-content vote-option">'

            # Build inner card: cleanly removed id="vote-option" from the site name paragraph!
            element += f'<p id="vote-number-{i}">{i}</p><p>{name}</p><button class="vote-button" onclick="window.open(\'{url}\', \'_blank\');">Vote</button>'

            # Close both divs and append to the master string
            element += '</div></div>'
            elements += element

        return elements

    def generate_vote_all_button(self, data: list[dict[str, str]]):
        urls = [item.get("vote_link") for item in data if item.get("vote_link")]

        if len(urls) <= 1:
            return ""

        # Safely format URLs into a JavaScript array string: ['url1', 'url2']
        urls_js = str(urls).replace('"', "'")

        element = '<div class="vote-all-container">'
        # Opens our custom modal instead of directly triggering window.open
        element += f'<button class="vote-all-btn" onclick="openVoteModal({urls_js})">Vote All ({len(urls)})</button>'
        element += '</div>'

        # Inject the HTML structure for the modal directly below the button container
        element += '''
        <div id="vote-modal-overlay" class="vote-modal-overlay">
            <div class="vote-modal-box">
                <h3>Open All Voting Links?</h3>
                <p>This will open multiple tabs for you to support Sundown SMP. Are you ready?</p>
                <div class="vote-modal-actions">
                    <button id="vote-modal-yes" class="vote-modal-btn yes">Yes, Open All</button>
                    <button id="vote-modal-no" class="vote-modal-btn no">Cancel</button>
                </div>
            </div>
        </div>
        '''
        return element

    def fetch_server_version(self, api_url: str) -> str:
        try:
            req = urllib.request.Request(
                api_url,
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode('utf-8'))
                version_raw = data.get("version", {}).get("name_clean", "")
                if "-" in version_raw:
                    return version_raw.split("-")[-1]
                return version_raw

        except Exception as e:
            print(f"Warning: Could not fetch version from API ({e})")
            return "Unknown"