'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
  Sparkles,
  TrendingUp,
  LightbulbIcon,
  RefreshCw,
  History,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useInsights } from '@/hooks/useInsights'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'

const MAX_TITLE_LENGTH = 60

const parseGoalText = (text: string) => {
  const matches = text.match(/\[([\w-]+)\]([^:]+)/)
  if (!matches) return { id: null, title: text, rest: '' }

  const [, id, fullTitle] = matches
  const title = fullTitle.trim()
  const rest = text.split(':').slice(1).join(':').trim()

  return {
    id,
    title:
      title.length > MAX_TITLE_LENGTH
        ? `${title.slice(0, MAX_TITLE_LENGTH)}...`
        : title,
    rest,
  }
}

export default function GoalInsights() {
  const {
    insight: currentInsight,
    remainingGenerations,
    isLoading,
    isGenerating,
    generateNewInsights,
    insightHistory,
  } = useInsights()
  const [selectedInsight, setSelectedInsight] = useState(currentInsight)
  const router = useRouter()

  useEffect(() => {
    setSelectedInsight(currentInsight)
  }, [currentInsight])

  const handleHistorySelect = (insightId: string) => {
    const historicalInsight = insightHistory?.find(
      (insight) => insight.insight_id === insightId
    )
    if (historicalInsight) {
      setSelectedInsight(historicalInsight)
    }
  }

  if (isLoading) {
    return (
      <Card className='bg-gradient-to-br from-background to-muted/20'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-[90%]' />
            <Skeleton className='h-4 w-[95%]' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[85%]' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-[75%]' />
            <Skeleton className='h-4 w-[70%]' />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!selectedInsight) {
    return (
      <Card className='bg-gradient-to-br from-background to-muted/20'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <Sparkles className='h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-muted-foreground text-center mb-6'>
            No insights available. Generate your first insight to get
            personalized recommendations!
          </p>
          <Button
            onClick={generateNewInsights}
            disabled={isGenerating || remainingGenerations === 0}
            className='gap-2'
          >
            {isGenerating ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className='h-4 w-4' />
                Generate Insights
              </>
            )}
          </Button>
          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground mb-2'>
              Daily Generations
            </p>
            <Progress
              value={(remainingGenerations / 3) * 100}
              className='w-32 h-2'
            />
            <p className='text-xs text-muted-foreground mt-2'>
              {remainingGenerations} remaining
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='bg-card'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='flex items-center gap-2'>
          <Sparkles className='h-5 w-5 text-primary' />
          AI Insights
        </CardTitle>
        <div className='flex flex-col items-end gap-1'>
          <div className='flex items-center gap-2'>
            <Button
              onClick={generateNewInsights}
              disabled={isGenerating || remainingGenerations === 0}
              size='sm'
              variant='outline'
              className='gap-2'
            >
              {isGenerating ? (
                <>
                  <RefreshCw className='h-3 w-3 animate-spin' />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className='h-3 w-3' />
                  Generate New
                </>
              )}
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <Progress
              value={(remainingGenerations / 3) * 100}
              className='w-16 h-1.5'
            />
            <span className='text-xs text-muted-foreground'>
              {remainingGenerations}/3
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6 pt-4'>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-primary'>
              Summary
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {selectedInsight.summary}
          </p>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-primary'>
              <TrendingUp className='h-3 w-3 mr-1' />
              Trends
            </Badge>
          </div>
          <ul className='grid gap-2 text-sm'>
            {selectedInsight.trends.map((trend, index) => (
              <li
                key={index}
                className='text-muted-foreground flex items-start gap-2 leading-relaxed'
              >
                <span className='text-primary mt-1.5'>•</span>
                {trend}
              </li>
            ))}
          </ul>
        </div>

        {(selectedInsight.topPerforming ?? []).length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-green-500'>
                <TrendingUp className='h-3 w-3 mr-1' />
                Top Performing Goals
              </Badge>
            </div>
            <div className='rounded-md border'>
              <Table>
                <TableBody className='text-sm'>
                  {(selectedInsight.topPerforming ?? []).map((goal, index) => {
                    const { id, title, rest } = parseGoalText(goal)
                    return (
                      <TableRow
                        key={index}
                        className='hover:bg-muted-foreground/10 cursor-pointer transition-colors'
                        onClick={() => id && router.push(`/goals/${id}`)}
                      >
                        <TableCell className='font-medium'>
                          {id ? (
                            <span className='text-primary'>{title}</span>
                          ) : (
                            title
                          )}
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {rest}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {(selectedInsight.needsWork ?? []).length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-amber-500'>
                <LightbulbIcon className='h-3 w-3 mr-1' />
                Goals Needing Focus
              </Badge>
            </div>
            <div className='rounded-md border'>
              <Table>
                <TableBody className='text-sm'>
                  {(selectedInsight.needsWork ?? []).map((goal, index) => {
                    const { id, title, rest } = parseGoalText(goal)
                    return (
                      <TableRow
                        key={index}
                        className='hover:bg-muted-foreground/10 cursor-pointer transition-colors'
                        onClick={() => id && router.push(`/goals/${id}`)}
                      >
                        <TableCell className='font-medium'>
                          {id ? (
                            <span className='text-primary'>{title}</span>
                          ) : (
                            title
                          )}
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {rest}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-primary'>
              <LightbulbIcon className='h-3 w-3 mr-1' />
              Recommendations
            </Badge>
          </div>
          <ul className='grid gap-2'>
            {selectedInsight.recommendations.map((recommendation, index) => (
              <li
                key={index}
                className='text-muted-foreground flex items-start gap-2 leading-relaxed'
              >
                <span className='text-primary mt-1.5'>•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        {insightHistory && insightHistory.length > 0 && (
          <div className='flex justify-end'>
            <Select onValueChange={handleHistorySelect}>
              <SelectTrigger className='w-[180px]'>
                <History className='h-3 w-3 mr-2' />
                <SelectValue placeholder='View History' />
              </SelectTrigger>
              <SelectContent>
                {insightHistory.map((insight) => (
                  <SelectItem
                    key={insight.insight_id}
                    value={insight.insight_id}
                  >
                    {format(new Date(insight.created_at), 'MMM d, h:mm a')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className='flex justify-end'>
          <p className='text-xs text-muted-foreground'>
            Generated{' '}
            {format(new Date(selectedInsight.created_at), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
