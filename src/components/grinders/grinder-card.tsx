"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Grinder } from "@/types/grinder";
import { deleteGrinder } from "@/services/grinder-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GrinderCardProps {
  grinder: Grinder;
  onDelete?: () => void;
}

export function GrinderCard({ grinder, onDelete }: GrinderCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleEdit = () => {
    router.push(`/grinders/${grinder.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGrinder(grinder.id);
      if (onDelete) {
        onDelete();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting grinder:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <Card className='p-6 bg-white dark:bg-coffee-navy border border-gray-200 dark:border-coffee-navy-dark rounded-xl shadow-sm'>
      <div className='flex flex-col items-start justify-between gap-6 w-full'>
        {/* Left Section: Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-3 mb-1'>
            <h3 className='text-lg font-bold text-coffee-navy dark:text-coffee-coral truncate'>
              {grinder.name}
            </h3>
            <span className='px-2 py-0.5 text-xs font-semibold rounded bg-orange-500 text-white ml-1'>
              {grinder.type || 'Electric'}
            </span>
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
            {grinder.brand} {grinder.model}
          </div>
          <div className='grid grid-cols-2 gap-y-2 gap-x-8 text-sm'>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Type
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {grinder.burrType || 'Conical'}
              </div>
            </div>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Size
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {grinder.burrSize ? `${grinder.burrSize}mm` : '38mm'}
              </div>
            </div>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Range
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {grinder.minGrindSize && grinder.maxGrindSize
                  ? `${grinder.minGrindSize}-${grinder.maxGrindSize}`
                  : '1-12'}
              </div>
            </div>
            <div>
              <div className='uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider'>
                Precision
              </div>
              <div className='font-semibold text-coffee-navy dark:text-coffee-coral'>
                {grinder.micronsPerClick
                  ? `${grinder.micronsPerClick} microns`
                  : '8 microns'}
              </div>
            </div>
            {/* <div>
              <div className="uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider">Adjustment</div>
              <div className="font-semibold text-coffee-navy dark:text-coffee-coral">{grinder.stepless ? 'Stepless' : 'Stepped'}</div>
            </div> */}
          </div>
          {/* {grinder.notes && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 italic">
              {grinder.notes}
            </div>
          )} */}
        </div>
        {/* Right Section: Actions */}
        <div className='flex flex-row items-center gap-2 w-full'>
          {showConfirmDelete ? (
            <>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleDelete}
                disabled={isDeleting}
                className='w-full bg-red-500 dark:bg-red-600'
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
              <Button
                variant='default'
                size='sm'
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className='w-full'
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='destructive'
                size='sm'
                className='w-full'
                onClick={() => setShowConfirmDelete(true)}
              >
                Delete
              </Button>
              <Button
                variant='default'
                size='sm'
                className='w-full'
                onClick={handleEdit}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
