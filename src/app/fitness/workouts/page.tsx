import React from 'react';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';
import { VStack } from '@/ds/v-stack';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import DirectoryListing from '@/ds/directory-listing';
import { CreateWorkoutButton } from './__private__/create-workout-button';

export default async function Workouts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(`/auth/login?next=${encodeURIComponent('/fitness/workouts')}`);
  }

  const { data } = await supabase.from('gym_workout').select('*');

  return (
    <PageLayout
      type="full"
      header={
        <PageLayoutHeader
          title="Workouts"
          endContent={<CreateWorkoutButton />}
        />
      }
    >
      <VStack gap="sm">
        {data?.map((workout) => (
          <DirectoryListing
            key={workout.id}
            label={`${workout.name} (${workout.sets} × ${workout.reps})`}
            href={`/fitness/workouts/${workout.id}`}
          />
        ))}
      </VStack>
    </PageLayout>
  );
}
