<template>
    <div id="selectTenant" class="selectTenantPage">
        <div class="header">
            <img class="logo" src="@/static/image/logo.png" alt="">
        </div>
        <div class="content">
            <h2 class="title">租户：</h2>
            <div class="list clearfix">
                <div class="item active">广东易迁易科技公司</div>
                <div class="item">广东易迁易</div>
                <div class="item">广东易迁易</div>
                <div class="item">名字很长很长试试名字很长很长试试名字很长很长试试名字很长很长试试</div>
            </div>
            <h2 class="title">组织：</h2>
            <div class="list clearfix">
                <div class="item active">组织一</div>
                <div class="item">组织二</div>
                <div class="item">组织三</div>
                <div class="item">组织四组织四组织四组织四组织四组织四组织四</div>
            </div>
            <div class="bot-btn">
                <el-button type="primary">确认</el-button>
<!--                <el-button>返回</el-button>-->
            </div>
        </div>
    </div>
</template>

<script>
    import selectTenant from './selectTenant.js'
    export default selectTenant
</script>
<style lang="scss">
.selectTenantPage{
    height: 100%;
    .header{
        background: #fff;
        height: 80px;
        border-bottom:$border;
        box-sizing: border-box;
        img{
            height: 50px;
            margin:15px 0 0 20px;
        }
    }
    .content{
        height: calc(100% - 130px);
        margin: 20px 20px 0;
        border:$border;
        border-radius: 5px;
        background: #fff;
        padding: 0 20px;
        position: relative;
        padding-bottom: 80px;
        box-sizing: border-box;
        .title{
            font-size: 18px;
            line-height: 80px;
            font-weight: bold;
        }
        .list{
            .item{
                float: left;
                border:$border;
                border-radius: 3px;
                width: 180px;
                height: 120px;
                display: flex;
                align-items:center;
                justify-content: center;
                text-align: center;
                line-height: 24px;
                cursor: pointer;
                margin-right: 20px;
                font-size: 14px;
                padding: 12px;
                box-sizing: border-box;
                &.active,&:hover{
                    border:1px solid $main-color;
                    color: $main-color;
                }
            }
        }
        .bot-btn{
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
        }
    }
}
</style>
