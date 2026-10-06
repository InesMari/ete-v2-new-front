<template>
  <div class="manage" id="wangEditorDemo">
    <div class="common-info">
      <ul class="content clearfix">
        <li class="item item100">
          <label class="label-term"><em>*</em>问题名称</label>
          <div class="input-text">
            <el-input v-model="aa"  show-word-limit></el-input>
          </div>
        </li>
        <li class="item item100">
          <label class="label-term"><em>*</em>分类目录</label>
          <div class="input-text">
            <el-select v-model="aa" clearable filterable placeholder="请选择">
              <el-option
                  v-for="item in customerData"
                  :key="item.tenantId"
                  :label="item.abbreviationName"
                  :value="item.tenantId">
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="item item100 itemEditor">
          <label class="label-term"><em>*</em>答案描述</label>
          <div class="input-text">
            <WangEditor ref="wangEditor"></WangEditor>
          </div>
        </li>
        <li class="item item100">
          <label class="label-term"><em>*</em>问题排序</label>
          <div class="input-text">
            <el-input-number v-model="sortNum"  :min="0" ></el-input-number>
          </div>
        </li>
        <li class="item item100">
          <label class="label-term">是否热门</label>
          <div class="input-text">
            <el-select v-model="aa" clearable filterable placeholder="请选择">
              <el-option
                  v-for="item in customerData"
                  :key="item.tenantId"
                  :label="item.abbreviationName"
                  :value="item.tenantId">
              </el-option>
            </el-select>
          </div>
        </li>
      </ul>
      <div class="bot-btn">
        <el-button type="primary" @click="save">确认新增</el-button>
        <el-button>关闭</el-button>
      </div>
    </div>
  </div>
</template>
  
  <script>
import WangEditor from "@/components/wangEditor/wangEditor.vue";

export default {
  name: "wangEditorDemo",
  components: {
    WangEditor,
  },
  data() {
    return {
      formData: {},
      sortNum:0,
      aa:'',
      customerData:[],
    };
  },
  mounted() {
      this.$refs.wangEditor.setEditor('<p>hello <strong>回显</strong></p>')
  },
  methods: {
    // 保存
    save() {
      const wangEditor = this.$refs.wangEditor;
      this.formData.contentText = wangEditor.html;
      console.log(this.formData.contentText);
    },
  },
};
</script>
  <style lang="scss" scoped>
.manage {
  .common-info{
    height: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
    /deep/ .content{
        height: calc(100% - 80px);
      .itemEditor{
        height: calc(100% - 200px);
        .input-text{
          height: 100%;
          &>div{
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .w-e-full-screen-container{
            z-index: 999999;
          }
        }
      }
    }
  }
  /deep/ .el-input,.el-select {
    width: 300px!important;
  }
  /deep/ .el-input-number{
    width: initial;
  }
  
}
</style>