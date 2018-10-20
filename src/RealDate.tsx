import * as React from 'react';
import {StaticDate} from './context';

export class RealDate extends React.Component<RealDate.Props, RealDate.State> {
  private get now(): Date {
    const {now} = this.props;
    return now === undefined ? new Date() : now();
  }

  state = {
    now: this.now,
  };

  interval?: number;

  componentDidMount() {
    this.setInterval(this.props.refreshIntervalMs);
  }

  componentWillReceiveProps({
    now: newNow,
    refreshIntervalMs: newRefreshIntervalMs,
  }: RealDate.Props) {
    const {now, refreshIntervalMs} = this.props;

    if (newNow !== undefined && newNow !== now) {
      this.setState({now: newNow()});
    }

    if (newRefreshIntervalMs !== refreshIntervalMs) {
      this.setInterval(newRefreshIntervalMs);
    }
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  private setInterval(refreshIntervalMs?: number): void {
    this.clearInterval();
    if (refreshIntervalMs !== undefined) {
      this.interval = window.setInterval(this.updateTime, refreshIntervalMs);
    }
  }

  private clearInterval(): void {
    if (this.interval !== undefined) {
      window.clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private updateTime = (): void => {
    this.setState({now: this.now});
  };

  render() {
    return <StaticDate date={this.state.now} children={this.props.children} />;
  }
}

export namespace RealDate {
  export interface Props {
    now?: () => Date;
    refreshIntervalMs?: number;
  }

  export interface State {
    now: Date;
  }
}
