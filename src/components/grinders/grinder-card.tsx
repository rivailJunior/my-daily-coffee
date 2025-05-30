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
    <Card className='p-4 bg-white dark:bg-coffee-navy border-coffee-gray/30 dark:border-coffee-navy-dark hover:shadow-md transition-shadow'>
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-lg font-medium text-coffee-navy dark:text-coffee-coral'>
            {grinder.name}
          </h3>
          <span className='px-2 py-1 text-xs rounded-full bg-coffee-coral/10 text-coffee-coral'>
            {grinder.type}
          </span>
        </div>

        <div className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
          {grinder.brand} {grinder.model}
        </div>

        <div className='grid grid-cols-2 gap-2 text-sm mb-4'>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Burr Type:</span>{' '}
            {grinder.burrType || 'N/A'}
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Burr Size:</span>{' '}
            {grinder.burrSize ? `${grinder.burrSize}mm` : 'N/A'}
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>
              Adjustment:
            </span>{' '}
            {grinder.stepless ? 'Stepless' : 'Stepped'}
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Range:</span>{' '}
            {grinder.minGrindSize} - {grinder.maxGrindSize}
          </div>
          {!grinder.stepless && grinder.micronsPerClick && (
            <div className='col-span-2'>
              <span className='text-gray-500 dark:text-gray-400'>
                Precision:
              </span>{' '}
              {grinder.micronsPerClick} microns per click
            </div>
          )}
        </div>

        {grinder.notes && (
          <div className='text-sm text-gray-600 dark:text-gray-300 mb-4 italic'>
            {grinder.notes}
          </div>
        )}

        <div className='mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2'>
          {showConfirmDelete ? (
            <>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowConfirmDelete(true)}
              >
                Delete
              </Button>
              <Button size='sm' onClick={handleEdit}>
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
