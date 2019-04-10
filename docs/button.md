## 源码
```js
 app.directive("ngButton", function ($compile, $timeout) {
    return {
      transclude: true,
      replace: true,
      restrict: 'E',
      template: '<div class="ng_button ripple" ng-class="setStyle(type)"><span ng-transclude></span></div>',//这里需要替换成你自己项目的模板位置
      scope: {
        type: '@',//primary success danger
        disabled: '=?'//是否禁用
      },
      controller: function ($scope, $element, $attrs, $parse) {
        $scope.type = $scope.type || 'primary'
        $scope.disabled = $scope.disabled || false

        $scope.setStyle = function (type) {
          var disabled = $scope.disabled ? 'disabled' : ''
          return 'ng_button--' + type + ' ' + disabled
        }

      }
    }
  })
```
```css
.ng_button {
  width: 90px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 2px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-block;
  margin: 10px;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), color 1ms;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none; }
  .ng_button.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.6; }
  .ng_button:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3); }
  .ng_button--primary {
    background-color: #409eff;
    border-color: #409eff; }
  .ng_button--success {
    background-color: #4fc08d;
    border-color: #4fc08d; }
  .ng_button--danger {
    background-color: #ff5252;
    border-color: #ff5252; }

.ripple {
  position: relative;
  overflow: hidden; }

.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  -webkit-transform: scale(10, 10);
          transform: scale(10, 10);
  opacity: 0;
  transition: opacity .5s, -webkit-transform .5s;
  transition: transform .5s, opacity .5s;
  transition: transform .5s, opacity .5s, -webkit-transform .5s; }

.ripple:active:after {
  -webkit-transform: scale(0, 0);
          transform: scale(0, 0);
  opacity: .3;
  transition: 0s; }

```


## 使用
```html
    <ng-button>primary</ng-button>
    <ng-button type='danger'>danger</ng-button>
    <ng-button type='success'>success</ng-button>
    <ng-button type='danger' disabled='disabled'>禁用</ng-button>
```

```js
app.controller('', function ($scope) {
    $scope.disabled = 'true'
}
```
## API

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |------|------ |
| type   | 按钮类型，可选值为 `primary`、`success`、`danger`或者不设置| string | primary |
| disabled | 是否禁用   | boolean | false | 




