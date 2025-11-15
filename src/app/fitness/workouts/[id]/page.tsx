import React from 'react';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PageLayout, PageLayoutHeader } from '@/ds/page-layout';
import { VStack } from '@/ds/v-stack';
import { HStack } from '@/ds/h-stack';
import { Text } from '@/ds/text';
import { CreateWorkoutInstanceButton } from './__private__/create-workout-instance-button';
import { ArrowUpIcon, ArrowDownIcon, EqualsIcon } from '@/ds/icons';

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
          endContent={<CreateWorkoutInstanceButton workoutID={params.id} />}
        />
      }
    >
      {instances != null && instances.length > 0 ? (
        <VStack gap="sm">
          {instances.map((instance) => {
            const SignalIcon =
              instance.signal === 'INCREASE'
                ? ArrowUpIcon
                : instance.signal === 'DECREASE'
                  ? ArrowDownIcon
                  : EqualsIcon;

            const iconColor =
              instance.signal === 'INCREASE'
                ? 'var(--positive-color)'
                : instance.signal === 'DECREASE'
                  ? 'var(--negative-color)'
                  : undefined;

            return (
              <HStack
                key={instance.id}
                gap="md"
                vAlign="center"
                style={{
                  padding: '12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <Text
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {instance.weight} lbs
                  </Text>
                  <Text
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {new Date(instance.timestamp).toLocaleString()}
                  </Text>
                </div>
                <SignalIcon
                  size={24}
                  style={iconColor ? { color: iconColor } : undefined}
                />
              </HStack>
            );
          })}
        </VStack>
      ) : (
        <CreateWorkoutInstanceButton workoutID={params.id} />
      )}
    </PageLayout>
  );
}
