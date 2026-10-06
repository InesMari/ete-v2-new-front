<template>
  <div id="limitDeploy" class="limitDeployPage">
    <el-tree
        :data="treeData"
        show-checkbox
        node-key="regionId"
        :props="defaultProps">
    </el-tree>
    <div class="page-bot-btn">
        <el-button size="small">取消</el-button>
        <el-button type="primary" size="small">提交</el-button>
    </div>
  </div>
</template>

<script>
import limitDeploy from './limitDeploy.js'
export default limitDeploy
</script>
<style lang="scss">
.limitDeployPage{
    padding: 20px;
    .page-bot-btn{
        position: absolute;
        bottom:30px;
        left: 0;
        width: 100%;
    }
}
</style>