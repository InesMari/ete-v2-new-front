<template>
  <div id="myTag">
    <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        :closable="!disable"
        :disable-transitions="false"
        @close="handleClose(tag)">
      {{tag}}
    </el-tag>

    <el-input
        class="input-new-tag"
        v-if="inputVisible&&!disable"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
    >
    </el-input>
    <el-button class="button-new-tag" size="small" @click="showInput" v-if="!inputVisible&&!disable">+新建</el-button>
  </div>
</template>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

<script>
export default {
  props: {
    dynamicTags: [],
    disable:Boolean,
  },
  data() {
    return {
      inputVisible: false,
      inputValue: ''
    };
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    getData(){
      return this.dynamicTags;
    }
  }
}
</script>