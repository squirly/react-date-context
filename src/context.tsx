import * as React from 'react';

const Context = React.createContext<Date | undefined>(undefined);

export const StaticDate: React.FunctionComponent<StaticDate.Props> = ({
  date,
  children,
}) => <Context.Provider value={date} children={children} />;

StaticDate.displayName = 'StaticDate';

export namespace StaticDate {
  export interface Props {
    date: Date;
  }
}

export const CurrentDate: React.FunctionComponent<CurrentDate.Props> = ({
  children,
}) => <>{children(useCurrentDate())}</>;

CurrentDate.displayName = 'CurrentDate';

export namespace CurrentDate {
  export interface Props {
    children: (date: Date) => React.ReactNode;
  }
}

export function useCurrentDate() {
  const date = React.useContext(Context);

  if (date === undefined) {
    throw new NoDateContextError();
  } else {
    return date;
  }
}

export class NoDateContextError extends Error {
  constructor() {
    super(
      'No parent "react-date-context" provider. <CurrentDate/> must be nested in <StaticDate/> or <RealDate/>',
    );
    Object.setPrototypeOf(this, NoDateContextError.prototype);
  }
}
