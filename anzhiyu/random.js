var posts=["2025/01/05/hello-world/","2025/01/05/第一篇博客/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };