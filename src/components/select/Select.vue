<template>
  <div>
    <topbar :name="TeaMessage.name" :params="params"/>
    <div class="courses">
      <div class="handle">
        <!-- 查询 -->
        <div class="menu">
          <el-timeline>
            <el-timeline-item placement="top">
              <el-card>
                <h4>课程查询</h4>
                <el-input placeholder="请输入课程名" class="searchName" v-model="searchName">
                  <!-- <el-button slot="append" type="primary" icon="el-icon-search">搜索</el-button> -->
                </el-input>
                <el-button type="primary" icon="el-icon-search" round>搜索</el-button>
              </el-card>
            </el-timeline-item>
           <el-timeline-item placement="top">
              <el-card>
                <h4>{{addcourseForm.Name}}选课情况</h4>
                <el-table :data="studentCourse">
                  <el-table-column type="index" :index="indexMethod"></el-table-column>
                  <el-table-column prop="Title" label="课程名" width="150"></el-table-column>
                  <el-table-column fixed="right" label="操作" width="80">
                    <template slot-scope="scope">
                      <el-tooltip
                        content="删除这门课程？"
                        placement="top"
                        effect="light"
                        :hide-after="1000"
                        :enterable="false"
              >
                <el-button
                  @click="deleteCourse(scope.$index, scope.row)"
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  circle
                  plain
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
                </el-table>
              </el-card>

            </el-timeline-item>
          <el-timeline-item placement="top">
             
            </el-timeline-item>
          </el-timeline>
         
        </div>
      </div>
      <div class="formData">
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="coursesData.filter(data => !searchName || data.Title.toLowerCase().includes(searchName.toLowerCase()))"
          border
          style="width: 100%"
          min-height="650"
          max-height="650"
        >
          <el-table-column type="index" :index="indexMethod"></el-table-column>
          <el-table-column prop="Title" label="课程名" width="150"></el-table-column>
          <el-table-column prop="Enrollments.length" sortable label="选修人数" width="120"></el-table-column>
          <el-table-column prop="Max" label="人数上限" width="100"></el-table-column>
          <el-table-column prop="Introduction" label="课程简介" :formatter="checkNull"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="selectCourse(scope.row)" type="warning" size="small">选修</el-button>
              
            </template>
          </el-table-column>
        </el-table>

        <el-dialog title="课程信息" :visible.sync="dialogFormVisible">
          <el-form :model="updateForm" class="content" :rules="rules" ref="updateForm">
            <el-form-item label="课程名" prop="Title" :label-width="formLabelWidth">
              {{updateForm.Title}}
            </el-form-item>
            <el-form-item label="人数上限" prop="Max" :label-width="formLabelWidth">
              {{updateForm.Max}}
            </el-form-item>
            <el-form-item label="课程简介" prop="Introduction" :show-overflow-tooltip="true" :label-width="formLabelWidth">
              {{updateForm.Introduction}}
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateCourse">确 定</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
        
      </div>
  </div>
  </div>
