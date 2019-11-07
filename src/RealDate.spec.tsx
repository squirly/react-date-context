import * as React from 'react';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import {RealDate, useCurrentDate} from './';

describe('RealDate', () => {
  it('immediately uses the current time', () => {
    const renderer = makeRenderer();

    expect(getDate(renderer).getTime()).toBeCloseTo(new Date().getTime(), -2);
  });

  it('updates when the children are changed', () => {
    const renderer = create(<RealDate>hello</RealDate>);
    expect(renderer.toJSON()).toBe('hello');

    renderer.update(<RealDate>world</RealDate>);
    expect(renderer.toJSON()).toBe('world');
  });

  describe('with passed time factory', () => {
    it('immediately uses the passed time factory', () => {
      const date = new Date(2017, 0, 1, 12, 0, 0, 0);
      const timeFactory = () => date;

      const renderer = makeRenderer({now: timeFactory});

      expect(getDate(renderer)).toStrictEqual(date);
    });

    it('updates with a new time factory', () => {
      const date = new Date(2017, 0, 2, 12, 0, 0, 0);
      const timeFactory = () => date;

      const date2 = new Date(2017, 0, 2, 13, 0, 0, 0);
      const timeFactory2 = () => date2;

      const renderer = makeRenderer({now: timeFactory});
      expect(getDate(renderer)).toStrictEqual(date);

      updateRenderer(renderer, {now: timeFactory2});

      expect(getDate(renderer)).toStrictEqual(date2);
    });
  });

  describe('with passed refresh interval', () => {
    beforeAll(jest.useFakeTimers);
    afterEach(jest.clearAllTimers);
    afterAll(jest.useRealTimers);

    const date1 = new Date(2017, 1, 1, 12, 0, 0, 0);
    const date2 = new Date(2017, 1, 1, 13, 0, 0, 0);

    it('refreshes after elapsed time', () => {
      let date = date1;
      const timeFactory = () => date;

      const renderer = makeRenderer({now: timeFactory, refreshIntervalMs: 500});

      expect(getDate(renderer)).toStrictEqual(date1);

      date = date2;

      advanceTimer(499);

      expect(getDate(renderer)).toStrictEqual(date1);

      advanceTimer(1);

      expect(getDate(renderer)).toStrictEqual(date2);
    });

    it('updates with new interval', () => {
      let date = date1;
      const timeFactory = () => date;

      const renderer = makeRenderer({now: timeFactory, refreshIntervalMs: 500});

      expect(getDate(renderer)).toStrictEqual(date1);

      date = date2;

      advanceTimer(499);

      expect(getDate(renderer)).toStrictEqual(date1);

      updateRenderer(renderer, {now: timeFactory, refreshIntervalMs: 1000});

      expect(getDate(renderer)).toStrictEqual(date1);

      advanceTimer(999);

      expect(getDate(renderer)).toStrictEqual(date1);

      advanceTimer(1);

      expect(getDate(renderer)).toStrictEqual(date2);
    });

    it('updates with no interval', () => {
      let date = date1;
      const timeFactory = () => date;

      const renderer = makeRenderer({now: timeFactory, refreshIntervalMs: 500});

      expect(getDate(renderer)).toStrictEqual(date1);

      date = date2;

      advanceTimer(499);

      expect(getDate(renderer)).toStrictEqual(date1);

      updateRenderer(renderer, {now: timeFactory});

      expect(getDate(renderer)).toStrictEqual(date1);

      runPendingTimers();

      expect(getDate(renderer)).toStrictEqual(date2);
    });

    it('clears interval on unmount', () => {
      const date = new Date(2017, 1, 4, 12, 0, 0, 0);
      const timeFactory = () => date;

      const renderer = makeRenderer({now: timeFactory, refreshIntervalMs: 500});

      expect(jest.getTimerCount()).not.toBe(0);
      renderer.unmount();
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});

function makeRenderer(props: RealDate.Props = {}): ReactTestRenderer {
  let renderer: ReactTestRenderer | undefined = undefined; // tslint:disable-line:no-unnecessary-initializer

  act(() => {
    renderer = create(makeComponent(props));
  });

  return renderer!; // tslint:disable-line:no-non-null-assertion
}

function updateRenderer(
  renderer: ReactTestRenderer,
  props: RealDate.Props = {},
): void {
  act(() => {
    renderer.update(makeComponent(props));
  });
}

function makeComponent(
  props: RealDate.Props = {},
): React.ReactElement<RealDate.Props> {
  return (
    <RealDate {...props}>
      <DisplayCurrentDate />
    </RealDate>
  );
}

const DisplayCurrentDate: React.FunctionComponent = () => {
  return <>{useCurrentDate().toISOString()}</>;
};

function getDate(renderer: ReactTestRenderer): Date {
  return new Date(renderer.root.findByType(DisplayCurrentDate)
    .children[0] as string);
}

function advanceTimer(ms: number): void {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

function runPendingTimers(): void {
  act(() => {
    jest.runOnlyPendingTimers();
  });
}
