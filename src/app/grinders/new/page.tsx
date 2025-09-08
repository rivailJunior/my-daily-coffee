"use client";

import { GrinderForm } from "@/components/grinders/grinder-form";
import { FormContainer } from '@/components/formContainer';

export default function NewGrinderPage() {
  return (
    <FormContainer
      heading='Add New Grinder'
      href='/grinders'
      title='Add New Grinder'
      headingDescription='Register a new coffee grinder to use in your recipes'
    >
      <GrinderForm />
    </FormContainer>
  );
}
