import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import { CreateWorkoutButton } from './__private__/create-workout-button';
import { WorkoutsTable } from './__private__/workouts-table';
import type { WorkoutRow } from './__private__/workouts-table';

export default async function Workouts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    redirect(`/auth/login?next=${encodeURIComponent('/fitness/workouts')}`);
  }

  const { data } = await supabase.from('gym_workout').select('*');
  const rows: WorkoutRow[] =
    data?.map((workout) => ({
      id: workout.id,
      name: workout.name,
      sets: workout.sets,
      reps: workout.reps,
    })) ?? [];

  return (
    <Layout
      height="fill"
      contentWidth={960}
      content={
        <LayoutContent padding={0}>
          <VStack padding={4} gap={8}>
            <HStack gap={3} vAlign="center">
              <StackItem size="fill">
                <Heading level={1}>Workouts</Heading>
              </StackItem>
              <CreateWorkoutButton />
            </HStack>
            {rows.length === 0 ? (
              <EmptyState
                title="No workouts yet"
                description="Create your first workout to start logging it."
              />
            ) : (
              <WorkoutsTable rows={rows} />
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
