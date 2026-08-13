import type { Page } from "@playwright/test";

export const getTableRowCount = async (page: Page): Promise<number> => {
  return page.locator("tbody tr").count();
};

export const getFirstColumnNames = async (page: Page): Promise<string[]> => {
  return page.locator("tbody tr td:first-child").allTextContents();
};
