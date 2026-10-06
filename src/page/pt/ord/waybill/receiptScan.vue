<template>
  <div id="receiptScan" class="receiptScanPage">
    <div class="receiptScanContent">
        <el-input 
            type="text" 
            ref="inputRef"
            @keyup.enter.native="handleEnterKey"
            v-model="inputValue"
            placeholder="请扫描或输入派车单号"
            clearable
        ></el-input>
    </div>
    <div class="table_height">
        <el-empty v-if="tableData.length === 0" description="暂无数据，请扫描回单二维码"></el-empty>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-else>
            <thead class="fixed-thead">
                <tr>
                    <th width="60">序号</th>
                    <th :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,index) in head" :key="index">{{hd.name}}</th>
                </tr>
            </thead>
            <tbody class="fixed-tbody">
                <tr v-for="(data,index) in tableData" :class="data.class" :key="index">
                    <td width="60">{{index+1}}</td>
                    <td :width="hd.width == undefined ? defaultW : hd.width" v-for="(hd,i) in head" :key="i" :title="data[hd.code]">
                        <a class="link" v-if="hd.code == 'waybillNum'" @click="toDetail(data.waybillId)">{{data[hd.code]}}</a>
                        <el-button v-else-if="hd.code == 'operation'" type="text" size="small" @click="deleteItem(index)">删除</el-button>
                        <span v-else>{{data[hd.code]}}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="page-bot-btn">
    <el-button type="primary" @click="confirmReceipt">确认收单</el-button>
    <el-button @click="close">关闭</el-button>
    </div>
  </div>
</template>

<script>
import receiptScan from './receiptScan.js'
export default receiptScan
</script>
<style lang="scss" scoped>
.receiptScanPage{
    background: #fff;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;

    .receiptScanContent{
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;

        .el-input {
            width: 500px;
            font-size: 16px;
        }
    }

    .table_height{
        flex: 1;
        overflow: auto;
        border: 1px solid #EBEEF5;
        border-radius: 4px;
    }

    .page-bot-btn {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
        padding-bottom: 20px;
    }

    .link {
        color: #409EFF;
        cursor: pointer;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
}
</style> 