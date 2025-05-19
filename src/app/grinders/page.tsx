"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllGrinders } from "@/services/grinder-service";
import { Grinder } from "@/types/grinder";
import { GrinderCard } from "@/components/grinders/grinder-card";
import { Button } from "@/components/ui/button";

export default function GrindersPage() {
  const [grinders, setGrinders] = useState<Grinder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGrinders = () => {
      try {
        const data = getAllGrinders();
        setGrinders(data);
      } catch (error) {
        console.error("Error loading grinders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGrinders();
  }, []);

  const handleGrinderDeleted = () => {
    // Refresh the list after deletion
    setGrinders(getAllGrinders());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-coffee-navy dark:text-coffee-coral">
          My Grinders
        </h1>
        <Link href="/grinders/new">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add Grinder
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading grinders...</p>
        </div>
      ) : grinders.length === 0 ? (
        <div className="bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No grinders yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add your first coffee grinder to get started
          </p>
          <Link href="/grinders/new">
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 mr-2"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add Your First Grinder
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grinders.map((grinder) => (
            <GrinderCard
              key={grinder.id}
              grinder={grinder}
              onDelete={handleGrinderDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
