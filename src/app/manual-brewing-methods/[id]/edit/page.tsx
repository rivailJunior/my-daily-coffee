"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ManualBrewer } from "@/types/manualBrewing";
import { getManualBrewerById } from "@/services/manual-brewing-service";
import { ManualBrewerForm } from "@/components/manual-brewing/manual-brewer-form";
import { Button } from "@/components/ui/button";

export default function EditManualBrewerPage() {
  const params = useParams();
  const router = useRouter();
  const [brewer, setBrewer] = useState<ManualBrewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    
    if (!id) {
      setError("Brewer ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      const brewerData = getManualBrewerById(id);
      
      if (!brewerData) {
        setError("Brewing method not found");
      } else {
        setBrewer(brewerData);
      }
    } catch (err) {
      console.error("Error loading brewing method:", err);
      setError("Failed to load brewing method data");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading brewing method data...</p>
        </div>
      </div>
    );
  }

  if (error || !brewer) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Error</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || "Failed to load brewing method data"}
          </p>
          <Button onClick={() => router.push("/manual-brewing")}>
            Back to Brewing Methods
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-navy dark:text-coffee-coral">
          Edit Brewing Method
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Update information for {brewer.name}
        </p>
      </div>

      <div className="bg-white dark:bg-coffee-navy-dark border border-coffee-gray/30 dark:border-coffee-navy rounded-lg p-6">
        <ManualBrewerForm brewer={brewer} />
      </div>
    </div>
  );
}
