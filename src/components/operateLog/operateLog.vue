<template>
    <div id="operateLog" class="operateLogComponents">
        <div class="logListCommon">
            <div class="title clearfix">
                <div class="time">
                    时间
                </div>
                <div class="operator">
                    操作人
                </div>
                <div class="news">
                    最新动态
                </div>
            </div>
            <el-scrollbar class="content" ref="scrollbar">
                <div class="item clearfix" :class="{'first':index==0}" v-for="(item,index) in list" :key="index">
                    <div class="time">
                        {{ item.createDate }}
                    </div>
                    <div class="operator">
                        {{ item.createUserName }}
                    </div>
                    <div class="news">
                        {{ item.content }}
                        <!--{{ item.remark }}-->
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import operateLog from './operateLog.js'

export default operateLog
</script>
<style lang="scss" scoped>
.operateLogComponents {
    height: calc(100% - 60px);
    background: #fff;
    border: $border;
    box-sizing: border-box;

    .logListCommon {
        height: 100%;

        .content {
            height: calc(100% - 40px);

            /deep/ .el-scrollbar__wrap {
                overflow-x: hidden;
            }
        }
    }
}
</style>