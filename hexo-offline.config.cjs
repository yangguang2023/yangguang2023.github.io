// offline config passed to workbox-build.
module.exports = {
    globPatterns: ['**/*.{js,html,css,png,jpg,gif,svg,webp,eot,ttf,woff,woff2}'],
    // 靜態文件合集，如果你的站點使用了例如 webp 格式的文件，請將文件類型添加進去。
    globDirectory: 'public',
    swDest: 'public/service-worker.js',
    maximumFileSizeToCacheInBytes: 10485760, // 緩存的最大文件大小，以字節為單位。
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      // 本地搜索文件缓存策略 - 使用旧缓存同时更新
      {
        urlPattern: /.*\/search\.json/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'search-cache',
          expiration: {
            maxAgeSeconds: 86400 * 7 // 缓存保留一周
          }
        }
      },
      // Vercel相关资源缓存配置
      {
        urlPattern: /^https:\/\/www\.zhonmiaozhimen\.cn\/.*/, 
        handler: 'NetworkFirst'
      },
      // 阿里图标字体库
      {
        urlPattern: /^https:\/\/at\.alicdn\.com\/.*/, 
        handler: 'CacheFirst'
      }
    ]
  }
  