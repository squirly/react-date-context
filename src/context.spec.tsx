import * as React from 'react';
import {create} from 'react-test-renderer';
import {CurrentDate, StaticDate} from './';

describe('context', () => {
  let injectedDate: Date | undefined;

  function injectDate(d: Date): null {
    injectedDate = d;
    return null;
  }

  beforeEach(() => {
    injectedDate = undefined;
  });

  describe('StaticDate', () => {
    it('passes the date to CurrentDate', () => {
      const date = new Date(2017, 1, 1, 12, 0, 0, 0);

      create(
        <StaticDate date={date}>
          <CurrentDate>{injectDate}</CurrentDate>
        </StaticDate>,
      );
      expect(injectedDate).toBe(date);
    });

    describe('on changed date', () => {
      it('updates the date in CurrentDate', () => {
        const date1 = new Date(2017, 1, 1, 12, 0, 0, 0);
        const date2 = new Date(2017, 1, 1, 13, 0, 0, 0);

        const renderer = create(
          <StaticDate date={date1}>
            <CurrentDate children={injectDate} />
          </StaticDate>,
        );
        expect(injectedDate).toBe(date1);

        renderer.update(
          <StaticDate date={date2}>
            <CurrentDate children={injectDate} />
          </StaticDate>,
        );
        expect(injectedDate).toBe(date2);
      });
    });

    it('unsubscribes context on unmount', () => {
      const date = new Date(2017, 1, 1, 12, 0, 0, 0);

      const renderer = create(
        <StaticDate value={date}>
          <CurrentDate>{injectDate}</CurrentDate>
        </StaticDate>,
      );
      const instance = renderer.toTree().rendered.instance;
      expect(instance.sub.list).toHaveLength(1);
      renderer.unmount();
      expect(instance.sub.list).toHaveLength(0);
    });
  });

  describe('CurrentDate', () => {
    it('renders the value passed by the children function', () => {
      const date = new Date(2017, 1, 1, 12, 0, 0, 0);

      const renderer = create(
        <StaticDate date={date}>
          <CurrentDate>{d => <span>{d.toDateString()}</span>}</CurrentDate>
        </StaticDate>,
      );
      expect(renderer.root.findByType('span').children[0]).toBe(
        date.toDateString(),
      );
    });

    describe('with no parent', () => {
      beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => {
          /**/
        });
      });

      afterEach(() => {
        console.error.mockRestore();
      });

      it('throws an error', () => {
        expect(() =>
          create(<CurrentDate>{injectDate}</CurrentDate>),
        ).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
