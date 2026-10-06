<template>
    <div id="waybillDetail" class="wayBillDetailPage dispatchPage orderPage">
      <waybillLog ref="waybillLog" :opLogList="data.opLogList"></waybillLog>
      <map-track ref="mapTrack" :isHz="1"></map-track>
    </div>
</template>

<script>
	import waybillDetail from './waybillDetail.js'
	export default waybillDetail
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
    .mapTrackPage {
      .bm-view {
        height: 55vh;
      }
    }
    .wayBillDetailPage {
        background: #fff;
        border: $border;
        box-sizing: border-box;
        padding-right: 0;
        .innerTab {
            border: none;
        }
        .logListCommon {
            margin-top: 20px;
            border-bottom: $border;
            .content_height {
                height: 150px;
                .el-scrollbar__wrap {
                    overflow-x: hidden;
                }
            }
        }
        .tableCommonComponents {
            .tableCommon {
                border: none;
                td, th {
                    height: 30px;
                }
            }
        }
    }
</style>
