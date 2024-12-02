import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export const AuthCard = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description: string
}) => {
  return (
    <Card className='w-[400px]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
