if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,t)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const u=e=>i(e,n),r={module:{uri:n},exports:c,require:u};s[n]=Promise.all(a.map((e=>r[e]||u(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"fb3dd23a2ee23a2807134e78dac549f1"},{url:"/_next/static/XtqbPajxUlKY4Yi2uuDR6/_buildManifest.js",revision:"ac29389be4d46bf6873204bdd667fff8"},{url:"/_next/static/XtqbPajxUlKY4Yi2uuDR6/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1319-ef5d42082e6ed853.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/1345-97d4b83cb3025337.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/1381-09fed9f340894126.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/1517-a0a66cb99f8e0658.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/1578.46db8420e5dfc24e.js",revision:"46db8420e5dfc24e"},{url:"/_next/static/chunks/1604-6c2c24c3436041f8.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/1627-a0b0725c728b405d.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/1688.0e3e3720d18105d2.js",revision:"0e3e3720d18105d2"},{url:"/_next/static/chunks/174-022a637e7c074f74.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/1868-886fe7eb87f6e480.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/2228-b5804caa39d109a7.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/2942-156e6041be40b643.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/3265-567ead503a43364c.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/3310-a6dfc51010f440fb.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/3565.26c5e0cd75f7a8eb.js",revision:"26c5e0cd75f7a8eb"},{url:"/_next/static/chunks/4604-b50c28d131f56a57.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/4bd1b696-fa4ecafd305cc36a.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/5203.f4b97ab553880bca.js",revision:"f4b97ab553880bca"},{url:"/_next/static/chunks/5539.b8bc749bd7094ebe.js",revision:"b8bc749bd7094ebe"},{url:"/_next/static/chunks/6218.ba8ff6176d4fd6f6.js",revision:"ba8ff6176d4fd6f6"},{url:"/_next/static/chunks/6418-c254db0f7024ee1b.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/6529.c51c38c9219748ff.js",revision:"c51c38c9219748ff"},{url:"/_next/static/chunks/6966-577765e21e0afa80.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/7076-2dcc1674d56803d7.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/7254-dba66953a4b5d8a3.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/7859.2ec45a79d6a93255.js",revision:"2ec45a79d6a93255"},{url:"/_next/static/chunks/814-299303a1c4ece310.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/8173-7bde1f77b191b8ff.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/8438-29bd2f8185c818e8.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/8653-49e8a55ee4e32387.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/8880-30ba0dbc3fa749ad.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/9847-3f6bd647cf4eb802.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/9870-a2fbb13788ee8609.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/edit/loading-b3a591c30f2d5215.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/edit/page-06d271ab83eaa8ca.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/loading-7f2f4b25fc711bee.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/page-57bc653524b93284.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/saved/loading-d14d85eb5c24398d.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/saved/page-63ea9aedeb81a460.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/tagged/loading-9b0280bf2d055069.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/%5Busername%5D/tagged/page-a45bd34430fc504e.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/_not-found/page-bad67c71b798c6a9.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/add-story/loading-be0cc24f4e739707.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/add-story/page-4ddc545dfc909442.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-d161a81b0f53f931.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/create-post/loading-08a018d18b378702.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/create-post/page-bde1d192fec97783.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/inbox/%5Bid%5D/loading-280f2dc8a97041e6.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/inbox/%5Bid%5D/page-9fe62811a0dcba00.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/inbox/loading-d02e9090781d5f0f.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/inbox/page-6beaf9f6f61009f8.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/layout-78c190822f37cb94.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/loading-69161216999c1a24.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/login/loading-e9530d7df1104676.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/login/page-4219ef86bf8b1d82.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/not-found-62ff2600d7b32e2d.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/notifications/loading-25011697caeebc62.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/notifications/page-6c4ba128101e4940.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/p/%5Bpostid%5D/delete/page-709b5ccf93c4f7cf.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/p/%5Bpostid%5D/page-617e129b8bd3cae4.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/p/%5Bpostid%5D/update/page-33703a65b1de5602.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/page-85510ac9ea333095.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/search/loading-7c7b0810dd63b5dd.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/search/page-22184d54d217861d.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/signup/loading-6e2ee02f402ae3f1.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/signup/page-89808e542c799318.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/stories/loading-5c4d39e6a66ce7e8.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/app/stories/page-9b57432bbb562faa.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/framework-28674b8561f5ef2a.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/main-0e111e01f26bcb1a.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/main-app-8f09d05fb5bffb48.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/pages/_app-f9efafe803d2ac1c.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/pages/_error-a48838824b14e25a.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-ed259c37587242b0.js",revision:"XtqbPajxUlKY4Yi2uuDR6"},{url:"/_next/static/css/eff3253ccdad266f.css",revision:"eff3253ccdad266f"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/icons/logo-128.png",revision:"661cd57ee3862df9871e417a6762a43e"},{url:"/icons/logo-144.png",revision:"fef5d644d82126ca172815d9213e64d7"},{url:"/icons/logo-152.png",revision:"4dc39b656d1f8b2c87b1062d8871d595"},{url:"/icons/logo-16.png",revision:"0f371af4961071c872e940352fc74b0d"},{url:"/icons/logo-180.png",revision:"7830d5e3b78915bff3c520bb8b373b34"},{url:"/icons/logo-192.png",revision:"239f3703b6b726832564306e977c36a9"},{url:"/icons/logo-256.png",revision:"be6d06331035ce74d7e3851592838a48"},{url:"/icons/logo-48.png",revision:"50a15fcde006a926b01e1d2308f4fd17"},{url:"/icons/logo-512.png",revision:"bc425c155afa7178f8939858b5fcc558"},{url:"/icons/logo-64.png",revision:"5d53425680d3bc351241a1fcc04ed47a"},{url:"/icons/logo-72.png",revision:"f4ed8ffe92a4cecbc2575a5c5372c0fb"},{url:"/icons/logo-96.png",revision:"8d8547b9c9b492ba19cce3518be76443"},{url:"/manifest.json",revision:"ab83d4f75dced12d435ef47c6b64d497"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
