import * as React from 'react';
import {createContext} from './ReactContext';

const {Provider, Consumer} = createContext<Date | undefined>(undefined);

export class StaticDate extends React.Component<StaticDate.Props> {
  render() {
    return <Provider {...this.props} />;
  }
}

export namespace StaticDate {
  export interface Props {
    value: Date;
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
    children: (value: Date) => React.ReactNode;
  }
}
