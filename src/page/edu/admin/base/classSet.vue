<template>
    <div id="classSet" class="classSetPage">
        <div class="table-content " ref="tableContent">
            <div class="treeList fl" ref="treeList">
                <tree class="innerTree" ref="tree" :treedata="treeData" label="name" @selectItem="selectItem"></tree>
            </div>
            <div class="table-inner fr">
                <div class="common-info" style="border:none;padding:0;">
                    <div class="btns">
                        <el-button type="success" size="mini" @click="add" >新增课程分类</el-button>
                        <el-button type="primary" size="mini" @click="update">修改课程分类</el-button>
                        <el-button type="danger" size="mini" @click="del">删除课程分类</el-button>
                    </div>
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term">父课程分类</label>
                          <div class="input-text">
                            <el-select v-model="info.parentId" placeholder="请选择父课程分类，为空代表新建一级分类" filterable clearable :disabled="flag || (isUpdate && !info.parentId)">
                              <el-option v-for="item in courseOneClass" :key="item.codeValue" :label="item.codeName"
                                         :value="item.codeValue" ></el-option>
                            </el-select>
                          </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">课程分类名称</label>
                            <div class="input-text">
                                <el-input v-model="info.name" maxlength="100" placeholder="请输入课程分类名称" :disabled="flag"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                          <label class="label-term">课程分类排序</label>
                          <div class="input-text">
                            <el-input v-model="info.sortId" maxlength="100" placeholder="课程分类排序,不输入排最后" :disabled="flag"></el-input>
                          </div>
                        </li>
                    </ul>
                    <div class="page-bot-btn ">
                      <el-button type="primary" size="mini" @click="cancel()" v-show="btnflag">取消</el-button>
                      <el-button type="primary" size="mini" @click="saveOrUpdate()" v-show="!flag">保存</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import classSet from './classSet.js'
    export default classSet
</script>
<style lang="scss" scoped>
.classSetPage{
    .table-content{
        border:none;
        background: none;
    }
    .table-inner{
        width: calc(100% - 370px);
        height:100%;
        border: 1px solid #e8e8e8;
        background: #fff;
    }
    .treeList{
        border:$border;
        width: calc(350px);
        background: #fff;
        padding: 20px 0;
        box-sizing: border-box;
        overflow: auto;
        .innerTree{
            padding:0 20px;
            overflow: hidden;
        }
    }
    .common-info{
        max-width: 500px;
        margin:50px 50px 0 50px;
        .btns{
            margin: 0 0 30px;
            text-align: center;
        }
        /deep/ .content{
            .el-textarea__inner{
                width:100%!important;
            }
        }
    }
}
</style>
