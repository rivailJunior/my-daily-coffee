"use client";

import { ManualBrewerForm } from "@/components/manual-brewing/manual-brewer-form";
import { FormContainer } from '@/components/formContainer';

export default function NewManualBrewerPage() {
  return (
    <FormContainer
      heading='Add New Brewing Method'
      href='/manual-brewing'
      title='Add New Brewing Method'
      headingDescription='Register a new manual brewing method to use in your recipes'
    >
      <ManualBrewerForm />
    </FormContainer>
  );
}
