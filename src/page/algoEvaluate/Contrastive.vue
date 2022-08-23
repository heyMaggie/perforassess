<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>对比分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline search-row">
            <div class="input-area">
                <el-form-item>
                    <el-select v-model="searchForm.algo_type" clearable placeholder="算法类型" @change="selectAlgoType">
                        <el-option v-for="item in algoTypeList" :key="item" :label="item" :value="item">{{ item }}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择对比算法">
                    <el-select
                        v-model="searchForm.algo_id_list"
                        clearable
                        placeholder="算法"
                        @focus="selectAlgoList"
                        multiple
                        class="select_width"
                        @change="multipleChange"
                    >
                        <el-option v-for="item in algoList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="timeRange"
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
                ><el-button type="plain" @click="downLoad"><img class="iconImg" src="../../assets/icon/xiazai.png" />下载报告</el-button>
            </div>
        </el-form>
        <div class="container" id="resultsHuiZongTableId">
            <div class="card" id="main1"></div>
            <div class="card p-bottom">
                <div class="card-title">算法能力分析</div>
                <div class="right-row">
                    <div class="bulue-card radar" id="main2"></div>
                    <div class="bulue-card grade">
                        <el-empty
                            v-if="!mulitAnalyList.length"
                            description="暂无数据"
                            style="width: 100%"
                            :image="require('../../assets/img/empty.png')"
                        ></el-empty>
                        <template v-else>
                            <div class="grade-lump" v-for="(item, i) in mulitAnalyList" :key="i">
                                <div class="score">
                                    <div class="number">{{ item.composite_score }}</div>
                                    <div class="text">综合评分</div>
                                    <el-rate class="rate" v-model="item.startValue" disabled> </el-rate>
                                    <div class="rank-icon">{{ item.ranking }}</div>
                                </div>
                                <div class="dimensionality" v-for="(subItem, j) in item.dimension" :key="subItem.profile_type">
                                    <div class="title">{{ titleList[j] }}</div>
                                    <div class="explain" :title="subItem.desc">{{ subItem.desc }}</div>
                                </div>
                                <div class="present">
                                    <span class="left">当前算法</span>
                                    <span class="right">{{ item.algo_name }}</span>
                                </div>
                            </div></template
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { mulitAnalyseApi, optionListApi } from '@/api/index';
import fiexdDate from '../../utils/fixeddate';
import dayjs from 'dayjs';
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
export default {
    name: 'contrastive66t',
    data() {
        return {
            searchForm: {
                algo_type: '',
                algo_id_list: []
            },
            timeRange: [new Date(), new Date()], //筛选时间范围 默认当天
            currentPage: 1,
            pageTotal: 0,
            algoTypeList: [],
            algoList: [],
            mulitAnalyList: [],
            titleList: ['算法经济性分析', '算法完成度分析', '算法风险度分析', '算法绩效分析', '算法稳定性分析']
        };
    },
    created() {
        this.getMulitAnalyseData();
        // 获取厂商列表
        let query = {
            choose_type: 5
        };
        this.getOptionList(query, 'algoTypeList', 'algo_type');
    },
    mounted() {},
    methods: {
        onSubmit() {
            console.log('submit!', this.searchForm);
            this.getMulitAnalyseData();
        },
        downLoad() {
            this.createPDF('对比分析');
        },
        getOptionList(query, type, list) {
            optionListApi(query).then((res) => {
                if (res.code == 200) {
                    this[type] = res[list];
                }
            });
        },
        selectAlgoType() {
            this.searchForm.algo_id_list = [];
        },
        selectAlgoList() {
            // 获取算法
            let query = {
                choose_type: 7,
                algo_type: this.searchForm.algo_type
            };
            console.log(this.searchForm);
            this.getOptionList(query, 'algoList', 'algo_name');
        },
        multipleChange(val) {
            if (val.length > 4) {
                this.$message.error('最多只能选择4个对比算法！');
                this.searchForm.algo_id_list.splice(-1);
            }
        },
        getMulitAnalyseData() {
            let today = dayjs(this.timeRange[0]).format('YYYY-MM-DD');
            let today2 = dayjs(this.timeRange[1]).format('YYYY-MM-DD');
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today2} 23:59`).getTime() / 1000;
            let query = {
                start_time: start_time,
                end_time: end_time,
                user_id: localStorage.getItem('ms_username'),
                algo_name: this.searchForm.algo_id_list
            };
            let list = [];
            mulitAnalyseApi(query)
                .then((res) => {
                    if (res.code == 200) {
                        list = res.list ? res.list : [];
                        this.mulitAnalyList = res.list ? res.list : [];
                        this.mulitAnalyList.forEach((item) => {
                            item.startValue = item.composite_score / 20;
                        });
                        this.generateChart(list, 'main1');
                        this.getRadarChart(list);
                    } else {
                        return Promise.reject(new Error('请求异常'));
                    }
                })
                .catch(() => {
                    this.generateChart([], 'main1');
                    this.getRadarChart([]);
                });
        },
        generateChart(list, type) {
            let isNull = list.length ? false : true;
            let seriesList = [];
            function singelLine(params) {
                let lineObj = { name: '', data: [] };
                fiexdDate.forEach((item, i) => {
                    lineObj.name = params.algo_name;
                    lineObj.data[i] = '';
                    params.data.forEach((subitem) => {
                        if (subitem.time_point == item) {
                            lineObj.data[i] = subitem.score;
                        }
                    });
                });
                return lineObj;
            }
            if (!list.length || !list) {
                // this.$message.error('该时间段暂无数据');
                isNull = true;
            } else {
                list.forEach((params) => {
                    if (params.data) {
                        seriesList.push(singelLine(params));
                        isNull = false;
                    } else {
                        isNull = true;
                    }
                });
                let colorList = ['#65A6FF', '#34B7FE', '#59CC7F', '#FAD337'];
                seriesList.forEach((item, i) => {
                    item.type = 'line';
                    item.smooth = true;
                    item.showSymbol = false;
                    item.itemStyle = {
                        color: colorList[i]
                    };
                    item.connectNulls = true;
                    item.areaStyle = {
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
                        opacity: 0.2,
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
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
                    bottom: 0,
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
                    left: '5px',
                    right: '15px',
                    bottom: '30px',
                    top: '65px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: fiexdDate,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#E9E9E9',
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        interval: 29,
                        color: '#000'
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
                            padding: [0, 0, 0, 25],
                            color: '#888'
                        },
                        min: isNull ? 0 : null,
                        max: isNull ? 100 : null
                    }
                ],
                series: seriesList
            };
            var myChart = echarts.init(document.getElementById(type));
            myChart.clear();
            myChart.setOption(option);
            myChart.resize();
        },
        getRadarChart(list) {
            let seriesList = [];
            list.forEach((item) => {
                let sblist = [];
                seriesList.push({
                    name: item.algo_name,
                    value: (() => {
                        item.dimension.forEach((subItem) => {
                            sblist.push(subItem.score);
                        });
                        return sblist;
                    })(),
                    areaStyle: {
                        opacity: 0.02 // 区域透明度
                    },
                    symbolSize: 2.5, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
                    label: {
                        // 单个拐点文本的样式设置
                        show: true, // 单个拐点文本的样式设置。[ default: false ]
                        position: 'top', // 标签的位置。[ default: top ]
                        distance: 2, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                        color: '#333333', // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                        fontSize: 12, // 文字的字体大小
                        formatter: function (params) {
                            return params.value;
                        }
                    },
                    itemStyle: {
                        //图形悬浮效果
                        // borderColor: '#1890FF',
                        borderWidth: 3.5
                    }
                });
            });
            let option = {
                color: ['#1890FF', '#FACC14', '#2FC25B'],
                legend: {
                    show: true,
                    // icon: 'circle',//图例形状
                    bottom: 18,
                    center: 0,
                    itemWidth: 7, // 图例标记的图形宽度。[ default: 25 ]
                    itemHeight: 7, // 图例标记的图形高度。[ default: 14 ]
                    itemGap: 21, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
                    textStyle: {
                        fontSize: 12,
                        color: '#999999'
                    }
                },
                radar: [
                    {
                        indicator: [
                            {
                                name: '完成度',
                                max: 10
                            },
                            {
                                name: '算法绩效',
                                max: 10
                            },
                            {
                                name: '经济性',
                                max: 10
                            },
                            {
                                name: '风险度',
                                max: 10
                            },
                            {
                                name: '绩效稳定性',
                                max: 10
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
                                color: ['RGBA(224, 239, 255, .6)', '#F5F9FF', '#F5F9FF', '#F5F9FF', '#F5F9FF'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
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
                        emphasis: {
                            lineStyle: {
                                width: 4
                            }
                        },
                        data: seriesList
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById('main2'));
            option && myChart.setOption(option);
            myChart.resize();
        },
        createPDF(title) {
            return new Promise((resolve) => {
                html2Canvas(document.querySelector('#resultsHuiZongTableId'), {
                    allowTaint: false,
                    useCORS: true, // allowTaint、useCORS只能够出现一个
                    imageTimeout: 0,
                    dpi: 500, // 像素
                    scale: 4 // 图片大小
                }).then(function (canvas) {
                    // document.body.appendChild(canvas)
                    // 用于将canvas对象转换为base64位编码
                    console.log(canvas, 'canvas');
                    let pageData = canvas.toDataURL('image/jpeg', 1.0),
                        canvasWidth = canvas.width,
                        canvasHeight = canvas.height,
                        concentWidth = 880,
                        concentHeight = Math.round((concentWidth / canvasWidth) * canvasHeight),
                        position = 40,
                        pageHeight = 1060,
                        height = concentHeight;
                    console.log(canvasWidth, canvasHeight);
                    console.log(height, pageHeight, concentWidth, concentHeight);
                    // 新建一个new JsPDF，A3的像素大小 842*1191，A4的像素大小 592*841。这个px像素不准确，不清楚他们的像素大小来源如何
                    let PDF = new JsPDF('l', 'px', 'a3');
                    if (height <= pageHeight) {
                        // 添加图片
                        // PDF.addImage(pageData, 'JPEG', 10, position, concentWidth, 867);
                        PDF.addImage(pageData, 'JPEG', 10, position, concentWidth, concentHeight);
                    } else {
                        while (height > 0) {
                            // PDF.addImage(pageData, 'JPEG', 10, position, concentWidth, 867);
                            PDF.addImage(pageData, 'JPEG', 10, position, concentWidth, concentHeight);
                            height -= pageHeight;
                            position -= pageHeight;
                            if (height > 0) {
                                PDF.addPage();
                            }
                        }
                    }
                    // 保存 pdf 文档
                    PDF.save(`${title}.pdf`);
                    resolve(true);
                });
            });
        }
    }
};
</script>

<style scoped lang="less">
.select_width {
    /deep/ .el-input--small .el-input__inner {
        width: 450px;
    }
}

.container {
    .card {
        margin-bottom: 12px;

        &:nth-child(1) {
            height: 320px;
        }
        &:nth-child(2) {
            height: 450px;
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
                width: 80%;
                overflow-x: auto;
                overflow-y: hidden;
                display: flex;
                flex-wrap: nowrap;
                .grade-lump {
                    width: 287px;
                    padding: 20px;
                    padding-right: 0px;
                    display: inline-block;
                    // border-right: 1px red solid;
                    margin-right: 35px;
                    .score {
                        display: flex;
                        width: 287px;
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
                            margin-left: 25px;
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
                        margin-top: 10px;
                        .title {
                            font-size: 14px;
                            color: #333333;
                            line-height: 20px;
                            margin-bottom: 2px;
                        }
                        .explain {
                            font-size: 12px;
                            color: #999999;
                            line-height: 18px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .present {
                        // width: 284px;
                        height: 32px;
                        background: rgba(214, 226, 246, 0.24);
                        border-radius: 6px;
                        line-height: 32px;
                        margin-top: 15px;
                        padding-left: 15px;
                        padding-right: 20px;
                        .left {
                            font-size: 12px;
                            color: #999999;
                        }
                        .right {
                            font-size: 12px;
                            color: #333333;
                            float: right;
                        }
                    }
                }
            }
        }
    }
}
</style>
