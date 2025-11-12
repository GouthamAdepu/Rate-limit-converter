/**
 * Token Bucket Rate Limiter Middleware
 * 
 * Allows a burst of up to 10 requests per 10 seconds.
 * Refills 1 token every second.
 */

// Store token buckets for each IP address
const tokenBuckets = new Map();

// Metrics tracking
const metrics = {
  requestsServed: new Map(), // IP -> count
  rateLimitTriggered: 0 // Total count
};

// Configuration
const BUCKET_CAPACITY = 10; // Maximum tokens (burst size)
const REFILL_RATE = 1; // Tokens per second
const REFILL_INTERVAL = 1000; // 1 second in milliseconds

/**
 * Initialize or get token bucket for an IP address
 */
function getTokenBucket(ip) {
  if (!tokenBuckets.has(ip)) {
    tokenBuckets.set(ip, {
      tokens: BUCKET_CAPACITY,
      lastRefill: Date.now()
    });
  }
  return tokenBuckets.get(ip);
}

/**
 * Refill tokens for a bucket based on elapsed time
 */
function refillTokens(bucket) {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor((elapsed / REFILL_INTERVAL) * REFILL_RATE);
  
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(BUCKET_CAPACITY, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }
}

/**
 * Rate limiter middleware
 */
function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Get or create token bucket for this IP
  const bucket = getTokenBucket(ip);
  
  // Refill tokens based on elapsed time
  refillTokens(bucket);
  
  // Check if token is available
  if (bucket.tokens >= 1) {
    // Consume a token
    bucket.tokens -= 1;
    
    // Update metrics
    const currentCount = metrics.requestsServed.get(ip) || 0;
    metrics.requestsServed.set(ip, currentCount + 1);
    
    // Log request served
    console.log(`[${new Date().toISOString()}] Request served for IP: ${ip}, Tokens remaining: ${bucket.tokens.toFixed(2)}`);
    
    next();
  } else {
    // Rate limit exceeded
    metrics.rateLimitTriggered += 1;
    console.log(`[${new Date().toISOString()}] Rate limit exceeded for IP: ${ip}. Total rate limits triggered: ${metrics.rateLimitTriggered}`);
    
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }
}

/**
 * Get metrics
 */
function getMetrics() {
  const requestsByIp = {};
  metrics.requestsServed.forEach((count, ip) => {
    requestsByIp[ip] = count;
  });
  
  return {
    requestsServed: requestsByIp,
    rateLimitTriggered: metrics.rateLimitTriggered,
    activeBuckets: tokenBuckets.size
  };
}

/**
 * Reset metrics (useful for testing)
 */
function resetMetrics() {
  metrics.requestsServed.clear();
  metrics.rateLimitTriggered = 0;
  tokenBuckets.clear();
}

module.exports = {
  rateLimiter,
  getMetrics,
  resetMetrics
};
