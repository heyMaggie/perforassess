<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>算法动态</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline search-row">
            <div class="input-area">
                <el-form-item>
                    <el-select v-model="searchForm.firm" clearable placeholder="厂商">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algoType" clearable placeholder="算法类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algoId" clearable placeholder="算法">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="button-right">
                <el-button type="primary" @click="onSubmit">查询</el-button
                ><el-button type="plain" @click="onSubmit"><i class="el-icon-upload el-icon--right"></i>下载报告</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="card radarCard" id="radar"></div>
            <div class="card" id="main1"></div>
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
            <div class="card">
                <div class="card-title">资金占比</div>
                <div class="blur-card" id="pie1"></div>
            </div>
            <div class="card">
                <div class="card-title">买卖方向</div>
                <div class="blur-card" id="pie2"></div>
            </div>
            <div class="card">
                <div class="card-title">股价类型</div>
                <div class="blur-card" id="pie3"></div>
            </div>
            <div class="card">
                <div class="card-title">交易量</div>
                <div class="blur-card" id="pie4"></div>
            </div>
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
                firm: '',
                algoType: '',
                algoId: '',
                userId: '',
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
            currentPage: 5,
            startValue: 3.5
        };
    },
    mounted() {
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
        this.getPieChart('pie1');
        this.getSemicircle('pie2');
        this.getStripChart();
        this.getPieChart5('pie4');
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        getRadarChart() {
            let option = {
                color: ['#3281FF', '#FACC14', '#2FC25B'],
                radar: [
                    {
                        indicator: [
                            {
                                text: '完成度',
                                max: 100
                            },
                            {
                                text: '算法绩效',
                                max: 100
                            },
                            {
                                text: '贴合度',
                                max: 100
                            },
                            {
                                text: '风险度',
                                max: 100
                            },
                            {
                                text: '绩效稳定性',
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
                        name: {
                            formatter: '{value}',
                            textStyle: {
                                fontSize: 14, //外圈标签字体大小
                                color: '#333333' //外圈标签字体颜色
                            }
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
                        itemStyle: {
                            emphasis: {
                                lineStyle: {
                                    width: 4
                                }
                            }
                        },
                        data: [
                            {
                                name: '算法',
                                value: [85, 65, 55, 90, 82],
                                areaStyle: {
                                    normal: {
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
                                    }
                                },
                                symbolSize: 2.5, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
                                label: {
                                    // 单个拐点文本的样式设置
                                    normal: {
                                        show: true, // 单个拐点文本的样式设置。[ default: false ]
                                        position: 'top', // 标签的位置。[ default: top ]
                                        distance: 2, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                                        color: '#333333', // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                                        fontSize: 14, // 文字的字体大小
                                        formatter: function (params) {
                                            return params.value;
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        //图形悬浮效果
                                        borderColor: '#3281FF',
                                        borderWidth: 3.5
                                    }
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
                main1: { name: '实时绩效', color: '#83BDFF' },
                main2: { name: '实时完成度', color: '#FCE75F' }
            };
            let isNull = list.length ? false : true;
            let option = {
                title: {
                    // top: '4px',
                    // left: '32px',
                    text: lineObj[type].name,
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
                            normal: {
                                color: lineObj[type].color
                            }
                        },
                        areaStyle: {
                            normal: {
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
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById(type));
            myChart.setOption(option);
            myChart.resize();
        },
        getPieChart(type) {
            var chartDom = document.getElementById(type);
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                title: [
                    {
                        text: '资金占比',
                        x: '75px',
                        top: '38%',
                        textStyle: {
                            color: '#333333',
                            fontSize: 14,
                            fontWeight: '100',
                            fontWeight: '600',
                            fontFamily: 'Lato'
                        }
                    },
                    {
                        text: '（%）',
                        x: '80px',
                        top: '50%',
                        textStyle: {
                            fontSize: '14',
                            color: '#333333'
                        }
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#1F2329',
                    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1F2329',
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: 'vartical',
                    icon: 'circle',
                    itemWidth: 8,
                    x: 'right',
                    top: 'center',
                    left: '200px',
                    bottom: '0%',
                    textStyle: { color: ' #999' }
                },
                grid: {
                    left: '-100px'
                },
                series: [
                    {
                        name: '资金占比（%）',
                        type: 'pie',
                        radius: ['60%', '80%'],
                        itemStyle: {
                            borderRadius: 0,
                            borderColor: '#fafbff',
                            borderWidth: 5
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        left: -140,
                        selectedOffset: 20,
                        labelLine: {
                            show: true
                        },
                        data: [
                            { value: 1048, name: '超大市值' },
                            { value: 735, name: '大市值' },
                            { value: 580, name: '中市值' },
                            { value: 484, name: '小市值' }
                        ]
                    }
                ]
            };
            option && myChart.setOption(option);
        },
        getPieChart5(type) {
            var chartDom = document.getElementById(type);
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                title: [
                    {
                        text: '交易量占比',
                        x: '19%',
                        top: '38%',
                        textStyle: {
                            color: '#333333',
                            fontSize: 14,
                            fontWeight: '100',
                            fontWeight: '600',
                            fontFamily: 'Lato'
                        }
                    },
                    {
                        text: '（%）',
                        x: '24%',
                        top: '50%',
                        textStyle: {
                            fontSize: '14',
                            color: '#333333'
                        }
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#1F2329',
                    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1F2329',
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: 'vartical',
                    icon: 'circle',
                    itemWidth: 8,
                    x: 'right',
                    top: 'center',
                    left: '200px',
                    bottom: '0%',
                    textStyle: { color: ' #999' }
                },
                grid: {
                    left: '-100px'
                },
                series: [
                    {
                        name: '交易量占比（%）',
                        type: 'pie',
                        radius: ['60%', '80%'],
                        itemStyle: {
                            borderRadius: 0,
                            borderColor: '#fafbff',
                            borderWidth: 5
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        left: -140,
                        selectedOffset: 20,
                        labelLine: {
                            show: true
                        },
                        data: [
                            { value: 1048, name: '<百万' },
                            { value: 735, name: '<千万' },
                            { value: 580, name: '<亿' },
                            { value: 484, name: '亿以上' }
                        ]
                    }
                ]
            };
            option && myChart.setOption(option);
        },
        getSemicircle() {
            var chartDom = document.getElementById('pie2');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['27%', '68%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '100%',
                        progress: {
                            show: true,
                            width: 15,
                            itemStyle: {
                                color: '#4DCB73'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 15,
                                color: [[1, '#DEEFE4']]
                            }
                        },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: {
                            distance: 5,
                            color: '#666',
                            fontSize: 0,
                            formatter: function (value) {
                                if (value === 0 || value === 100) {
                                    return value + '%';
                                }
                            }
                        },
                        anchor: {
                            show: false,
                            showAbove: false,
                            size: 25,
                            itemStyle: {
                                borderWidth: 60
                            }
                        },
                        title: {
                            show: true,
                            offsetCenter: [0, '30%'],
                            fontSize: 18
                        },
                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-20%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|买} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 12,
                                    padding: [15, 0, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: 27.8,
                                name: ''
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['73%', '68%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '100%',
                        progress: {
                            show: true,
                            width: 15,
                            itemStyle: {
                                color: '#7CB3FF'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 15,
                                color: [[1, '#E6EEF9']]
                            }
                        },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: {
                            distance: 5,
                            color: '#666',
                            fontSize: 0,
                            formatter: function (value) {
                                if (value === 0 || value === 100) {
                                    return value + '%';
                                }
                            }
                        },
                        anchor: {
                            show: false,
                            showAbove: false,
                            size: 25,
                            itemStyle: {
                                borderWidth: 60
                            }
                        },
                        title: {
                            show: true,
                            offsetCenter: [0, '30%'],
                            fontSize: 18
                        },
                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-20%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|卖} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 12,
                                    padding: [15, 0, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: 35.8,
                                name: ''
                            }
                        ]
                    }
                ]
            };
            myChart.setOption(option, true);
        },
        getStripChart() {
            var chartDom = document.getElementById('pie3');
            var myChart = echarts.init(chartDom);
            var option;

            var spNum = 5,
                _max = 100;
            // var legendData = ['类型1', '类型2', '类型3', '类型4', '类型5', '类型6', '类型7'];
            var legendData = ['类型1', '类型2', '类型3', '类型4', '类型5'];
            let _data1 = [10];
            let _data2 = [19];
            let _data3 = [21];
            let _data4 = [5];
            let _data5 = [15];
            let _data6 = [15];
            let _data7 = [5];
            var _label = {};
            option = {
                legend: [
                    {
                        orient: 'horizontal',
                        // type: 'scroll',
                        data: legendData,
                        icon: 'circle',
                        itemWidth: 6,
                        itemGap: 20,
                        y: 'bottom',
                        top: '80px',
                        // x: 'center',
                        textStyle: {
                            color: '#999'
                        }
                    },
                    {
                        data: ['类型6', '类型7'],
                        icon: 'circle',
                        itemWidth: 6,
                        itemGap: 20,
                        y: 'bottom',
                        x: 'center',
                        textStyle: {
                            color: '#999'
                        }
                    }
                ],
                grid: {
                    containLabel: true,
                    left: 0,
                    right: 15,
                    bottom: 90
                },
                tooltip: {
                    show: true,
                    backgroundColor: '#1F2329',
                    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1F2329',
                    textStyle: {
                        color: '#fff'
                    }
                },
                xAxis: {
                    // splitNumber: spNum,
                    // interval: _max / spNum,
                    max: _max,
                    axisLabel: {
                        show: false,
                        formatter: function (v) {
                            var _v = ((v / _max) * 100).toFixed(0);
                            return _v == 0 ? _v : _v + '%';
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: [
                    {
                        data: ['占比'],
                        axisLabel: {
                            fontSize: 16,
                            color: '#fff'
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        name: '类型1',
                        stack: '2',
                        label: _label,
                        legendHoverLink: false,
                        barWidth: 24,
                        itemStyle: {
                            normal: {
                                color: '#65A6FF',
                                barBorderRadius: [4, 0, 0, 4]
                            },
                            emphasis: {
                                color: '#65A6FF'
                            }
                        },
                        data: _data1
                    },
                    {
                        type: 'bar',
                        name: '类型2',
                        stack: '2',
                        legendHoverLink: false,
                        barWidth: 24,
                        label: _label,
                        itemStyle: {
                            normal: {
                                color: '#72E05A'
                            },
                            emphasis: {
                                color: '#72E05A'
                            }
                        },
                        data: _data2
                    },
                    {
                        type: 'bar',
                        stack: '2',
                        name: '类型3',
                        legendHoverLink: false,
                        barWidth: 24,
                        label: _label,
                        itemStyle: {
                            normal: {
                                color: '#32B7FF'
                            },
                            emphasis: {
                                color: '#32B7FF'
                            }
                        },
                        data: _data3
                    },
                    {
                        type: 'bar',
                        stack: '2',
                        name: '类型4',
                        legendHoverLink: false,
                        barWidth: 24,
                        label: _label,
                        itemStyle: {
                            normal: {
                                color: '#83BDFF'
                            },
                            emphasis: {
                                color: '#83BDFF'
                            }
                        },
                        data: _data4
                    },
                    {
                        type: 'bar',
                        stack: '2',
                        name: '类型5',
                        legendHoverLink: false,
                        barWidth: 24,
                        label: _label,
                        itemStyle: {
                            normal: {
                                color: '#83E3FF'
                            },
                            emphasis: {
                                color: '#83E3FF'
                            }
                        },
                        data: _data5
                    },
                    {
                        type: 'bar',
                        stack: '2',
                        name: '类型6',
                        legendHoverLink: false,
                        barWidth: 24,
                        label: _label,
                        itemStyle: {
                            normal: {
                                color: '#F78B7F'
                            },
                            emphasis: {
                                color: '#2EDDCD'
                            }
                        },
                        data: _data6
                    },
                    {
                        type: 'bar',
                        stack: '2',
                        name: '类型7',
                        legendHoverLink: false,
                        barWidth: 24,
                        label: _label,
                        itemStyle: {
                            normal: {
                                color: '#FFD747',
                                barBorderRadius: [0, 4, 4, 0]
                            },
                            emphasis: {
                                color: '#FFD747'
                            }
                        },
                        data: _data7
                    }
                ]
            };

            myChart.setOption(option, true);
        }
    }
};
</script>
<style scoped lang="less">
.container {
    .card {
        margin-bottom: 12px;
        display: inline-block;
        overflow: hidden;
        &:nth-child(1) {
            height: 280px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(2) {
            height: 280px;
            width: 74.7%;
            // width: 64.53%;
        }
        &:nth-child(3) {
            height: 280px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(4) {
            height: 280px;
            width: 74.7%;
        }
        &:nth-child(5) {
            height: 190px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(6) {
            height: 190px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(7) {
            height: 190px;
            width: 404px;
            margin-right: 12px;
        }
        &:nth-child(8) {
            height: 190px;
            width: 404px;
        }
    }
    .radarCard {
        padding-bottom: 0;
    }
    .grade-lump {
        .score {
            display: flex;
            align-items: center;
            margin-bottom: -2px;
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
            margin-top: 4px;
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
    .blur-card {
        margin-top: 10px;
        height: 130px;
        border-radius: 12px;
        background: #fafbff;
    }
}
</style>
