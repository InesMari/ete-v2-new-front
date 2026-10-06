<template>
    <div id="entityButton" class="entityButtonPage">
        <div class="treeView">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          
          <el-scrollbar class="treeScroll">
            <el-tree
                :data="treeData"
                node-key="id"
                ref="tree"
                @node-click="selMenu"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="notCon" v-show="!isSelMenu">请选择菜单</div>
        <div class="conView" v-show="isSelMenu">
          <div class="level">当前操作菜单：{{ levelStr }}</div>
          <div class="tableView">
            <!-- <div class="entitySel">
              <el-radio v-model="menuSel" border size="small" :label="item.id" :key="item.id" v-for="item in entityArray" @change="getRoleEntity(item.id)">{{ item.entityName }}</el-radio>
            </div> -->
            <div class="tableTile">
              <div class="title1">未授权角色列表</div>
              <div class="title2">已授权角色列表</div>
            </div>
            <dbTable tableName="entityButtonTable" ref="dbTable" :head="head" onlyId="roleId" @dataChange="dbTableChange"></dbTable>
          </div>
          
          <div class="bot-btn">
            <el-button @click="close()">关闭</el-button>
            <el-button type="primary" @click="save">确定修改</el-button>
            <el-button type="success" @click="copyEntity" v-show="!copyEntityList">复制角色列表</el-button>
            <el-button type="danger" @click="clearCopy" v-show="copyEntityList">取消复制</el-button>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  import entityButton from './entityButton.js'
  export default entityButton
  </script>
  <style lang="scss" scoped>
  .entityButtonPage{
    display: flex;
    /deep/ .treeView{
      width: 250px;
      background: #fff;
      border:$border;
      height: 100%;
      box-sizing: border-box;
      .el-input{
        margin: 20px;
        display: block;
        width: auto;
      }
      .treeScroll{
        height: calc(100% - 80px);
        box-sizing: border-box;
        .el-tree{
          padding:0 20px 20px;          
        }
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
        .el-tree-node__content{
          height: 32px;
        }
        .el-tree-node__label{
          word-break: break-all;
          white-space: normal;
        }
        .is-current{
          &>.el-tree-node__content{
            background: #F5F7FA;
          }
        }
      }
    }
    .notCon{
      border:$border;
      flex: 1;
      margin-left: 20px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5vw;
      color: #999;
    }
    /deep/ .conView{
      flex: 1;
      margin-left: 20px;
      background: #fff;
      border:$border;
      .level{
        color: $main-color;
        font-size: 14px;
        padding: 15px 20px;
        border-bottom: $border;
      }
      .tableView{
        padding: 15px 20px;        
        .entitySel{
          margin-bottom:15px  ;
          .el-radio{
            margin: 0 15px 10px 0;
            margin-left: 0!important;
          }
        }
        .tableTile{
          display: flex;
          .title1,.title2{
            flex: 1;
            font-size: 14px;
            padding-left:20px;
            position: relative;
            line-height: 40px;
            &::after{
              content: "";
              width: 10px;
              height: 10px;
              border-radius: 50%;
              position: absolute;
              background: $main-color;
              top:15px;
              left:3px;
            }
          }
          .title2{
            margin-left: 2%;
            &::after{
              background: red;
            }
          }
        }
        .table_height{
          height: calc(100vh - 380px);
          border:$border;
          .tfoot{
            display: none;
          }
          .newAdd{
            td{
              color: red;
            }
          }
          .copy{
            td{
              color: $main-color;
            }
          }
        }
      }
    }
  }
  </style>
  