<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted } from 'vue'
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
    
    const lineColor = ref('')
    
    const updateColor = () => {
      lineColor.value = getComputedStyle(document.documentElement)
        .getPropertyValue('--div-border')
        .trim()
    }
    
    onMounted(() => {
      updateColor()
      // Watch for changes to the `data-theme` attribute
      const observer = new MutationObserver(updateColor)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      onUnmounted(() => observer.disconnect())
    })

    //Sample data
    // TODO: replace with props
    const props = defineProps<{
		xData: string[],
     	yData: number[],
	}>();
    
    //Options to make it reactive
    const options = computed(() => ({
		grid: {
			left: 40,
			right: 20,
			top: 10,
			containLabel: false,
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
			boundaryGap: false,
			axisLabel: { show: false }, 
			axisTick: { show: false },
			axisLine: {
				lineStyle: {
					color: lineColor.value
				}
			}
		},
		yAxis: {
			type: 'value',
			boundaryGap: false,
			axisLabel: {
				margin: 10,
				color: lineColor.value
			},
		},

		series: [
			{
				data: props.yData,
				type: 'line',
				smooth: true,
				color: lineColor.value,
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