</template>
<script>
import qs from "qs";
import topbar from "../Topbar";
export default {
  name: "course",
  inject:['reload'],
  data() {
    return {
      TeaMessage:{},
      params:{},
      addcourseForm:{},
      searchName: "",
      coursesData: [],
      loading: true,
      studentCourse:[],
      selectForm:{},
      // 修改时课程信息 表单项设置
      updateForm: {
        Id: "",
        Title: "",
        Introduction: "",
        Max:""
      },
      // 校验规则
      rules: {
        Title: [
          { required: true, message: "请输入课程名", trigger: "change" },
          { min: 2, max: 10, message: "长度在 2到 10 个字符", trigger: "blur" }
        ],
        Max:[{
          required:true,message:"请输入数字",trigger:"change",transform: (value) => Number(value),type:'number'
        }],
        Introduction: [
          {
            required: true,
            message: "请填写课程信息,否则无法通过喔~",
            trigger: "change"
          }
        ],
        // Max:[{
        //   required:true,
        //   type:number,
        //    message: "请输入数字",
        // }]
      },
      dialogFormVisible: false,
      dialogForm2Visible:false,
      formLabelWidth: "6em"
    };
  },
  components:{
    topbar
  },
  methods: {
   
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //为表格添加序号
    indexMethod(index) {
      return index + 1;
    },
    // 退选课程
    deleteCourse(index, row) {
       let strData = {
        studentId:this.addcourseForm.Id,
        courseId:row.Cid
      }
      this.$confirm("此操作将退选该课程, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("http://localhost:8004/Students/courseDelete",qs.stringify(strData))
            .then(result => {
              if (result.status == 200 || result.status == 302) {
                this.$message({
                  message: "删除成功(*￣︶￣)，",
                  type: "success"
                });
                this.getAllcourses();
                this.reload();
              }
            })
            .catch(err => {
              this.$message({
                message: "删除失败o(╥﹏╥)o",
                type: "danger"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //选修课程
    selectCourse(row) {
      // 数据回显
      console.log(row);
      // this.resetForm(updateForm);
      this.updateForm.Title = row.Title;
      this.updateForm.Introduction = row.Introduction;
      this.updateForm.Id = row.Id;
      this.updateForm.Max=row.Max;
      this.selectForm.studentId=this.addcourseForm.Id;
      this.selectForm.courseId=row.Id
      this.dialogFormVisible = true;
    },
    // 提交选课
    updateCourse() {
     this.dialogFormVisible = false;
          //  改变post的编码格式，适应后台  修改！
          this.$axios
            .post(
              "http://localhost:8004/Enrollments/create",
              qs.stringify(this.selectForm)
            )
            .then(result => {
              if (result.status == 200 || result.status == 302) {
                this.$notify({
                  id: "",
                  title: "选课成功",
                  message: "选课成功！请查看",
                  type: "success"
                });
                this.getAllcourses();
                this.reload();
              }
            })
            .catch(err => {
              this.$message({
                message: "选课失败o(╥﹏╥)o",
                type: "danger"
              });
            });
    },
    // 查验简介是否为空
    checkNull(row, column) {
      // console.log(row)
      return row.Introduction == null
        ? "该课程暂无介绍信息 ￣□￣｜｜"
        : row.Introduction;
    },
    // 获取全部的课程数据
    getAllcourses() {
      this.$axios.get("http://localhost:8004/Courses").then(result => {
        if (result.status == 200) {
          // console.log(result.data);
          this.coursesData = result.data;
          this.coursesData.forEach(item => {
              // console.log(item.Id);
              // console.log(item.Enrollments);
            if (item.Introduction == null) {
              item.Introduction == "暂无课程简介";
            }
            // item.Introduction==null ? "0" : item.Introduction
          });
          this.loading = false;
        }
      });
    },
    //获取学生课程数据
    getstudentcourses(){
      
       this.$axios.get("http://localhost:8004/Enrollments/"+this.addcourseForm.Id).then(res => {
         if(res.status == 200){
  
          this.studentCourse=res.data
         }
        
      });
    }
  },
  mounted() {
    this.params = this.$route.params;
    console.log(this.params)
    this.TeaMessage = this.$route.params.listinfo;
    this.addcourseForm=this.$route.params.listinfo.addcourseForm;
    
    if(this.params.listinfo.addcourseForm!=undefined){
       this.getAllcourses();
       this.getstudentcourses();
       delete this.params.listinfo.addcourseForm
    }
    else{
      this.$router.push({
        name:'students',
        params:this.params
      })
    }
   
  }
};
</script>
<style lang="less" scoped>
.courses {
  display: flex;
  height: 42em;
  .handle {
    flex: 2;
    // height: 50em;
    // background-color: lightblue;
    .searchName {
      width: 50%;
      margin-right:10%;
    }
    .menu {
      padding: 5% 10% 0 10%;
      h4 {
        margin: 0.2em;
        padding-bottom: 0.5em;
      }
      .stydentForm {
        .el-form-item__content {
          margin: 0 !important;
          // .el-input__suffix {
          //   right: 0 !important;
          // }
          // .el-input {
          //   width: 70%;
          // }
        }
      }
    }
  }
  .formData {
    flex: 3;
    text-align: center;
    .el-table {
      // text-align: center !important;
      float: right;
      // padding: 5%
      margin: 2%;
    }
    // background-color: lightpink;
  }
}

// .el-dialog__body{
//   text-align: left !important;
// }
</style>