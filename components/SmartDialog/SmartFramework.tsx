import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DialogTitle } from '@radix-ui/react-dialog'

const smartDetails = [
  {
    letter: 'S',
    word: 'Specific',
    description:
      'Clear and well-defined goals that answer the five "W" questions: What, Why, Who, Where, and Which.',
    example: 'Instead of "Get fit", try "Run a 5K marathon in under 30 minutes"',
  },
  {
    letter: 'M',
    word: 'Measurable',
    description:
      "Include specific metrics to track progress and know when you've achieved your goal.",
    example: 'Track your running times, distance covered, and training frequency',
  },
  {
    letter: 'A',
    word: 'Achievable',
    description:
      'Goals should be challenging but realistic within your capabilities and resources.',
    example: 'Start with a 5K before aiming for a full marathon',
  },
  {
    letter: 'R',
    word: 'Relevant',
    description: 'Align with your broader objectives and current life situation.',
    example: 'Ensure your fitness goal fits with your schedule and lifestyle',
  },
  {
    letter: 'T',
    word: 'Time-bound',
    description: 'Set clear deadlines and milestones to create urgency and maintain focus.',
    example: 'Achieve your target running time within 3 months',
  },
]

export const SmartFramework = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">The SMART Framework</h2>
        <p className="text-muted-foreground">
          Goal Hacker is built on the proven SMART goal-setting methodology, helping you transform
          vague aspirations into achievable outcomes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {smartDetails.map(item => (
          <Card key={item.letter}>
            <CardHeader>
              <DialogTitle asChild>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-electricPurple text-white">
                    {item.letter}
                  </span>
                  {item.word}
                </div>
              </DialogTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <CardDescription className="text-xs italic">Example: {item.example}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How Goal Hacker Implements SMART</CardTitle>
          <CardDescription>
            Our platform seamlessly integrates the SMART framework into your goal-setting process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Structured Goal Creation</h4>
            <p className="text-sm text-muted-foreground">
              Our goal creation process guides you through each SMART criterion, ensuring your goals
              are well-defined and actionable.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Progress Tracking</h4>
            <p className="text-sm text-muted-foreground">
              Built-in tracking tools help you measure progress against your defined metrics and
              timelines.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Subgoal System</h4>
            <p className="text-sm text-muted-foreground">
              Break down larger goals into achievable subgoals, making complex objectives more
              manageable and trackable.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Timeline Management</h4>
            <p className="text-sm text-muted-foreground">
              Set and track deadlines for both main goals and subgoals, keeping you accountable and
              on schedule.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SmartFramework
