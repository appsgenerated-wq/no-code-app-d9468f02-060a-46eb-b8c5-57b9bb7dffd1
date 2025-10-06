// COMPREHENSIVE CORS MIDDLEWARE: Handles CORS for ALL requests, not just health checks
// Reads ALLOWED_ORIGINS env var (comma-separated). Supports '*' wildcards.
// Applied to all endpoints to ensure preflight requests work.
module.exports = async (req, res, manifest) => {
  const timestamp = new Date().toISOString();
  const appId = req.get('X-App-ID') || 'Unknown';
  console.log('🔍 [CORS] CORS middleware triggered at ' + timestamp + ', App ID: ' + appId);
  console.log('🔍 [CORS] Request method: ' + req.method + ', URL: ' + req.url);
  
  try {
    const origin = req.get('Origin');
    console.log('🔍 [CORS] Origin header: ' + origin);
    
    const raw = process.env.ALLOWED_ORIGINS || '';
    console.log('🔍 [CORS] ALLOWED_ORIGINS env var: ' + raw);
    const patterns = raw.split(',').map(s => s.trim()).filter(Boolean);
    console.log('🔍 [CORS] Parsed patterns: ' + JSON.stringify(patterns));
    
    const matches = (o) => {
      if (!o) {
        console.log('🔍 [CORS] No origin provided, allowing (for mobile apps, etc.)');
        return true;
      }
      for (const p of patterns) {
        console.log('🔍 [CORS] Testing pattern: ' + p);
        if (!p) continue;
        if (p.includes('*')) {
          // Simple wildcard matching for *.domain.com
          const basePattern = p.replace('*.', '');
          console.log('🔍 [CORS] Wildcard pattern, base: ' + basePattern);
          if (o.endsWith(basePattern)) {
            console.log('🔍 [CORS] Wildcard match successful');
            return true;
          }
        } else {
          if (p === o) {
            console.log('🔍 [CORS] Exact match successful');
            return true;
          }
        }
      }
      console.log('🔍 [CORS] No pattern matched, blocking origin');
      return false;
    };
    
    const allowed = matches(origin);
    console.log('🔍 [CORS] Origin allowed: ' + allowed);
    
    if (allowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-ID, Accept, Origin, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      console.log('✅ [CORS] CORS headers set successfully');
    }
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      console.log('🔍 [CORS] Handling OPTIONS preflight request');
      return res.status(204).send();
    }
    
    // If this is the health endpoint, return health data
    if (req.url === '/api/health' || req.url.endsWith('/health')) {
      const healthStatus = { status: 'ok', timestamp: timestamp, appId: appId, manifest: 'running', version: '1.0.0' };
      console.log('✅ [HEALTH] Health check successful:', healthStatus);
      res.status(200).json(healthStatus);
    } else {
      // For non-health endpoints with CORS headers set, continue to next handler
      console.log('🔍 [CORS] Not health endpoint, continuing to next handler');
      return;
    }
  } catch (error) {
    console.error('❌ [CORS] CORS middleware error:', error);
    // On error, allow the request to continue without CORS headers
    // This is safer than blocking all requests
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }
  }
};