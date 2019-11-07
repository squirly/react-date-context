import * as React from 'react';
import {StaticDate} from './context';

export const RealDate: React.FunctionComponent<RealDate.Props> = ({
  refreshIntervalMs,
  now = defaultNow,
  children,
}) => {
  const [date, setDate] = React.useState(now);

  React.useEffect(() => {
    setDate(now());
  }, [now, setDate]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(now());
    }, refreshIntervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [refreshIntervalMs, now, setDate]);

  return <StaticDate date={date} children={children} />;
};

export namespace RealDate {
  export interface Props {
    now?: () => Date;
    refreshIntervalMs?: number;
  }
}

function defaultNow(): Date {
  return new Date();
}
