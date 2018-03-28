import * as React from 'react';
import {createContext} from './ReactContext';

const {Provider, Consumer} = createContext<Date | undefined>(undefined);

export class StaticDate extends React.Component<StaticDate.Props> {
  render() {
    const {date, children} = this.props;
    return <Provider value={date} children={children} />;
  }
}

export namespace StaticDate {
  export interface Props {
    date: Date;
  }
}

export class CurrentDate extends React.Component<CurrentDate.Props> {
  render() {
    const {children} = this.props;

    return (
      <Consumer>
        {value => {
          if (value === undefined) {
            throw new Error(
              'No parent "react-date-context" provider. <CurrentDate/> must be nested in <StaticDate/> or <RealDate/>',
            );
          } else {
            return children(value);
          }
        }}
      </Consumer>
    );
  }
}

export namespace CurrentDate {
  export interface Props {
    children: (date: Date) => React.ReactNode;
  }
}
