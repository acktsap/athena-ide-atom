import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description } from '../atoms';
import Arguments from './arguments';

const ConstructorArguments = (props) => {
  const args = props.args;
  const payable = props.payable;
  const argsRef = props.argsRef;
  return (
    <CardRow>
      <Description
        description="Args"
      />
      <Arguments args={args} payable={payable} ref={argsRef} />
    </CardRow>
  );
}

ConstructorArguments.propTypes = {
  args: PropTypes.array,
  payable: PropTypes.bool,
  argsRef: PropTypes.any
}

export default ConstructorArguments;