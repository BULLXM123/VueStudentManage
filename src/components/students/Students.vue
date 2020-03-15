
<template>
<div>
  <topbar :name="TeaMessage.name" :params="params"/>
<div class="students">
    <div class="handle">
      <!-- 查询 -->
      <div class="menu">
        <el-timeline>
          <el-timeline-item placement="top">
            <el-card>
              <h4>学生查询</h4>
              <el-input placeholder="请输入姓名" class="searchName" v-model="searchName">
                <!-- <el-button slot="append" type="primary" icon="el-icon-search">搜索</el-button> -->
              </el-input>
              <el-button type="primary" icon="el-icon-search" round>搜索</el-button>
            </el-card>
          </el-timeline-item>
          <el-timeline-item placement="top">
            <el-card>
              <h4>添加学生</h4>
              <el-input placeholder="请输入姓名" class="searchName" v-model="ruleForm.name">
              </el-input>
               <el-button @click="addStudent()" type="primary" icon="el-icon-search" round>添加</el-button>
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
        :data="studentData.filter(data => !searchName || data.Name.toLowerCase().includes(searchName.toLowerCase()) )"
        border
        style="width: 100%"
        min-height="650"
        max-height="650"
      >
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column
          prop="Number"
          sortable
          label="学号"
          width="110"
          
        ></el-table-column>
        <el-table-column prop="Name" label="姓名" width="100"></el-table-column>
        <!-- <el-table-column prop="College" label="院系" width="70"></el-table-column> -->
      
         <el-table-column prop="Gender" label="性别" width="70"></el-table-column>
       
        <el-table-column prop="College" label="院系" :show-overflow-tooltip="true"  width="100"></el-table-column>
        <el-table-column prop="Major" label="专业" width="100"></el-table-column>
         <el-table-column label="课程管理" width="120">
          <template slot-scope="scope">
            <el-tooltip content="查看课程" placement="right" effect="light" :hide-after="2000">
              <el-button @click="handleCourses(scope.row)" type="success" size="small">
                已选
                <strong>{{scope.row.Enrollments.length}}</strong>
                门
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="信息管理">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="warning" size="small">修改</el-button>
            <el-tooltip content="删除这位同学？" placement="right" effect="light" :hide-after="2000">
              <el-button
                @click="handleDelete(scope.$index, scope.row)"
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
      <el-dialog title="学生信息" :visible.sync="dialogFormVisible" class="dialogOne">
        <el-form :model="updateForm" class="content">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="updateForm.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="时间" required :label-width="formLabelWidth">
            <el-col :span="11">
              <el-form-item prop="year">
                <el-date-picker
                  type="year"
                  placeholder="选择入学年份"
                  v-model="updateForm.year"
                  style="width: 100%;"
                >></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="性别" prop="sex" required :label-width="formLabelWidth">
            <el-select v-model="updateForm.sex" placeholder="请选择性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="院系" prop="college" required :label-width="formLabelWidth">
                  <el-input v-model="updateForm.college" placeholder="请输入学生院系"></el-input>
                </el-form-item>

                <el-form-item label="专业" prop="major"  required :label-width="formLabelWidth">
                 <el-input v-model="updateForm.major" placeholder="请输入学生专业"></el-input>
                </el-form-item>

                <el-form-item label="学号" prop="number" required :label-width="formLabelWidth">
                 <el-input v-model="updateForm.number" placeholder="请输入学生学号"></el-input>
                </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateStudent">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="课程信息" :visible.sync="dialogForm2Visible" class="dialogOne">
        <el-form :model="updateForm2" class="content">
          <el-form-item label="成绩" :label-width="formLabelWidth">
            <el-input v-model="updateForm2.grade" autocomplete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateCourse">确 定</el-button>
          <el-button @click="dialogForm2Visible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="学生信息" :visible.sync="dialogForm3Visible" class="dialogOne">
        <el-form :model="ruleForm" 
                class="content"
                :rules="rules"
                ref="ruleForm">
          <el-form-item label="姓名" prop="name" required :label-width="formLabelWidth">
            <el-input v-model="ruleForm.name" autocomplete="off" placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item label="时间" required :label-width="formLabelWidth">
            <el-col :span="11">
              <el-form-item prop="year">
                <el-date-picker
                  type="year"
                  placeholder="选择入学年份"
                  v-model="ruleForm.year"
                  style="width: 100%;"
                >></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="性别" prop="sex" required :label-width="formLabelWidth">
            <el-select v-model="ruleForm.sex" placeholder="请选择性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="院系" prop="college" required :label-width="formLabelWidth">
                  <el-input v-model="ruleForm.college" placeholder="请输入学生院系"></el-input>
                </el-form-item>

                <el-form-item label="专业" prop="major" required :label-width="formLabelWidth">
                 <el-input v-model="ruleForm.major" placeholder="请输入学生专业"></el-input>
                </el-form-item>

                <el-form-item label="学号" prop="number" required :label-width="formLabelWidth">
                 <el-input v-model="ruleForm.number" placeholder="请输入学生学号"></el-input>
                </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button @click="calcel3">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 关于进阶版的课程管理 -->
    <el-dialog title="课程管理" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column property="coursesName" label="课程名" width="150"></el-table-column>
        <el-table-column property="grade" label="成绩" width="200">
          <template slot-scope="scope">
            <p v-if="scope.row.grade==null">{{nograde}}</p>
            <p v-else v-text="scope.row.grade"></p>
          </template>
        </el-table-column>
        
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="changeCourse(scope.row)" type="warning" size="small">修改</el-button>
            <el-tooltip content="删除这个课程？" placement="right" effect="light" :hide-after="2000">
              <el-button
                @click="deleteCourse(scope.$index,scope.row)"
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
      <el-button @click="addCourse(coursemanage)" type="warning" size="small" style="display:block;margin:0 auto;">增加</el-button>
    </el-dialog>
  </div>
