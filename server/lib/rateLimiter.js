// Constants for limits and 24-hour period
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const PER_IP_LIMIT = 5;    // Maximum 5 requests per day per IP
const GLOBAL_LIMIT = 100;   // Maximum 100 total requests per day for all IPs

// Variables to store request counts and the last reset timestamp
let lastReset = Date.now();
const perIpCounts = new Map(); // Key: IP, Value: number of requests made during the period
let globalCount = 0;

/**
 * Formats the timestamp into a readable date and time string.
 * Example format: "11:03:15 on 03/18/2025"
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString('en-US');
  const formattedTime = date.toLocaleTimeString('en-US');
  return `${formattedTime} on ${formattedDate}`;
}

/**
 * Rate limiting middleware:
 * 1. Resets counters if more than 24 hours have passed since the last reset.
 * 2. Increments the per-IP and global request counters.
 * 3. If a limit is exceeded, responds with HTTP 429 (Too Many Requests).
 */
export function rateLimiter(req, res, next) {
  const now = Date.now();

  // Reset all counters if more than 24 hours have passed
  if (now - lastReset > DAY_IN_MS) {
    perIpCounts.clear();
    globalCount = 0;
    lastReset = now;
    console.info(`[RATE LIMIT] Counters automatically reset at ${formatTimestamp(now)}`);
  }

  // Retrieve the client's IP address
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
  let ipCount = perIpCounts.get(ip) || 0;

  // Log request for debugging
  console.log(`[USER] IP ${ip} made a request at ${formatTimestamp(now)}.`);

  // Check if the IP exceeded its daily limit
  if (ipCount >= PER_IP_LIMIT) {
    console.warn(`[RATE LIMIT] IP ${ip} blocked for exceeding ${PER_IP_LIMIT} daily requests.`);
    return res.status(429).json({ error: 'Your daily request limit has been reached. Please try again tomorrow.' });
  }

  // Check if the global request limit has been reached
  if (globalCount >= GLOBAL_LIMIT) {
    console.warn(`[RATE LIMIT] Global daily limit of ${GLOBAL_LIMIT} requests reached.`);
    return res.status(429).json({ error: 'Global daily request limit reached. Please try again tomorrow.' });
  }

  // Increment request counters
  perIpCounts.set(ip, ipCount + 1);
  globalCount++;

  // Log the current request count for this IP and globally
  console.log(`[RATE LIMIT] IP ${ip} has used ${ipCount + 1}/${PER_IP_LIMIT} requests.`);
  console.log(`[RATE LIMIT] Total requests used: ${globalCount}/${GLOBAL_LIMIT}.`);

  // Proceed to the next middleware or route
  next();
}
