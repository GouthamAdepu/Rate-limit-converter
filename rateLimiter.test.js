const request = require('supertest');
const express = require('express');
const { rateLimiter, resetMetrics, getMetrics } = require('./rateLimiter');

describe('Token Bucket Rate Limiter', () => {
  let app;

  beforeEach(() => {
    // Reset metrics before each test
    resetMetrics();
    
    // Create a new Express app for each test
    app = express();
    app.set('trust proxy', true);
    app.use(rateLimiter);
    app.get('/api/data', (req, res) => {
      res.json({ message: 'Success' });
    });
  });

  describe('Normal requests', () => {
    test('should allow requests within the limit', async () => {
      const response = await request(app)
        .get('/api/data')
        .set('X-Forwarded-For', '192.168.1.1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Success' });
    });

    test('should allow burst of 10 requests', async () => {
      const ip = '192.168.1.2';
      const requests = [];

      // Make 10 requests rapidly
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip)
        );
      }

      const responses = await Promise.all(requests);

      // All 10 requests should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Success' });
      });

      const metrics = getMetrics();
      expect(metrics.requestsServed[ip]).toBe(10);
      expect(metrics.rateLimitTriggered).toBe(0);
    });
  });

  describe('Rate limit enforcement', () => {
    test('should reject 11th request in a burst', async () => {
      const ip = '192.168.1.3';
      const requests = [];

      // Make 11 requests rapidly (exceeding the bucket capacity of 10)
      for (let i = 0; i < 11; i++) {
        requests.push(
          request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip)
        );
      }

      const responses = await Promise.all(requests);

      // First 10 should succeed
      for (let i = 0; i < 10; i++) {
        expect(responses[i].status).toBe(200);
        expect(responses[i].body).toEqual({ message: 'Success' });
      }

      // 11th should be rate limited
      expect(responses[10].status).toBe(429);
      expect(responses[10].body.error).toBe('Too Many Requests');

      const metrics = getMetrics();
      expect(metrics.requestsServed[ip]).toBe(10);
      expect(metrics.rateLimitTriggered).toBe(1);
    });

    test('should allow requests after tokens refill', async () => {
      const ip = '192.168.1.4';

      // Exhaust the bucket
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/data')
          .set('X-Forwarded-For', ip);
      }

      // 11th request should be blocked
      const blockedResponse = await request(app)
        .get('/api/data')
        .set('X-Forwarded-For', ip);
      expect(blockedResponse.status).toBe(429);

      // Wait for token refill (1.2 seconds to be safe)
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Now should allow one more request
      const allowedResponse = await request(app)
        .get('/api/data')
        .set('X-Forwarded-For', ip);
      expect(allowedResponse.status).toBe(200);
      expect(allowedResponse.body).toEqual({ message: 'Success' });
    });
  });

  describe('IP-based isolation', () => {
    test('should track requests separately for different IPs', async () => {
      const ip1 = '192.168.1.5';
      const ip2 = '192.168.1.6';

      // Make 10 requests from IP1
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/data')
          .set('X-Forwarded-For', ip1);
      }

      // Make 10 requests from IP2
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/data')
          .set('X-Forwarded-For', ip2);
      }

      const metrics = getMetrics();
      expect(metrics.requestsServed[ip1]).toBe(10);
      expect(metrics.requestsServed[ip2]).toBe(10);
      expect(metrics.rateLimitTriggered).toBe(0);

      // Both IPs should have exhausted their buckets
      const response1 = await request(app)
        .get('/api/data')
        .set('X-Forwarded-For', ip1);
      expect(response1.status).toBe(429);

      const response2 = await request(app)
        .get('/api/data')
        .set('X-Forwarded-For', ip2);
      expect(response2.status).toBe(429);
    });
  });
});

// Print test results
console.log('\n🧪 Running Token Bucket Rate Limiter Tests...\n');
