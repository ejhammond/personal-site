export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      gym_workout: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          reps: number;
          sets: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          reps: number;
          sets: number;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          reps?: number;
          sets?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      gym_workout_instance: {
        Row: {
          created_at: string;
          id: number;
          signal: Database['public']['Enums']['gym_workout_instance_signal'];
          timestamp: string;
          user_id: string;
          weight: number;
          workout_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          signal: Database['public']['Enums']['gym_workout_instance_signal'];
          timestamp?: string;
          user_id?: string;
          weight: number;
          workout_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          signal?: Database['public']['Enums']['gym_workout_instance_signal'];
          timestamp?: string;
          user_id?: string;
          weight?: number;
          workout_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'gym_workout_instance_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'gym_workout';
            referencedColumns: ['id'];
          },
        ];
      };
      mortgage: {
        Row: {
          annualized_interest_rate: number;
          created_at: string;
          id: number;
          month: number;
          name: string;
          pre_payment: number | null;
          principal: number;
          term: number;
          updated_at: string;
          user_id: string;
          year: number;
        };
        Insert: {
          annualized_interest_rate: number;
          created_at?: string;
          id?: number;
          month: number;
          name: string;
          pre_payment?: number | null;
          principal: number;
          term: number;
          updated_at?: string;
          user_id?: string;
          year: number;
        };
        Update: {
          annualized_interest_rate?: number;
          created_at?: string;
          id?: number;
          month?: number;
          name?: string;
          pre_payment?: number | null;
          principal?: number;
          term?: number;
          updated_at?: string;
          user_id?: string;
          year?: number;
        };
        Relationships: [];
      };
      mortgage_payment: {
        Row: {
          amount: number;
          id: number;
          month: number;
          mortgage_id: number;
          user_id: string;
        };
        Insert: {
          amount: number;
          id?: number;
          month: number;
          mortgage_id: number;
          user_id?: string;
        };
        Update: {
          amount?: number;
          id?: number;
          month?: number;
          mortgage_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'mortgage_payment_mortgage_id_fkey';
            columns: ['mortgage_id'];
            isOneToOne: false;
            referencedRelation: 'mortgage';
            referencedColumns: ['id'];
          },
        ];
      };
      mortgage_recurring_payment: {
        Row: {
          amount: number;
          id: number;
          mortgage_id: number;
          starting_month: number;
          user_id: string;
        };
        Insert: {
          amount: number;
          id?: number;
          mortgage_id: number;
          starting_month: number;
          user_id?: string;
        };
        Update: {
          amount?: number;
          id?: number;
          mortgage_id?: number;
          starting_month?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'mortgage_recurring_payment_mortgage_id_fkey';
            columns: ['mortgage_id'];
            isOneToOne: false;
            referencedRelation: 'mortgage';
            referencedColumns: ['id'];
          },
        ];
      };
      mortgage_refinance: {
        Row: {
          annualized_interest_rate: number;
          id: number;
          month: number;
          mortgage_id: number;
          pre_payment: number | null;
          principal: number | null;
          term: number;
          user_id: string;
        };
        Insert: {
          annualized_interest_rate: number;
          id?: number;
          month: number;
          mortgage_id: number;
          pre_payment?: number | null;
          principal?: number | null;
          term: number;
          user_id?: string;
        };
        Update: {
          annualized_interest_rate?: number;
          id?: number;
          month?: number;
          mortgage_id?: number;
          pre_payment?: number | null;
          principal?: number | null;
          term?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'mortgage_refinance_mortgage_id_fkey';
            columns: ['mortgage_id'];
            isOneToOne: false;
            referencedRelation: 'mortgage';
            referencedColumns: ['id'];
          },
        ];
      };
      split_expense: {
        Row: {
          amount: number;
          created_at: string;
          id: number;
          label: string;
          owner_id: number | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at: string;
          id?: number;
          label: string;
          owner_id?: number | null;
          updated_at: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: number;
          label?: string;
          owner_id?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'split_expense_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'split_group_member';
            referencedColumns: ['id'];
          },
        ];
      };
      split_expense_participant: {
        Row: {
          expense_id: number;
          id: number;
          member_id: number;
        };
        Insert: {
          expense_id: number;
          id?: number;
          member_id: number;
        };
        Update: {
          expense_id?: number;
          id?: number;
          member_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'split_expense_participant_expense_id_fkey';
            columns: ['expense_id'];
            isOneToOne: false;
            referencedRelation: 'split_expense';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'split_expense_participant_member_id_fkey';
            columns: ['member_id'];
            isOneToOne: false;
            referencedRelation: 'split_group_member';
            referencedColumns: ['id'];
          },
        ];
      };
      split_group: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at: string;
          id?: number;
          name: string;
          updated_at: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      split_group_member: {
        Row: {
          group_id: number;
          id: number;
          name: string;
        };
        Insert: {
          group_id: number;
          id?: number;
          name: string;
        };
        Update: {
          group_id?: number;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'split_group_member_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'split_group';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      gym_workout_instance_signal: 'INCREASE' | 'MAINTAIN' | 'DECREASE';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      gym_workout_instance_signal: ['INCREASE', 'MAINTAIN', 'DECREASE'],
    },
  },
} as const;
