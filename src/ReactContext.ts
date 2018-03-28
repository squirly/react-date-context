import * as PropTypes from 'prop-types';
import * as React from 'react';

let id = 0;

export namespace ReactContext {
  // Temporary port of new react context that does not respect component tree.
  // https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md
  export function createContext<ContextValue>(
    defaultValue: ContextValue,
  ): Context<ContextValue> {
    interface ConsumerState {
      value: ContextValue;
    }

    const identifier = `context-port-${id++}`;
    const contextType = {
      [identifier]: PropTypes.object,
    };

    type ConsumerStateSetter = (state: ContextValue) => void;

    class Provider extends React.Component<ContextProviderProps<ContextValue>> {
      public static childContextTypes = contextType;

      public sub: {
        value: ContextValue;
        list: ConsumerStateSetter[];
      };

      constructor(props: ContextProviderProps<ContextValue>) {
        super(props);
        this.sub = {
          value: this.props.value,
          list: [],
        };
      }

      public getChildContext() {
        return {[identifier]: this.sub};
      }

      public componentWillReceiveProps({
        value,
      }: ContextProviderProps<ContextValue>): void {
        if (this.props.value !== value) {
          this.sub.value = value;
          this.sub.list.forEach(setValue => setValue(value));
        }
      }

      public render() {
        return this.props.children;
      }
    }

    class Consumer extends React.Component<
      ContextConsumerProps<ContextValue>,
      ConsumerState
    > {
      public static contextTypes = contextType;
      public state = {value: defaultValue};

      public componentDidMount() {
        this.list.push(this.setValue);
      }

      public componentWillUnmount() {
        this.list.splice(this.list.indexOf(this.setValue), 1);
      }

      private setValue = (value: ContextValue): void => {
        this.setState({value});
      };

      get list() {
        return this.context[identifier] ? this.context[identifier].list : [];
      }

      get value() {
        return this.context[identifier]
          ? this.context[identifier].value
          : this.state.value;
      }

      public render() {
        return this.props.children(this.value);
      }
    }

    return {Provider, Consumer};
  }

  export interface Context<ContextValue> {
    Provider: React.ComponentClass<ContextProviderProps<ContextValue>>;
    Consumer: React.ComponentClass<ContextConsumerProps<ContextValue>>;
  }

  export interface ContextProviderProps<ContextValue> {
    value: ContextValue;
  }

  export interface ContextConsumerProps<ContextValue> {
    children: (value: ContextValue) => React.ReactNode;
  }
}

export const createContext: typeof ReactContext.createContext =
  (React as any).createContext === undefined
    ? ReactContext.createContext
    : (React as any).createContext;
