<template>
    <div id="vehicleMonthDetail">
        <div class="common-info flex">
            <div class="dateTitle">
                数据年月：
                <div class="value">
                    <el-select v-model="info.id" clearable filterable placeholder="请选择月份" size="mini"
                        style="width: 120px;" @change="changeMonth">
                        <el-option v-for="item in months" :key="item.id" :label="item.month"
                            :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <h3 class="common-title"><span class="title-name">分项数据合计</span></h3>
            <ul class="content clearfix" style="margin-top:10px;">
                <li class="item">
                    <div class="label-term">总收入合计：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070001" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">固定成本合计：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070002" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">变动成本合计：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070003" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">总成本合计：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070004" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">总毛利合计：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070005" placeholder="请输入"></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content">
                <li class="item">
                    <div class="label-term">总车队费用：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070006" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">总车贷利息：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070007" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">总ETC利息：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070008" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">总三费分摊：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070009" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">总净利合计：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code20070010" placeholder="请输入"></el-input>
                    </div>
                </li>
            </ul>
            <h3 class="common-title">
                <span class="title-name">分项数据 - 油车</span>
                <div class="total">
                    <div class="item">
                        <el-tooltip effect="light" content="总毛利 - 车队间接费用 - ETC利息 - 公司三费分摊" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总净利：{{ info.code20030019 }}
                    </div>
                    <div class="item">
                        <el-tooltip effect="light" content="本项总收入 - 固定成本合计 - 变动成本合计" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总毛利：{{ info.code20030015 }}
                    </div>
                </div>
            </h3>
            <div class="dataView">
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <div class="label">总收入</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030001"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">折旧</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030003"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">保险</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030004"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">司机工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030005"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">押运工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030006"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">社保及福利</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030007"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">固定成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20030008" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">油费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030010"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030011"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">修理费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030012"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">其他(耗费备品备件)</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030013"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">变动成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20030014" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">车队间隔费用</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030016"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC利息</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030017"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">三费分摊</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20030018"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="common-title">
                <span class="title-name">分项数据 - LNG - 旧</span>
                <div class="total">
                    <div class="item">
                        <el-tooltip effect="light" content="总毛利 - 车队间接费用 - 车贷利息 - 公司三费分摊" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总净利：{{ info.code20040020 }}
                    </div>
                    <div class="item">
                        <el-tooltip effect="light" content="本项总收入 - 固定成本合计 - 变动成本合计" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总毛利：{{ info.code20040015 }}
                    </div>
                </div>
            </h3>
            <div class="dataView">
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <div class="label">总收入</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040001"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">折旧</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040003"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">保险</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040004"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">司机工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040005"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">押运工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040006"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">社保及福利</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040007"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">固定成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20040008" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">燃气费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040010"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040011"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">修理费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040012"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">其他(耗费备品备件)</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040013"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">变动成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20040014" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">车队间隔费用</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040016"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">车贷利息</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040017"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC利息</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040018"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">三费分摊</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20040019"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="common-title">
                <span class="title-name">分项数据 - 电车</span>
                <div class="total">
                    <div class="item">
                        <el-tooltip effect="light" content="总毛利 - 车队间接费用 - 车贷利息 - 公司三费分摊" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总净利：{{ info.code20050020 }}
                    </div>
                    <div class="item">
                        <el-tooltip effect="light" content="本项总收入 - 固定成本合计 - 变动成本合计" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总毛利：{{ info.code20050015 }}
                    </div>
                </div>
            </h3>
            <div class="dataView">
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <div class="label">总收入</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050001"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">折旧</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050003"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">保险</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050004"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">电池租金</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050005"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">司机工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050006"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">社保及福利</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050007"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">固定成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20050008" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">电费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050010"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050011"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">修理费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050012"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">其他(耗费备品备件)</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050013"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">变动成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20050014" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">车队间隔费用</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050016"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">车贷利息</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050017"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC利息</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050018"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">三费分摊</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20050019"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="common-title">
                <span class="title-name">分项数据 - LNG</span>
                <div class="total">
                    <div class="item">
                        <el-tooltip effect="light" content="总毛利 - 车队间接费用 - 车贷利息 - 公司三费分摊" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总净利：{{ info.code20060020 }}
                    </div>
                    <div class="item">
                        <el-tooltip effect="light" content="本项总收入 - 固定成本合计 - 变动成本合计" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总毛利：{{ info.code20060015 }}
                    </div>
                </div>
            </h3>
            <div class="dataView">
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <div class="label">总收入</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060001"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">折旧</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060003"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">保险</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060004"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">电池租金</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060005"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">司机工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060006"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">社保及福利</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060007"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">固定成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20060008" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">燃气费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060010"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060011"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">修理费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060012"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">其他(耗费备品备件)</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060013"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">变动成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code20060014" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <!-- 不删，当间隔用 -->
                        </div>
                        <div class="item">
                            <div class="label">车队间隔费用</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060016"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">车贷利息</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060017"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC利息</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060018"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">三费分摊</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code20060019"
                                    placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="common-title" v-if="type != 1 || info.verifySts != 0">
                <span class="title-name">审核信息</span>
            </h3>
            <div class="review" v-if="type != 1 || info.verifySts != 0">
                <div class="item" style="flex:0.5;">
                    <div class="label">审核状态：</div>
                    <div class="value">
                        <el-input :disabled="true" v-model="info.verifyStsName"></el-input>
                    </div>
                </div>
                <div class="item" v-if="info.verifySts != 0">
                    <div class="label">审核人：</div>
                    <div class="value">
                        <el-input :disabled="true" :value="info.verifyUserName + '   ' + info.verifyDate"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="label">审核意见：</div>
                    <div class="value">
                        <el-input v-if="info.verifySts == 0 && type == 2" :disabled="false"
                            v-model="info.verifyRemark"></el-input>
                        <el-input v-else :disabled="true" v-model="info.verifyRemark"></el-input>
                    </div>
                </div>
            </div>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="changeData" v-if="!disabled"
                    v-entity="1007163">修改</el-button>
                <el-button type="danger" @click="del" v-if="!disabled"
                    v-entity="1007164">删除</el-button>
                <el-button type="primary" @click="verify(1)" v-if="type == 2 && info.verifySts == 0"
                    v-entity="1007165">审核通过</el-button>
                <el-button type="danger" @click="verify(2)" v-if="type == 2 && info.verifySts == 0"
                    v-entity="1007165">审核不通过</el-button>
                <el-button type="danger" @click="cancelVerify" v-if="info.verifySts!=0" v-entity="1007166">取消审核</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import vehicleMonthDetail from './vehicleMonthDetail.js'
