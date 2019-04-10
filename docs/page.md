# page 分页器

## 源码
``` js
var helper = {
  unique: function (array) {
    var res = {}
    var temp = []

    for (var i = 0; i < array.length; i++) {
      var val = array[i]
      res[val] = true
    }

    for (var key in res) {
      if (res.hasOwnProperty(key)) {
        temp.push(Number(key))
      }
    }
    return temp
  }
}


app.directive("ngPage", function ($compile, $timeout) {
  return {
    restrict: 'E',
    template: '<div class="ng_page" ng-show="total!=0">'+ "<span class='ng_page-item' ng-class='{disabled:current==1}' ng-click='reduce()'> <  </span> "  +
    " <span ng-repeat='item in pages track by $index '  class='ng_page-item' ng-class='{active:item==current}' ng-click='onPageChange(item)'>  {{item}} </span>   "+
    '<span class="ng_page-item" ng-class="{disabled:current==totalPages}" ng-click="add()"> > </span>  </div>     ',

    replace: true,
    scope: {
      total: '@',//数据总数
      current: '@',//当前页码
      size: '@?',//每页条数
      change: '&'//&代表传递函数 页码改变触发该函数 
    },

    link: function (scope, element, attrs, ctrl) {
    },

    controller: function ($scope, $element, $attrs, $parse) {
      var sc = $scope

      sc.total = Number(sc.total)
      sc.current = Number(sc.current)
      sc.size = Number(sc.size) || 20//默认20
      sc.pages = []//所有页数
      sc.totalPages = 0,//总页数

        sc.onPageChange = function (page) {
          if (page == '...') return
          sc.current = page
          sc.change({ currentPage: page })//执行页面传入的方法 并传参时 必须这么写 ，而且使用的页面传递的函数参数 必须叫 currentPage
          sc.getPages()
        }

      sc.reduce = function () {
        var c = Number(sc.current)
        if (c === 1) return
        sc.onPageChange(c - 1)
      }

      sc.add = function () {
        var c = Number(sc.current)
        if (c === sc.totalPages) return
        sc.onPageChange(c + 1)
      }
      sc.getPages = function () {
        sc.current = Number(sc.current)
        sc.totalPages = Math.ceil(sc.total / sc.size)//总共多少页
        sc.pages = [1, sc.current - 2, sc.current - 1, sc.current, sc.current + 1, sc.current + 2, sc.totalPages]
        sc.pages = sc.pages.filter(function (item) { return item >= 1 && item <= sc.totalPages }, )
        sc.pages = helper.unique(sc.pages)

        sc.pages = sc.pages.reduce(function (pre, cur, i) {
          var hasGap = sc.pages[i + 1] - sc.pages[i] > 1//是否加入省略号 '...'
          pre.push(cur)
          hasGap && pre.push('...')
          return pre
        }, [])
      }
      sc.$watch('total', sc.getPages)
    }
  };
});





```

```css
.ng_page-item {
  display: inline-block;
  vertical-align: middle;
  min-width: 32px;
  height: 32px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  background-color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  font-family: Arial;
  font-weight: 500;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  transition: border .2s ease-in-out, color .2s ease-in-out; }
  .ng_page-item.active {
    border: 1px solid #2d8cf0; }
  .ng_page-item.disabled {
    cursor: not-allowed;
    background: #dcdee2; }
    .ng_page-item.disabled:hover {
      border: 1px solid #dcdee2; }
  .ng_page-item:hover {
    border: 1px solid #2d8cf0; }


```

## API

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |------|------  |
| total   | 数据总数 | number | 0      |
| current | 当前页码   | number | 1     |
| size | 每页条数   | number | 1     |
| change | 页码改变触发该函数    | function | -     |

## 使用

```html


```


```js
app.controller('', function ($scope) {
```

## 注意事项

::: warning
1
:::


