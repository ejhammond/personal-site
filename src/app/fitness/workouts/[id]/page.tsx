import React from 'react';
import { BackLink } from '@/app/back-link';
import { SiteFooter } from '@/app/site-footer';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
} from '@astryxdesign/core/Layout';
import { List } from '@astryxdesign/core/List';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import { CreateWorkoutInstanceButton } from './__private__/create-workout-instance-button';
import { WorkoutInstanceItem } from './__private__/workout-instance-item';
import { WorkoutMenu } from './__private__/workout-menu';

// Per-request page: renders from the auth session and/or query params,
// so it renders on demand instead of prerendering (Cache Components
// default is to prerender; `instant = false` opts out).
export const instant = false;


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
    <Layout
      height="fill"
      contentWidth={1000}
      defaultHasDividers
      footer={
        <LayoutFooter hasDivider padding={4}>
          <SiteFooter />
        </LayoutFooter>
      }
      header={
        <LayoutHeader hasDivider padding={4} paddingBlockEnd={0}>
          <VStack gap={3}>
            <HStack gap={4} vAlign="start">
              <StackItem size="fill">
                <VStack gap={0}>
                  <BackLink href="/fitness/workouts" label="All workouts" />
                  <Heading level={1} maxLines={1}>
                    {workout.name} ({workout.sets} × {workout.reps})
                  </Heading>
                </VStack>
              </StackItem>
              <WorkoutMenu workout={workout} />
            </HStack>
          </VStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent role="main">
          <VStack gap={4}>
            <CreateWorkoutInstanceButton workoutID={params.id} />
            {instances != null && instances.length > 0 && (
              <List density="balanced" hasDividers>
                {instances.map((instance) => (
                  <WorkoutInstanceItem key={instance.id} instance={instance} />
                ))}
              </List>
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
