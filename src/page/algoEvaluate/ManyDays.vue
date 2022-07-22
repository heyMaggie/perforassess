<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>多日分析</el-breadcrumb-item>
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
                <el-button type="primary" @click="onSubmit">确定</el-button
                ><el-button type="plain" @click="onSubmit"><img class="iconImg" src="../../assets/icon/xiazai.png" />下载报告</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="card" id="main1"></div>
            <div class="card" id="main2"></div>
            <div class="card" id="main3"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'manyDays',
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
            currentPage: 5
        };
    },
    mounted() {
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
        this.generateChart(list, 'main3');
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        generateChart(list, type) {
            if (list.length == 1) {
                list.push({ x: '', y: list[0].y });
            }
            let lineObj = {
                main1: { name: '算法绩效', color: '#83BDFF' },
                main2: { name: '算法贴合度', color: '#59CC7F' },
                main3: { name: '算法完成度', color: '#FCE75F' }
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
        }
    }
};
</script>

<style scoped lang="less">
.container {
    .card {
        margin-bottom: 12px;
        height: 320px;
    }
}
</style>
