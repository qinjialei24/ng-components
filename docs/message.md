# message 提示信息

## [在线运行](https://codepen.io/leeesin/pen/vMZydq?editors=1111)
## 源码

``` js
app.directive("ngMessage", function ($compile) {
  return {
    restrict: 'E',
    template: '<div class="ng_message">' +
    ' <div ng-class="setStyle()"'+
    'ng-transclude></div></div>',

    transclude: true,
    scope: {
      type: '@'
    },

    controller: function ($scope, $element, $attrs, $parse) {
      $scope.setStyle = function () {
        return 'ng_message-core ng_message-core--' + $scope.type
      }
    }
  };
});
```

```css
.ng_message {
  width: 100%;
  text-align: center;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  position: fixed;
  top: 20px;
  z-index: 11021;
}

.ng_message-core {
  border-radius: 5px;
  vertical-align: top;
  color: #fff;
  display: inline-block;
  padding-left: 20px;
  padding-right: 20px;
  height: 100%;
  animation: move 0.25s forwards;
  &--success {
    background-color: #4fc08d;
  }
  &--fail {
    background-color: #ff5252;
  }
}

@keyframes move {
  from {
    margin-top: -36px;
  }
  to {
    margin-top: 20px;
  }
}
```

## API
通过直接调用以下方法来使用组件：
```js

 app.controller('', function ($scope, $compile) {

    $scope.hint = function () {
      _c.message(
        {
          wait: '2000',
          hint: '提示信息',
          type: 'fail'
        },
        $scope,
        $compile
      )
    }



  })

```



| 参数     | 说明          | 类型   | 默认值        |
| -------- | ------------- | ------ | ------------- | ------------- |
| wait     | 消失时间      | string | 2000(单位 ms) |
| hint     | 提示信息内容  | string | -             |
| type     | 提示信息类型,可选值为 `success` 、`fail`  或者不设置 | string | success             |
| $scope   | 页面 $scope   | object | -             |
| $compile | 页面 $compile | object | -             |



