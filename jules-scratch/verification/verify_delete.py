
from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    def handle_dialog(dialog):
        dialog.accept()

    page.on('dialog', handle_dialog)

    page.goto("http://localhost:3000/projects/3/tasks")
    time.sleep(5)  # Wait for the page to load

    # Click the delete button on the first task
    page.locator('.delete-task-button').first.click()
    time.sleep(2) # Wait for the task to be deleted

    page.screenshot(path="jules-scratch/verification/delete_verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
