import $ from 'jquery';
import moment from 'moment';
import app from '../../../../app';
import { abbrNum } from '../../../../utils';
import loadTemplate from '../../../../utils/loadTemplate';
import BaseVw from '../../../baseVw';

export default class extends BaseVw {
  constructor(options = {}) {
    super({
      ...options,
      initialState: {
        paymentNumber: 1,
        amountShort: 0,
        balanceRemaining: 0,
        payee: '',
        userCurrency: app.settings.get('localCurrency') || 'BTC',
        showAcceptRejectButtons: false,
        showCancelButton: false,
        acceptInProgress: false,
        rejectInProgress: false,
        cancelInProgress: false,
        rejectConfirmOn: false,
        blockChainTxUrl: '',
        paymentCoin: undefined,
        ...options.initialState || {},
      },
    });

    if (!this.model) {
      throw new Error('Please provide a model.');
    }

    this.boundOnDocClick = this.onDocumentClick.bind(this);
    $(document).on('click', this.boundOnDocClick);
  }

  className() {
    return 'payment rowLg';
  }

  events() {
    return {
      'click .js-cancelOrder': 'onClickCancelOrder',
      'click .js-acceptOrder': 'onClickAcceptOrder',
      'click .js-rejectOrder': 'onClickRejectOrder',
      'click .js-rejectConfirmed': 'onClickRejectConfirmed',
      'click .js-rejectConfirm': 'onClickRejectConfirmBox',
      'click .js-rejectConfirmCancel': 'onClickRejectConfirmCancel',
    };
  }

  onClickCancelOrder() {
    this.trigger('cancelClick', { view: this });
  }

  onClickAcceptOrder() {
    this.trigger('acceptClick', { view: this });
  }

  onClickRejectConfirmed() {
    this.trigger('confirmedRejectClick', { view: this });
    this.setState({ rejectConfirmOn: false });
  }

  onClickRejectOrder() {
    this.setState({ rejectConfirmOn: true });
    return false;
  }

  onClickRejectConfirmBox() {
    // ensure event doesn't bubble so onDocumentClick doesn't
    // close the confirmBox.
    return false;
  }

  onClickRejectConfirmCancel() {
    this.setState({ rejectConfirmOn: false });
  }

  onDocumentClick() {
    this.setState({ rejectConfirmOn: false });
  }

  setState(state = {}, options = {}) {
    const mergedState = {
      ...this.getState(),
      ...state,
    };

    if (!mergedState.paymentCoin ||
      typeof mergedState.paymentCoin !== 'string') {
      throw new Error('Please provide the paymentCoin as a string.');
    }

    return super.setState(state, options);
  }

  remove() {
    $(document).off('click', this.boundOnDocClick);
    super.remove();
  }

  render() {
    loadTemplate('modals/orderDetail/summaryTab/payment.html', (t) => {
      this.$el.html(t({
        ...this._state,
        ...this.model.toJSON(),
        abbrNum,
        moment,
      }));
    });

    return this;
  }
}
