# 快速上手
1. 分别拷贝组件的 `html` 、 `js`、到你自己的`自定义组件内`,
2. 在全局引入拷组件库的辅助函数，代码如下：
3. 使用你自己项目的构建工具,将每个组件的样式文件打包到一个 `css` 文件内，并且在 `index.html` 内引入
```js

  var _c = { // 组件的辅助函数
  message: function (options, $scope, $compile) {//实现elementUI类似 this.$message('这是一条消息提示');   这样调用组件 
    var hint = options.hint || '提示信息'
    var type = options.type || 'fail' // success fail 
    var wait = options.wait || 3000 //单位 秒
    var str = "<ba-message type='" + type + "'>" + hint + "</ba-message >"
    var html = $compile(str)($scope);
    var dom = document.createElement('div')
    document.body.appendChild(dom)
    dom.appendChild(html[0])
    setTimeout(function () {//todo 使用单例模式提升性能
      document.body.removeChild(dom)
    }, wait);
  },
   // 优化:使用ref获取组件实例代替广播
  validateForm: function ($scope) {//触发表单验证 
    $scope.$broadcast('ba-form-item:validate')//通知每个 form-item 验证 
    $scope.$broadcast('ba-form:validate')//通知 form 验证，若每个子 form-item 的 pass 都为 true，则验证都为 true，反之为 false
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
3.