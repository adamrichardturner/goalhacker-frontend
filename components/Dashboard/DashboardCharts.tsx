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

const getMonthlyProgress = (goals: Goal[]) => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      timestamp: date.getTime(),
    }
  }).reverse()

  return last6Months.map(({ month, timestamp }) => {
    const monthStart = new Date(timestamp)
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(timestamp)
    monthEnd.setMonth(monthEnd.getMonth() + 1)
    monthEnd.setDate(0)
    monthEnd.setHours(23, 59, 59, 999)

    const completed = goals.filter((goal) => {
      const updatedDate = new Date(goal.updated_at)
      return (
        goal.status === 'completed' &&
        updatedDate >= monthStart &&
        updatedDate <= monthEnd
      )
    }).length

    const started = goals.filter((goal) => {
      const createdDate = new Date(goal.created_at)
      return createdDate >= monthStart && createdDate <= monthEnd
    }).length

    return {
      name: month,
      'Goals Completed': completed,
      'Goals Started': started,
    }
  })
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

  return percent === 0 ? null : (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      dominantBaseline='central'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function DashboardCharts({
  goals,
  isLoading = false,
}: DashboardChartsProps) {
  if (isLoading || !goals) {
    return <Loading className='h-[400px]' />
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
  const monthlyProgress = getMonthlyProgress(goals)

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
                  paddingAngle={5}
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
                    paddingAngle={5}
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
                    tickFormatter={(value) =>
                      value.length > 20 ? `${value.substring(0, 20)}...` : value
                    }
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey='completed_subgoals'
                    name='Completed'
                    stackId='a'
                    fill='#4ade80'
                  />
                  <Bar
                    dataKey='incomplete_subgoals'
                    name='Incomplete'
                    stackId='a'
                    fill='#fb923c'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} Goals`, '']} />
                <Legend />
                <Bar dataKey='Goals Completed' fill='#4ade80' />
                <Bar dataKey='Goals Started' fill='#fb923c' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
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
                <Tooltip formatter={(value) => [`${value} Goals`, '']} />
                <Bar dataKey='count' fill='#8884d8' name='Goals' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
