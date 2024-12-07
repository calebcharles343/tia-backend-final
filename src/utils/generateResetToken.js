const crypto = require("crypto");
const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // Store as a Date object

  return { resetToken, hashedToken, resetExpires };
};

module.exports = generateResetToken;
