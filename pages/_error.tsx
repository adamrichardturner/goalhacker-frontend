import { Button } from '@/components/ui/button'

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center space-y-8 px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {statusCode ? `An error ${statusCode} occurred` : 'An error occurred'}
          </h1>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </div>
        <Button onClick={() => window.location.reload()} size="lg">
          Try Again
        </Button>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: { res: any; err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
