import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Courses from "@/components/courses/Courses.vue"
import Students from "@/components/students/Students"
import Enrollments from "@/components/enrollments/Enrollments"
import Select from "@/components/select/Select"
import Aboutme from "@/components/Aboutme"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
     name:'login',
     component:Login
     
    },
    {
      path:"/students",
      name:"students",
      component:Students
    },
    {
      path:"/courses",
      name:"courses",
      component:Courses
    },
    {
      path:"/enrollments", 
      name:"enrollments",
      component:Enrollments
      // component: resolve => require(['../components/enrollments/Enrollments.vue'], resolve)
    },
    {
      path:"/select",
      name:"select",
      component:Select
    }

  ]
})
