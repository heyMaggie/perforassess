<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>对比分析</el-breadcrumb-item>
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
                <el-form-item>
                    <el-select v-model="searchForm.userId" clearable placeholder="用户ID">
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
                <el-button type="primary" @click="onSubmit">查询</el-button
                ><el-button type="plain" @click="onSubmit"><i class="el-icon-upload el-icon--right"></i>下载报告</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="card" id="main1"></div>
            <div class="card p-bottom">
                <div class="card-title">算法能力分析</div>
                <div class="right-row">
                    <div class="bulue-card radar" id="main2"></div>
                    <div class="bulue-card grade">
                        <!-- <div class="grade-lump">
                            <div class="score">
                                <div class="number">92</div>
                                <div class="text">综合评分</div>
                                <el-rate v-model="startValue" disabled> </el-rate>
                                <div class="rank-icon"></div>
                            </div>
                            <div class=""></div>
                            <div class=""></div>
                        </div>
                        <div class="grade-lump">
                            <div class="score">
                                <div class="number">92</div>
                                <div class="text">综合评分</div>
                                <el-rate v-model="startValue" disabled> </el-rate>
                                <div class="rank-icon"></div>
                            </div>
                            <div class=""></div>
                            <div class=""></div>
                        </div> -->
                        <div class="grade-lump">
                            <div class="score">
                                <div class="number">92</div>
                                <div class="text">综合评分</div>
                                <el-rate class="rate" v-model="startValue" disabled> </el-rate>
                                <div class="rank-icon"></div>
                            </div>
                            <div class=""></div>
                            <div class=""></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'contrastive66t',
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
            startValue: 5
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
        this.getRadarChart();
    },
    methods: {
        onSubmit() {
            console.log('submit!');
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
                legend: {
                    data: ['算法1', '算法2', '算法3', '算法4'],
                    bottom: 0
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
                    bottom: '30px',
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
        },
        getRadarChart() {
            let option = {
                color: ['#1890FF', '#FACC14', '#2FC25B'],
                legend: {
                    show: true,
                    // icon: 'circle',//图例形状
                    bottom: 0,
                    center: 0,
                    itemWidth: 7, // 图例标记的图形宽度。[ default: 25 ]
                    itemHeight: 7, // 图例标记的图形高度。[ default: 14 ]
                    itemGap: 21, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
                    textStyle: {
                        fontSize: 12,
                        color: '#999999'
                    },
                    data: ['算法1', '算法2', '算法3']
                },
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
                        // axisLabel:{//展示刻度
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
                                name: '算法1',
                                value: [85, 65, 55, 90, 82],
                                areaStyle: {
                                    normal: {
                                        opacity: 0.02 // 区域透明度
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
                                        fontSize: 12, // 文字的字体大小
                                        formatter: function (params) {
                                            return params.value;
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        //图形悬浮效果
                                        borderColor: '#1890FF',
                                        borderWidth: 3.5
                                    }
                                }
                            },
                            {
                                name: '算法2',
                                value: [50, 20, 45, 30, 75],
                                symbolSize: 2.5,
                                itemStyle: {
                                    normal: {
                                        borderColor: '#f9cf67',
                                        borderWidth: 3.5
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        opacity: 0.02 // 区域透明度
                                    }
                                }
                            },
                            {
                                name: '算法3',
                                value: [37, 80, 12, 50, 25],
                                symbolSize: 2.5,
                                itemStyle: {
                                    normal: {
                                        borderColor: '#2FC25B',
                                        borderWidth: 3.5
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        opacity: 0.02 // 区域透明度
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById('main2'));
            option && myChart.setOption(option);
            myChart.resize();
        }
    }
};
</script>

<style scoped lang="less">
.container {
    .card {
        margin-bottom: 12px;

        &:nth-child(1) {
            height: 320px;
        }
        &:nth-child(2) {
            height: 455px;
        }
    }
    .p-bottom {
        .card-title {
            margin-bottom: 20px;
        }
        .right-row {
            display: flex;
            .radar {
                margin-right: 12px;
                width: 367px;
            }
            .bulue-card {
                background: #fafbff;
                height: 373px;
                // width: 20%;
                border-radius: 12px;
            }
            .grade {
                width: 70%;
                overflow-x: auto;
                display: flex;
                flex-wrap: nowrap;
                .grade-lump {
                    width: 287px;
                    padding: 29px 20px 26px;
                    display: inline-block;
                    .score {
                        display: flex;
                        width: 287px;
                        align-items: center;
                        .number {
                            font-size: 36px;
                            color: #333333;
                            font-weight: bold;
                            margin-right: 8px;
                        }
                        .text {
                            font-size: 12px;
                            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
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
                            background-image: url('../../../assets/icon/rank-icon.png');
                            background-repeat: no-repeat;
                            background-size: 34px 44px;
                            align-self: flex-end;
                            margin-left: 25px;
                        }
                    }
                }
            }
        }
    }
}
</style>
