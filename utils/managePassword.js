import bcrypt from "bcrypt";

export async function HashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export async function ComparePasswords(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

  return isMatch;
}
