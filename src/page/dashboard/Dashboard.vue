<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> Dashboard</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="echart-container">
            <div class="showBorder">
                <div class="card">
                    <div class="card-title">用户数量</div>
                    <div class="circular">
                        <span class="number">12<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">算法数量</div>
                    <div class="circular special-green">
                        <span class="number">12<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">交易量</div>
                    <div class="blue-card">
                        <span class="number">
                            128,321,6.00
                            <div class="unit">(万元)</div>
                        </span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">订单数</div>
                    <div class="circular">
                        <span class="number">12<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">买卖占比</div>
                    <div class="medium-blue-card" id="pie2"></div>
                </div>
                <div class="card">
                    <div class="card-title">厂商总数</div>
                    <div class="circular special-pink">
                        <span class="number">12<span class="unit">(个)</span></span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">资金占比</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div class="gather">
                        <div class="min-blue-card">
                            <span class="number">2<span class="unit">%</span></span>
                            <div class="explain">超大市值</div>
                        </div>
                        <div class="min-blue-card">
                            <span class="number">10<span class="unit">%</span></span>
                            <div class="explain">大市值</div>
                        </div>
                        <div class="min-blue-card">
                            <span class="number">5<span class="unit">%</span></span>
                            <div class="explain">中市值</div>
                        </div>
                        <div class="min-blue-card">
                            <span class="number">8<span class="unit">%</span></span>
                            <div class="explain">小市值</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title line-img">完成度</div>
                    <img class="query-icon" src="../../assets/icon/query.png" />
                    <div id="water-polo" class="water-polo"></div>
                </div>
            </div>
            <div class="showClounm">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="T0算法" name="first">
                        <div v-for="i in 4" :key="i">
                            <div class="rowtitle">厂商A</div>
                            <div class="rowlist">
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/1aa.png" />用户数量</div>
                                    <div class="number">32</div>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/2bb.png" />交易量</div>
                                    <div class="number"><span class="symbol">￥</span>18,321,621.00</div>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/3cc.png" />收益率</div>
                                    <el-badge value="盈利" class="item" type="success">
                                        <!-- primary  -->
                                        <div class="number"><span class="symbol">+ </span>45<span class="unit">%</span></div>
                                    </el-badge>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/4dd.png" />订单数量</div>
                                    <div class="number">136</div>
                                </div>
                                <div class="blue-mincard">
                                    <div class="tit"><img src="../../assets/icon/5ee.png" />买卖占比</div>
                                    <div class="pieList" :id="'pieList' + i"></div>
                                </div>
                            </div>
                        </div>
                        <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="100"
                            layout=" ->, prev, pager, next, total, jumper"
                            :total="1000"
                        >
                        </el-pagination>
                    </el-tab-pane>
                    <el-tab-pane label="拆单算法" name="second">拆单算法</el-tab-pane>
                </el-tabs>
            </div>
            <div class="showPortrait">
                <div class="card">
                    <div class="card-title">
                        <span>算法绩效</span>
                        <span class="more" @click="goMoreAlgo">查看更多<span class="icon el-icon-arrow-right"></span></span>
                    </div>
                    <div class="main1" id="main1"></div>
                </div>
                <div class="card">
                    <div class="card-title">
                        <span>算法总体评分</span>
                        <span class="more" @click="goMoreGrade">查看更多<span class="icon el-icon-arrow-right"></span></span>
                    </div>
                    <div id="radar" class="radarCard"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'dashBoard',
    data() {
        return {
            startValue: 3.5,
            activeName: 'first',
            currentPage: 5
        };
    },
    mounted() {
        this.getWaterEchart();
        this.getRadarChart();
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
        this.getSemicircle('pie2');
        for (let i = 1; i < 5; i++) {
            this.getSemicircle('pieList' + i);
        }
    },
    methods: {
        onSubmit() {
            console.log('submit!');
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
                                text: '算法1',
                                max: 100
                            },
                            {
                                text: '算法2',
                                max: 100
                            },
                            {
                                text: '算法3',
                                max: 100
                            },
                            {
                                text: '算法4',
                                max: 100
                            }
                        ],
                        center: ['50%', '50%'],
                        radius: 90,
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
                                    width: 3
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
                legend: {
                    data: ['算法1', '算法2', '算法3', '算法4'],
                    bottom: 14,
                    icon: 'circle',
                    itemWidth: 8,
                    x: 'center',
                    textStyle: { color: ' #999' }
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
                    left: '3px',
                    right: '10px',
                    bottom: '50px',
                    top: '38px',
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
        },
        getSemicircle(type) {
            var chartDom = document.getElementById(type);
            var myChart = echarts.init(chartDom);
            var option;
            var option2;
            option = {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['30%', '37%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '45%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: '#3FAD60'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 8,
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
                            offsetCenter: ['70px', '0%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|买} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 14,
                                    fontWeight: '400',
                                    padding: [-20, 132, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: 27,
                                name: ''
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['30%', '88%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '45%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: '#7CB3FF'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 8,
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
                            offsetCenter: ['70px', '0%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|卖} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 14,
                                    fontWeight: '400',
                                    padding: [-20, 132, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: 35,
                                name: ''
                            }
                        ]
                    }
                ]
            };
            option2 = {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['30%', '100%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '200%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: '#4DCB73'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 8,
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
                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-12%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|买} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 14,
                                    padding: [-8, 120, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: 27,
                                name: ''
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        startAngle: 180,
                        center: ['83%', '100%'],
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: '200%',
                        progress: {
                            show: true,
                            width: 8,
                            itemStyle: {
                                color: '#7CB3FF'
                            }
                        },
                        pointer: { show: false },
                        axisLine: {
                            lineStyle: {
                                width: 8,
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
                            show: false
                        },

                        detail: {
                            valueAnimation: true,
                            fontSize: 26,
                            lineHeight: 10,
                            color: '#333333',
                            fontWeight: 'bold',
                            offsetCenter: [0, '-12%'],
                            formatter: function (value) {
                                return value + '{a1|%}' + '\n' + '{a|卖} ';
                            },
                            rich: {
                                a1: {
                                    color: '#333'
                                },
                                a: {
                                    color: '#999',
                                    fontSize: 14,
                                    padding: [-8, 120, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: 35,
                                name: ''
                            }
                        ]
                    }
                ]
            };
            if (type == 'pie2') {
                myChart.setOption(option);
            } else {
                myChart.setOption(option2);
            }
        },
        handleClick() {},
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        goMoreAlgo() {
            this.$router.push('/algoMoreEchart');
        },
        goMoreGrade() {
            this.$router.push('/algoGrade');
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
            width: 196px;
            height: 220px;
            &:nth-child(8) {
                margin-right: 0px;
            }
            .line-img {
                display: inline-block;
            }
            .water-polo {
                margin-top: 19px;
                height: 135px;
            }
            .circular {
                margin: 20px auto;
                width: 135px;
                height: 135px;
                border-radius: 50%;
                background-color: #e8f1ff;
                padding-top: 13px;
                box-sizing: border-box;
                &::after {
                    content: '';
                    display: block;
                    width: 109px;
                    height: 110px;
                    border-radius: 50%;
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(50, 129, 255, 0.32);
                    margin: auto;
                }
                .number {
                    float: left;
                    margin: auto;
                    line-height: 36px;
                    text-align: center;
                    width: 100%;
                    font-size: 46px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                    margin-top: 24px;
                }
                .unit {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #999999;
                }
            }
            .special-green {
                background-color: #e5f8f2;
                &::after {
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(29, 195, 138, 0.32);
                }
            }
            .special-pink {
                background-color: #fef2f0;
                &::after {
                    background-color: #fff;
                    box-shadow: 0px 4px 6px 0px rgba(247, 139, 127, 0.32);
                }
            }
            .gather {
                margin-top: 24px;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                width: 170px;
                margin: 24px -11px 0;
                .min-blue-card {
                    width: 76px;
                    height: 64px;
                    background: #fafbff;
                    text-align: center;
                    margin-bottom: 8px;
                    .number {
                        width: 21px;
                        font-size: 28px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #333333;
                        line-height: 32px;
                    }
                    .unit {
                        font-size: 14px;
                    }
                    .explain {
                        font-size: 14px;
                        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                        font-weight: 400;
                        color: #999999;
                        line-height: 20px;
                    }
                    // line-height: 64px;
                }
            }
            .medium-blue-card {
                width: 161px;
                height: 136px;
                background: #fafbff;
                margin-top: 24px;

                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 8px;
                    position: relative;
                    bottom: 68px;
                    background-color: #fff;
                }
            }
        }
        .query-icon {
            margin-left: 10px;
        }
        .blue-card {
            // width: 100%;
            height: 126px;
            background: #fafbff;
            border-radius: 8px;
            // margin-top: 24px;
            margin: 24px -12px 0;
            text-align: center;
            .number {
                font-size: 26px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.85);
                margin-top: 35px;
                display: inline-block;
            }
            .unit {
                font-size: 14px;
                color: #999999;
                font-weight: 500;
                margin-top: 10px;
            }
        }
    }
    .showClounm {
        margin-top: 8px;
        width: 100%;
        .rowtitle {
            height: 20px;
            font-size: 14px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: #333333;
            line-height: 20px;
        }
        .rowlist {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            margin-bottom: 12px;
            .blue-mincard {
                // background: red;
                background: #fafbff;
                padding: 14px 8px 16px;
                margin-top: 8px;
                // height: 92px;
                min-width: 156px;
                &:nth-child(2) {
                    width: 244px;
                }
                &:nth-child(5) {
                    width: 316px;
                    padding: 8px 8px 0px;
                    .tit {
                        margin-bottom: 8px;
                    }
                    .pieList {
                        width: 300px;
                        height: 50px;
                    }
                }
                .tit {
                    font-size: 14px;
                    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                    font-weight: 400;
                    color: #666666;
                }
                img {
                    margin-right: 8px;
                    width: 12px;
                    height: 12px;
                }
                .number {
                    height: 32px;
                    font-size: 28px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                    line-height: 32px;
                    margin-top: 12px;
                    margin-left: 18px;

                    .symbol {
                        // line-height: 8px;
                        font-size: 16px;
                    }
                    .unit {
                        font-size: 16px;
                    }
                }
            }
        }

        /deep/.el-tabs__nav-wrap::after {
            background-color: unset;
        }
        /deep/.el-tabs__header {
            // padding-top: 4px;
            margin-bottom: 12px;
        }
        /deep/.el-tabs__item {
            font-size: 16px;
        }
        .el-tabs__active-bar {
        }
        /deep/.el-tabs__nav-wrap {
            background: #fff;
            border-radius: 8px;
            padding: 2px 24px 0;
        }
        /deep/.el-tabs__content {
            background: #fff;
            padding: 16px 24px;
            border-radius: 12px;
        }
        /deep/.el-badge__content {
            border-radius: 10px 10px 10px 0;
        }
        /deep/.el-badge__content.is-fixed {
            top: 10px;
            right: 10px;
        }
    }
    .showPortrait {
        height: 315px;
        margin-top: 12px;
        margin-bottom: 20px;
        .card {
            height: 100%;
            &:nth-child(1) {
                margin-right: 12px;
                width: calc(100% - 505px);
            }
            &:nth-child(2) {
                width: 493px;
            }
        }
        .card-title {
            font-size: 20px;
            .more {
                float: right;
                font-size: 12px;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: #666666;
                cursor: pointer;
                height: 22px;
                line-height: 22px;
                .icon {
                    margin-left: 10px;
                }
            }
        }
        .main1 {
            height: 280px;
        }
        .radarCard {
            padding-bottom: 0;
            height: 280px;
            width: 100%;
            // padding-top: 10px;
        }
    }
}
</style>
