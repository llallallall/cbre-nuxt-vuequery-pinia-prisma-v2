<template>
        <div class="grid-cols-1 w-[80%] mx-auto ">
                <client-only>
                        <v-chart ref="snavChart" class="chart" :option="option" @brushselected="handleBrushselected"
                                auto-resize />
                </client-only>


                <!-- header -->
                <div class="w-full flex justify-between text-center text-sm divide-x  divide-white ">
                        <div v-for="(col, idx) in columns" class=" bg-darkgreen w-full divide-y">
                                <div :key="col.key" class="py-2"> {{ col.label }}</div>
                        </div>
                </div>
                <!-- selected data -->
                <div class="w-full flex justify-between text-center text-sm text-gray-900 divide-x  divide-white ">

                        <div v-for="(col, idx) in columns" class="w-full divide-y">
                                <div v-if="idx == 0" :key="'row' + idx" class="py-2"> Q2 2023(%) </div>
                                <div v-else-if="idx == 1" :key="'row1' + idx" class="py-2"> {{ selectedData.toFixed(2) }} </div>
                                <div v-else :key="'row2' + idx" class="py-2">{{ (Math.random() * (selectedData * 1.5 -
                                        selectedData * (-1.5)) + selectedData * (-1.5)).toFixed(2) }}</div>
                        </div>
                </div>
                <!-- Q-o-Q (%p) -->
                <div class="w-full flex justify-between text-center text-sm text-gray-900 divide-x  divide-white ">

                        <div v-for="(col, idx) in columns" class="w-full  bg-gray-200 divide-y">
                                <div v-if="idx == 0" :key="'qoq' + idx" class="py-2"> Q-o-Q (%p)</div>
                                <div v-else :key="idx" class="py-2">{{ (Math.random() * (selectedData * 1.1 -
                                        selectedData * (-1.1)) + selectedData * (-1.1)).toFixed(2) }}</div>
                        </div>
                </div>

                <!-- Y-o-Y (%p) -->
                <div class="w-full flex justify-between text-center text-sm text-gray-900 divide-x  divide-white ">

                        <div v-for="(col, idx) in columns" class="w-full divide-y">
                                <div v-if="idx == 0" :key="'yoy' + idx" class="py-2"> Y-o-Y (%p)</div>
                                <div v-else :key="idx" class="py-2">{{ (Math.random() * (selectedData * 1.3 -
                                        selectedData * (-1.3)) + selectedData * (-1.3)).toFixed(2) }}</div>
                        </div>
                </div>

                <!-- caption -->
                <div class="w-full flex  text-left text-xs text-gray-700 ">
                        Source : CBRE Korea
                </div>





        </div>
</template>

<script setup lang="ts">
definePageMeta({
        layout: 'datacenter-layout',
});
//@ts-ignore
import VChart from 'vue-echarts';
import { ref } from 'vue'


const snavChart = ref();
const data1 = [
        {
                mode: 1,
                affinity: 0.5,
                lb: 1.34,
                ub: 2.53,
                pUrl: "purl1",
                qUrl: "qurl1"
        },
        {
                mode: 2,
                affinity: 1.5,
                lb: 13.34,
                ub: 2.453,
                pUrl: "purl2",
                qUrl: "qurl2"
        }
]
let dataBySeries = [
        [120, 200, 150, 120, 200, 150, 120, 200, -2, 120, 200, 150, 120, 200, 850, 120, 200, 150, 120, 200, 150, 120, 200, 150],
        [100, 50, 250, 400, 50, 250, 100, 50, 250, 100, 50, 750, 100, -5, 250, 100, 50, 250, 100, 50, 250, 100, 50, 250],
        [12, 20, 15, 12, 20, 15, 2, 20, 15, 12, 20, 15, 40, 20, 15, 12, 55, 15, 12, 50, 15, 12, 20, 15]
]

const selectedData = ref(1)
const handleBrushselected = (params: any) => {
        let brushComponent = params.batch[0];

        for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
                let dataIndices = brushComponent.selected[sIdx].dataIndex;
                let dataIndex = dataIndices[0];
                let data = dataBySeries[2][dataIndex];


                console.log(dataIndex + ' : ' + data)
                selectedData.value = data
                // for (let i = 0; i < dataIndices.length; i++) {
                //         let dataIndex = dataIndices[i];
                //         sum += dataBySeries[sIdx][dataIndex];
                // }
        }


}


