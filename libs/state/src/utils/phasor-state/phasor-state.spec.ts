import { toPhasor } from './phasor-state';
import { afar } from '../..';
import { create } from 'zustand';
import { Phase } from '../phasor/phasor.types';

const data = {
  name: 'John',
};

async function fn() {
  return data;
}

const { initial, reducer } = toPhasor('user', fn);

const useStore = create(() => initial);
const dispatch = afar(useStore, reducer);

describe('PhasorState', () => {
  it('should have give state', () => {
    expect(useStore.getState()).toEqual(expect.objectContaining(initial));
  });

  describe('dispatch', () => {
    it('should have run state', async () => {
      const result = await dispatch({
        type: 'user/run',
        payload: []
      });

      expect(result).toEqual({
        user: expect.objectContaining({
          phase: Phase.Done,
        })
      });
    });
  });
});
