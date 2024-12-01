import { User } from "@/types/auth"
import { Goal } from "@/types/goal"
import { Button } from "../ui/button"
import { useState } from "react"
import Link from "next/link"

type FilterType = "All" | "Active" | "Completed"

interface GoalsViewProps {
  goals: Goal[]
  user: User
}

const GoalsView = ({ goals, user }: GoalsViewProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All")

  const filters: FilterType[] = ["All", "Active", "Completed"]

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between items-center'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-2xl leading-none font-semibold'>
            Welcome, {user?.first_name}! 👋
          </h1>
          <Link href='/goals/new'>
            <Button className='bg-success p-6 hover:bg-success-hover hover:drop-shadow-sm text-light text-white text-sm'>
              New Goal
            </Button>
          </Link>
        </div>
      </div>

      <nav className='flex gap-8 items-center border-b border-border'>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`relative pb-2 text-sm transition-colors duration-200 ${
              selectedFilter === filter
                ? "text-foreground font-semibold"
                : "text-muted hover:text-foreground"
            }`}
          >
            {filter}
            {selectedFilter === filter && (
              <div className='absolute bottom-0 left-0 w-full h-0.5 bg-electricPurple' />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default GoalsView
