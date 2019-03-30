'use babel';

import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Environment, ContractCall } from '../organisms';

@inject('contractStore')
@observer
export default class RunPanel extends React.Component {

  static get propTypes() {
    return {
      contractStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this._onContractAddressChange = this._onContractAddressChange.bind(this);
    this._onContractFunctionClicked = this._onContractFunctionClicked.bind(this);
  }

  _onContractAddressChange(selectedContractAddress) {
    const contractAddress = selectedContractAddress.value;
    logger.info("Contract address change to", contractAddress);
    this.props.contractStore.changeContract(contractAddress);
  }

  _onContractFunctionClicked(argInputRef, targetFunction) {
    logger.debug("Input ref:", argInputRef);
    const targetArgs = argInputRef.current.state.value.split(',')
      .map(arg => arg.trim())
      .map(arg => {
      const asNumber = Number(arg);
      return Number.isNaN(asNumber) ? arg.replace(/['"]+/g, '') : asNumber;
    });
    logger.info("Execute contract", targetFunction, "with args", targetArgs);
    this.props.contractStore.executeContract(targetFunction, targetArgs);
  }

  render() {
    // run
    const onContractChange = this._onContractAddressChange;
    const currentContract = this.props.contractStore.currentContract;
    const contracts = this.props.contractStore.contracts;
    const currentAbi = this.props.contractStore.currentAbi;
    const onAbiCall = this._onContractFunctionClicked;

    return (
      <Panel>
        <Environment />
        <ContractCall
          onContractChange={onContractChange}
          currentContract={currentContract}
          contracts={contracts}
          currentAbi={currentAbi}
          onAbiCall={onAbiCall}
        />
      </Panel>
    );
  }

}