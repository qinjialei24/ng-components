# form 表单组件
## 注意事项

::: warning
使用前必须在全局( index.html)引入拷组件库的辅助函数,代码如下：
```js
  var _c = { // 组件的辅助函数
  message: function (options, $scope, $compile) {//实现elementUI类似 this.$message('这是一条消息提示');   这样调用组件 
    var hint = options.hint || '提示信息'
    var type = options.type || 'fail' // success fail 
    var wait = options.wait || 3000 //单位 秒
    var str = "<ng-message type='" + type + "'>" + hint + "</ng-message >"
    var html = $compile(str)($scope);
    var dom = document.createElement('div')
    document.body.appendChild(dom)
    dom.appendChild(html[0])
    setTimeout(function () {
      document.body.removeChild(dom)
    }, wait);
  },
   // 优化:使用ref获取组件实例代替广播
  validateForm: function ($scope) {//触发表单验证 
    $scope.$broadcast('ng_form-item:validate')//通知每个 form-item 验证 
    $scope.$broadcast('ng_form:validate')//通知 form 验证，若每个子 form-item 的 pass 都为 true，则验证都为 true，反之为 false
  },
  /**
   *
   *传入自己， 和需要找到的父组件的组件名，输出父组件实例
   * @param {{}} selfScope
   * @param {string} componentName
   * @returns 父组件实例
   */
  findParentByComponentName: function (selfScope, componentName) {
    if (selfScope.$parent.componentName == componentName) return selfScope.$parent
    else return _c.findParentByComponentName(selfScope.$parent, componentName)
  },
}
```
:::

## 源码 分为两部份
- form
- form-item

### form 源码
``` html
<div class='ng_form'>
  <div ng-transclude></div>
</div>
```

```js
var DEFAULT = {
  COMPONENT_NAME: 'ng_form',//用于递归查找组件
  LABEL_WIDTH: '100px',
  LABEL_POSITION: 'right',
}

app.directive('ngForm', function () {
  return {
    restrict: 'E',
    templateUrl: '',//这里换成你自己的 templateUrl
    transclude: true,
    scope: {
      labelWidth: '@',
      inline: '=?',//是否一行显示
      labelPosition: '@',
      model: '=',//存放表单数据的对象
      success: '&'//若表单验证通过 则执行回调 ，&代表传递函数
    },
    link: function (scope, element, attrs) {
    },

    controller: function ($scope, $element, $attrs, $parse) {


      $scope.init = function () { //设置默认值
        $scope.componentName = DEFAULT.COMPONENT_NAME
        $scope.labelWidth = $scope.labelWidth || DEFAULT.LABEL_WIDTH
        $scope.labelPosition = $scope.labelPosition || DEFAULT.LABEL_POSITION
        $scope.model = $scope.model || {}
        $scope.validateResult = {}//每个子 form-item 的验证结果  key 为 form-item的 prop，value 为验证结果 true or false 
      }


      $scope.$on('ng_form:validate', function () {
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

      $scope.init()

    }
  }
})
```



### form-item 源码
```html
<div class="ng_form-item"
     ng-style='{"display": inline ? "inline-block" : "block"}'>
  <div>
    <div class="ng_form-item_label"
         ng-style='{"width":labelWidth,"justify-content": labelPosition === "left" ? "flex-start" : "flex-end" }'>
      <span ng-show='required'
            style="color:red;">*</span>
      <span>{{label}}</span>
    </div>
    <div class="ng_form-item_content">
      <div class="ng_form-item_content_core"
           ng-transclude></div>
      <div ng-if='!pass'
           class="ng_form-item_content_error">{{label}}必填！</div>
    </div>
  </div>

</div>

```

