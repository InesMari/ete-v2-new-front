import Vue from 'vue'

//获取焦点
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

//权限管理
Vue.directive('entity', {
  inserted(el, binding,vnode) {
    let value = binding.value;
    if(vnode.data.attrs && vnode.data.attrs.entityId){  //存在动态参数时，外部格式：:entityId="[{1:101,2:202},pId]"
      let data = vnode.data.attrs.entityId;
      let key = vnode.context.$route.query.pId;
      let map = data[0];
      if(data[1]) key=data[1];
      value = map[key];
    }
    let entityIds = localStorage.getItem("entityIds").split(",");
    let isRemove = true;
    entityIds.forEach(item => {
      if(value==item){
        isRemove = false;
      }
    })
    if(isRemove) el.remove();
  }
})

Vue.directive('entitys', {
  inserted(el, binding,vnode) {
    let valueStr = binding.value;
    let values = valueStr.split(",");
    let valueSet = new Set();
    values.forEach(el=>valueSet.add(el));

    let entityIds = localStorage.getItem("entityIds").split(",");
    let isRemove = true;
    entityIds.forEach(item => {
      if(valueSet.has(item)){
        isRemove = false;
      }
    })
    if(isRemove) el.remove();
  }
})

/**
 * 只能输入整数
 * 正则说明：
 * [^\d]  非数字，同\D
 */
Vue.directive('mynumval', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    // ele.addEventListener("keyup",function(event){
    //   ele.value = ele.value.replace(/[^\d]/g, '');
    // });
    ele.addEventListener("input",function(event){
      ele.value = ele.value.replace(/[^\d]/g, '')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('keyup', true, true)
      ele.dispatchEvent(e);
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(/[^\d]/g, '')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('keyup', true, true)
      ele.dispatchEvent(e);
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
/**
 * 只能输入正负整数
 * 正则说明：
 * [^-\d]  非负号和数字
 * (-?\d*) ()表示捕获分组,()会把每个分组里的匹配的值保存起来，后面$1(第一个分组)是取出改分组内容
 * -?\d*   匹配的内容
 */
Vue.directive('mypmnumval', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    // ele.addEventListener("keyup",function(event){
    //   ele.value = ele.value.replace(/[^\d]/g, '');
    // });
    ele.addEventListener("input",function(event){
      ele.value = ele.value.replace(/[^-\d]*(-?\d*)/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('keyup', true, true)
      ele.dispatchEvent(e);
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(/[^-\d]*(-?\d*)/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('keyup', true, true)
      ele.dispatchEvent(e);
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
/**
 * 两位小数
 * 正则说明：
 * ^\D      非数字
 * ()       表示捕获分组,()会把每个分组里的匹配的值保存起来，后面$1(第一个分组)是取出改分组内容
 * (?:)     表示非捕获分组,匹配的值不会保存起来，后续$n不会取出
 * (\d*(?:\.\d{0,2})?)  匹配的内容
 */
Vue.directive('mydoubleval', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener("keyup",function(event){
      ele.value = ele.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e);
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
//两位正负小数
Vue.directive('mypmdoubleval', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener("keyup",function(event){
      ele.value = ele.value.replace(/^[^-\d]*(-?\d*(?:\.\d{0,2})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(/^[^-\d]*(-?\d*(?:\.\d{0,2})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
//两位正负小数，支持千分号
Vue.directive('mypmdoublethousandval', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    // 处理千分号并校验数字格式
    const formatValue = (value) => {
      // 1. 先移除所有千分号（逗号）
      let val = value.replace(/,/g, '');
      // 2. 再应用数字格式校验
      return val.replace(/^[^-\d]*(-?\d*(?:\.\d{0,2})?).*$/g, '$1');
    };
    ele.addEventListener("keyup",function(event){
      ele.value = formatValue(ele.value);
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = formatValue(ele.value);
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
//输入四位小数
Vue.directive('mydouble4val', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener("keyup",function(event){
      ele.value = ele.value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
//输入四位小数,不监听blur（blur二次触发事件影响性能）
Vue.directive('mydouble4valNoBlur', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener("keyup",function(event){
      ele.value = ele.value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
//输入四位正负小数
Vue.directive('mypmdouble4val', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener("keyup",function(event){
      ele.value = ele.value.replace(/[^-\d]*(-?\d*(?:\.\d{0,4})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(/[^-\d]*(-?\d*(?:\.\d{0,4})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})
//输入五位小数
Vue.directive('mydouble5val', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener("keyup",function(event){
      ele.value = ele.value.replace(/^\D*(\d*(?:\.\d{0,5})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(/^\D*(\d*(?:\.\d{0,5})?).*$/g, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})

//自定义小数
Vue.directive('mydiyval', {
  inserted(el, binding,vnode) {
    let ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    let regex = new RegExp(`^\\D*(\\d*(?:\\.\\d{0,${binding.value}})?).*$`, 'g');
    ele.addEventListener("keyup",function(event){
      ele.value = ele.value.replace(regex, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
    //失去焦点时再做一次判断,针对于输入法点击数字选择文字时的坑
    ele.addEventListener("blur",function(event){
      ele.value = ele.value.replace(regex, '$1')
      const e = document.createEvent('HTMLEvents')
      e.initEvent('input', true, true)
      ele.dispatchEvent(e)
      if(vnode.componentInstance) vnode.componentInstance.$emit('input', ele.value);
    });
  }
})