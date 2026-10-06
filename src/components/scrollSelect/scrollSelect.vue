<template>
    <div id="scrollSelect" class="scrollSelect">
        <el-popover
            placement="bottom"
            :append-to-body="false"
            class="popoverView"
            v-model="showPopover"
            @show="initData"
            trigger="click">
            <div slot="reference">                        
                <input type="text" @input="inputData" @blur="blurSelect" v-model="value" :placeholder="placeholder">
                <i class="el-icon-circle-close delIcon" v-if="value" @click="clear" ></i>
            </div>
            <div class="searchList" ref="searchList">
                <div class="groupList">
                    <div class="list">
                        <div class="item" v-for="item in selectDataShow" @click="selectItem(item)">
                          <!-- 默认插槽 -->
                            <div class="name" v-if="$scopedSlots.default">
                              <slot :item="item"></slot>
                            </div>
                            <div class="name" v-else>
                              <span>{{ item[label] }}</span>
                            </div>
                        </div>
                    </div>
                </div>                        
                <div class="noData" v-show="selectDataShow.length==0">无数据</div>
            </div>
        </el-popover>
    </div>
</template>

<script>
import scrollSelect from "./scrollSelect";
export default scrollSelect;
</script>
<style lang="scss" scoped>
.scrollSelect{
    
  /deep/ .popoverView{
    .el-popover{
      box-sizing: border-box;
      width: 100%;
      padding: 6px 0;
    }
    .delIcon{
      color:#666;
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 0.5;
      cursor: pointer;
      &:hover{
        opacity: 1;
      }
    }
    input{
      width: 100%;
      padding: 0 12px;
      border: none;
      text-align: center;
      display: block;
      box-sizing: border-box;
      &::placeholder{
        font-weight: bold;
      }
    }
    .searchList{
      max-height: 300px;
      overflow-y: auto;
      .title{
        font-size: 12px;
        color: #909399;
        line-height: 30px;
        font-weight: normal;
        padding:0 20px;
      }
      .list{
        .item{          
          padding-right: 40px;
          font-size: 14px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #606266;
          height: 34px;
          line-height: 34px;
          box-sizing: border-box;
          cursor: pointer;
          padding:0 40px 0 20px;
          .name{
            font-weight: normal;
          }
          &:hover{
            background-color: #f5f7fa;
          }
          .unit{
            position: absolute;
            right: 10px;
            color: #0379FF; 
            font-size: 13px;
            z-index: 8;
          }
        }
      }
    }
    .noData{
      text-align: center;
      line-height: 36px;
      font-size: 14px;
    }
  }
}
</style>
