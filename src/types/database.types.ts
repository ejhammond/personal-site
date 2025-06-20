export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
