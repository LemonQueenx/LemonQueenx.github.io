离线缓存应用
# 实现流程
1. 创建一个本地数据库 & 建表
smallDatabase = openDatabase("APP", "1.0", "Not The FT Web App", (5*1024*1024));

smallDatabase.transaction(function(tx){
	for(i=0, l=data.length; i<l; i++) {
		tx.executeSql(query, data[i], innerSuccessCallback, errorCallback);
	}
});

2. 显示逻辑
建库建表后，绑定hashChange事件，加载主体结构（主标题和#body标签），移除loading。
> 绑定hashChange事件
> 1）!hash，装载页面，查询数据，显示文章列表，设置刷新功能。
> 调用template.home将刷新按钮和headlines标签装载在#body标签中，调用articlesController.showArticleList在表中找到所有的id，headline，author，date，成功后调用templates.articleList显示在headline中。
> 点击刷新按钮，如果在线，请求接口（articleController.synchronizeWithServer），删除旧数据（article.deleteArticles）把返回来的新数据插入表中（article.insertAritcles），成功后更新首页文章列表（templates.articleList）。如果离线，则给出提示（offlineWarning），不刷新数据。
> 
> 2）如果hash && hash>0,则显示对应的文章详情。
>   articlesController.showArticle(id) -> article.selectFullArticles -> database.runQuery("SELECT id, headline, date, author, body FROM articles WHERE id=?"...) -> #body templates.article(article)
> 
> 3） 如果hash && hash>0,则提示未找到相应的页面(pageNotFound)。

# SQL 语句
CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY ASC, date TIMESTAMP, author TEXT, headline TEXT, body TEXT)
DELETE FROM ARTICLES
INSERT INTO articles (id, date, headline, author, body) VALUES (?, ?, ?, ?, ?)
SELECT id, headline, date, author, body FROM articles WHERE id=?
DROP TABLE articles