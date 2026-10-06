<template>
    <div id="storageFeeSummarManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" @clearFn="initQuery" searchKey="storageFeeSummarManageSearch"></searchList>
      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓库收支明细列表</span>
                    <el-tooltip effect="light" content="仓库收支明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="storageFeeSummarManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='totalIncome'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='totalCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='warehouseLeaseCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='fixPersonCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='servicePersonCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='temporaryServiceCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='equipmentBuyCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='equipmentLeaseCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='waybillCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='deviceCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='packagingCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='upstairsCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='recyclingCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                    <a href="javascript:void(0);" class="link"
                       @click.stop="goto(item, code)"
                       v-if="code=='consumableCost'">{{item[code] > 0 ? item[code] : null}}
                    </a>
                </template>
            </tableCommon>
        </div>

    </div>
</template>

<script>
import storageFeeSummarManage from './storageFeeSummarManage.js'
export default storageFeeSummarManage
</script>
<style lang="scss">

</style>




