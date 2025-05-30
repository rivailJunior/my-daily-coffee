"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ManualBrewer } from "@/types/manualBrewing";
import { deleteManualBrewer } from "@/services/manual-brewing-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ManualBrewerCardProps {
  brewer: ManualBrewer;
  onDelete?: () => void;
}

export function ManualBrewerCard({ brewer, onDelete }: ManualBrewerCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleEdit = () => {
    router.push(`/manual-brewing/${brewer.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteManualBrewer(brewer.id);
      if (onDelete) {
        onDelete();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting manual brewer:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  // Format brew time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get method type label
  const getMethodLabel = () => {
    switch (brewer.brewMethod) {
      case 'percolation':
        return 'Percolation';
      case 'immersion':
        return 'Immersion';
      case 'hybrid':
        return 'Hybrid';
      default:
        return brewer.brewMethod;
    }
  };

  return (
    <Card className='p-4 bg-white dark:bg-coffee-navy border-coffee-gray/30 dark:border-coffee-navy-dark hover:shadow-md transition-shadow'>
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-lg font-medium text-coffee-navy dark:text-coffee-coral'>
            {brewer.name}
          </h3>
          <span className='px-2 py-1 text-xs rounded-full bg-coffee-coral/10 text-coffee-coral'>
            {getMethodLabel()}
          </span>
        </div>

        <div className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
          {brewer.brand} {brewer.model}
        </div>

        <div className='grid grid-cols-2 gap-2 text-sm mb-4'>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Type:</span>{' '}
            {brewer.type.charAt(0).toUpperCase() + brewer.type.slice(1)}
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Material:</span>{' '}
            {brewer.material.charAt(0).toUpperCase() + brewer.material.slice(1)}
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Filter:</span>{' '}
            {brewer.filterType.charAt(0).toUpperCase() +
              brewer.filterType.slice(1)}
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Capacity:</span>{' '}
            {brewer.capacity} ml
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>
              Grind Size:
            </span>{' '}
            {brewer.recommendedGrindSize}
          </div>
          <div>
            <span className='text-gray-500 dark:text-gray-400'>Brew Time:</span>{' '}
            {formatTime(brewer.brewTime.min)} -{' '}
            {formatTime(brewer.brewTime.max)}
          </div>
          {brewer.pressure && (
            <div className='col-span-2'>
              <span className='text-gray-500 dark:text-gray-400'>
                Features:
              </span>{' '}
              Uses pressure
            </div>
          )}
        </div>

        {brewer.notes && (
          <div className='text-sm text-gray-600 dark:text-gray-300 mb-4 italic'>
            {brewer.notes}
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
