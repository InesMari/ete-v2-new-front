<template>
    <div id="commonOpLog">
        <el-dialog title="操作记录" :visible.sync="isshowDialog" @close="hideDialog" width="450px">
            <div class="logListCommon">
                <div class="content">
                    <div class="item clearfix" :class="{'first':index==0}" v-for="(item,index) in list" :key="index">
                    <div class="operator">
                        {{ item.createDate }} <br>
                        操作人：{{ item.createUserName }}
                    </div>
                    <div class="news">
                        {{ item.opContent }}
                    </div>
                    </div>
                </div>
            </div>
            <div class="page-bot-btn ">
                <el-button size="mini" @click="hideDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import commonOpLog from './commonOpLog.js'
    export default commonOpLog
</script>

<style lang="scss">
#commonOpLog{
    .el-dialog__body{
        padding: 0;
    }
    .page-bot-btn{
        margin:0;
        padding: 15px 0;
        border-top:$border;
    }
    .logListCommon{
        max-height: 350px;
        overflow: auto;
        padding: 30px 20px;
        .operator{
            width:250px;
        }
        .item.first::before{
            left: 223px;
        }
        .item::before{
            left: 226px;
        }
        .content::after{
            left:230px;
        }
        .news{
            width:auto;
            color: $tip-color;
        }
    }
}
</style>
