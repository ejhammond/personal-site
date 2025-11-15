'use server';

import { createClient } from '@/supabase/server';
import { Database } from '@/types/database.types';
import {
  createServerAction,
  ServerActionFormError,
  ServerActionState,
} from '@/utils/actions';
import z from 'zod/v4';

type WorkoutInstanceRow =
  Database['public']['Tables']['gym_workout_instance']['Row'];

const workoutInstanceSchema = z.object({
  id: z.coerce.number(),
  user_id: z.coerce.string(),
  workout_id: z.coerce.number(),
  signal: z.enum(['INCREASE', 'MAINTAIN', 'DECREASE']),
  timestamp: z.coerce.string(),
  weight: z.coerce.number().min(0),
  created_at: z.coerce.string(),
});

export type InsertWorkoutInstancePayload = Omit<
  WorkoutInstanceRow,
  'id' | 'user_id' | 'created_at'
>;
export type InsertWorkoutInstanceActionState =
  ServerActionState<InsertWorkoutInstancePayload>;

export const insertWorkoutInstance =
  createServerAction<InsertWorkoutInstancePayload>({
    schema: workoutInstanceSchema.omit({
      id: true,
      user_id: true,
      created_at: true,
    }),
    action: async ({ payload }) => {
      const supabase = await createClient();

      const { error } = await supabase
        .from('gym_workout_instance')
        .insert(payload);

      if (error != null) {
        throw new ServerActionFormError(error.message);
      }
    },
  });
