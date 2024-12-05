import { ChangeDetectionStrategy, Component, computed, effect, model, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Check, CheckSquare, ChevronsUpDown, Copy, LogOut, LucideAngularModule } from 'lucide-angular';
import {
  injectAccount,
  injectBalance,
  injectChains,
  injectDisconnect,
  injectEnsAvatar,
  injectEnsName,
  injectSwitchChain,
} from 'ngx-wagmi';
import { ClickOutside } from 'ngxtension/click-outside';
import { formatUnits } from 'viem';
import { injectFlash } from '../../injections/flash';
import { CallPipe } from '../../pipes/call.pipe';
import { LucideIconData } from '../../types/lucide-angular';
import { emojiAvatarForAddress } from '../connect-button/emojiAvatarForAddress';
import { provideRainbowKitChains, RainbowKitChain } from '../connect-button/provideRainbowKitChains';
import { ModalComponent } from '../modal/modal.component';

const formatNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 });
export function isSameChain(chain: RainbowKitChain, targetChainId?: number) {
  return [chain.sourceId, chain.id].includes(targetChainId);
}
@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [LucideAngularModule, CallPipe, ClickOutside, ModalComponent, FormsModule],
  templateUrl: './account-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountModalComponent {
  readonly ICONS: Record<string, LucideIconData> = { Copy, CheckSquare, LogOut, ChevronsUpDown, Check };
  readonly emojiAvatarForAddress = emojiAvatarForAddress;
  readonly shortenAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);
  readonly isSameChain = isSameChain;

  account = injectAccount();
  private chains = injectChains();
  private disconnectM = injectDisconnect();
  private switchChainM = injectSwitchChain();
  ensNameQ = injectEnsName(() => ({ address: this.account().address }));
  ensAvatarQ = injectEnsAvatar(() => ({ name: this.ensNameQ.data()!, query: { enabled: !!this.ensNameQ.data() } }));
  private balanceQ = injectBalance(() => ({ address: this.account().address }));
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

  modalOpening = model(false);
  private accountModal = viewChild<string, ModalComponent>('accountModal', { read: ModalComponent });
  chainDropdownOpenning = signal(false);

  readonly actions = [
    {
      icon: Copy as LucideIconData,
      label: 'Copy Address',
      onClick: () => {
        const address = this.account().address;
        if (!address) return;
        this.copyFlashing.flash();
        navigator.clipboard.writeText(address);
      },
    },
    {
      icon: LogOut as LucideIconData,
      label: 'Disconnect',
      onClick: async () => {
        await this.disconnectM.disconnectAsync();
        this.modalOpening.set(false);
      },
    },
  ];

  constructor() {
    effect(
      () => {
        if (!this.modalOpening()) this.chainDropdownOpenning.set(false);
      },
      { allowSignalWrites: true },
    );
  }

  switchChain(chainId: number) {
    this.switchChainM.switchChainAsync({ chainId });
    this.chainDropdownOpenning.set(false);
  }

  show() {
    this.accountModal()?.show();
  }
}
