<template>
  <div id="entityCompare" class="entityComparePage">
    <div class="common-info">
      <div class="tree-container">
        <div class="headers-row">
          <div class="tree-column tree-title">
            <h3 class="column-title">当前角色权限</h3>
            <div class="info">
              <div class="info-group">
                <div class="search-box">
                  <el-input v-model="searchQuery" @input="handleSearch" placeholder="搜索权限节点" clearable prefix-icon="el-icon-search" style="width: 140px;"></el-input>
                </div>
                <span class="role-name">{{ info.roleName }}</span>
                <span class="checked-count">已授权：{{ info.checkNums }}</span>
                <span class="removed-count">本次删除：{{ info.addNums }}</span>
                <span class="added-count">本次新增：{{ info.delNums }}</span>
              </div>
            </div>
          </div>
          <div class="tree-column tree-title">
            <h3 class="column-title">对比角色权限</h3>
            <div class="info">
              <div class="info-group">
                <span class="role-name">{{ info.compareRoleName }}</span>
                <span class="checked-count">已授权：{{ info.checkCompareNums }}</span>
                <span class="removed-count">本次删除：{{ info.addCompareNums }}</span>
                <span class="added-count">本次新增：{{ info.delCompareNums }}</span>
              </div>
            </div>
          </div>
        </div>

        <el-scrollbar class="scroll-container">
          <div class="trees-wrapper">
            <div class="tree-content">
              <treeCompare ref="tree1" :treedata="treeData" :tree-ref="'tree1'"
                :search-query="searchQuery"
                @expand-change="handleExpandChange"
                @change-check="handleChangeCheck($event, 1)"></treeCompare>
            </div>

            <div class="tree-content">
              <treeCompare ref="tree2" :treedata="treeDataCompare" :tree-ref="'tree2'"
                :search-query="searchQuery"
                @expand-change="handleExpandChange" @change-check="handleChangeCheck($event, 2)"></treeCompare>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="page-bot-btn">
        <el-button size="small" @click="closePage()">取消</el-button>
        <el-checkbox v-model="isExpandAll" v-show="!onlyread" @change="changeExpand" border  size="small" style="margin:0 8px;">全部展开</el-checkbox>
        <el-button v-show="!onlyread" type="warning" size="small" @click="showDifference()">仅显示差异项</el-button>
        <el-button v-show="!onlyread" type="danger" size="small" @click="showChanges()">仅显示变化项</el-button>
        <el-button v-show="!onlyread" type="primary" size="small" @click="save(1)">保存左侧数据</el-button>
        <el-button v-show="!onlyread" type="primary" size="small" @click="save(2)">保存右侧数据</el-button>
        <el-button v-show="!onlyread" type="success" size="small" @click="save(0)">保存全部数据</el-button>
        <el-button v-show="onlyread" type="danger" size="small" @click="reBack()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import entityCompare from './entityCompare.js'
export default entityCompare
</script>
<style lang="scss" scoped>
.entityComparePage {
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding: 0 8px;

  .common-info {
    border: none;
    height: 100%;
    box-sizing: border-box;

    .tree-container {
      border: $border;
      height: calc(100% - 20px);
    }

  }

  .headers-row {
    display: flex;
    border-bottom: $border;
  }

  .tree-column {
    flex: 1;
    display: flex;
    background: #f5f7fa;
    justify-content: space-between;
    padding-right: 20px;

    &:first-child {
      border-right: $border;
    }
  }

  .column-title {
    padding: 12px 16px;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
  }

  .scroll-container {
    flex: 1;
    height: calc(100% - 45px);
  }

  .trees-wrapper {
    display: flex;
    min-height: 100%;
  }

  .tree-content {
    padding: 10px;
    height: 100%;
    flex: 1;
  }

  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #606266;
    min-height: 40px;

    .info-group {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      .search-box {
        display: flex;
        align-items: center;
      }

      span {
        display: flex;
        align-items: center;
        white-space: nowrap;

        &:first-child {
          font-weight: 500;
          color: #303133;
          margin-right: 8px;
        }

        &.role-name {
          font-weight: 600;
          color: #409eff;
          background: rgba(64, 158, 255, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }

        &.checked-count {
          color: #e6a23c;
          font-weight: 500;
        }

        &.added-count {
          color: #67c23a;
          font-weight: 500;
        }

        &.removed-count {
          color: #f56c6c;
          font-weight: 500;
        }
      }
    }
  }

  .custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &.auth-removed {
      color: #f56c6c; // 红色表示权限被移除（从true变false）
      font-weight: 500;
    }

    &.auth-added {
      color: #67c23a; // 绿色表示权限被添加（从false变true）
      font-weight: 500;
    }
  }

}
</style>
