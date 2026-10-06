<template>
    <div id="monthsPicker" class="monthsPickerComponents" @click.stop="()=>false">
        <div class="select-view">
            <div class="select-tags">
                <span @click="showMonthPicker">
                    <span class="select-info" v-for="(item,index) in selectValue" :key="index">
                        <span class="select-text">{{item}}</span>
                        <i class="el-icon-close" @click.stop="delMonth(index)"></i>
                    </span>
                </span>
                <input type="text" @focus="showMonthPicker" :placeholder="selectValue.length>0?'':'选择月份'" />
                <span class="el-input__suffix">
                    <span class="el-input__suffix-inner">
                        <i class="el-select__caret el-input__icon el-icon-arrow-up" :class="{'is-reverse':isshowMonthPicker}"></i>
                    </span>
                </span>
            </div>
        </div>
        <div class="monthsPickerPopup clearfix" v-show="isshowMonthPicker">
            <div class="years">
                <el-scrollbar class="content_height" ref="scrollbar">
                    <div class="year" :class="{'active':item.active,'issel':item.isSel}" v-for="(item,index) in years" :key="index" @click="yearClick(item)">{{item.name}}</div>
                </el-scrollbar>
            </div>
            <div class="months">
                <div class="month" :class="{'active':item.active}" v-for="(item,index) in months" :key="index" @click="monthClick(item)">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import monthsPicker from './monthsPicker.js'
    export default monthsPicker
</script>
<style lang="scss">
.monthsPickerComponents{
    position: relative;
    .select-view{
        .select-tags{
            // position: absolute;
            line-height: normal;
            white-space: normal;
            // z-index: 1;
            // top: 50%;
            // -webkit-transform: translateY(-50%);
            // transform: translateY(-50%);
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            height: 35px;
            input{
                border: none;
                outline: 0;
                padding: 0;
                margin-left: 15px;
                color: #666;
                font-size: 14px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                height: 28px;
                background-color: transparent;
                flex-grow: 1;
            }
            &>span{
                display: contents;
            }
            .select-info{
                background-color: #f4f4f5;
                border-color: #e9e9eb;
                display: inline-block;
                height: 32px;
                padding: 0 10px;
                line-height: 30px;
                font-size: 12px;
                border-width: 1px;
                border-style: solid;
                border-radius: 4px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                white-space: nowrap;
                color: #909399;
                height: 24px;
                padding: 0 8px;
                line-height: 22px;
                margin: 2px 0 2px 6px;
                .el-icon-close{
                    background-color: #C0C4CC;
                    right: -7px;
                    top: 0;
                    color: #909399;
                    cursor: pointer;
                    border-radius: 50%;
                    text-align: center;
                    position: relative;
                    cursor: pointer;
                    font-size: 12px;
                    height: 16px;
                    width: 16px;
                    line-height: 16px;
                    vertical-align: middle;
                    -webkit-transform: scale(.8);
                    transform: scale(.8);
                    margin-top: -2px;
                    &:hover{
                        color: #fff;
                        background-color: #909399;
                    }
                    &::before{
                        display: block;
                        -webkit-transform: translate(0,.5px);
                        transform: translate(0,.5px);
                    }
                }
            }
            .el-input__suffix{
                transition: all .3s;
                .el-input__suffix-inner{
                    pointer-events: all;
                    .el-input__icon{
                        position: absolute;
                        top: 0;
                        right: 5px;
                        height: 35px;
                        width: 25px;
                        text-align: center;
                        line-height: 35px;
                        color: #C0C4CC;
                        font-size: 14px;
                        -webkit-transition: -webkit-transform .3s;
                        transition: -webkit-transform .3s;
                        transition: transform .3s;
                        transition: transform .3s, -webkit-transform .3s;
                        transition: transform .3s,-webkit-transform .3s;
                        -webkit-transform: rotateZ(180deg);
                        transform: rotateZ(180deg);
                        cursor: pointer;
                        &.is-reverse{
                            -webkit-transform: rotateZ(0);
                            transform: rotateZ(0);
                        }
                    }
                }
            }
        }
    }
    .monthsPickerPopup{
        box-shadow: 0 0 3px rgba(0,0,0,0.1);
        background: #fff;
        position: fixed;
        border:$border;
        height: 287px;
        z-index: 99999;
        .content_height{
            height: 100%;
            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }
        .years{
            width: 100px;
            float: left;
            text-align: center;
            height: 100%;
            border-right: $border;
            .year{
                line-height: 35px;
                border-bottom:$border;
                transition: .1s all;
                cursor: pointer;
                &:hover,&.issel{
                    background: $main-color;
                    color: #fff;
                }
                &.active{
                    background: #00ed7f;
                    color: #fff;
                }
            }
        }
        .months{
            width: 300px;
            float: left;
            .month{
                text-align: center;
                float: left;
                width: 33.33%;
                line-height: 72px;
                transition: .1s all;
                cursor: pointer;
                &:hover,&.active{
                    background: $main-color;
                    color: #fff;
                }
            }
        }
    }
}
</style>