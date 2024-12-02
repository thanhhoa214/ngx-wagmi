import { ChangeDetectionStrategy, Component, computed, effect, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Check, CheckSquare, ChevronsUpDown, Copy, LogOut, LucideAngularModule } from 'lucide-angular';
import {
  injectAccount,
  injectBalance,
  injectChains,
  injectConfig,
  injectDisconnect,
  injectEnsAvatar,
  injectEnsName,
  injectSwitchChain,
} from 'ngx-wagmi';
import { formatUnits } from 'viem';
import { injectFlash } from '../../injections/flash';
import { CallPipe } from '../../pipes/call.pipe';
import { ConnectWalletModalComponent } from '../connect-modal/connect-modal.component';
import { ModalComponent } from '../modal/modal.component';
import { emojiAvatarForAddress } from './emojiAvatarForAddress';
import { provideRainbowKitChains, RainbowKitChain } from './provideRainbowKitChains';

const formatNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 });

@Component({
  selector: 'app-connect-button',
  standalone: true,
  imports: [LucideAngularModule, ConnectWalletModalComponent, CallPipe, ModalComponent, FormsModule],
  templateUrl: './connect-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectButtonComponent {
  readonly ICONS = { Copy, CheckSquare, LogOut, ChevronsUpDown, Check };
  readonly emojiAvatarForAddress = emojiAvatarForAddress;
  readonly shortenAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);
  readonly isSameChain = (chain: RainbowKitChain, targetChainId?: number) =>
    [chain.sourceId, chain.id].includes(targetChainId);

  account = injectAccount();
  chains = injectChains();
  disconnectM = injectDisconnect();
  switchChainM = injectSwitchChain();
  config = injectConfig();
  ensNameQ = injectEnsName(() => ({ address: this.account().address }));
  ensAvatarQ = injectEnsAvatar(() => ({ name: this.ensNameQ.data()!, query: { enabled: !!this.ensNameQ.data() } }));
  balanceQ = injectBalance(() => ({ address: this.account().address }));
  balanceStr = computed(() => {
    if (this.balanceQ.isLoading()) return '~ ETH';
    if (this.balanceQ.error()) return 'Error';
    const data = this.balanceQ.data();
    if (!data) return '0 ETH';
    return `${formatNumber.format(Number(formatUnits(data.value, data.decimals)))} ${data.symbol}`;
  });
  avatar = computed(() => this.account().address && this.emojiAvatarForAddress(this.account().address!));
  rkChains = computed(() => provideRainbowKitChains(this.chains()));
  currentChain = computed(() => this.rkChains().find((c) => this.isSameChain(c, this.account().chainId)));
  copyFlashing = injectFlash();

  connectModal = viewChild<string, ModalComponent>('connectModal', { read: ModalComponent });
  accountModal = viewChild<string, ModalComponent>('accountModal', { read: ModalComponent });
  modalOpenning = signal(false);
  chainDropdownOpenning = signal(false);

  actions = [
    {
      icon: Copy,
      label: 'Copy Address',
      onClick: () => {
        const address = this.account().address;
        if (!address) return;
        this.copyFlashing.flash();
        navigator.clipboard.writeText(address);
      },
    },
    {
      icon: LogOut,
      label: 'Disconnect',
      onClick: async () => {
        await this.disconnectM.disconnectAsync();
        this.modalOpenning.set(false);
      },
    },
  ];

  constructor() {
    effect(
      () => {
        if (this.account().isConnected) this.connectModal()?.hide();
      },
      { allowSignalWrites: true },
    );
  }

  switchChain(chainId: number) {
    this.switchChainM.switchChainAsync({ chainId });
    this.chainDropdownOpenning.set(false);
  }
}
