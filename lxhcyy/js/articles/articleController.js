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
      url: '/lxhcyy/api/articles.json',
      success(res) {
        console.log(res, 'res');
        APP.article.deleteArticles(function() {
          APP.article.insertAritcles(res?.data, function() {
            $('#headlines').html(APP.templates.articleList(res?.data));
          });
        });
      },
      error(res){
        const str = res.responseText;
        const item = str.split('[')[1].split('},').join('').split('{');
        const mapData =  (item || []).filter(item => item).map((item) => {
          const idS = item.search(/id/) + 5;
          const idE = item.substring(idS).search(/,/);
          const id = item.substring(idS, idS+idE);
          const authorS = item.search(/author/) + 10;
          const authorE = item.substring(authorS).search(/,/) - 1;
          const author = item.substring(authorS, authorS+authorE);
          const dateS = item.search(/date/) + 8;
          const dateE = item.substring(dateS).search(/,/) - 1;
          const date = item.substring(dateS, dateS+dateE);
          const bodyS = item.search(/body/) + 8;
          const bodyE = item.substring(bodyS).search(/,/) - 1;
          const body = item.substring(bodyS, bodyS+bodyE);
          const headlinesS = item.search(/headlines/) + 13;
          const headlinesE = item.substring(headlinesS).search(/,/) - 1;
          const headlines = item.substring(headlinesS, headlinesS+headlinesE);
          return {
            id,
            author,
            date,
            headlines,
            body
          };
        });
        console.log('mapData', mapData);

        // 因为我们现在访问的是json文件，所以ajax会失败，则以下：
        APP.article.deleteArticles(function() {
          APP.article.insertAritcles(mapData, function() {
            $('#headlines').html(APP.templates.articleList(mapData));
          });
        });
        // 正常如果是http请求，则以下：
        // if (failureCallback) {
        //   failureCallback();
        // }
      }
    });
  }

  return {
    synchronizeWithServer,
    showArticleList,
    showArticle,
  };
}());