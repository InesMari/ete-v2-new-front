<template>
    <div id="selectTenant" class="selectTenantPage">
        <div class="header">
            <img class="logo" src="@/static/image/logo.png" alt="">
        </div>
        <div class="content">
            <h2 class="title">公司：</h2>
            <div class="list clearfix">
                <div class="item" v-bind:class="{ active: selTenantId==tenant.id }" @click="selTenant(tenant)" v-for="tenant in tenantList" :key="tenant.id" >{{tenant.name}}</div>
            </div>
            <h2 class="title" v-show="orgList.length>0">组织：</h2>
            <div class="list clearfix" v-show="orgList.length>0">
              <div class="item" v-bind:class="{ active: selOrgId==org.id }" @click="selOrg(org)" v-for="org in orgList" :key="org.id" >{{org.name}}</div>
            </div>
            <div class="bot-btn">
                <el-button type="primary" @click="commitSelTenant()">确认</el-button>
                <el-button @click="back()">返回</el-button>
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
