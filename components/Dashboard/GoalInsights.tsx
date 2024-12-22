'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Sparkles, TrendingUp, LightbulbIcon, RefreshCw, History } from 'lucide-react'
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
import Link from 'next/link'
import { Insight } from '@/services/insightsService'
import { motion } from 'framer-motion'
import { AnimatedAccordion } from '@/components/ui/animated-accordion'

const MAX_TITLE_LENGTH = 60

const renderGoalText = (text: string, insight: Insight) => {
  const parts = text.split(/(\[[\w-]+\]|\b(?:is|and|between|with|to)\b)/)

  return parts
    .map((part, index) => {
      const idMatch = part.match(/\[([\w-]+)\]/)
      if (idMatch) {
        const id = idMatch[1]
        const goal = insight.goal_stats.completionRates.find(g => g.goal_id === id)
        if (goal) {
          const truncatedTitle =
            goal.title.length > MAX_TITLE_LENGTH
              ? `${goal.title.slice(0, MAX_TITLE_LENGTH)}...`
              : goal.title
          return (
            <Link
              key={`${id}-${index}`}
              href={`/goals?selected=${id}&from=insights`}
              className="text-primary hover:underline inline"
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
  const [topPerformingOpenItem, setTopPerformingOpenItem] = useState<string | null>(null)
  const [needsWorkOpenItem, setNeedsWorkOpenItem] = useState<string | null>(null)
  const [recommendationsOpenItem, setRecommendationsOpenItem] = useState<string | null>(null)

  useEffect(() => {
    setSelectedInsight(currentInsight)
  }, [currentInsight])

  const handleHistorySelect = (insightId: string) => {
    const historicalInsight = insightHistory?.find(insight => insight.insight_id === insightId)
    if (historicalInsight) {
      setSelectedInsight(historicalInsight)
    }
  }

  const handleGenerateNew = async () => {
    await generateNewInsights()
    // Reset to latest insight after successful generation
    if (currentInsight) {
      setSelectedInsight(currentInsight)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-[75%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasEnoughData = selectedInsight && selectedInsight.goal_stats.total > 0

  if (!hasEnoughData) {
    return (
      <Card className="bg-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-6 max-w-[500px]">
            Start working on your goals to unlock AI-powered insights! Add goals, track progress, or
            mark tasks as complete to see personalized recommendations and analysis.
          </p>
          <Button
            onClick={handleGenerateNew}
            disabled={isGenerating || remainingGenerations === 0}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Daily Generations</p>
            <Progress value={remainingGenerations * (100 / 3)} className="w-32 h-2" />
            <p className="text-xs text-muted-foreground mt-2">{remainingGenerations} remaining</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!selectedInsight) {
    return (
      <Card className="bg-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-6">
            No insights available. Generate your first insight to get personalized recommendations!
          </p>
          <Button
            onClick={handleGenerateNew}
            disabled={isGenerating || remainingGenerations === 0}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Daily Generations</p>
            <Progress value={remainingGenerations * (100 / 3)} className="w-32 h-2" />
            <p className="text-xs text-muted-foreground mt-2">{remainingGenerations} remaining</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateNew}
              disabled={isGenerating || remainingGenerations === 0}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  Generate New
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={remainingGenerations * (100 / 3)} className="w-16 h-1.5" />
            <span className="text-xs text-muted-foreground">{remainingGenerations}/3</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary">
                Summary
              </Badge>
            </div>
            <div className="bg-accordion-body rounded-lg p-6">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {renderGoalText(selectedInsight.summary, selectedInsight)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trends
              </Badge>
            </div>
            <div className="grid gap-4">
              {selectedInsight.trends.map((trend, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className="bg-accordion-body rounded-lg p-4"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {renderGoalText(trend, selectedInsight)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {(selectedInsight.topPerforming ?? []).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Top Performing Goals
                </Badge>
              </div>
              <div className="grid gap-3">
                <AnimatedAccordion
                  items={(selectedInsight.topPerforming ?? [])
                    .map((goal, index) => {
                      const [goalRef, ...messageParts] = goal.split(':')
                      const message = messageParts.join(':').trim()
                      const goalId = goalRef.match(/\[([\w-]+)\]/)?.[1]
                      const goalData = selectedInsight.goal_stats.completionRates.find(
                        g => g.goal_id === goalId
                      )

                      if (!goalData) return null

                      return {
                        id: `top-${index}`,
                        title: <span className="text-sm font-medium">{goalData.title}</span>,
                        content: (
                          <div className="flex flex-col gap-2 pt-2">
                            <p className="text-sm text-muted-foreground">{message}</p>
                            <div className="mt-2 flex justify-end flex-col gap-1">
                              <div className="flex items-center justify-end text-xs text-muted-foreground mb-1">
                                <span>Progress {goalData.completion.toFixed(1)}%</span>
                              </div>
                              <div className="flex items-center justify-end">
                                <Progress
                                  value={goalData.completion}
                                  className="h-1"
                                  indicatorClassName="bg-electricPurple"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Link href={`/goals?selected=${goalId}&from=insights`}>
                                <Button variant="default" size="md">
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
                  variant="purple"
                />
              </div>
            </div>
          )}

          {(selectedInsight.needsWork ?? []).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-amber-500">
                  <LightbulbIcon className="h-3 w-3 mr-1" />
                  Goals Needing Focus
                </Badge>
              </div>
              <div className="grid gap-3">
                <AnimatedAccordion
                  items={(selectedInsight.needsWork ?? [])
                    .map((goal, index) => {
                      const [goalRef, ...messageParts] = goal.split(':')
                      const message = messageParts.join(':').trim()
                      const goalId = goalRef.match(/\[([\w-]+)\]/)?.[1]
                      const goalData = selectedInsight.goal_stats.completionRates.find(
                        g => g.goal_id === goalId
                      )

                      if (!goalData) return null

                      return {
                        id: `needs-${index}`,
                        title: <span className="text-sm font-medium">{goalData.title}</span>,
                        content: (
                          <div className="flex flex-col gap-2 pt-2">
                            <p className="text-sm text-muted-foreground">{message}</p>
                            <div className="mt-2 flex justify-end flex-col gap-1">
                              <div className="flex items-center justify-end text-xs text-muted-foreground mb-1">
                                <span>Progress {goalData.completion.toFixed(1)}%</span>
                              </div>
                              <div className="flex items-center justify-end">
                                <Progress
                                  value={goalData.completion}
                                  className="h-1"
                                  indicatorClassName="bg-electricPurple"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Link href={`/goals?selected=${goalId}&from=insights`}>
                                <Button variant="default" size="md">
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
                  variant="purple"
                />
              </div>
            </div>
          )}

          {selectedInsight.recommendations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary">
                  <LightbulbIcon className="h-3 w-3 mr-1" />
                  Recommendations
                </Badge>
              </div>
              <div className="grid gap-3">
                <AnimatedAccordion
                  items={selectedInsight.recommendations
                    .map((recommendation, index) => {
                      const [goalRef, ...messageParts] = recommendation.split(':')
                      const message = messageParts.join(':').trim()
                      const goalId = goalRef.match(/\[([\w-]+)\]/)?.[1]
                      const goalData = selectedInsight.goal_stats.completionRates.find(
                        g => g.goal_id === goalId
                      )

                      if (!goalData) return null

                      return {
                        id: `recommendation-${index}`,
                        title: <span className="text-sm font-medium">{goalData.title}</span>,
                        content: (
                          <div className="flex flex-col gap-2 pt-2">
                            <p className="text-sm text-muted-foreground">{message}</p>
                            <div className="mt-2 flex justify-end flex-col gap-1">
                              <div className="flex items-center justify-end text-xs text-muted-foreground mb-1">
                                <span>Progress {goalData.completion.toFixed(1)}%</span>
                              </div>
                              <div className="flex items-center justify-end">
                                <Progress
                                  value={goalData.completion}
                                  className="h-1"
                                  indicatorClassName="bg-electricPurple"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Link href={`/goals?selected=${goalId}&from=insights`}>
                                <Button variant="default" size="md">
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
                  variant="purple"
                />
              </div>
            </div>
          )}

          {insightHistory && insightHistory.length > 0 && (
            <div className="flex justify-end pt-4">
              <Select onValueChange={handleHistorySelect}>
                <SelectTrigger className="w-[180px]">
                  <History className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="View History" />
                </SelectTrigger>
                <SelectContent>
                  {insightHistory.map(insight => (
                    <SelectItem key={insight.insight_id} value={insight.insight_id}>
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
  )
}
