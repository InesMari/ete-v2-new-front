/**
 * 自定义指令：v-auto-select
 * 用于在元素获取焦点或点击时自动全选文本
 */
export default {
  // 当被绑定的元素插入到DOM中时调用
  inserted: function(el) {
    // 对于Element UI的el-input组件，需要找到内部的input元素
    const inputElement = el.tagName === 'INPUT' ? el : el.querySelector('input');

    if (!inputElement) return;

    // 定义全选函数
    const selectAll = function() {
      setTimeout(() => {
        if (inputElement.value) {
          inputElement.select();
          try {
            inputElement.setSelectionRange(0, inputElement.value.length);
          } catch (e) {
            // 忽略可能的错误
          }
        }
      }, 100);
    };

    // 添加事件监听器
    inputElement.addEventListener('focus', selectAll);
    inputElement.addEventListener('click', selectAll);

    // 存储函数引用，以便在unbind时移除
    el._autoSelectHandler = selectAll;
  },

  // 当指令与元素解绑时调用
  unbind: function(el) {
    // 移除事件监听器
    const inputElement = el.tagName === 'INPUT' ? el : el.querySelector('input');
    if (inputElement && el._autoSelectHandler) {
      inputElement.removeEventListener('focus', el._autoSelectHandler);
      inputElement.removeEventListener('click', el._autoSelectHandler);
      delete el._autoSelectHandler;
    }
  }
};
