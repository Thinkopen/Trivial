import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CircularProgressbar from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

const limitAlert = 15;
const red = '#b53737';
const blue = '#377BB5';

const ProgressbarContainer = styled.div`
  width: 30px;
  position: absolute;
  top: 35px;
  right: 40px;
`;

class Countdown extends Component {
  static propTypes = {
    questionId: PropTypes.string.isRequired,
    timeout: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = { countdown: props.timeout / 1000 };
  }

  componentDidMount() {
    this.countdown = setInterval(() => {
      this.setState({ countdown: this.state.countdown -1 });
    }, 1000)
  }

  componentDidUpdate({ questionId: nextQuestionId, timeout }) {
    nextQuestionId !== this.props.questionId && this.setState({
      countdown: timeout / 1000,
    });
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  getMainColor = countdown => countdown <= limitAlert ? red : blue

  getProgressbarStyle = countdown => ({
    text: {
      fontSize: '2.9em',
      fill: this.getMainColor(countdown),
    },
    path: {
      stroke: this.getMainColor(countdown),
    },
    trail: {
      stroke: 'white',
    },
  });

  render() {
    const { state: { countdown }, props: { timeout } } = this;
    const percentage = countdown / (timeout / 1000) * 100;

    return (
      <ProgressbarContainer>
        <CircularProgressbar
          percentage={percentage}
          textForPercentage={() => countdown}
          counterClockwise={false}
          strokeWidth={12}
          initialAnimation
          styles={this.getProgressbarStyle(countdown)}
        />
      </ProgressbarContainer>
    );
  }
}

export default Countdown;
