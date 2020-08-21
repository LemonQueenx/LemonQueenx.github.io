APP.templates = (function(){
  "use strict";

  // 创建头标题
  function application () {
    return '<div id="window"><div id="header"><h1>FT Tech Blog</h1></div><div id="body"></div></div>';
  }

  // 创建主页内容的刷新按钮和文章内容主体区（包含文章的区域）
  function home () {
    return '<button id="refreshButton">刷新新闻</button><div id="headlines"></div></div>';
  }

  function articleList (articles) {
    var i, l, output='';
    if (!articles.length) {
      return '<p><i>No articles have been found, maybe you have\'t <b>refreshed the news</b>?</i></p>';
    }
    for (i=0, l=articles.length; i<l; i++) {
      output = `${output}<li><h2><a href="#${articles[i].id}">${articles[i].headline}</a></h2><p class="byline">作者：<strong>${articles[i].author}</strong>，发表日期：${articles[i].date}</p></li>`;
    }
    return `<ul>${output}</ul>`;
  }

  // 根据某个文章特定的标准（也就是#锚点后的内容），在总的文章列表中选取
  function article (articles) {
    // if the data is not in the right form, redirect to an error.
    if (!articles[0]) {
      window.location = '#error';
    }
    return `<a href="#">回到首页</a><h2>${articles[0].headline}</h2><h3>作者： ${articles[0].author}， 发表日期：${articles[0].date}</h3>${articles[0].body}`;
  }

  // 显示文章加载（显示某个特定文章前，调用这个函数）
  function articleLoading(){
    return '<a href="#">回到首页</a><br /><br />Please wait';
  }

  return  {
    application,
    home,
    articleList,
    article,
    articleLoading,
  };
}());