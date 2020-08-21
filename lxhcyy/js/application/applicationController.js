// 匿名函数自执行的方式，最后返回一个对象
APP.applicationController = (function () {
  "use strict";

  function offlineWarning () {
    alert('This feature is only awailable online.');
  }

  function pageNotFound () {
    alert('That page you were looking for cannot be found.');
  }

  function showHome () {
    $('#body').html(APP.templates.home());
    APP.articlesController.showArticleList();
    $('#refreshButton').click(function(){
      if (navigator && navigator.online === false) {
        offlineWarning();
      } else {
        APP.articlesController.synchronizeWithServer(offlineWarning);
      }
    });
  }

  function showArticle (id) {
    APP.articlesController.showArticle(id);
  }

  function route () {
    var page = window.location.hash;
    if (page) {
      page = page.substring(1);
      if (parseInt(page, 10) > 0) {
        showArticle(page);
      } else {
        pageNotFound();
      }
    } else {
      showHome();
    }
  }

  function start () {
    APP.database.open(function () {
      $(window).bind("hashchange", route);
      $("body").html(APP.templates.application());
      $("#loading").remove();
      route();
    });
  }

  return {
    start,
  };
}());