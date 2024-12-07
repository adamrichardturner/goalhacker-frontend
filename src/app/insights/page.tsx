  <div className='space-y-4'>
    <div className='flex items-center gap-2'>
      <Badge variant='outline' className='text-primary'>
        Summary
      </Badge>
    </div>
    <div className='bg-muted/5 rounded-lg p-6'>
      <div className='text-sm text-muted-foreground leading-relaxed max-w-full'>
        {renderGoalText(selectedInsight.summary, selectedInsight)}
      </div>
    </div>
  </div>

  <div className='grid gap-4'>
    {selectedInsight.trends.map((trend, index) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        key={index}
        className='bg-muted/5 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed'
      >
        <div className='flex flex-wrap items-start gap-1 w-full whitespace-pre-wrap break-words'>
          {renderGoalText(trend, selectedInsight)}
        </div>
      </motion.div>
    ))}
  </div>

  <div className='flex flex-col gap-2'>
    <div className='flex flex-wrap items-start gap-1 w-full whitespace-pre-wrap break-words'>
      {renderGoalText(goalRef, selectedInsight)}
    </div>
    <p className='text-muted-foreground whitespace-pre-wrap break-words'>{message}</p>
    {goalData && (
      <div className='mt-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground mb-1'>
          <span>Progress</span>
          <span>{goalData.completion.toFixed(1)}%</span>
        </div>
        <Progress value={goalData.completion} className='h-1' />
      </div>
    )}
  </div> 