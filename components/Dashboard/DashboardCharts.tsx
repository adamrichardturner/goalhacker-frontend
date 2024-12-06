'use client'

import { Goal } from '@/types/goal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'

interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  name: string
}

const ALL_STATUSES = {
  planned: { name: 'Planned', color: 'hsl(217, 91%, 60%)' },
  in_progress: { name: 'In Progress', color: 'hsl(45, 93%, 47%)' },
  completed: { name: 'Completed', color: 'hsl(142, 76%, 36%)' },
  archived: { name: 'Archived', color: 'hsl(215, 16%, 47%)' },
}

export default function DashboardCharts({
  goals,
  isLoading,
}: {
  goals: Goal[]
  isLoading: boolean
}) {
  const calculateSubgoalStats = () => {
    if (!goals) return []

    const stats = {
      planned: 0,
      in_progress: 0,
      completed: 0,
      archived: 0,
    }

    goals.forEach((goal) => {
      goal.subgoals?.forEach((subgoal) => {
        stats[subgoal.status as keyof typeof stats]++
      })
    })

    // Only include statuses with values > 0
    return Object.entries(stats)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: ALL_STATUSES[key as keyof typeof ALL_STATUSES].name,
        value,
        status: key,
      }))
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: CustomLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor='middle'
        dominantBaseline='central'
        className='text-xs font-medium'
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const calculateGoalProgress = () => {
    if (!goals) return []

    return goals.map((goal) => {
      const total = goal.subgoals?.length || 0
      const completed =
        goal.subgoals?.filter((sg) => sg.status === 'completed').length || 0
      const percentage = total ? (completed / total) * 100 : 0

      return {
        name: goal.title,
        progress: Math.round(percentage),
        completed,
        total,
      }
    })
  }

  const calculateGoalsByType = () => {
    if (!goals) return []

    const typeCount = goals.reduce(
      (acc, goal) => {
        const type = goal.category?.name || 'Other'
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
    }))
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-lg'>Loading...</div>
      </div>
    )
  }

  const data = calculateSubgoalStats()
  const progressData = calculateGoalProgress()
  const typeData = calculateGoalsByType()

  return (
    <div className='grid gap-6'>
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Subgoal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius='80%'
                    innerRadius='40%'
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {data.map((entry) => (
                      <Cell
                        key={`cell-${entry.status}`}
                        fill={
                          ALL_STATUSES[
                            entry.status as keyof typeof ALL_STATUSES
                          ].color
                        }
                        className='stroke-background hover:opacity-80'
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='rounded-lg border bg-background p-2 shadow-sm'>
                            <div className='flex flex-col gap-1'>
                              <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                {payload[0].name}
                              </span>
                              <span className='font-bold text-muted-foreground'>
                                {payload[0].value} Subgoals
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend
                    verticalAlign='bottom'
                    content={() => (
                      <div className='mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4'>
                        {Object.entries(ALL_STATUSES).map(
                          ([key, { name, color }]) => (
                            <div
                              key={`legend-${key}`}
                              className='flex items-center gap-2'
                            >
                              <div
                                className='h-3 w-3 rounded-full'
                                style={{ backgroundColor: color }}
                              />
                              <span className='text-sm text-muted-foreground whitespace-nowrap'>
                                {name}{' '}
                                {data.find((d) => d.status === key)?.value || 0}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goals by Type</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={typeData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className='stroke-muted'
                  />
                  <XAxis
                    dataKey='type'
                    className='text-sm text-muted-foreground'
                  />
                  <YAxis className='text-sm text-muted-foreground' />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='rounded-lg border bg-background p-2 shadow-sm'>
                            <div className='flex flex-col gap-1'>
                              <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                {payload[0].payload.type}
                              </span>
                              <span className='font-bold text-muted-foreground'>
                                {payload[0].value} Goals
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey='count'
                    fill='hsl(217, 91%, 60%)'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={progressData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis
                  dataKey='name'
                  className='text-sm text-muted-foreground'
                  angle={-45}
                  textAnchor='end'
                  height={60}
                />
                <YAxis
                  className='text-sm text-muted-foreground'
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className='rounded-lg border bg-background p-2 shadow-sm'>
                          <div className='flex flex-col gap-1'>
                            <span className='text-[0.70rem] uppercase text-muted-foreground'>
                              {data.name}
                            </span>
                            <span className='font-bold text-muted-foreground'>
                              {data.progress}% Complete
                            </span>
                            <span className='text-sm text-muted-foreground'>
                              {data.completed} of {data.total} subgoals
                            </span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='progress'
                  stroke='hsl(142, 76%, 36%)'
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142, 76%, 36%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