const columns = [{
        key: 'id',
        label: 'Vacancy Rate',

}, {
        key: 'seoul',
        label: 'Seoul',

}, {
        key: 'cbd',
        label: 'CBD',

}, {
        key: 'gbd',
        label: 'GBD',

}, {
        key: 'ybd',
        label: 'YBD',

}]

const colors = [
        '#80bbad',
        '#435254',
        '#dad898',
        '#3f7da6',
        '#7fbbad',
        '#dcd99a',
        '#435254',
        '#d3785a',
        '#16e88f',
        '#435254',
]
const emphasisStyle = {
        itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
        }
};
const dataAxis = ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
const option = ref({
        title: {
                text: 'Seoul Grade A office New Supply, Net absorption and Vacancy (2001-2023 YTD)',
                left: 110,
                textStyle: {
                        color: '#333',
                        fontSize: 14,
                        fontWeight: 'normal',
                        lineHeight: 10,
                },

        },
        grid: {
                bottom: 50
        },
        brush: {
                brushType: 'lineX',
                brushMode: 'single',
                xAxisIndex: 'all',
                transformable: true,
                brushLink: 'all',
                toolbox: ['lineX', 'clear'],
                brushStyle: {
                        borderWidth: 0,
                        color: 'rgba(205, 207, 107, 0.2)',
                        borderColor: 'rgba(120,140,180,0.8)'
                },
                outOfBrush: {
                        colorAlpha: 0.9
                }
        },
        toolbox: {
                feature: {
                        myFullScreen: { //Custom tool myTool 
                                show: true,
                                title: 'Full screen',
                                icon: 'image:///images/icons/fullscreen.svg',
                                onclick: function () {
                                        setFullScreenToolBox(snavChart.value, 'iddoanhthungay');
                                        setTimeout(function () {
                                                snavChart.value?.resize();
                                        }, 500);
                                }
                        },
                        saveAsImage: {},
                        myExportExcel: {
                                show: true,
                                title: 'Download Excel',
                                icon: 'image:///images/icons/icons8-excel.svg',
                                onclick: function () {
                                        console.log(dataBySeries)
                                        console.log(dataAxis)

                                        // const workBook = Xlsx.utils.book_new()
                                        // const workSheet = Xlsx.utils.json_to_sheet(data1)
                                        // Xlsx.utils.book_append_sheet(workBook, workSheet, 'example')
                                        // Xlsx.writeFile(workBook, 'example.xlsx')
                                }
                        },
                        dataZoom: {},
                        dataView: {
                                // readOnly: false,
                                // optionToContent: function (opt : any) {
                                //         console.log(opt);
                                //         let xAxis_max = opt.xAxis[0].max ? opt.xAxis[0].max : "";
                                //         let xAxis_interval = opt.xAxis[0].interval ? opt.xAxis[0].interval : "";
                                //         let data_len = opt.series[0].data.length;
                                //         var table = `<h5>table data</h5><textarea rows='${data_len}' style="width: 100%">`;
                                //         for (let i = 0; i < data_len; i) {
                                //                 table = "\n" +opt.yAxis[0].data[i] +","+ opt.series[0].data[i];
                                //         }
                                //         table = `</textarea><h5>option config</h5>
                                //                 max: <input type="text" value="${xAxis_max}"><br>
                                //                 interval: <input type="text" value="${xAxis_interval}">`;
                                //         return table
                                // },
                                // contentToOption: function (html : any, opt : any) {
                                //         let content = $(html).children("textarea").val().split("\n");
                                //         let handle_data = { data: [], yAxis: [] };
                                //         content.slice(1).forEach(function (x, index) {
                                //                 let data = x.split(',');
                                //                 handle_data.yAxis.push(data[0]);
                                //                 handle_data.data.push(data[1]);
                                //         });
                                //         opt.series[0].data = handle_data.data;
                                //         opt.yAxis[0].data = handle_data.yAxis;
                                //         let inputs = $(html).children("input");
                                //         if (inputs.eq(0).val()) {
                                //                 opt.xAxis[0].max = inputs.eq(0).val();
                                //         }
                                //         if (inputs.eq(1).val()) {
                                //                 opt.xAxis[0].interval = inputs.eq(1).val();
                                //         }
                                //         myChart.clear();
                                //         return opt;
                                // }
                        },
                },
                right: 120,
        },
        color: colors,
        tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)',
        },

        legend: {
                orient: 'horizontal',
                bottom: 0,
                data: ['Net Supply (LHS)', 'Net Absorption (LHS)', 'Vacancy (RHS)'],
                icon: 'rect',
                //left: '10%'
        },
        xAxis: {
                type: 'category',
                axisTick: {
                        alignWithLabel: true
                },
                data: dataAxis,

        },
        yAxis: [{
                type: 'value',
                name: 'Unit : 1,000 ㎡',
                position: 'left',
                alignTicks: true,
                axisLine: {
                        show: true,
                        lineStyle: {
                                color: colors[0]
                        }
                },
                axisLabel: {
                        formatter: '{value}'
                }
        },
        {
                type: 'value',
                name: 'Vacancy (RHS)',
                position: 'right',
                alignTicks: false,
                offset: 0,
                axisLine: {
                        show: true,
                        lineStyle: {
                                color: colors[2]
                        }
                },
                axisLabel: {
                        formatter: '{value}%'
                }
        }],
        series: [
                {
                        name: 'Net Supply (LHS)',
                        data: dataBySeries[0],
                        type: 'bar',
                        emphasis: emphasisStyle,
                        yAxisIndex: 0,
                        lineStyle: {
                                color: colors[0],
                                width: 4,
                                type: 'dashed'
                        }
                },
                {
                        name: 'Net Absorption (LHS)',
                        data: dataBySeries[1],
                        type: 'bar',
                        emphasis: emphasisStyle,
                        yAxisIndex: 0,
                        lineStyle: {
                                color: colors[1],
                                width: 4,
                                type: 'dashed'
                        }
                },
                {
                        name: 'Vacancy (RHS)',
                        data: dataBySeries[2],
                        type: 'line',
                        yAxisIndex: 1,
                        lineStyle: {
                                color: colors[2],
                                width: 4,
                                type: 'dashed'
                        }
                }
        ]
});

