// 底层Model模型
APP.database = (function(){
  // ES5的严格模式
  "use strict"; 

  var smallDatabase;
  // 执行数据库对表的各种操作的函数
  // 参数：sql语句， data数据， 成功后的回调函数
  function runQuery(query, data, successCallback) {
    var i, l, remaining;
    // 如果data参数的第一个元素不是数组，那么将其变为一个数组
    if (!(data[0] instanceof Array)) {
      data = [data];
    }
    remaining = data.length; //获取数组长度
    // tx是transaction中传递过来的事务处理对象，rs是执行的结果
    function innerSuccessCallback(tx, rs) {
      var i, l, output = [];
      remaining = remaining - 1;
      // remaining等于0的时候执行
      if (!remaining) {
        // 把执行后（插入某一个数据或查询某一个数据）的结果封装成数组，HACK Convert row object to an array to make our lives easier。
        for (i = 0, l = rs.rows.length; i < l; i++ ) {
          output.push(rs.rows.item(i));
        }
        // 执行带参数的回调函数
        if (successCallback) {
          successCallback(output);
        }
      }
    }

    function errorCallback (tx, e) {
      console.error('An error ahs accurred', e);
    }

    // 如果查询两个文章的时候，执行两次查询表的操作，tx是transaction中传递过来的事务处理对象。
    smallDatabase.transaction(function(tx){
      for(i=0, l=data.length; i<l; i++) {
        tx.executeSql(query, data[i], innerSuccessCallback, errorCallback);
      }
    });
  }

  // 创建一个本地数据库
  function open(successCallback) {
    smallDatabase = openDatabase("APP", "1.0", "Not The FT Web App", (5*1024*1024));
    // 创建一个表，如果它不存在，该表有id(表的逐渐从小都大的顺序排列)，表名是articles
    // data(时间戳格式)、author（文件格式），headline（文本格式），body（文本格式）。
    runQuery("CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY ASC, date TIMESTAMP, author TEXT, headline TEXT, body TEXT)", [], successCallback);
  }

  return {
    open,
    runQuery,
  }
}());