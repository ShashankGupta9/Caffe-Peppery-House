// lib/admin/adminServices.ts
import {
  mockDashboardStats,
  mockSalesData,
  mockOrders,
  mockInventory,
  mockAIInsights,
  mockCustomers,
  mockReviews
} from './mockAdminData';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getDashboardStats() {
  await delay(800);
  return mockDashboardStats;
}

export async function getSalesData() {
  await delay(800);
  return mockSalesData;
}

export async function getOrders() {
  await delay(1000);
  return mockOrders;
}

export async function getInventory() {
  await delay(900);
  return mockInventory;
}

export async function getAIInsights() {
  await delay(1200);
  return mockAIInsights;
}

export async function getCustomers() {
  await delay(1000);
  return mockCustomers;
}

export async function getReviews() {
  await delay(700);
  return mockReviews;
}
