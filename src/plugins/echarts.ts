import * as echarts from 'echarts/core'
import { BarChart, LineChart, RadarChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  BarChart,
  LineChart,
  RadarChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

export { echarts }
