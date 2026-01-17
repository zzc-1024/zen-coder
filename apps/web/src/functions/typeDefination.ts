import type { BaseType, Parameter } from "@/parser/variable";

export type AvailableFunctions = Record<
  string,
  Record<
    string,
    Record<
      string,
      {
        parameters: Parameter[];
        returnType: BaseType | undefined;
        isPureFunction: boolean;
        defaultValues: Record<string, string>;
      }
    >
  >
>;
