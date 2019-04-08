# table 表格组件

## 源码

### html
``` html
<div class="ba_table">
</div>
```

### js
```js

var baTable = angular.module("baTable", []);
baTable.directive("baTable", function ($compile, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'components/basic/table/table.html',//这里需要替换成你自己项目的模板位置
    transclude: true,
    scope: {
      options: '=',
      parentScope: '='
    },

    link: function (scope, element, attrs, ctrl) { },

    controller: function ($scope, $element, $attrs, $parse, $compile) {
      var sc = $scope;

      sc.getTheadHtml = function () {//获取表头的标题的 html 字符串
        return sc.options.reduce(function (pre, cur) {
          return pre + '<th>' + cur.label + '</th>'
        }, '')
      }

      sc.getTbodyHtml = function () {//获取tbody的标题的 html 字符串
        return sc.options.reduce(function (pre, cur) {
          return cur.template ? pre + '<td>' + cur.template + '</td>' : pre + '<td>{{item.' + cur.prop + '}}</td>'
        }, '')
      }

      sc.getTemplate = function () {
        var thead = sc.getTheadHtml()
        var tbody = sc.getTbodyHtml()
        var empty = '<tr ng-show="tableData.length==0"><td colspan="7" class="text-center empty-data-td">暂无数据</td> </tr>'
        var h = '<div><table class="table table-striped"><thead><tr>' + thead + '<tr></thead>'
        var b = '<tbody>' + empty + ' <tr ng-repeat="item in tableData" ng-show="tableData.length!=0">' + tbody + '</tr> </tbody> </table> </div>'
        var template = h + b;
        return template
      }

      sc.renderTable = function (template) {
        console.log('template 的值是：', template);
        $element.append($compile(template)(sc.parentScope))
      }

      sc.renderTable(sc.getTemplate())

    }
  };
});
```

## API
###  options (表格每列的配置项)
例如:
```js
$scope.options = [
    {
      label: '名称',
      prop: 'name',
      template: '<h1 style="color:red" ng-click="test(item.status)">{{map[item.status]}}</h1>'
    },
    {
      label: '年龄',
      prop: 'age',
    },
    {
      label: '地址',
      prop: 'address',
    },
  ]
```
### parentScope (页面所在作用域)