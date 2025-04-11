// offline config passed to workbox-build.
module.exports = {
    // 预缓存所有重要文件，包括搜索相关文件
    globPatterns: [
      '**/*.{js,html,css,png,jpg,gif,svg,webp,eot,ttf,woff,woff2}',
      '**/search.json',
      '**/manifest.json',
      '**/local-search.js'
    ],
    // 靜態文件合集，如果你的站點使用了例如 webp 格式的文件，請將文件類型添加進去。
    globDirectory: 'public',
    swDest: 'public/service-worker.js',
    maximumFileSizeToCacheInBytes: 10485760, // 緩存的最大文件大小，以字節為單位。
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      // 本地搜索文件 - 缓存优先确保离线功能
      {
        urlPattern: /.*search\.json/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'search-json-cache',
          expiration: {
            maxAgeSeconds: 86400 * 7 // 缓存保留一周
          }
        }
      },
      // 搜索JS文件 - 缓存优先确保离线功能
      {
        urlPattern: /.*local-search\.js/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'search-js-cache',
          expiration: {
            maxAgeSeconds: 86400 * 30 // 缓存长期保留
          }
        }
      },
      // manifest文件 - 缓存优先确保离线功能
      {
        urlPattern: /.*manifest\.json/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'manifest-cache',
          expiration: {
            maxAgeSeconds: 86400 * 30 // 缓存长期保留
          }
        }
      },
      // Vercel相关资源缓存配置 - 对主站所有内容应用NetworkFirst策略
      {
        urlPattern: /^https:\/\/www\.zhonmiaozhimen\.cn\/.*/, 
        handler: 'NetworkFirst',
        options: {
          networkTimeoutSeconds: 10, // 网络请求超时时间
          cacheName: 'site-cache',
          expiration: {
            maxAgeSeconds: 86400 * 7
          }
        }
      },
      // 阿里图标字体库
      {
        urlPattern: /^https:\/\/at\.alicdn\.com\/.*/, 
        handler: 'CacheFirst',
        options: {
          cacheName: 'icon-cache',
          expiration: {
            maxAgeSeconds: 86400 * 30
          }
        }
      },
      // 默认回退策略 - 确保任何网络请求在离线状态下都有响应
      {
        urlPattern: /.*/, 
        handler: 'NetworkFirst',
        options: {
          cacheName: 'fallback-cache',
          expiration: {
            maxAgeSeconds: 86400 * 7
          }
        }
      }
    ]
  }
  