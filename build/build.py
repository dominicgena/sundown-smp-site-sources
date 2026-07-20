import subprocess
import os
import shutil
import re
from pathlib import Path

# Import the populator from the sibling file in the build directory
from populate_html import HtmlPopulator

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = Path("/home/dominic/smp-site")
ENTRY_POINT = PROJECT_ROOT / "src/ts/bundle-entry.ts"
BUNDLE_NAME = "bundle.js"

GIT_EXCLUSIONS = {'.git', '.gitignore', '.gitattributes', '.gitmodules'}
ROOT_EXCLUSIONS = {
                      'tsconfig.json', 'package.json', 'package-lock.json',
                      '.vscode', 'node_modules', 'build', 'dist', 'src', 'assets', 'tree.txt'
                  } | GIT_EXCLUSIONS


def run_build():
    print(f"STARTING BUILD...")

    try:
        process = subprocess.run(
            ['npx', 'esbuild', str(ENTRY_POINT), '--bundle', '--minify', '--format=iife', '--target=es2022'],
            capture_output=True,
            text=True,
            check=True
        )
        bundled_js = process.stdout
    except subprocess.CalledProcessError as e:
        print(f"ESBUILD FAILED: {e.stderr}")
        return

    if OUTPUT_DIR.exists():
        for item in os.listdir(OUTPUT_DIR):
            if item in GIT_EXCLUSIONS:
                continue
            path = OUTPUT_DIR / item
            if path.is_dir():
                shutil.rmtree(path)
            else:
                path.unlink()
    else:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    html_files = list(PROJECT_ROOT.glob("*.html"))
    processed_html = {}
    script_regex = re.compile(r'<script[^>]*class=["\']entrypoint["\'][^>]*>.*?</script>', re.DOTALL)

    for html_path in html_files:
        # Instantiate HtmlPopulator for the current HTML file
        populator = HtmlPopulator(html_path.name)

        # Intercept the populated HTML string to use as our base content
        content = str(populator)

        # Apply the esbuild entrypoint script replacement to the populated string
        new_tag = f'<script src="dist/{BUNDLE_NAME}"></script>'
        new_content = script_regex.sub(new_tag, content)
        processed_html[html_path.name] = new_content

    shutil.copytree(
        PROJECT_ROOT / "src",
        OUTPUT_DIR / "src",
        ignore=shutil.ignore_patterns('ts', '.git*'),
        dirs_exist_ok=True
    )

    shutil.copytree(
        PROJECT_ROOT / "assets",
        OUTPUT_DIR / "assets",
        ignore=shutil.ignore_patterns('.git*'),
        dirs_exist_ok=True
    )

    for item in os.listdir(PROJECT_ROOT):
        s = PROJECT_ROOT / item
        d = OUTPUT_DIR / item
        if item not in ROOT_EXCLUSIONS and s.is_file():
            shutil.copy2(s, d)

    for filename, content in processed_html.items():
        with open(OUTPUT_DIR / filename, 'w', encoding='utf-8') as f:
            f.write(content)

    dist_path = OUTPUT_DIR / "dist"
    dist_path.mkdir(exist_ok=True)
    with open(dist_path / BUNDLE_NAME, 'w', encoding='utf-8') as f:
        f.write(bundled_js)

    print(f"BUILD COMPLETE: {OUTPUT_DIR}")


if __name__ == "__main__":
    run_build()