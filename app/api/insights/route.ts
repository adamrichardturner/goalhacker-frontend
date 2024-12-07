import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { Goal } from '@/types/goal'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { goals } = await req.json()

    // Prepare goal data for analysis
    const goalStats = {
      total: goals.length,
      byStatus: goals.reduce((acc: Record<string, number>, goal: Goal) => {
        acc[goal.status] = (acc[goal.status] || 0) + 1
        return acc
      }, {}),
      byPriority: goals.reduce((acc: Record<string, number>, goal: Goal) => {
        acc[goal.priority] = (acc[goal.priority] || 0) + 1
        return acc
      }, {}),
      byCategory: goals.reduce((acc: Record<string, number>, goal: Goal) => {
        const category = goal.category?.name || 'Uncategorized'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {}),
      completionRates: goals.map((goal: Goal) => {
        const total = goal.subgoals?.length || 0
        const completed =
          goal.subgoals?.filter((sg) => sg.status === 'completed').length || 0
        return {
          title: goal.title,
          completion: total ? (completed / total) * 100 : 0,
        }
      }),
    }

    const prompt = `
      Analyze the following goal data and provide insights:
      
      Total Goals: ${goalStats.total}
      
      Status Distribution:
      ${Object.entries(goalStats.byStatus)
        .map(([status, count]) => `${status}: ${count}`)
        .join('\n')}
      
      Priority Distribution:
      ${Object.entries(goalStats.byPriority)
        .map(([priority, count]) => `${priority}: ${count}`)
        .join('\n')}
      
      Category Distribution:
      ${Object.entries(goalStats.byCategory)
        .map(([category, count]) => `${category}: ${count}`)
        .join('\n')}
      
      Goal Completion Rates:
      ${goalStats.completionRates
        .map((g) => `${g.title}: ${g.completion.toFixed(1)}%`)
        .join('\n')}
      
      Please provide:
      1. A brief summary of the overall goal portfolio
      2. Key trends and patterns you observe
      3. Actionable recommendations for improvement
      
      Format the response as JSON with the following structure:
      {
        "summary": "overall summary here",
        "trends": ["trend 1", "trend 2", ...],
        "recommendations": ["recommendation 1", "recommendation 2", ...]
      }
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert goal analyst and productivity coach. Analyze goal data and provide actionable insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const insights = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
