var _c = { // 组件的辅助函数
  message: function (options, $scope, $compile) {//实现elementUI类似 this.$message('这是一条消息提示');   这样调用组件 
    var hint = options.hint || '提示信息'
    var type = options.type || 'success' // success fail 
    var wait = options.wait || 2000 //单位 秒
    var str = "<ng-message type='" + type + "'>" + hint + "</ng-message >"
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
    $scope.$broadcast('ng-form-item:validate')//通知每个 form-item 验证 
    $scope.$broadcast('ng-form:validate')//通知 form 验证，若每个子 form-item 的 pass 都为 true，则验证都为 true，反之为 false
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