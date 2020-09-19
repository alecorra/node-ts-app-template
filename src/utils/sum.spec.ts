import { sum } from './sum';

describe('sum', () => {
  it('add the params', () => {
    const result: number = sum(1, 2);

    expect(result).toEqual(3);
  });
});
