APP.article = (function(){
  "use strict";

  // 删除表中所有数据
  function deleteArticles(successCallback) {
    APP.database.runQuery('DELETE FROM ARTICLES', [], successCallback);
  }

  // 辅控制器，从后台获取文章数据后，调用Model层，把数据插入本地数据库
  function insertAritcles(articles, successCallback) {
    var i, l, data = [], remaning = articles.length;
    if (remaning === 0) {
      successCallback();
    }
    // Convert article array of objects  to array of arrays
    for (i=0, l=articles.length; i<l; i++) {
      data[i] = [articles[i].id, articles[i].date, articles[i].headline, articles[i].author, articles[i].body];
    }
    APP.database.runQuery("INSERT INTO articles (id, date, headline, author, body) VALUES (?, ?, ?, ?, ?)", data, successCallback);
  }

  // 主控制器在点击刷新按钮的时候，调用辅控制器，调用Model层（也就是这个函数）获取本地数据库的内容
  function selectBasicArticles(successCallback) {
    APP.database.runQuery('SELECT id, headline, date, author FROM articles', [], successCallback);
  }

  // 查找某个特定的文章数据
  function selectFullArticles(id, successCallback) {
    APP.database.runQuery('SELECT id, headline, date, author, body FROM articles WHERE id=?', [id], successCallback);
  }


  return {
    insertAritcles,
    selectBasicArticles,
    selectFullArticles,
    deleteArticles,
  }
}());