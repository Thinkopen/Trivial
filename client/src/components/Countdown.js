import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CircularProgressbar from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

const ProgressbarContainer = styled.div`
  width: 30px;
  position: absolute;
  top: 35px;
  right: 40px;
`;

const progressbarStyle = {
  text: {
    fontSize: '2.9em',
    fill: '#377BB5',
  },
  path: {
    stroke: '#377BB5',
  },
};

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
          styles={progressbarStyle}
        />
      </ProgressbarContainer>
    );
  }
}

export default Countdown;
