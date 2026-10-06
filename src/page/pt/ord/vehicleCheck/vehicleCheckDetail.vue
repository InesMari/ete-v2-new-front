<template>
    <div id="vehicleCheckDetail">
        <div class="common-info" id="printTable" style="padding:0 0 50px;position:relative;">
            <div style="text-align: center;font-weight: bold;font-size: 16px;line-height:70px;">
                <img style="height: 50px;position: absolute;left: 10px;top: 10px;" src="@/static/image/logo.png">定期、移库车辆点检表
            </div>
            <div class="baseTitle"></div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable">
                <tr>
                    <td style="width:90px;" class="label">提交日期</td>
                    <td class="value">{{ info.submitDate }}</td>

                    <td v-if="type != 3" style="width:90px;" class="label">所属车队</td>
                    <td v-if="type != 3" class="value">{{ info.tenantName }}</td>
                    <td v-if="type == 3" style="width:90px;" class="label">派车单号</td>
                    <td v-if="type == 3" class="value">{{ info.waybillNum }}</td>

                    <td style="width:90px;" class="label">线路名称</td>
                    <td class="value">{{ info.routeName }}</td>
                </tr>
                <tr>
                    <td class="label">车头号码</td>
                    <td class="value">{{ info.plateNumber }}</td>
                    <td class="label">挂车号码</td>
                    <td class="value">{{ info.trailerNumber }}</td>
                    <td class="label">到厂时间</td>
                    <td class="value">{{ info.arriveDate }}</td>
                </tr>
            </table>
            <div class="baseTitle">点检信息</div>            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable">
                <tr>
                    <td style="width:100px" class="label">点检项目</td>
                    <td style="width:200px" class="label">要求</td>
                    <td style="width:50px" class="label">检查结果</td>
                </tr>
                <tr v-for="item in info.checkList" >
                    <td class="label">{{ item.itemName }}</td>
                    <td class="value" v-html="item.requirements"></td>
                    <td class="value">{{ item.checkStateName }}</td>
                </tr>
            </table>
            <div class="baseTitle">点检意见</div>           
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable">
                <tr>
                    <td class="label">人员类型</td>
                    <td class="label">异常记录</td>
                    <td class="label">确认人</td>
                </tr>
                <tr>
                    <td class="value">司机</td>
                    <td class="value">{{ info.submitRemark }}</td>
                    <td class="value">{{ info.submitUserName }}</td>
                </tr>
                <tr>
                    <td class="value">运作专员</td>
                    <td class="value">{{ info.confirmRemark }}</td>
                    <td class="value">{{ info.confirmUserName }}</td>
                </tr>
                <tr>
                    <td class="value fw">注</td>
                    <td class="value fw" colspan="2">此表由司机自主点检，司机点检后由现场运作专员确认交管理部门存档，保存期限三个月</td>
                </tr>
            </table>    
        </div>

        <div class="uploadFile clearfix" v-if="info.fileList.length>0 && type != 3">
            <div class="imgList fl">
                <img v-for="item in info.fileList" @click="showTickerImg(item.fileUrl)" :src="item.fileUrl" alt="">
            </div>
        </div>
        <div class="bot-btn" v-if="type != 2">
            <el-button type="success" v-if="type == 1" @click="review(1)">确认通过</el-button>
            <el-button type="danger" v-if="type == 1" @click="review(2)">确认不通过</el-button>
            <el-button type="primary" v-if="type == 3" @click="print()">打印</el-button>
        </div>
        
        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
    import vehicleCheckDetail from './vehicleCheckDetail.js'
    export default vehicleCheckDetail
</script>
<style lang="scss" scoped>
#vehicleCheckDetail {
    padding-bottom: 50px;
    height: auto;
    .fillTable{
        table-layout: fixed;
        td{
            padding: 3px 10px;
            &.label{
                background: #f2f2f2;
                color:#333;
            }
            &.value{
                color:#333;
            }
        }
    }
    .baseTitle{
        text-align: center;
        line-height: 45px;
        color: #333;
        font-size: 14px;
        font-weight: bold;
    }
    .uploadFile{
      padding: 20px;
      background: #fff;
      border:$border;
      margin-top: 20px;
      p{
        text-align: center;
      }
      .imgList{
        img{
          width:110px;
          height: 110px;
          border-radius: 5px;
          overflow: hidden;
          float: left;
          margin-left: 20px;
        }
      }
      .form{
        line-height: 110px;
        font-weight: bold;
        font-size: 14px;
        button{
          margin-left: 20px;
        }
      }
    }
}
</style>
