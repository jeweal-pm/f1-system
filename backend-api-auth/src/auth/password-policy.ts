import { randomInt } from "node:crypto";
import { z } from "zod";

export const passwordSchema = z.string()
  .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
  .max(64, "รหัสผ่านต้องมีไม่เกิน 64 ตัวอักษร")

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

export function generatePassword() {
  const chars = [
    "ABCDEFGHJKLMNPQRSTUVWXYZ"[randomInt(24)],
    "abcdefghijkmnpqrstuvwxyz"[randomInt(24)],
    "23456789"[randomInt(8)],
  ];
  while (chars.length < 12) chars.push(alphabet[randomInt(alphabet.length)]!);
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [chars[index], chars[swapIndex]] = [chars[swapIndex]!, chars[index]!];
  }
  return chars.join("");
}
