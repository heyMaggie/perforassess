<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>用户画像</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline search-row">
            <div class="input-area">
                <el-form-item>
                    <el-select v-model="searchForm.provider" clearable placeholder="厂商">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algo_type" clearable placeholder="算法类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algo_id" clearable placeholder="算法">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.user_id" clearable placeholder="用户ID">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="searchForm.timeRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="button-right">
                <div class="box1">
                    <span class="capital">资金：</span>
                    <span class="treasure">￥18271982190</span>
                    <span class="capital">盈亏：</span>
                    <span class="profit-loss">-121121</span><span class="icon">亏损</span>
                </div>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </div>
        </el-form>
        <div class="echart-container">
            <div class="showBorder">
                <div class="card">
                    <div class="card-title">登录次数</div>
                    <div class="circular">
                        <span class="number">12<span class="unit">次</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">交易次数</div>
                    <div class="circular special-green">
                        <span class="number">12<span class="unit">次</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">当天交易金额</div>
                    <div class="blue-card">
                        <span class="number">
                            128,321,6.00
                            <div class="unit">(万元)</div>
                        </span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line">用户级别</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div class="circular">
                        <span class="number">A<span class="unit">级</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line">完成度</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div id="water-polo" class="water-polo"></div>
                </div>
                <div class="card">
                    <div class="card-title line">当天滚动持仓</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div class="blue-card">
                        <span class="number">
                            128,321,6.00
                            <div class="unit">(万元)</div>
                        </span>
                    </div>
                </div>
            </div>
            <div class="showPortrait">
                <div class="card" id="radar"></div>
                <div class="card" id="main1"></div>
            </div>
            <div class="showDate">
                <div class="card grade-lump">
                    <div class="score">
                        <div class="number">84</div>
                        <div class="text">综合评分</div>
                        <el-rate class="rate" v-model="startValue" disabled> </el-rate>
                        <div class="rank-icon">3</div>
                    </div>
                    <div class="dimensionality">
                        <div class="title">算法绩效分析</div>
                        <div class="explain">T0算法盈亏绩效成绩为4.3，dead盈算法亏绩效成算绩</div>
                    </div>
                    <div class="dimensionality">
                        <div class="title">算法绩效分析</div>
                        <div class="explain">T0算法盈亏绩效成绩为4.3，dead盈</div>
                    </div>
                    <div class="dimensionality">
                        <div class="title">算法绩效分析</div>
                        <div class="explain">T0算法盈亏绩效成绩为4.3，dead盈</div>
                    </div>
                    <div class="dimensionality">
                        <div class="title">算法绩效分析</div>
                        <div class="explain">T0算法盈亏绩效成绩为4.3，dead盈</div>
                    </div>
                    <div class="dimensionality">
                        <div class="title">算法绩效分析</div>
                        <div class="explain">T0算法盈亏绩效成绩为4.3，dead盈</div>
                    </div>
                </div>
                <div class="card" id="main2"></div>
            </div>
            <div class="showClounm card" id="histogram"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'baseform',
    data() {
        return {
            searchForm: {
                provider: '',
                algo_type: '',
                algo_id: '',
                user_id: '',
                timeRange: []
            },
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    tag: '家'
                },
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    tag: '家'
                },
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    tag: '公司'
                },
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    tag: '公司'
                }
            ],
            startValue: 3.5,
            currentPage: 1
        };
    },
    mounted() {
        this.getWaterEchart();
        this.getRadarChart();
        let list = [
            { x: 1, y: '1' },
            { x: 2, y: '2' },
            { x: 3, y: '3' },
            { x: 4, y: '4' },
            { x: 5, y: '5' },
            { x: 6, y: '6' },
            { x: 7, y: '7' },
            { x: 8, y: '8' },
            { x: 9, y: '9' },
            { x: 10, y: '10' },
            { x: 11, y: '11' },
            { x: 12, y: '12' }
        ];
        this.generateChart(list, 'main1');
        this.generateChart(list, 'main2');
        this.getHistogramChart();
    },
    methods: {
        onSubmit() {
            console.log('submit!', this.searchForm);
        },
        getWaterEchart() {
            var chartDom = document.getElementById('water-polo');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                backgroundColor: '#fff',
                series: [
                    {
                        type: 'liquidFill',
                        data: [0.38],
                        radius: '95%',
                        // 水球颜色
                        color: [
                            {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(145, 213, 255, 0.3)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(50, 129, 255, 0.8)'
                                    }
                                ]
                            }
                        ],
                        // outline  外边
                        outline: {
                            // show: false
                            borderDistance: 3,
                            itemStyle: {
                                borderWidth: 2,
                                borderColor: '#D1E3FF'
                            }
                        },
                        label: {
                            formatter: function (param) {
                                return '{b|' + Number(param.value) * 100 + '}{c| %}';
                            },
                            textStyle: {
                                rich: {
                                    b: {
                                        fontSize: 48,
                                        fontWeight: 'bold',
                                        color: '#000'
                                    },
                                    c: {
                                        fontSize: 16,
                                        color: '#000'
                                    }
                                }
                            }
                        },
                        // 内图 背景色 边
                        backgroundStyle: {
                            color: '#fff'
                        },
                        itemStyle: {
                            opacity: 1, // 波浪的透明度
                            shadowBlur: 0 // 波浪的阴影范围
                        }
                    }
                ]
            };
            myChart.setOption(option, true);
        },
        getRadarChart() {
            let option = {
                color: ['#3281FF', '#FACC14', '#2FC25B'],
                radar: [
                    {
                        indicator: [
                            {
                                name: '完成度',
                                max: 100
                            },
                            {
                                name: '算法绩效',
                                max: 100
                            },
                            {
                                name: '贴合度',
                                max: 100
                            },
                            {
                                name: '风险度',
                                max: 100
                            },
                            {
                                name: '绩效稳定性',
                                max: 100
                            }
                        ],
                        center: ['50%', '50%'],
                        radius: 100,
                        startAngle: 90,
                        splitNumber: 3,
                        orient: 'horizontal', // 图例列表的布局朝向,默认'horizontal'为横向,'c'为纵向.
                        // shape: 'circle',
                        // backgroundColor: {
                        //     image:imgPath[0]
                        // },
                        axisName: {
                            formatter: '{value}',
                            fontSize: 14, //外圈标签字体大小
                            color: '#333333' //外圈标签字体颜色
                        },
                        splitArea: {
                            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                            show: true,
                            areaStyle: {
                                // 分隔区域的样式设置。
                                color: ['#F5F9FF', '#F5F9FF'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                            }
                        },
                        // axisLabel: {
                        //     //展示刻度
                        //     show: true
                        // },
                        axisLine: {
                            //指向外圈文本的分隔线样式
                            lineStyle: {
                                color: '#EAEAEB',
                                type: 'dashed'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#EAEAEB', // 分隔线颜色
                                width: 1, // 分隔线线宽
                                type: 'dashed'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '雷达图',
                        type: 'radar',
                        emphasis: {
                            lineStyle: {
                                width: 4
                            }
                        },
                        data: [
                            {
                                name: '算法',
                                value: [85, 65, 55, 90, 82],
                                areaStyle: {
                                    // 单项区域填充样式
                                    color: {
                                        type: 'linear',
                                        x: 0, //右
                                        y: 0, //下
                                        x2: 1, //左
                                        y2: 1, //上
                                        colorStops: [
                                            {
                                                offset: 0,
                                                color: '#E4F1FF'
                                            },
                                            {
                                                offset: 0.5,
                                                color: '#E4F1FF'
                                            },
                                            {
                                                offset: 1,
                                                color: '#E4F1FF'
                                            }
                                        ],
                                        globalCoord: false
                                    },
                                    opacity: 0.4 // 区域透明度
                                },
                                symbolSize: 2.5, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
                                label: {
                                    // 单个拐点文本的样式设置
                                    show: true, // 单个拐点文本的样式设置。[ default: false ]
                                    position: 'top', // 标签的位置。[ default: top ]
                                    distance: 2, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                                    color: '#333333', // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                                    fontSize: 14, // 文字的字体大小
                                    formatter: function (params) {
                                        return params.value;
                                    }
                                },
                                itemStyle: {
                                    //图形悬浮效果
                                    borderColor: '#3281FF',
                                    borderWidth: 3.5
                                    // normal: {
                                    //     //图形悬浮效果
                                    //     borderColor: '#3281FF',
                                    //     borderWidth: 3.5
                                    // }
                                }
                            }
                        ]
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById('radar'));
            option && myChart.setOption(option);
            myChart.resize();
        },
        generateChart(list, type) {
            if (list.length == 1) {
                list.push({ x: '', y: list[0].y });
            }
            let lineObj = {
                main1: { name: '绩效', color: '#83BDFF' },
                main2: { name: '完成度', color: '#FCE75F' }
            };
            let isNull = list.length ? false : true;
            let option = {
                title: {
                    // top: '4px',
                    // left: '32px',
                    name: lineObj[type].name,
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
                dataset: {
                    dimensions: ['x', 'y'],
                    source: list
                },
                grid: {
                    left: '5px',
                    right: '10px',
                    bottom: '0px',
                    // top: '75px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
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
                        // nameLocation: 'start',
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
                series: [
                    {
                        name: '算法单数',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        itemStyle: {
                            color: lineObj[type].color
                            // normal: {
                            //     color: lineObj[type].color
                            // }
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: lineObj[type].color
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
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById(type));
            myChart.setOption(option);
            myChart.resize();
        },
        getHistogramChart() {
            var chartDom = document.getElementById('histogram');
            var myChart = echarts.init(chartDom);
            var option;
            // 指定图表的配置项和数据
            var data3 = [20, 30, 20, 30, 20, 30, 20, 30, 20, 30];
            var data4 = [9, 30, 9, 60, 70, 20, 59, 20, 49, 20];
            var datacity = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            var option = {
                title: {
                    text: '持仓市值与成本',
                    textStyle: {
                        color: '#333333',
                        fontSize: 20,
                        fontWeight: 500
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },

                legend: {
                    data: ['市值', '成本'],
                    icon: 'circle',
                    itemWidth: 6,
                    itemGap: 24,
                    y: 'bottom',
                    // top: '80px',
                    // x: 'center',
                    textStyle: {
                        color: '#999'
                    }
                },
                grid: {
                    left: '5px',
                    right: '10px',
                    bottom: '45px',
                    // top: '75px',
                    containLabel: true
                },
                yAxis: [
                    {
                        type: 'value',
                        type: 'value',
                        name: `单位：（万元）`,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} '
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                        axisTick: {
                            show: false //隐藏X轴刻度
                        },
                        axisLine: {
                            show: false
                        },
                        nameTextStyle: {
                            padding: [0, 0, 0, 20]
                        }
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            show: false,
                            splitNumber: 15
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#E9E9E9'
                            }
                        },
                        axisTick: {
                            show: false //隐藏X轴刻度
                        },
                        data: datacity
                    }
                ],
                series: [
                    {
                        name: '市值',
                        type: 'bar',
                        color: '#4DCB73',
                        stack: 'sum1',
                        barWidth: '20px',
                        data: data3
                    },
                    {
                        name: '成本',
                        type: 'bar',
                        color: '#F78B7F',
                        stack: 'sum1',
                        barWidth: '20px',
                        data: data4,
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0]
                            // normal: {
                            //     borderRadius: [4, 4, 0, 0]
                            // }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
};
</script>

<style lang="less" scoped>
.echart-container {
    .card {
        overflow: hidden;
        display: inline-block;
    }
    .showBorder {
        .card {
            margin-right: 12px;
            width: 265px;
            height: 248px;
            &:nth-child(6) {
                margin-right: 0px;
            }
            .line {
                display: inline-block;
            }
            .water-polo {
                margin-top: 19px;
                height: 165px;
                // background: black;
            }
            .circular {
                margin: 20px auto;
                width: 158px;
                height: 158px;
                border-radius: 50%;
                background-color: #e8f1ff;
                padding-top: 15px;
                box-sizing: border-box;
                &::after {
                    content: '';
                    display: block;
                    width: 128px;
                    height: 128px;
                    border-radius: 50%;
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(50, 129, 255, 0.32);
                    margin: auto;
                }
                .number {
                    float: left;
                    margin: auto;
                    line-height: 120px;
                    text-align: center;
                    width: 100%;
                    font-size: 52px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                }
                .unit {
                    padding-left: 5px;
                    font-size: 16px;
                    font-weight: 500;
                }
            }
            .special-green {
                background-color: #e5f8f2;
                &::after {
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(29, 195, 138, 0.32);
                }
            }
        }
        .query-icon {
            margin-left: 10px;
            cursor: pointer;
        }
        .blue-card {
            width: 100%;
            height: 149px;
            background: #fafbff;
            border-radius: 8px;
            margin-top: 24px;
            text-align: center;
            // line-height: 149px;
            .number {
                font-size: 28px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.85);
                line-height: 39px;
                margin-top: 40px;
                display: inline-block;
            }
            .unit {
                font-size: 16px;
            }
        }
    }
    .showPortrait {
        height: 315px;
        margin-top: 8px;
        .card {
            height: 100%;
            &:nth-child(1) {
                margin-right: 12px;
                width: 405px;
            }
            &:nth-child(2) {
                width: calc(100% - 418px);
            }
        }
        .radarCard {
            padding-bottom: 0;
        }
    }
    .showDate {
        margin-top: 12px;
        height: 315px;
        .card {
            height: 100%;
            &:nth-child(1) {
                margin-right: 12px;
                width: 405px;
            }
            &:nth-child(2) {
                width: calc(100% - 418px);
            }
        }
        .grade-lump {
            .score {
                display: flex;
                align-items: center;
                // margin-bottom: -2px;
                .number {
                    font-size: 36px;
                    color: #333333;
                    font-weight: bold;
                    margin-right: 8px;
                }
                .text {
                    font-size: 12px;
                    font-weight: 400;
                    color: #666666;
                    line-height: 18px;
                    margin-right: 8px;
                    margin-top: 12px;
                }
                .rate {
                    margin-top: 12px;
                }
                .rank-icon {
                    width: 34px;
                    height: 44px;
                    background-image: url('../../assets/icon/rank-icon.png');
                    background-repeat: no-repeat;
                    background-size: 34px 44px;
                    align-self: flex-end;
                    margin-left: 98px;
                    text-align: center;
                    line-height: 48px;
                    font-size: 20px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #ffffff;
                    text-shadow: 0px -2px 9px #3a8159;
                }
            }
            .dimensionality {
                margin-top: 8px;
                .title {
                    font-size: 14px;
                    color: #333333;
                    // line-height: 20px;
                    margin-bottom: 2px;
                }
                .explain {
                    font-size: 12px;
                    color: #999999;
                    line-height: 18px;
                }
            }
        }
    }
    .showClounm {
        margin-top: 12px;
        height: 355px;
        width: 100%;
    }
}
.button-right {
    // display: flex;
    // align-items: center;
    // line-height: 36px;
}
.box1 {
    display: inline-block;
    .capital {
        display: inline-block;
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #666666;
    }
    .treasure {
        // display: inline-block;
        font-size: 24px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-right: 20px;
        line-height: 0px;
        // padding-top: 10px;
    }
    .profit-loss {
        // display: inline-block;
        font-size: 24px;
        // font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #4dcb73;
        line-height: 0;
    }
    .icon {
        display: inline-block;
        text-align: center;
        font-size: 10px;
        // font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #4dcb73;
        width: 32px;
        height: 18px;
        // line-height: 16px;
        background: rgba(77, 203, 115, 0.24);
        border-radius: 4px;
        margin-right: 20px;
        // margin-bottom: 10px;
    }
}
</style>
