<template>
    <div id="vehicleMonitorPosition" class="vehicleMonitorPositionPage">
        <div class="map-popup-top">
            <!-- 第一行：主要筛选条件 -->
            <div class="popup-row">
                <div class="popup-item">
                    <label class="label-term">查自有车：</label>
                    <el-checkbox v-model="query.isOwn" @change="doQuery"></el-checkbox>
                </div>
                <div class="popup-item">
                    <label class="label-term">车牌号码：</label>
                    <el-input class="queryIpt" v-model="query.plateNumber" type="textarea"
                              :class="{ textareaFocus: textareaFocus }"
                              @focus="setTextareaFocus"
                              @blur="setTextareaFocus"
                              prefix-icon="el-icon-search"
                              autocomplete="new-password"
                              @keydown.native="textareaKeyup"
                              @input="$forceUpdate()"
                              placeholder="请输入车牌号查询">
                    </el-input>
                </div>
                <div class="popup-item">
                    <label class="label-term">供应商：</label>
                    <el-select v-model="query.supplierId" filterable multiple clearable collapse-tags
                                placeholder="请输入后选择供应商"
                               remote reserve-keyword :remote-method="remoteSearchSupplier" :loading="selectLoading"
                               @change="onSupplierChange">
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.supplierName"
                                   :value="item.tenantId"></el-option>
                    </el-select>
                </div>
                <div class="popup-item">
                    <label class="label-term">客户：</label>
                    <el-select v-model="query.tenantIds" placeholder="请输入后选择客户" multiple filterable clearable collapse-tags                               
                                remote reserve-keyword :remote-method="remoteSearchCustomer" :loading="selectLoading"
                               @change="onCustomerChange">
                        <el-option v-for="item in customerData" :key="item.id" :label="item.name"
                                    :value="item.tenantId"></el-option>
                    </el-select>
                </div>
            </div>
            <!-- 第二行：次要筛选条件 -->
            <div class="popup-row">
                <div class="popup-item">
                    <label class="label-term">所有人：</label>
                    <el-input class="queryIpt queryIpt--sm" v-model="query.vehicleOwner" @blur="doQuery"></el-input>
                </div>
                <div class="popup-item">
                    <label class="label-term">车辆状态：</label>
                    <el-select v-model="query.vehicleStateId" clearable @change="doQuery" placeholder="请选择">
                        <el-option label="空闲中" :value="0"></el-option>
                        <el-option label="运作中" :value="1"></el-option>
                    </el-select>
                </div>
                <div class="popup-item">
                    <label class="label-term">车型车长：</label>
                    <el-input class="queryIpt queryIpt--sm" v-model="query.vehicleTypeLength" @blur="doQuery"></el-input>
                </div>
                <div class="popup-item">
                    <label class="label-term">在线期：</label>
                    <el-select v-model="query.nDay" placeholder="请选择在线期" filterable collapse-tags>
                        <el-option v-for="item in dayData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="btn-view">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="doQuery()">查询</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="clearQuery()">清空</el-button>
            </div>
        </div>
        <!-- 地图 -->
        <div id="mapId" class="bm-view"></div>
    </div>
</template>

<script>
import vehicleMonitorPosition from './vehicleMonitorPosition.js'

export default vehicleMonitorPosition;
</script>
<style lang="scss">
.vehicleMonitorPositionPage {
    position: relative;
    height: 100%;
    border: $border;
    box-sizing: border-box;

    .map-popup-top {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        padding: 8px 110px 8px 16px;
        border-bottom: $border;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.92);

        .popup-row {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px 16px;

            &:first-child {
                margin-bottom: 6px;
            }
        }

        .popup-item {
            display: flex;
            align-items: center;
            white-space: nowrap;
            flex-shrink: 0;
            flex:1;

            &:first-child{
                flex: 0.5;
            }

            &--grow {
                flex: 1;
                min-width: 200px;
            }
        
            &>div{
                flex: 1;
            }
        }

        .label-term {
            font-size: 13px;
            color: #606266;
            margin-right: 4px;
            width:60px;
        }

        .el-input__inner {
            height: 30px;
        }

        .btn-view{
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
            justify-content: center;
            width: 110px;
        }
        .el-button {
            margin:0;
        }

        .el-input__icon {
            line-height: 30px;
        }

        .el-textarea__inner {
            height: 30px;
            resize: none;
            line-height: 20px;

            &::placeholder {
                font-size: 12px;
                line-height: 24px;
            }
        }
    }

    .map-popup-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        border-top: $border;
        background: #fff;
        box-sizing: border-box;

        .item {
            float: left;
            line-height: 40px;
            font-size: 12px;
            padding: 0 30px 0 20px;
            position: relative;

            > span {
                font-weight: bold;
                margin-left: 20px;
            }

            &.all {
                color: #fff;
                background: red;
            }

            &::before {
                content: "";
                position: absolute;
                right: 0;
                top: 8px;
                border-right: $border;
                height: 24px;
            }

            &.all::before {
                display: none;
            }
        }
    }

    .bm-view {
        height: 100%;
        width: 100%;
    }

    .textareaFocus {
        position: relative;
        z-index: 99;

        .el-textarea__inner {
            height: 60px !important;
            border: 1px solid #DCDFE6 !important;
            box-sizing: border-box;
        }
    }
}
</style>