export default vehicleMonthDetail
</script>
<style lang="scss" scoped>
#vehicleMonthDetail {
    .common-title {
        .total {
            float: right;

            .item {
                float: left;
                margin-right: 20px;
                line-height: 30px;
                font-weight: bold;
            }
        }
    }

    .dateTitle {
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }

    .common-info {
        .content {
            display: flex;

            .item {
                min-width: initial;
                flex: 1;

                .label-term {
                    width: 88px;
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    /deep/ .dataView {
        .dataItem {
            overflow: hidden;

            .editList {
                padding: 10px 0;
                float: left;
                display: flex;
                flex-wrap: nowrap;
                width: calc(100% - 230px);
                overflow-x: auto;
                overflow-y: hidden;

                .item {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    width: 120px;
                    margin-right: 20px;
                    min-height: 10px;

                    .label {
                        margin-bottom: 5px;
                    }

                    .value {
                        .el-input__inner {
                            text-align: center;
                        }
                    }
                }
            }

            .totalData {
                float: right;
                width: 200px;
                text-align: center;
                padding: 10px 0;

                .label {
                    margin-bottom: 5px;
                }

                .value {
                    .el-input__inner {
                        text-align: center;
                    }
                }
            }
        }
    }

    .review {
        display: flex;
        height: 40px;

        .item {
            display: flex;
            align-items: center;
            flex: 1;
        }

        .label {
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .value {
            flex: 1;
        }
    }
}
</style>
