import { Baby } from '../models';

export const create = async (): Promise<Baby> => {
  return {
    name: `test`,
    weight: 2.62,
    dob: new Date(`25/04/2020`),
    height: 54,
  };
};
