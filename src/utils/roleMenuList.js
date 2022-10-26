export function roleType() {
    let menuList = [
        {
            icon: 'icon1',
            index: 'dashboard',
            name: 'Dashboard'
        },
        {
            icon: 'icon2',
            index: '2',
            name: '算法评估',
            children: [
                {
                    index: 'algoDynamic',
                    name: '算法动态'
                },
                {
                    index: '2-2',
                    name: '算法画像',
                    children: [
                        {
                            index: 'economy',
                            name: '经济性'
                        },
                        {
                            index: 'completeness',
                            name: '完成度'
                        },
                        {
                            index: 'riskDegree',
                            name: '风险度'
                        },
                        {
                            index: 'performance',
                            name: '绩效'
                        },
                        {
                            index: 'stability',
                            name: '稳定性'
                        }
                    ]
                },
                {
                    index: 'manyDays',
                    name: '多日分析'
                },
                {
                    index: 'contrastive',
                    name: '对比分析'
                }
            ]
        },
        {
            icon: 'icon3',
            index: '3',
            name: '高阶评估',
            children: [
                {
                    index: 'userPortrait',
                    name: '用户画像'
                },
                {
                    index: 'rankingList',
                    name: '排行榜'
                }
            ]
        },
        {
            icon: 'icon3',
            index: '4',
            name: '配置信息',
            children: [
                {
                    index: 'stockConfig',
                    name: '股票配置'
                },
                {
                    index: 'algoConfig',
                    name: '算法配置'
                },
                {
                    index: 'userConfig',
                    name: '用户配置'
                }
            ]
        },
        {
            icon: 'icon3',
            index: '5',
            name: '修复数据',
            children: [
                {
                    index: 'szMarket',
                    name: '深市行情'
                },
                {
                    index: 'huMarket',
                    name: '沪市行情'
                },
                {
                    index: 'busketInfo',
                    name: '母单信息'
                },
                {
                    index: 'subInfo',
                    name: '子单信息'
                }
            ]
        },
        {
            icon: 'icon3',
            index: '6',
            name: '权限管理',
            children: [
                {
                    index: 'roleManagement',
                    name: '角色管理'
                },
                {
                    index: 'systemUser',
                    name: '系统用户'
                }
            ]
        }
    ];
    // if (role == 3) {menuList.push();}
    return menuList;
}
