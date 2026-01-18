/**
 * Ensures that required environment variables are present.
 */
function assertEnvVars(...vars) {
  const missing = vars.filter(name => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = { assertEnvVars }; 