'use client'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SmartFramework from './SmartFramework'

export const SmartDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='text-blue-600 p-0 h-auto font-normal hover:no-underline cursor-pointer'>
          Click here for more information
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[90vw] 2xl:max-w-[60vw] h-[70vh] overflow-y-auto rounded-2xl'>
        <SmartFramework />
        <DialogClose asChild>
          <Button
            variant='default'
            className='mt-4 bg-primaryActive w-full sm:w-[120px]'
            size='lg'
          >
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default SmartDialog
