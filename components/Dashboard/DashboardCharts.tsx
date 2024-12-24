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

const ChartPlaceholder = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <div className='h-[300px] w-full flex flex-col items-center justify-center text-center p-6'>
    <Sparkles className='h-8 w-8 text-primaryActive mb-4 animate-pulse' />
    <h3 className='text-lg font-medium mb-2'>{title}</h3>
    <p className='text-sm text-muted-foreground max-w-[400px]'>{description}</p>
  </div>
)

export default function DashboardCharts({
  goals,
  isLoading = false,
}: DashboardChartsProps) {
  if (isLoading || !goals) {
    return <Loading className='h-[400px]' />
  }

  const hasGoals = goals.length > 0
  const hasStatusData = goals.some((goal) => goal.status)
  const hasPriorityData = goals.some((goal) => goal.priority)
  const hasCategoryData = goals.some((goal) => goal.category)
  // const hasSubgoalData = goals.some(
  //   (goal) => goal.subgoals && goal.subgoals.length > 0
  // )

  if (!hasGoals) {
    return (
      <Card className='h-[400px]'>
        <CardContent className='h-full flex flex-col items-center justify-center text-center p-6'>
          <Sparkles className='h-12 w-12 text-primaryActive mb-4 animate-pulse' />
          <h3 className='text-lg font-medium mb-2'>Welcome to Analytics!</h3>
          <p className='text-sm text-muted-foreground max-w-[500px]'>
            Create your first goal to unlock insightful analytics about your
            progress. You&apos;ll be able to track status, priorities,
            categories, and more.
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
          {hasStatusData ? (
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
                          ALL_STATUSES[
                            entry.status as keyof typeof ALL_STATUSES
                          ].color
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
          ) : (
            <ChartPlaceholder
              title='Status Data Coming Soon'
              description="Update your goals' status to see a breakdown of how many goals are planned, in progress, completed, or archived."
            />
          )}
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Priority</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            {hasPriorityData ? (
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
                            PRIORITIES[
                              entry.priority as keyof typeof PRIORITIES
                            ].color
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
            ) : (
              <ChartPlaceholder
                title='Priority Data Coming Soon'
                description='Set priorities for your goals to visualize the distribution of high, medium, and low priority tasks.'
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            {hasCategoryData ? (
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
                    <Tooltip
                      formatter={(value) => [`${value} Goals`, 'Count']}
                    />
                    <Bar dataKey='count' fill='hsl(217, 91%, 60%)' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartPlaceholder
                title='Category Data Coming Soon'
                description='Organize your goals into categories to see how they are distributed across different areas of focus.'
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Subgoal Status</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          {hasSubgoalData ? (
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
                  <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                  <Bar dataKey='progress' fill='hsl(217, 91%, 60%)' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartPlaceholder
              title='Subgoal Data Coming Soon'
              description='Break down your goals into subgoals and track their progress to see how each goal is advancing.'
            />
          )}
        </CardContent>
      </Card> */}
    </div>
  )
}
