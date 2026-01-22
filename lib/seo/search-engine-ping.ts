// Ping major search engines about sitemap updates
export async function pingSearchEngines() {
  const sitemapUrl = `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`;
  const results = [];

  // Search engines to ping
  const searchEngines = [
    {
      name: 'Google',
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    },
    {
      name: 'Bing',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    },
    {
      name: 'Yandex',
      url: `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    },
    {
      name: 'IndexNow (Bing, Yandex, Seznam)',
      url: 'https://api.indexnow.org/indexnow',
      method: 'POST',
      body: {
        host: new URL(process.env.NEXT_PUBLIC_URL || 'https://www.myerasediting.com').hostname,
        key: process.env.INDEXNOW_KEY || 'default-key',
        keyLocation: `${process.env.NEXT_PUBLIC_URL}/${process.env.INDEXNOW_KEY}.txt`,
        urlList: [sitemapUrl],
      },
    },
  ];

  for (const engine of searchEngines) {
    try {
      const options: RequestInit = {
        method: engine.method || 'GET',
        headers: {
          'User-Agent': 'MyERAS-Sitemap-Ping/1.0',
        },
      };

      if (engine.body) {
        options.method = 'POST';
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json',
        };
        options.body = JSON.stringify(engine.body);
      }

      const response = await fetch(engine.url, options);

      results.push({
        engine: engine.name,
        success: response.ok,
        status: response.status,
      });

      console.log(`✓ Pinged ${engine.name}: Status ${response.status}`);
    } catch (error) {
      console.error(`Failed to ping ${engine.name}:`, error);
      results.push({
        engine: engine.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Small delay between pings
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

// Submit specific URL to search engines
export async function submitUrlToSearchEngines(url: string) {
  const results = [];

  // Bing URL Submission API
  if (process.env.BING_WEBMASTER_API_KEY) {
    try {
      const response = await fetch('https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.BING_WEBMASTER_API_KEY,
        },
        body: JSON.stringify({
          siteUrl: process.env.NEXT_PUBLIC_URL,
          url: url,
        }),
      });

      results.push({
        engine: 'Bing URL Submission',
        success: response.ok,
        status: response.status,
      });

      console.log(`✓ Submitted to Bing: ${url}`);
    } catch (error) {
      console.error('Bing URL submission failed:', error);
      results.push({
        engine: 'Bing URL Submission',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // IndexNow for instant indexing
  if (process.env.INDEXNOW_KEY) {
    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: new URL(process.env.NEXT_PUBLIC_URL || 'https://www.myerasediting.com').hostname,
          key: process.env.INDEXNOW_KEY,
          keyLocation: `${process.env.NEXT_PUBLIC_URL}/${process.env.INDEXNOW_KEY}.txt`,
          urlList: [url],
        }),
      });

      results.push({
        engine: 'IndexNow',
        success: response.ok,
        status: response.status,
      });

      console.log(`✓ Submitted to IndexNow: ${url}`);
    } catch (error) {
      console.error('IndexNow submission failed:', error);
      results.push({
        engine: 'IndexNow',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}