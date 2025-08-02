import * as echarts from 'echarts/core'
import { BarChart, GaugeChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  CalendarComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TimelineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  // 数据集组件
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  VisualMapComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  CalendarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TimelineComponent,
  VisualMapComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  RadarChart,
  PolarComponent,
  GaugeChart,
  PieChart,
])

export { echarts }
