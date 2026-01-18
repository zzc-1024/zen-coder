import { BasicType } from '@/parser/variable';
import type { AvailableFunctions } from './typeDefination';

export const basicAvailableFunctions: AvailableFunctions = {
  'builtin:basic': {
    '.': {
      print: {
        parameters: [
          { name: 'value', type: new BasicType('builtin:basic:string') },
          { name: 'end', type: new BasicType('builtin:basic:string') },
        ],
        returnType: undefined,
        isPureFunction: false,
        defaultValues: {},
      },
      input: {
        parameters: [{ name: 'prompt', type: new BasicType('builtin:basic:string') }],
        returnType: new BasicType('builtin:basic:string'),
        isPureFunction: true,
        defaultValues: {},
      },
    },
    // math: {
    //   cos: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    //   sin: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    //   tan: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    //   sqrt: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    //   abs: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    //   ceil: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    //   floor: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    //   round: {
    //     parameters: [{ name: 'x', type: new BasicType('builtin:basic:float') }],
    //     returnType: new BasicType('builtin:basic:float'),
    //     isPureFunction: true,
    //     defaultValues: {},
    //   },
    // },
  },
};
