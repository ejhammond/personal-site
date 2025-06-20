export type FormActionState<
  TFields extends Readonly<{ [key: string]: string }>,
> = {
  errors?: TFields & {
    form?: string;
  };
};

export type UnknownFormActionState = Readonly<{
  errors?: Readonly<{ [key: string]: string }> &
    Readonly<{
      form?: string;
    }>;
}>;
