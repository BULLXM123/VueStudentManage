<template>
  <div>
      <div style="display:flex;justify-content:center;margin-top:150px">
          <el-card style="width:400px">
              <div slot="header" class="clearfix">
                  <span>登录</span>
              </div>
              <tr>
                  <td>用户名</td>
                  <td>
                      <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
                  </td>
              </tr>
              <tr>
                  <td>密码</td>
                  <td>
                      <el-input type="password" v-model="user.password" placeholder="请输入密码"
                       @keydown.enter.native="doLogin"></el-input>
                  </td>
              </tr>
              <!-- <tr>
                  <td colspan="2">
                       <el-radio v-model="radio" label="1">学生登录</el-radio>
                       <el-radio v-model="radio" label="2">教师登录</el-radio>
                  </td>
              </tr> -->
                
              <td colspan="2">
                  <el-button @click="doLogin" style="width:300px" type="primary">登录</el-button>
              </td>
              <table>
              </table>
          </el-card>
      </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
    name:'login',
    data(){
        return{
            user:{
                username:'',
                password:''
            },
            // radio:'1',
            message:{
                name:'',
                number:'',
                teaId:'',
            }
        }
    },
    methods:{
        doLogin(){
            let that = this
        //    if(this.radio == '1'){
        //      this.$axios.post("http://localhost:8004/Login/stu", qs.stringify(that.user))
        //         .then(result => {
        //             if (result.status == 200 || result.status == 302) {
        //                 that.message.name=result.data[0].name
        //                 that.message.number=result.data[0].number
        //                 that.message.studentId=result.data[0].s_id
        //                 this.$router.push({
        //                     name:'enrollments',
        //                     params:{listinfo:that.message}
        //                     })
        //             }
        // })
        // .catch(err => {
        //   console.log(err)
        // });
        //    }
        //     // this.$router.replace('/enrollments')
           
        //    else if(this.radio == '2'){
            this.$axios.post("http://localhost:8004/Login/tea", qs.stringify(that.user))
                .then(result => {
                    if (result.status == 200 || result.status == 302) {
                        that.message.name=result.data[0].name
                        that.message.number=result.data[0].number
                        that.message.teaId=result.data[0].s_id
                        this.$router.push({
                            name:'students',
                            params:{listinfo:that.message}
                            })
                    }
        })
        .catch(err => {
          console.log(err)
        });
        }
    // }
}}
</script>

<style>
tr,td{
    padding-bottom: 10px
}
</style>