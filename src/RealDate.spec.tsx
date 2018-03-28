import * as React from 'react';
import {create, ReactTestRenderer} from 'react-test-renderer';
import {CurrentDate, RealDate} from './';

describe('RealDate', () => {
  let injectedDate: Date | undefined;

  function injectDate(d: Date): null {
    injectedDate = d;
    return null;
  }

  beforeEach(() => {
    injectedDate = undefined;
  });

  it('immediately uses the current time', () => {
    create(
      <RealDate>
        <CurrentDate children={injectDate} />
      </RealDate>,
    );

    expect(injectedDate && injectedDate.getTime()).toBeCloseTo(
      new Date().getTime(),
      -2,
    );
  });

  describe('with passed time factory', () => {
    let date: Date;
    const timeFactory = () => date;

    it('immediately uses the passed time factory', () => {
      date = new Date(2017, 0, 1, 12, 0, 0, 0);

      create(
        <RealDate now={timeFactory}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );

      expect(injectedDate).toBe(date);
    });

    it('updates with a new time factory', () => {
      date = new Date(2017, 0, 2, 12, 0, 0, 0);
      const date2 = new Date(2017, 0, 2, 13, 0, 0, 0);

      const renderer = create(
        <RealDate now={timeFactory}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );
      expect(injectedDate).toBe(date);

      renderer.update(
        <RealDate now={() => date2}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );
      expect(injectedDate).toBe(date2);
    });
  });

  describe('with passed refresh interval', () => {
    beforeAll(jest.useFakeTimers);
    afterEach(jest.clearAllTimers);
    afterAll(jest.useRealTimers);

    let date: Date;
    const timeFactory = () => date;

    beforeEach(() => {
      date = undefined;
    });

    it('refreshes after elapsed time', () => {
      const date1 = new Date(2017, 1, 1, 12, 0, 0, 0);
      const date2 = new Date(2017, 1, 1, 13, 0, 0, 0);

      date = date1;

      create(
        <RealDate now={timeFactory} refreshIntervalMs={500}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );

      expect(injectedDate).toBe(date1);

      date = date2;

      jest.advanceTimersByTime(499);

      expect(injectedDate).toBe(date1);

      jest.advanceTimersByTime(1);

      expect(injectedDate).toBe(date2);
    });

    it('updates with new interval', () => {
      const date1 = new Date(2017, 2, 1, 12, 0, 0, 0);
      const date2 = new Date(2017, 2, 1, 13, 0, 0, 0);

      date = date1;

      const renderer = create(
        <RealDate now={timeFactory} refreshIntervalMs={500}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );

      expect(injectedDate).toBe(date1);

      date = date2;

      jest.advanceTimersByTime(499);

      expect(injectedDate).toBe(date1);

      renderer.update(
        <RealDate now={timeFactory} refreshIntervalMs={1000}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );

      expect(injectedDate).toBe(date1);

      jest.advanceTimersByTime(999);

      expect(injectedDate).toBe(date1);

      jest.advanceTimersByTime(1);

      expect(injectedDate).toBe(date2);
    });

    it('updates with no interval', () => {
      const date1 = new Date(2017, 3, 1, 12, 0, 0, 0);
      const date2 = new Date(2017, 3, 1, 13, 0, 0, 0);

      date = date1;

      const renderer = create(
        <RealDate now={timeFactory} refreshIntervalMs={500}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );

      expect(injectedDate).toBe(date1);

      date = date2;

      jest.advanceTimersByTime(499);

      expect(injectedDate).toBe(date1);

      renderer.update(
        <RealDate now={timeFactory}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );

      expect(injectedDate).toBe(date1);

      jest.runAllTimers();

      expect(injectedDate).toBe(date1);
    });

    it('clears interval on unmount', () => {
      date = new Date(2017, 1, 4, 12, 0, 0, 0);

      const renderer = create(
        <RealDate now={timeFactory} refreshIntervalMs={500}>
          <CurrentDate children={injectDate} />
        </RealDate>,
      );

      const instance = (renderer.getInstance() as any) as RealDate;
      expect(instance.interval).not.toBeUndefined();
      renderer.unmount();
      expect(instance.interval).toBeUndefined();
    });
  });
});
