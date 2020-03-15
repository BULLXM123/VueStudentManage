<template>
  <div>
    <topbar :name="studentMessage.name" :params="params"/>
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
                <h4>课程添加</h4>
                <el-input placeholder="请输入课程名" class="searchName" v-model="ruleForm.Title">
                </el-input>
                <el-button @click="addlesson()" type="primary" icon="el-icon-search" round>添加</el-button>
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
          <el-table-column prop="Max" label="人数上限" width="120"></el-table-column>
          <el-table-column prop="Introduction" label="课程简介" :formatter="checkNull"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="warning" size="small">修改</el-button>
              <el-tooltip
                content="删除这门课程？"
                placement="top"
                effect="light"
                :hide-after="1000"
                :enterable="false"
              >
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

        <el-dialog title="课程信息" :visible.sync="dialogFormVisible">
          <el-form :model="updateForm" class="content" :rules="rules" ref="updateForm">
            <el-form-item label="课程名" prop="Title" :label-width="formLabelWidth">
              <el-input v-model="updateForm.Title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="人数上限" prop="Max" :label-width="formLabelWidth">
              <el-input v-model="updateForm.Max" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="课程简介" prop="Introduction" :show-overflow-tooltip="true" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                v-model="updateForm.Introduction"
                placeholder="请填写课程信息"
                maxlength="50"
                :autosize="{ minRows: 4, maxRows: 6}"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateStudent('updateForm')">确 定</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="课程信息" :visible.sync="dialogForm2Visible">
          <el-form :model="ruleForm" 
                  class="content"
                  :rules="rules"
                  ref="ruleForm">
            <el-form-item label="课程名" prop="Title" :label-width="formLabelWidth">
              <el-input v-model="ruleForm.Title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="人数上限" prop="Max" :label-width="formLabelWidth">
              <el-input v-model="ruleForm.Max" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="课程简介" prop="Introduction" :show-overflow-tooltip="true" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                v-model="ruleForm.Introduction"
                placeholder="请填写课程信息"
                maxlength="50"
                :autosize="{ minRows: 4, maxRows: 6}"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            <el-button @click="dialogForm2Visible = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
  </div>
  </div>
</template>
<script>
import qs from "qs";
import topbar from '../Topbar'
export default {
  name: "course",
  inject:['reload'],
  data() {
    return {
      // name: "liudaxia",
      studentMessage:{},
      params:{},
      searchName: "",
      coursesData: [],
      loading: true,
      // 增加课程 表单项设置
      ruleForm: {
        Title: "",
        Max: "",
        Introduction: ""
      },
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
    //添加课程
    addlesson(){
      this.loading = false;
      this.dialogForm2Visible=true;
      // submitForm(ruleForm);
    },
    // 实现添加功能
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 表单验证成功
          var strData = {
            Title: this.ruleForm.Title,
            Introduction: this.ruleForm.Introduction,
            Max:this.ruleForm.Max
          };
          console.log(this.strData)
          // 改变post的编码格式，适应后台
          that.$axios
            .post("http://localhost:8004/Courses/create", qs.stringify(strData))
            .then(result => {
              if (result.status == 200 || result.status == 302) {
                this.$message({
                  message: "添加成功(*￣︶￣)，",
                  type: "success"
                });
                this.getAllcourses();
                this.reload();
              }
            })
            .catch(err => {
              this.$message({
                message: "添加失败o(╥﹏╥)o",
                type: "danger"
              });
            });
        } 
        else {
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
    // 实现删除功能
    handleDelete(index, row) {
      console.log(row);
       let strData = {
        courseId:row.Id
      }
      this.$confirm("此操作将删除该课程所有信息, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("http://localhost:8004/Courses/Delete",qs.stringify(strData))
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

    handleClick(row) {
      // 数据回显
      console.log(row);
      // this.resetForm(updateForm);
      this.updateForm.Title = row.Title;
      this.updateForm.Introduction = row.Introduction;
      this.updateForm.Id = row.Id;
      this.updateForm.Max=row.Max
      this.dialogFormVisible = true;
    },
    // 提交修改
    updateStudent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var updateData = {
            Id: this.updateForm.Id,
            Title: this.updateForm.Title,
            Introduction: this.updateForm.Introduction,
            Max:this.updateForm.Max
          };
          this.dialogFormVisible = false;
          //  改变post的编码格式，适应后台  修改！
          this.$axios
            .post(
              "http://localhost:8004/Courses/Edit",
              qs.stringify(updateData)
            )
            .then(result => {
              if (result.status == 200 || result.status == 302) {
                this.$notify({
                  id: "",
                  title: "修改成功",
                  message: "信息已修改完成！请查看",
                  type: "success"
                });
                this.getAllcourses();
                this.reload();
              }
            })
            .catch(err => {
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
          console.log(result.data);
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
    }
  },
  mounted() {
     this.studentMessage = this.$route.params.listinfo;
    this.params = this.$route.params;
    this.getAllcourses();
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
          // margin: 0 !important;
          .el-input__suffix {
            right: 0 !important;
          }
          .el-input {
            width: 70%;
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