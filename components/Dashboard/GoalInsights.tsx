'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp, LightbulbIcon, History } from 'lucide-react'
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
import Link from 'next/link'
import { Insight } from '@/services/insightsService'
import { motion } from 'framer-motion'
import { AnimatedAccordion } from '@/components/ui/animated-accordion'
import { StatusBadge } from '@/components/ui/status-badge'
import { Label } from '../ui/label'

const MAX_TITLE_LENGTH = 60

const renderGoalText = (text: string, insight: Insight) => {
  const parts = text.split(/(\[[\w-]+\]|\b(?:is|and|between|with|to)\b)/)

  return parts
    .map((part, index) => {
      const idMatch = part.match(/\[([\w-]+)\]/)
      if (idMatch) {
        const id = idMatch[1]
        const goal = insight.goal_stats.completionRates.find(
          (g) => g.goal_id === id
        )
        if (goal) {
          const truncatedTitle =
            goal.title.length > MAX_TITLE_LENGTH
              ? `${goal.title.slice(0, MAX_TITLE_LENGTH)}...`
              : goal.title
          return (
            <Link
              key={`${id}-${index}`}
              href={`/goals?id=${id}`}
              className='text-primary hover:underline inline'
            >
              {truncatedTitle}
            </Link>
          )
        }
      }
      if (part.match(/\b(?:is|and|between|with|to)\b/)) {
        return ` ${part} `
      }
      return part.trim() ? part : ' '
    })
    .filter(Boolean)
}

interface GoalInsightsProps {
  insights: Insight | null
  isLoading: boolean
}