</div>
  
</template>
<script>
import qs from "qs";
import topbar from "../Topbar";
export default {
  name: "student",
  inject:['reload'],
  data() {
    return {
      // name: "zhuxiaoming",
      TeaMessage:{},
      params:{},
      searchName: "",
      searchStudent: [],
      studentData: [],
      coursemanage:{},
      loading: true,
      nograde:'暂无成绩',
      delay: parseInt(200),
      // addcourseForm:{
      //   studentId:"",
      //   studentName:""
      // },
      // 增加学生 表单项设置
      ruleForm: {
        name: "",
        year: "",
        sex: "",
        college:"",
        major:"",
        number:""

      },
      // 修改时学生信息 表单项设置
      updateForm: {
        name: "",
        year: "",
        sex: "",
        id: "",
        checkName: "",
        college:'',
        major:'',
        number:'',
        flag:''
      },
      updateForm2:{
        grade:""
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: "请输入学生姓名", trigger: "change" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
          { pattern: /^[\u4E00-\u9FA5]+$/,message: '用户名只能为中文' }
        ],
        sex: [{ required: true, message: "请选择学生类型", trigger: "change" }],
        year: [
          {
            required: true,
            message: "请选择年份",
            trigger: "change"
          }
        ],
        college:[
          {required:true,message:"请输入学生院系",trigger:"change"}
          ],
        major:[
           {required:true,message:"请输入学生专业",trigger:"change"}
        ],
        number:[
           {required:true,message:"请输入学生学号",trigger:"change"},
           {min:9,max:9,trigger:'blur'}
        ]
      },
      dialogFormVisible: false,
      dialogForm2Visible:false,
       dialogForm3Visible:false,
      formLabelWidth: "5em",

      //存储当前行的课程数据
      gridData: [],

      dialogTableVisible: false
    };
  },
   components: {
    topbar
  },
  methods: {
    // 实现后台的课程管理
    handleCourses(row) {
      this.dialogTableVisible = true;
      this.gridName = row.Name;
      this.gridData = [];
      console.log(row)
      this.coursemanage.Name=row.Name;
      this.coursemanage.Id=row.Id;
      row.Enrollments.forEach(item => {
        var newCourse = {
          Id: item.Id,
          gridName: row.Name,
          done:item.Done,
          grade: item.Grade,
          coursesName: item.CourseName,
          courseId:item.CourseId,
          studentId:item.StudentId,
        };
        this.gridData.push(newCourse);
        // 这是未成功的尝试
        // this.axios.get("http://localhost:8004/Courses/Edit?id="+item.CourseId).then(result=>{
        //   console.log(result.data)
        // })
        console.log(this.gridData)
      });
      
    },

    // 删除对应的课程
    deleteCourse(index, row) {
      console.log(row);
      let strData={
        studentId:row.studentId,
        courseId:row.courseId
      }
      this.$confirm("此操作将删除该同学选修的此门课程, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("http://localhost:8004/Students/courseDelete" ,qs.stringify(strData))
            .then(result => {
              if (result.status == 200 || result.status == 302) {
                this.$message({
                  message: "删除成功(*￣︶￣)，",
                  type: "success"
                });
                this.gridData.splice(index, 1);
                this.getStudentData();
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
    //修改课程
    changeCourse(row) {
      // 数据回显
      this.dialogForm2Visible = true;
      this.updateForm2.studentId=row.studentId,
      this.updateForm2.courseId=row.courseId,
      this.updateForm2.done=row.done,
      this.updateForm2.grade = row.grade;
      console.log(row)
    },
    //增加选课
    addCourse(){
      // this.params.listinfo.addcourseForm={studentId:row.Id,studentName:row.Name};
     this.params.listinfo.addcourseForm=this.coursemanage;
      this.$router.push({
        name:'select',
        params:this.params
      })
    },
    // 实现查询功能
    findSomeOne(name) {
      if ((name = "")) {
        this.searchStudent = this.studentData;
      }
      this.searchStudent = this.studentData.filter(item => {
        if (item.Name.indexOf(name) != -1) {
          return item;
        }
      });
    },

    // 实现删除功能
    handleDelete(index, row) {
      console.log(index, row);
      let strData = {
        studentId:row.Id,
        number:row.Number
      }
      this.$confirm("此操作将删除该同学所有信息, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("http://localhost:8004/Students/Delete" ,qs.stringify(strData))
            .then(result => {
              if (result.status == 200 || result.status == 302) {
                this.$message({
                  message: "删除成功(*￣︶￣)，",
                  type: "success"
                });
                this.getStudentData();
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
  addStudent(){
      this.dialogForm3Visible = true;
      submitForm(ruleForm);
  },
  calcel3(){
      this.dialogForm3Visible = false;
      this.resetForm("ruleForm");
  },
    // 实现添加功能
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 表单验证成功
          var strData = {
            Name: this.ruleForm.name,
            Gender: parseInt(this.ruleForm.sex),
            EnrollmentDate:new Date(this.ruleForm.year).getFullYear(),
            Number:this.ruleForm.number,
            College:this.ruleForm.college,
            Major:this.ruleForm.major
          };
          this.$axios.post(
              "http://localhost:8004/Students/create",
              qs.stringify(strData)
            )
            .then(result => {
              if (result.status == 200 || result.status == 302) {
                this.$message({
                  message: "添加成功(*￣︶￣)，",
                  type: "success"
                });
                this.getStudentData();
                this.resetForm("ruleForm");
                this.reload();
              }
            })
            .catch(err => {
              console.log(err)
              this.$message({
                message: "添加失败o(╥﹏╥)o",
                type: "danger"
              });
            });
        } else {
          this.$message.error("信息错误，请重新操作");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //为表格添加序号
    indexMethod(index) {
      return index + 1;
    },

    //实现修改功能
    handleClick(row) {
      // 数据回显
      this.dialogFormVisible = true;
      this.updateForm.id = row.Id;
      this.updateForm.name = row.Name;
      // 用于提交修改时的校验，由于name被双向绑定了，这里未来防止 name被恶意清空，派出幕后英雄checkName
      this.updateForm.checkName = row.Name;
      this.updateForm.year = new Date(row.EnrollmentDate.toString());
      this.updateForm.sex = row.Gender;
      this.updateForm.college = row.College;
      this.updateForm.major = row.Major;
      this.updateForm.number = row.Number;
      this.updateForm.flag = row.Number;
      console.log(row);
    
    },
    
    // 提交修改学生
    updateStudent() {
      this.dialogFormVisible = false;
      console.log(this.updateForm)
      let updateData = {
        Name:
          this.updateForm.name == " "
            ? this.updateForm.checkName
            : this.updateForm.name,
        Gender: parseInt(
          this.updateForm.sex == "男" || this.updateForm.sex == "0" ? 0 : 1
        ),
        EnrollmentDate: new Date(this.updateForm.year).getFullYear(),
        College:this.updateForm.college,
        Major:this.updateForm.major,
        Number:this.updateForm.number,
        Flag:this.updateForm.flag
      };
      // 改变post的编码格式，适应后台做修改！
      this.$axios
        .post("http://localhost:8004/Students/Edit", qs.stringify(updateData))
        .then(result => {
          if (result.status == 200 || result.status == 302) {
            this.$notify({
              id: "",
              title: "修改成功",
              message: "信息已修改完成！请查看",
              type: "success"
            });
            this.getStudentData();
            this.reload();
          }
        })
        .catch(err => {
          this.$message({
            message: "修改失败o(╥﹏╥)o",
            type: "danger"
          });
        });
    },
    //提交修改课程
updateCourse(){
      this.dialogForm2Visible = false;
      console.log(this.updateForm2)
      let updateData = {
          studentId:this.updateForm2.studentId,
          courseId:this.updateForm2.courseId,
          done:this.updateForm2.done,
          grade:this.updateForm2.grade
      };
      // 改变post的编码格式，适应后台做修改！
      this.$axios
        .post("http://localhost:8004/Students/CourseEdit", qs.stringify(updateData))
        .then(result => {
          if (result.status == 200 || result.status == 302) {
            this.$notify({
              id: "",
              title: "修改成功",
              message: "信息已修改完成！请查看",
              type: "success"
            });
            this.getStudentData();
            this.reload();
          }
        })
        .catch(err => {
          this.$message({
            message: "修改失败o(╥﹏╥)o",
            type: "danger"
          });
        });
},
    // 获取全部学生数据
    getStudentData() {
      this.$axios.get("http://localhost:8004/Students").then(result => {
        
        if (result.status == 200) {
          result.data.forEach(item => {
            item.Gender == 0
              ? (item.Gender = "男")
              : (item.Gender = "女");
          });
          this.studentData = result.data;
          //  console.log(this.studentData );
          this.loading = false;
        }
      });
    },

  },
  //页面数据初始化
  // 增加loading
  mounted() {
    this.params = this.$route.params;
    console.log(this.params)
    this.TeaMessage = this.$route.params.listinfo;
    this.getStudentData();
  }
};
</script>
<style lang="less" scoped>
.students {
  display: flex;
  height: 42em;
  .handle {
    // flex: 2;
    // height: 50em;
    // background-color: lightblue;
    .searchName {
      width: 50%;
      margin-right: 10%;
    }
    .menu {
      padding: 5% 10% 0 0;
      h4 {
        margin: 0.2em;
        padding-bottom: 0.5em;
      }
      .studentForm {
        .el-form-item__content {
          // margin: 0 !important;
          .el-input__suffix {
            right: 0 !important;
          }
          .el-input {
            width: 70%;
          }
          .line{
            text-align: center
          }
        }
      }
    }
  }
  .formData {
    flex: 3;
    text-align: center;
    .el-table {
      text-align: center !important;
      float: right;
      // padding: 5%
      margin: 2%;
    }
    // background-color: lightpink;
  }
}
</style>