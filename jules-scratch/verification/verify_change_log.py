from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the first project's change log page
    # First, get the project ID from the main page
    page.goto("http://localhost:3000")
    project_link = page.query_selector('a[href^="/projects/"]')
    href = project_link.get_attribute('href')
    project_id = href.split('/')[-1]

    # Navigate to the change log page
    page.goto(f"http://localhost:3000/projects/{project_id}/change-log")

    # Wait for the page to load
    page.wait_for_selector('"Registro de Cambios"')

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/change-log-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
