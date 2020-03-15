// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
// import Vueaxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import '../static/css/style.css'
import  VueResource  from 'vue-resource'

Vue.use(VueResource)
Vue.use(ElementUI)
// Vue.use(Vueaxios,axios)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.prototype.$reset = function (formRef, ...excludeFields) {
  this.$refs[formRef].resetFields();
  let obj1 = this.$data;
  let obj2 = this.$options.data.call(this);
  if (!excludeFields || excludeFields.length === 0) {
    excludeFields = ["ruleValidate"];
  }
  for (let attrName in obj1) {
    if (excludeFields && excludeFields.includes(attrName)) {
      continue;
    }
    obj1[attrName] = obj2[attrName];
  }
};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  render:h =>h(App)
})
