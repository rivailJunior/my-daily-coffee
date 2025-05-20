"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllManualBrewers } from "@/services/manual-brewing-service";
import { ManualBrewer, BREW_METHODS } from "@/types/manualBrewing";
import { ManualBrewerCard } from "@/components/manual-brewing/manual-brewer-card";
import { Button } from "@/components/ui/button";

export default function ManualBrewingPage() {
  const [brewers, setBrewers] = useState<ManualBrewer[]>([]);
  const [filteredBrewers, setFilteredBrewers] = useState<ManualBrewer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadBrewers = () => {
      try {
        const data = getAllManualBrewers();
        setBrewers(data);
        setFilteredBrewers(data);
      } catch (error) {
        console.error("Error loading manual brewers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrewers();
  }, []);

  const handleBrewerDeleted = () => {
    // Refresh the list after deletion
    const updatedBrewers = getAllManualBrewers();
    setBrewers(updatedBrewers);
    filterBrewers(updatedBrewers, activeFilter);
  };
  
  const filterBrewers = (brewersList: ManualBrewer[], methodType: string | null) => {
    if (!methodType) {
      setFilteredBrewers(brewersList);
      return;
    }
    
    const filtered = brewersList.filter(brewer => brewer.brewMethod === methodType);
    setFilteredBrewers(filtered);
  };
  
  const handleFilterClick = (methodType: string | null) => {
    setActiveFilter(methodType === activeFilter ? null : methodType);
    filterBrewers(brewers, methodType === activeFilter ? null : methodType);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-coffee-navy dark:text-coffee-coral">
          My Brewing Methods
        </h1>
        <Link href="/manual-brewing-methods/new">
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
            Add Brewing Method
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading brewing methods...</p>
        </div>
      ) : brewers.length === 0 ? (
        <div className="bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No brewing methods yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add your first brewing method to get started
          </p>
          <Link href="/manual-brewing-methods/new">
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
              Add Your First Brewing Method
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={activeFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(null)}
              className="rounded-full"
            >
              All Methods
            </Button>
            {BREW_METHODS.map((method) => (
              <Button
                key={method.value}
                variant={activeFilter === method.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterClick(method.value)}
                className="rounded-full"
              >
                {method.label}
              </Button>
            ))}
          </div>

          {filteredBrewers.length === 0 ? (
            <div className="bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No matching brewing methods</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try a different filter or add a new brewing method
              </p>
              <Button onClick={() => handleFilterClick(null)}>
                Show All Methods
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBrewers.map((brewer) => (
                <ManualBrewerCard
                  key={brewer.id}
                  brewer={brewer}
                  onDelete={handleBrewerDeleted}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
