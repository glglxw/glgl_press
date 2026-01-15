import { test, expect } from '@playwright/test'

test.describe('Unified Editor', () => {
    test('Triangle editor loads with light theme and Chinese UI', async ({ page }) => {
        await page.goto('/triangle/editor')

        // Verify header
        await expect(page.locator('h2')).toContainText('三角日报编辑器')

        // Verify light theme - check the main container
        const container = page.locator('div').first()
        await expect(container).toHaveAttribute('data-theme', 'light')
    })

    test('Duskvol editor loads with dark theme and English UI', async ({ page }) => {
        await page.goto('/duskvol/editor')

        // Verify header
        await expect(page.locator('h2')).toContainText('The Press Room')

        // Verify dark theme
        const container = page.locator('div').first()
        await expect(container).toHaveAttribute('data-theme', 'dark')
    })

    test('Navigation from homepage works', async ({ page }) => {
        // Test triangle link
        await page.goto('/')
        await page.click('a[href="/triangle/editor"]')
        await expect(page).toHaveURL('/triangle/editor')

        // Test duskvol link
        await page.goto('/')
        await page.click('a[href="/duskvol/editor"]')
        await expect(page).toHaveURL('/duskvol/editor')
    })
})
