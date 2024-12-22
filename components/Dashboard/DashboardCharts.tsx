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
} from 'recharts'
import Loading from '../ui/loading'
import { Sparkles } from 'lucide-react'

interface DashboardChartsProps {
  goals: Goal[]
  isLoading: boolean
}

const ALL_STATUSES = {
  planned: { name: 'Planned', color: 'hsl(217, 91%, 60%)' },
  in_progress: { name: 'In Progress', color: 'hsl(45, 93%, 47%)' },
  completed: { name: 'Completed', color: 'hsl(142, 76%, 36%)' },
  archived: { name: 'Archived', color: 'hsl(215, 16%, 47%)' },
}

const PRIORITIES = {
  low: { name: 'Low', color: 'hsl(142, 76%, 36%)' },
  medium: { name: 'Medium', color: 'hsl(45, 93%, 47%)' },
  high: { name: 'High', color: 'hsl(0, 84%, 60%)' },
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return percent > 0 ? (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      dominantBaseline='central'
      className='text-xs'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

const getCategoryDistribution = (goals: Goal[]) => {
  const categoryCount = goals.reduce(
    (acc, goal) => {
      const category = goal.category?.name || 'Uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      count,
    }))
}

export default function DashboardCharts({
  goals,
  isLoading = false,
}: DashboardChartsProps) {
  if (isLoading || !goals) {
    return <Loading className='h-[400px]' />
  }

  const hasEnoughData =
    goals.length > 0 &&
    goals.some((goal) => goal.progress > 0 || goal.status === 'completed')

  if (!hasEnoughData) {
    return (
      <Card className='h-[400px]'>
        <CardContent className='h-full flex flex-col items-center justify-center text-center p-6'>
          <Sparkles className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-lg font-medium mb-2'>Analytics Coming Soon!</h3>
          <p className='text-sm text-muted-foreground max-w-[500px]'>
            Start working on your goals and check back here to see insightful
            analytics about your progress. Complete tasks, update your progress,
            or mark goals as completed to unlock these charts.
          </p>
        </CardContent>
      </Card>
    )
  }

  const goalStats = Object.entries(ALL_STATUSES).map(([status]) => ({
    status,
    name: ALL_STATUSES[status as keyof typeof ALL_STATUSES].name,
    value: goals.filter((goal) => goal.status === status).length,
  }))

  const priorityStats = Object.entries(PRIORITIES).map(([priority]) => ({
    priority,
    name: PRIORITIES[priority as keyof typeof PRIORITIES].name,
    value: goals.filter((goal) => goal.priority === priority).length,
  }))

  const categoryData = getCategoryDistribution(goals)

  return (
    <div className='grid gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Goal Status</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={goalStats}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={45}
                  outerRadius={110}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {goalStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ALL_STATUSES[entry.status as keyof typeof ALL_STATUSES]
                          .color
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Goals`, '']} />
                <Legend
                  formatter={(value) =>
                    `${value} (${goalStats.find((s) => s.name === value)?.value || 0})`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Priority</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={priorityStats}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={45}
                    outerRadius={110}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {priorityStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          PRIORITIES[entry.priority as keyof typeof PRIORITIES]
                            .color
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Goals`, '']} />
                  <Legend
                    formatter={(value) =>
                      `${value} (${priorityStats.find((s) => s.name === value)?.value || 0})`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={categoryData} layout='vertical'>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis
                    dataKey='category'
                    type='category'
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [`${value} Goals`, 'Count']} />
                  <Bar dataKey='count' fill='hsl(217, 91%, 60%)' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subgoal Status</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={goals} layout='vertical'>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis
                  dataKey='title'
                  type='category'
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey='completion_rate'
                  fill='hsl(217, 91%, 60%)'
                  name='Completion Rate'
                  unit='%'
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
