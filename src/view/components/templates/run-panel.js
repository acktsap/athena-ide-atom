import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import clipboardy from 'clipboardy';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Summary, Sync, Account, Node, Deployment, Contract } from '../organisms';
import { editor, SaveConfirmView } from '../..';
import { runWithCallback } from '../../../utils';

@inject('nodeStore', 'accountStore', 'notificationStore', 'compileStore', 'contractStore', 'deployTargetStore')
@observer
export default class RunPanel extends React.Component {

  static get propTypes() {
    return {
      nodeStore: PropTypes.any,
      accountStore: PropTypes.any,
      notificationStore: PropTypes.any,
      compileStore: PropTypes.any,
      contractStore: PropTypes.any,
      deployTargetStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this._onCompileButtonClicked = this._onCompileButtonClicked.bind(this);
    this._onSync = this._onSync.bind(this);

    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);

    this._onAddressChange = this._onAddressChange.bind(this);

    this._onFileChange = this._onFileChange.bind(this);
    this._onDeployButtonClicked = this._onDeployButtonClicked.bind(this);

    this._onAbiExec = this._onAbiExec.bind(this);
    this._onAbiQuery = this._onAbiQuery.bind(this);

    this._onCopyContract = this._onCopyContract.bind(this);
    this._onRemoveContract = this._onRemoveContract.bind(this);

    this._onError = this._onError.bind(this);
  }

  _onCompileButtonClicked() {
    runWithCallback.call(this, () => {
      logger.debug("Compile contract");
      if (editor.isAnyEditorDirty()) {
        new SaveConfirmView(() => this._compile()).show();
      } else {
        this._compile();
      }
    }, this._onError);
  }

  _onSync() {
    logger.info("Sync status");
    this.props.nodeStore.updateNodeState();
    this.props.accountStore.updateAccountState();
  }

  _onNodeUrlChange(selectedNode) {
    logger.info("Node change", selectedNode.value);
    this.props.nodeStore.changeNode(selectedNode.value);
    this._onSync();
  }

  _onAddressChange(selectedAddress) {
    logger.info("Account address change to", selectedAddress.value);
    this.props.accountStore.changeAccount(selectedAddress.value);
    this._onSync();
  }

  _onFileChange(selectedOption) {
    runWithCallback.call(this, () => {
      logger.debug("Compiled file change", selectedOption);
      this.props.deployTargetStore.changeTarget(selectedOption.value);
    }, this._onError);
  }

  _compile() {
    runWithCallback.call(this, () => {
      this.props.compileStore.compileCurrentTarget();
    }, this._onError);
  }

  _onDeployButtonClicked(argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Deploy contract");
      logger.debug("Input ref", argInputRef);
      let constructorArgs = [];
      let amount = "";
      if (argInputRef.current) {
        constructorArgs = argInputRef.current.values;
        amount = argInputRef.current.amount;
      }
      this.props.contractStore.deployContract(constructorArgs, amount);
    }, this._onError);
  }

  _onAbiExec(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Execute contract");
      logger.debug("Input ref", argInputRef);
      const targetArgs = argInputRef.current.values;
      const amount = argInputRef.current.amount;
      logger.info("Execute contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.executeContract(contractAddress, abi, targetFunction, targetArgs, amount);
    }, this._onError);
  }

  _onAbiQuery(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Query contract");
      logger.debug("Input ref", argInputRef);
      const targetArgs = argInputRef.current.values;
      logger.info("Query contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.queryContract(contractAddress, abi, targetFunction, targetArgs);
    }, this._onError);
  }

  _onCopyContract(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Copy contract", contractAddress);
      clipboardy.writeSync(contractAddress);
    }, this._onError);
  }

  _onRemoveContract(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Remove contract", contractAddress);
      this.props.contractStore.removeContract(contractAddress);
    }, this._onError);
  }

  _onError(error) {
    logger.error(error);
    this.props.notificationStore.notify(error, "error");
  }

  render() {
    // summary
    const node = this.props.nodeStore.currentNode;
    const address = this.props.accountStore.currentAddress;
    const height = this.props.nodeStore.currentHeight;
    const balanceWithUnit = this.props.accountStore.currentBalanceWithUnit;
    const nonce = this.props.accountStore.currentNonce;

    // sync
    const onCompile = this._onCompileButtonClicked;
    const onSync= this._onSync

    // node
    // const node = this.props.nodeStore.currentNode;
    const nodes = this.props.nodeStore.nodes;
    // const height = this.props.nodeStore.currentHeight;
    const onNodeChange = this._onNodeUrlChange;

    // address
    // const accountAddress = this.props.accountStore.currentAddress;
    const addresses = this.props.accountStore.addresses;
    const onAddressChange = this._onAddressChange;
    const balance = this.props.accountStore.currentBalance;
    // const nonce = this.props.accountStore.currentNonce;

    // deployment target
    const currentTarget = this.props.deployTargetStore.currentTarget;
    const targets = this.props.deployTargetStore.targets;
    const onChangeTarget = this._onFileChange;
    const onDeploy = this._onDeployButtonClicked;
    const constructorArgs = this.props.deployTargetStore.constructorArgs;
    const payable = this.props.deployTargetStore.isPayable;

    // contract
    const contractAddress2Abi = this.props.contractStore.contractAddress2Abi;
    const onAbiExec = this._onAbiExec;
    const onAbiQuery = this._onAbiQuery;
    const onCopyContract = this._onCopyContract
    const onRemoveContract = this._onRemoveContract

    return (
      <Panel>
        <Summary
          node={node}
          address={address}
          height={height}
          balanceWithUnit={balanceWithUnit}
          nonce={nonce}
        />
        <Sync
          onCompile={onCompile}
          onSync={onSync}
        />
        <Node
          node={node}
          nodes={nodes}
          height={height}
          onNodeChange={onNodeChange}
        />
        <Account
          address={address}
          addresses={addresses}
          onAddressChange={onAddressChange}
          balance={balance}
          nonce={nonce}
        />
        <Deployment
          currentTarget={currentTarget}
          targets={targets}
          onChangeTarget={onChangeTarget}
          constructorArgs={constructorArgs}
          payable={payable}
          onDeploy={onDeploy}
        />
        <Contract
          contractAddress2Abi={contractAddress2Abi}
          onAbiExec={onAbiExec}
          onAbiQuery={onAbiQuery}
          onCopyContract={onCopyContract}
          onRemoveContract={onRemoveContract}
        />
     </Panel>
    );
  }

}