```js
var SYNC_FIELDS = ['labelWidth', 'labelPosition', 'model', 'inline']//同步父组件的 scope 对象到 form-item 的 scope 内
app.directive('ngFormItem', function () {
  return {
    restrict: 'E',
    templateUrl: '',
    transclude: true,
    scope: {
      trigger: '@',//change 值改变时验证
      label: '@',
      prop: '@',
      required: '=?',
    },
    link: function (scope, element, attrs) {
      
      scope.componentName = 'ng_form-item'//用于递归查找组件
      scope.required = scope.required === undefined ? false : scope.required//设置默认值
    },
    controller: function ($scope, $element, $attrs, $parse) {
      
      $scope.formModel = {}
      $scope.labelWidth = '120px'
      $scope.pass = true//是否验证通过 true为通过

      $scope.updateFormModel = function () {//将ng-form的表单对象同步到组件内
        var parent = _c.findParentByComponentName($scope, 'ng_form')
        $scope.formModel = parent.model
      }

      $scope.syncWithParentScope = function () {//同步父组件的 scope 数据
        var parent = _c.findParentByComponentName($scope, 'ng_form')
        _.forEach(function (field) {
          $scope[field] = parent[field]
        }, SYNC_FIELDS)
      }

      $scope.validate = function () {
        if ($scope.required) {
          var value = $scope.formModel[$scope.prop]
          var noPass = value === '' || value === undefined//验证不通过的条件
          if (noPass) $scope.pass = false
          else $scope.pass = true
        } else {
          $scope.pass = true
        }
        var parent = _c.findParentByComponentName($scope, 'ng_form')
        parent.validateResult[$scope.prop] = $scope.pass
      }
      $scope.$on('ng_form-item:validate', function () {
        $scope.updateFormModel()
        $scope.validate() //通过 则设置 pass 为true ，标识此 form-item 验证通过
      })

      $scope.syncWithParentScope()

    }
  }
})

```

```css
ng_form-item {
  margin: 10px;
  color: red;
}

ng_form-item_label {
  height: 60px;
  border: 1px solid red;
  line-height: 60px;
  display: inline-block !important;
  margin-right: 10px;
  margin-bottom: 10px;
}

ng_form-item_content {
  height: 60px;
  line-height: 60px;
  display: inline-block;
}

ng_form-item_content_core input {
  width: 200px;
  height: 40px;
  background: none;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  outline: none;
}

ng_form-item_content_core input[disabled] {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

ng_form-item_content_core select {
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  outline: none;
  cursor: pointer;
  width: 200px;
  height: 40px;
  background: none;
  padding-left: 10px;
  line-height: 40px;
}

ng_form-item_content_core select[disabled] {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

ng_form-item_content_error {
  position: absolute;
  line-height: 4px;
  color: #f56c6c;
  font-size: 12px;
}
```


## 使用

```html
  <ba-form model='myForm'
               inline='true'
               success='success()'
               label-width='100px'>
          <ba-form-item label='门店注册账号' required='true' prop='username'>
            <input ng-model='myForm.username'>
          </ba-form-item>

          <ba-form-item label='门店名称' prop='shopName'>
            <input ng-model='myForm.shopName'>
          </ba-form-item>

          <ba-form-item label='门店编号' prop='shopId'>
            <input ng-model='myForm.shopId'>
          </ba-form-item>
    </ba-form>

    <button ng-click='onSubmit()'>触发表单验证</button>
```

```js
var sc = $scope

sc.myForm={
 username:'',
 shopName:'',
 shopId:'',
}

  sc.onSubmit = function () {
    _c.validateForm()//-c 为全局引入的组件的辅助函数 
  }

  sc.success = function () {//目前的表单验证只实现了简单的必填、选填验证
   alert('验证成功的回调函数')
  }



```





## form API


| 参数     | 说明          | 类型   | 默认值        |
| -------- | ------------- | ------ | ------------- | ------------- |
| labelWidth     | 表单域标签的宽度      | string |100px |
| inline     | 是否一行显示  | string | false            |
| labelPosition     | 表单域标签的宽度,可选值为 `left` 、`right`  | string | right             |
| model   | 存放表单数据的对象   | object | -             |
|success | 表单验证通过执行的回调函数 | function | -             |


## form-item API
| 参数     | 说明          | 类型   | 默认值        |
| -------- | ------------- | ------ | ------------- | ------------- |
| label     | 表单域标签名称      | string |- |
| prop     | 表单域 model 字段，在需要进行必填选填验证的情况下，该属性是必填的  | string | -             |
| required     | 是否是必填项 | boolean | false             |