export default function GoalInsights({
  insights,
  isLoading: externalLoading,
}: GoalInsightsProps) {
  const {
    isLoading: insightsLoading,
    isGenerating,
    generateNewInsights,
    insightHistory,
    remainingGenerations,
  } = useInsights()
  const [selectedInsight, setSelectedInsight] = useState(insights)
  const [topPerformingOpenItem, setTopPerformingOpenItem] = useState<
    string | null
  >(null)
  const [needsWorkOpenItem, setNeedsWorkOpenItem] = useState<string | null>(
    null
  )
  const [recommendationsOpenItem, setRecommendationsOpenItem] = useState<
    string | null
  >(null)

  useEffect(() => {
    if (insights) {
      setSelectedInsight(insights)
    }
  }, [insights])

  const handleHistorySelect = (insightId: string) => {
    const historicalInsight = insightHistory?.find(
      (insight) => insight.insight_id === insightId
    )
    if (historicalInsight) {
      setSelectedInsight(historicalInsight)
    }
  }

  const handleGenerateInsights = async () => {
    const newInsight = await generateNewInsights()
    if (newInsight) {
      setSelectedInsight(newInsight)
    }
  }

  const isLoadingState = externalLoading || insightsLoading

  if (isLoadingState || isGenerating) {
    return (
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <motion.div
            className='flex flex-col items-center justify-center py-8 text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles className='h-12 w-12 text-primaryActive mb-4 animate-pulse' />
            <p className='text-primary font-medium mb-2'>
              {isGenerating ? 'Generating Fresh Insights' : 'Loading Insights'}
            </p>
            <p className='text-muted-foreground text-sm max-w-[400px] mb-6'>
              Our AI is analyzing your goals, progress, and patterns to provide
              personalized insights and recommendations.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  const hasEnoughData = selectedInsight && selectedInsight.goal_stats.total > 0

  if (!hasEnoughData) {
    return (
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <Sparkles className='h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-muted-foreground text-center mb-6 max-w-[500px] text-[14px]'>
            Start working on your goals to unlock AI-powered insights! Add
            goals, track progress, or mark tasks as complete to see personalized
            recommendations and analysis.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!selectedInsight) {
    return (
      <Card className='bg-paper'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <Sparkles className='h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-muted-foreground text-center mb-6'>
            No insights available yet. We&apos;ll generate them automatically in
            a moment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <Card className='bg-card'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            AI Insights
          </CardTitle>
          <div className='flex flex-col-reverse items-end justify-end gap-2'>
            <div className='flex flex-col items-end gap-2'>
              <Button
                variant='default'
                size='sm'
                onClick={handleGenerateInsights}
                disabled={
                  isGenerating || isLoadingState || remainingGenerations === 0
                }
                className='relative'
              >
                Generate Insights
              </Button>
              {remainingGenerations > 0 && (
                <span className='ml-2 text-xs text-muted-foreground'>
                  ({remainingGenerations} left)
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <StatusBadge>Summary</StatusBadge>
              </div>
              <div className='bg-accordion-body rounded-2xl p-0'>
                <p className='text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                  {renderGoalText(selectedInsight.summary, selectedInsight)}
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <StatusBadge icon={<TrendingUp className='h-3 w-3' />}>
                  Trends
                </StatusBadge>
              </div>
              <div className='grid gap-4'>
                {selectedInsight.trends.map((trend, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className='bg-accordion-body rounded-2xl p-0'
                  >
                    <p className='text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                      {renderGoalText(trend, selectedInsight)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {(selectedInsight.topPerforming ?? []).length > 0 && (
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <StatusBadge icon={<TrendingUp className='h-3 w-3' />}>
                    Top Performing Goals
                  </StatusBadge>
                </div>
                <div className='grid gap-3'>
                  <AnimatedAccordion
                    items={(selectedInsight.topPerforming ?? [])
                      .map((goal, index) => {
                        const [goalRef, ...messageParts] = goal.split(':')
                        const message = messageParts.join(':').trim()
                        const goalId = goalRef.match(/\[([\w-]+)\]/)?.[1]
                        const goalData =
                          selectedInsight.goal_stats.completionRates.find(
                            (g) => g.goal_id === goalId
                          )

                        if (!goalData) return null

                        return {
                          id: `top-${index}`,
                          title: (
                            <span className='text-sm font-medium'>
                              {goalData.title}
                            </span>
                          ),
                          content: (
                            <div className='flex flex-col gap-2 pt-2'>
                              <p className='text-sm text-muted-foreground'>
                                {message}
                              </p>
                              <div className='mt-2 flex justify-end flex-col gap-1'>
                                <div className='flex items-center justify-end text-xs text-muted-foreground mb-1'>
                                  <span>
                                    Progress {goalData.completion.toFixed(1)}%
                                  </span>
                                </div>
                                <div className='flex items-center justify-end'>
                                  <Progress value={goalData.completion} />
                                </div>
                              </div>
                              <div className='flex justify-end mt-4'>
                                <Link href={`/goals?id=${goalId}`}>
                                  <Button variant='default' size='sm'>
                                    View Goal
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ),
                        }
                      })
                      .filter(
                        (
                          item
                        ): item is {
                          id: string
                          title: JSX.Element
                          content: JSX.Element
                        } => item !== null
                      )}
                    openItem={topPerformingOpenItem}
                    onOpenChange={setTopPerformingOpenItem}
                    variant='purple'
                  />
                </div>
              </div>
            )}

            {(selectedInsight.needsWork ?? []).length > 0 && (
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <StatusBadge icon={<LightbulbIcon className='h-3 w-3' />}>
                    Goals Needing Focus
                  </StatusBadge>
                </div>
                <div className='grid gap-3'>
                  <AnimatedAccordion
                    items={(selectedInsight.needsWork ?? [])
                      .map((goal, index) => {
                        const [goalRef, ...messageParts] = goal.split(':')
                        const message = messageParts.join(':').trim()
                        const goalId = goalRef.match(/\[([\w-]+)\]/)?.[1]
                        const goalData =
                          selectedInsight.goal_stats.completionRates.find(
                            (g) => g.goal_id === goalId
                          )

                        if (!goalData) return null

                        return {
                          id: `needs-${index}`,
                          title: (
                            <span className='text-sm font-medium'>
                              {goalData.title}
                            </span>
                          ),
                          content: (
                            <div className='flex flex-col gap-2 pt-2'>
                              <p className='text-sm text-muted-foreground'>
                                {message}
                              </p>
                              <div className='mt-2 flex justify-end flex-col gap-1'>
                                <div className='flex items-center justify-end text-xs text-muted-foreground mb-1'>
                                  <span>
                                    Progress {goalData.completion.toFixed(1)}%
                                  </span>
                                </div>
                                <div className='flex items-center justify-end'>
                                  <Progress value={goalData.completion} />
                                </div>
                              </div>
                              <div className='flex justify-end mt-4'>
                                <Link href={`/goals?id=${goalId}`}>
                                  <Button variant='default' size='sm'>
                                    View Goal
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ),
                        }
                      })
                      .filter(
                        (
                          item
                        ): item is {
                          id: string
                          title: JSX.Element
                          content: JSX.Element
                        } => item !== null
                      )}
                    openItem={needsWorkOpenItem}
                    onOpenChange={setNeedsWorkOpenItem}
                    variant='purple'
                  />
                </div>
              </div>
            )}

            {selectedInsight.recommendations.length > 0 && (
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <StatusBadge icon={<LightbulbIcon className='h-3 w-3' />}>
                    Recommendations
                  </StatusBadge>
                </div>
                <div className='grid gap-3'>
                  <AnimatedAccordion
                    items={selectedInsight.recommendations
                      .map((recommendation, index) => {
                        const [goalRef, ...messageParts] =
                          recommendation.split(':')
                        const message = messageParts.join(':').trim()
                        const goalId = goalRef.match(/\[([\w-]+)\]/)?.[1]
                        const goalData =
                          selectedInsight.goal_stats.completionRates.find(
                            (g) => g.goal_id === goalId
                          )

                        if (!goalData) return null

                        return {
                          id: `recommendation-${index}`,
                          title: (
                            <span className='text-sm font-medium'>
                              {goalData.title}
                            </span>
                          ),
                          content: (
                            <div className='flex flex-col gap-2 pt-2'>
                              <p className='text-sm text-muted-foreground'>
                                {message}
                              </p>
                              <div className='mt-2 flex justify-end flex-col gap-1'>
                                <div className='flex items-center justify-end text-xs text-muted-foreground mb-1'>
                                  <span>
                                    Progress {goalData.completion.toFixed(1)}%
                                  </span>
                                </div>
                                <div className='flex items-center justify-end'>
                                  <Progress value={goalData.completion} />
                                </div>
                              </div>
                              <div className='flex justify-end mt-4'>
                                <Link href={`/goals?id=${goalId}`}>
                                  <Button variant='default' size='sm'>
                                    View Goal
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ),
                        }
                      })
                      .filter(
                        (
                          item
                        ): item is {
                          id: string
                          title: JSX.Element
                          content: JSX.Element
                        } => item !== null
                      )}
                    openItem={recommendationsOpenItem}
                    onOpenChange={setRecommendationsOpenItem}
                    variant='purple'
                  />
                </div>
              </div>
            )}
            {insightHistory && insightHistory.length > 0 && (
              <div className='flex flex-col gap-2 w-full items-end justify-end'>
                <Label className='text-xs text-muted-foreground'>
                  View History
                </Label>
                <Select
                  value={selectedInsight?.insight_id}
                  onValueChange={handleHistorySelect}
                >
                  <SelectTrigger className='w-[180px]'>
                    <History className='h-4 w-4 mr-2' />
                    <SelectValue placeholder='View history' />
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
