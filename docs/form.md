# form 表单组件

## 源码

### html
``` html
<div class='ng_form'>
  <div ng-transclude></div>
</div>
```



### js
```js

var ngForm = angular.module("ngForm", []);
ngForm.directive("ngForm", function ($compile, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'components/basic/form/form.html',
    transclude: true,
    scope: {
      labelWidth: '@',
      inline:'=?',//是否一行显示
      labelPosition: '@',
      model: '=?',//存放表单数据的对象
      success: '&'//若表单验证通过 则执行回调 ，&代表传递函数
    },
    link: function (scope, element, attrs) {
      scope.componentName = 'ba-form'//用于递归查找组件
      scope.labelWidth = scope.labelWidth || '50px'
      scope.labelPosition = scope.labelPosition || 'right'
      scope.model = scope.model || {}
    },
    controller: function ($scope, $element, $attrs, $parse) {
      $scope.validateResult = {}//每个子 form-item 的验证结果  key 为form-item的 prop，value 为验证结果 true or false 

      $scope.$on('ba-form:validate', function () {
        $scope.validate()
      })

      $scope.validate = function () {//若每个子 form-item 的 pass 都为 true，则验证都为 true，反之为 false
        for (var key in $scope.validateResult) {
          if ($scope.validateResult.hasOwnProperty(key)) {
            var value = $scope.validateResult[key];
            if (!value) return
          }
        }
        $scope.success()
      }
    }
  }
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
      //这里组件做了特殊处理，所访问的方法（test）、变量（map）都是指向页面
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
### pageScope (页面所在作用域)
例如：
```js
app.controller('', function ($scope) {
  $scope.pageScope=$scope//将此变量 pageScope 传入组件
}

```