onMounted(() => {
        console.log('mounted')
        selectedData.value = dataBySeries[dataBySeries.length - 1][dataBySeries[dataBySeries.length - 1].length - 1]
        setTimeout(() => {

                snavChart.value?.dispatchAction({
                        type: 'brush',
                        areas: [
                                {
                                        brushType: 'lineX',
                                        coordRange: ['2021', '2022'],
                                        xAxisIndex: 0
                                }
                        ]
                });
        }, 1000)
})


function GoInFullscreen(element: any) {
        if (element.requestFullscreen)
                element.requestFullscreen();
        else if (element.mozRequestFullScreen)
                element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
                element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen)
                element.msRequestFullscreen();
}

function GoOutFullscreen() {
        if (document.exitFullscreen)
                document.exitFullscreen();
        //@ts-ignore
        else if (document.mozCancelFullScreen)
                //@ts-ignore
                document.mozCancelFullScreen();
        //@ts-ignore
        else if (document.webkitExitFullscreen)
                //@ts-ignore
                document.webkitExitFullscreen();
        //@ts-ignore
        else if (document.msExitFullscreen)
                //@ts-ignore
                document.msExitFullscreen();
}
function IsFullScreenCurrently() {
        //@ts-ignore
        var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;

        // If no element is in full-screen
        if (full_screen_element === null)
                return false;
        else
                return true;
}
//@ts-ignore
function setFullScreenToolBox(divname, idchart) {
        //@ts-ignore
        var classold = document.getElementById(divname).className;
        var idold = document.getElementById(idchart);
        if (classold == 'col-md-12') {
                //@ts-ignore
                document.getElementById(divname).className = "col-md-6";
                if (IsFullScreenCurrently())
                        GoOutFullscreen();
                //@ts-ignore
                idold.style = 'height:300px';
        }
        else if (classold == 'col-md-6') {
                //@ts-ignore
                document.getElementById(divname).className = "col-md-12";
                //idold.style = 'height:500px';
                var heights = screen.height;// window.innerHeight;
                //@ts-ignore
                idold.style.height = heights - 100 + "px";
                GoInFullscreen('');
        }



        return true;
}

</script>

<style scoped>
.chart {
        margin-top: 80px;
        padding-top: 40px;
        margin-left: -110px;
        margin-right: 0;
        height: 50vh;
        width: 94vw;
}
</style>