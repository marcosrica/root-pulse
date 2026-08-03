<script setup lang="ts">
    import { ref, computed } from 'vue'
    import VChart from 'vue-echarts'
    import { use } from 'echarts/core'
    import { CanvasRenderer } from 'echarts/renderers'
    import { LineChart } from 'echarts/charts'
    import {
    	TooltipComponent,
    	BrushComponent,
    	GridComponent,
    	DataZoomComponent
    } from 'echarts/components'

    //Register required components
    use([
    	CanvasRenderer,
    	LineChart,
    	TooltipComponent,
    	BrushComponent,
    	GridComponent,
		DataZoomComponent,
	]);

    //Sample data
    // TODO: replace with props
    const props = defineProps<{
		xData: string[],
     	yData: number[],
	}>();
    
    const xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const yData = [120, 200, 150, 80, 70, 110, 130];

    //Options to make it reactive
    const options = computed(() => ({
		grid: {
			left: 0,
			right: 10,
           	containLabel: false 
     	},
		tooltip: {
     		trigger: 'axis' //Show tooltip at the same X index
		},
		brush: {
			toolbox: ['rect', 'clear'],
			brushMode: 'single',
         	xAxisIndex: 0
		},
		xAxis: {
			type: 'category',
			data: props.xData,
		},
		yAxis: {
			type: 'value',
		},

		series: [
			{
				data: props.yData,
				type: 'line',
				smooth: true
			}
		],

		//DataZoom zooms after selection
		dataZoom: [
			{
				type: 'slider',
				start: 0,
				end: 100 
			}
		]
	}));

    //Handle the brush selection event
    function onBrushSelected(params: any) {
    	
	}

	const chartRef = ref<InstanceType<typeof VChart> | null>(null);
</script>

<template>
	<v-chart
		ref="chartRef"
		class="chart"
		:option="options"
		autoresize
		@brushselected="onBrushSelected"
	/>
</template>

<style>
	.chart {
		width: 100%;
		height: 400px;
	}
</style>