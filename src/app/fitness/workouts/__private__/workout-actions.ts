'use server';

import { createClient } from '@/supabase/server';
import { Database } from '@/types/database.types';
import {
  createServerAction,
  ServerActionFormError,
  ServerActionState,
} from '@/utils/actions';
import z from 'zod/v4';

type WorkoutRow = Database['public']['Tables']['gym_workout']['Row'];

const workoutSchema = z.object({
  id: z.coerce.number(),
  user_id: z.coerce.string(),
  name: z.string(),
  sets: z.coerce.number().int().min(1),
  reps: z.coerce.number().int().min(1),
  created_at: z.coerce.string(),
});

export type InsertWorkoutPayload = Omit<
  WorkoutRow,
  'id' | 'user_id' | 'created_at'
>;
export type InsertWorkoutActionState = ServerActionState<InsertWorkoutPayload>;

export const insertWorkout = createServerAction<InsertWorkoutPayload>({
  schema: workoutSchema.omit({
    id: true,
    user_id: true,
    created_at: true,
  }),
  action: async ({ payload }) => {
    const supabase = await createClient();

    const { error } = await supabase.from('gym_workout').insert(payload);

    if (error != null) {
      throw new ServerActionFormError(error.message);
    }
  },
});
