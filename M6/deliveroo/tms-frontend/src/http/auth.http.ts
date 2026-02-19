import { delay } from "./mock-utils";

export async function login(email: string, password: string): Promise<boolean> {
  await delay(500, 1000);
  console.log(`Attempting to log in with email: ${email} and password: ${password}`);
  return true;
}
