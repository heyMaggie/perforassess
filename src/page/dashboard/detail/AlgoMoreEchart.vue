<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> Dashboard / 查看更多</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="card">
            <div @click="goBack" class="backRow"><span class="backIcon icon el-icon-arrow-left"></span>返回</div>
            <div class="main1" id="main1"></div>
            <div class="blue-card">
                <a class="minW-card" v-for="j in 14" :key="j">
                    <div v-for="i in 4" :key="i">
                        <div class="dot" :style="{ background: colorList[i] }"></div>
                        <span class="algoName">算法{{ i }}</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
    data() {
        return {
            colorList: ['#65A6FF', '#34B7FE', '#59CC7F', '#FAD337']
        };
    },
    mounted() {
        let list = {
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            series: [
                { y: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
                { y: ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'] },
                { y: ['31', '33', '33', '34', '35', '36', '37', '38', '39', '30', '31', '33'] },
                { y: ['41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52'] }
            ]
        };
        this.generateChart(list, 'main1');
    },
    methods: {
        goBack() {
            this.$router.push('/dashboard');
        },
        generateChart(list, type) {
            if (list.length == 1) {
                list.push({ x: '', y: list[0].y });
            }
            let isNull = list.length ? false : true;
            let seriesList = list.series;
            if (list.length == 0) {
                message.error('该时间段暂无数据');
                isNull = true;
            } else {
                isNull = false;
                let colorList = ['#65A6FF', '#34B7FE', '#59CC7F', '#FAD337'];
                seriesList.forEach((item, i) => {
                    item.name = '算法' + (i + 1);
                    item.data = item.y;
                    item.type = 'line';
                    item.smooth = true;
                    item.showSymbol = false;
                    item.itemStyle = {
                        normal: {
                            color: colorList[i]
                        }
                    };
                    item.areaStyle = {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: colorList[i]
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(255,255,255,0)'
                                    }
                                ],
                                false
                            ),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    };
                });
            }
            let option = {
                title: {
                    text: '算法绩效',
                    textStyle: {
                        color: '#333333',
                        fontSize: 20,
                        fontWeight: 500
                    }
                },
                textStyle: {
                    color: '#333'
                },

                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#1F2329',
                    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1F2329',
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    left: '5px',
                    right: '10px',
                    bottom: '20px',
                    // top: '60px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: list.x,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#E9E9E9',
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        // interval: 0,
                        // rotate: 30,
                    },
                    axisTick: {
                        show: true, //显示X轴刻度
                        lineStyle: {
                            color: '#E9E9E9'
                        }
                    },
                    axisLine: {
                        // 刻度线的颜色
                        show: false
                    },
                    axisPointer: {
                        type: 'line',
                        lineStyle: { color: '#BDBEBF' }
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: `单位：（%）`,
                        axisLine: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#666'
                        },
                        axisTick: {
                            show: false //隐藏X轴刻度
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E9E9E9',
                                type: 'dashed'
                            }
                        },
                        nameTextStyle: {
                            padding: [0, 0, 0, 25]
                        },
                        min: isNull ? 0 : null,
                        max: isNull ? 100 : null
                    }
                ],
                series: seriesList
            };
            var myChart = echarts.init(document.getElementById(type));
            myChart.setOption(option);
            myChart.resize();
        }
    }
};
</script>
<style lang="less" scoped>
.card {
    height: 88vh;
    .backRow {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #666666;
        cursor: pointer;
        margin: 0 -24px 0px;
        padding: 0 24px 16px;
        border-bottom: #ececec 1px solid;
        .backIcon {
            color: #91a2bd;
            margin-right: 10px;
        }
    }
    .main1 {
        height: 326px;
        width: 100%;
        margin-top: 16px;
    }
    .blue-card {
        // width: 1608px;
        height: 125px;
        background: #f2f4fb;
        padding: 16px 13px 0px;
        .minW-card {
            width: 238px;
            height: 28px;
            background: #ffffff;
            box-shadow: 0px 6px 16px 0px rgba(198, 208, 224, 0.46);
            border-radius: 5px;
            display: inline-block;
            margin-right: 8px;
            margin-bottom: 4px;
            overflow: hidden;
            padding-left: 10px;
            // padding-right: 10px;
            line-height: 28px;
            box-sizing: border-box;
            cursor: pointer;
            &:active {
                background: #e3f1ff;
            }
            div {
                display: inline-block;
                margin-right: 18px;
                &:nth-child(4) {
                    margin-right: 0px;
                }
            }
            .dot {
                width: 6px;
                height: 6px;
                background: #1890ff;
                border-radius: 50%;
                display: inline-block;
                margin-right: 3px;
                margin-bottom: 1px;
            }
            .algoName {
                font-size: 12px;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: #999999;
                line-height: 22px;
            }
        }
    }
}
</style>
