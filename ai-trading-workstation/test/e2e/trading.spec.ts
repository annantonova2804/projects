import { expect, test } from "@playwright/test";

// These tests assume the app is running with LLM_MOCK=true so chat behavior
// is deterministic (see scripts/dev-backend.sh, which defaults to that).

test("dashboard loads with starting cash and watchlist", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("FINALLY")).toBeVisible();
  await expect(page.getByTestId("header-cash")).toContainText("$10,000.00");
  await expect(page.getByTestId("watchlist-trade-AAPL")).toBeVisible();
});

test("manual trade ticket fills a market order", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("watchlist-trade-AAPL").click();
  await expect(page.getByTestId("trade-ticket")).toBeVisible();

  await page.getByRole("spinbutton").fill("2");
  await page.getByRole("button", { name: /Buy AAPL/i }).click();

  await expect(page.getByTestId("trade-ticket")).toHaveCount(0);
  await expect(page.getByText("No positions.")).toHaveCount(0);
});

test("AI chat executes a trade via natural language", async ({ page }) => {
  await page.goto("/");
  const chatInput = page.getByPlaceholder("Ask the assistant…");
  await chatInput.fill("buy 3 MSFT");
  await chatInput.press("Enter");

  await expect(page.getByText(/Filled: buy 3(\.0)? MSFT/i)).toBeVisible({ timeout: 10_000 });
});

test("AI chat reports portfolio status", async ({ page }) => {
  await page.goto("/");
  const chatInput = page.getByPlaceholder("Ask the assistant…");
  await chatInput.fill("show my portfolio");
  await chatInput.press("Enter");

  await expect(page.getByText(/Cash: \$/)).toBeVisible({ timeout: 10_000 });
});
