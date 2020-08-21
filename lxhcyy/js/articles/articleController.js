APP.articlesController = (function(){
  "use strict";

  // 通过Model层，从本地数据库选取所有的文章数据
  // 通过view层，调用显示所有文章的功能
  function showArticleList() {
    APP.article.selectBasicArticles(function(articles){
      $('#headlines').html(APP.templates.articleList(articles));
    });
  }

  // 通过Modal层选取某个特定的文章，成功后通过view层调用显示文章的功能
  function showArticle(id) {
    APP.article.selectFullArticles(id, function(article){
      $('#body').html(APP.templates.article(article));
    })
  }

  // 访问后台获取文章数据
  // 调用Model层的删除所有文章的功能后插入新的文章数据，之后通过调用显示所有与文章的功能来显示文章
  // Instead of the line below we *colud* just run showArticleList() but since we already have the articles in scope we needn't make anothor call to the database and instead just render the articles straight away.
  function synchronizeWithServer(failureCallback) {
    $.ajax({
      dataType: 'json',
      type: 'GET',
      url: 'http://gz-cvm-ebuild-ningzhang-dev001.gz.sftcwl.com:7300/mock/5f3e70c6879510406f5b732c/oca/articles',
      success(res) {
        APP.article.deleteArticles(function() {
          APP.article.insertAritcles(res?.data, function() {
            $('#headlines').html(APP.templates.articleList(res?.data));
          });
        });
      },
      error(){
        if (failureCallback) {
          failureCallback();
        }
      }
    });
  }

  return {
    synchronizeWithServer,
    showArticleList,
    showArticle,
  };
}());