<template>
    <div id="selectWork" class="selectWorkPage">
        <div class="content">
            <h2 class="title">仓库：</h2>
            <div class="list clearfix">
                <div class="item" v-bind:class="{ active: selWorkId==item.workId }" @click="selTenant(item)" v-for="item in workList" :key="item.workId" >{{item.workName}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import selectWork from './selectWork.js'
    export default selectWork
</script>
<style lang="scss">
.selectWorkPage{
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
        height: auto;
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
                margin-bottom: 20px;
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
