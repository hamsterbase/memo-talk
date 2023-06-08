export function validateName(str: string): string {
  if (typeof str !== "string") {
    throw new Error("Invalid type: expected a string");
  }
  // 检查字符串长度是否为 64
  if (str.length !== 64) {
    throw new Error("Invalid length: expected 64 characters");
  }

  // 检查字符串是否只包含 0-9 和 A-F 之间的字符
  const regex = /^[0-9A-Fa-f]{64}$/;
  if (!regex.test(str)) {
    throw new Error("Invalid format: expected 64 hexadecimal characters");
  }

  // 将字符串转换为小写并返回
  return str.toLowerCase();
}
