import React from 'react';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';
import { VStack } from '@/ds/v-stack';
import { HStack } from '@/ds/h-stack';
import { CreateWorkoutInstanceButton } from './__private__/create-workout-instance-button';
import { WorkoutInstanceItem } from './__private__/workout-instance-item';
import { WorkoutMenu } from './__private__/workout-menu';

export default async function WorkoutID({
  params: asyncParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await asyncParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(
      `/auth/login?next=${encodeURIComponent(`/fitness/workouts/${params.id}`)}`,
    );
  }

  const { data: workout } = await supabase
    .from('gym_workout')
    .select('*')
    .match({ id: params.id })
    .single();

  if (workout == null) {
    notFound();
  }

  const { data: instances } = await supabase
    .from('gym_workout_instance')
    .select('*')
    .eq('workout_id', Number(params.id))
    .order('timestamp', { ascending: false });

  return (
    <PageLayout
      type="full"
      header={
        <PageLayoutHeader
          title={`${workout.name} (${workout.sets} × ${workout.reps})`}
          endContent={
            <HStack gap="sm" vAlign="center">
              <CreateWorkoutInstanceButton workoutID={params.id} />
              <WorkoutMenu workout={workout} />
            </HStack>
          }
        />
      }
    >
      {instances != null && instances.length > 0 ? (
        <VStack gap="sm">
          {instances.map((instance) => (
            <WorkoutInstanceItem key={instance.id} instance={instance} />
          ))}
        </VStack>
      ) : (
        <CreateWorkoutInstanceButton workoutID={params.id} />
      )}
    </PageLayout>
  );
}
