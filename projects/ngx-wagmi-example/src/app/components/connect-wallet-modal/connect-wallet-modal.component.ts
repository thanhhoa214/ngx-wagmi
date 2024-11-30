import { ChangeDetectionStrategy, Component, computed, effect, signal, Signal } from '@angular/core';
import type { WalletDetailsParams } from '@rainbow-me/rainbowkit';
import { Connector } from '@wagmi/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { injectConnectors } from 'ngx-wagmi';

type RkConnector<T extends boolean = false> = T extends true
  ? Connector & WalletDetailsParams
  : Connector & Partial<WalletDetailsParams>;
type RkConnectors = Array<RkConnector>;

@Component({
  selector: 'app-connect-wallet-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './connect-wallet-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectWalletModalComponent {
  readonly xIcon = X;

  rawConnectors = injectConnectors() as Signal<RkConnectors>;
  icons = signal({} as Record<string, string>);
  connectingConnector = signal<RkConnector<true> | null>(null);

  connectorGroups = computed(() => {
    // For simple, we just use only RainbowKit connectors
    const groups = [
      {
        groupIndex: 0,
        groupName: 'Installed',
        connectors: [],
      },
    ] as {
      groupIndex: number;
      groupName: string;
      connectors: RkConnector<true>[];
    }[];
    for (const connector of this.rawConnectors()) {
      if (!connector.rkDetails) continue;
      const rkDetailsConnector = connector as RkConnector<true>;
      if (connector.rkDetails.installed) groups[0].connectors.push(rkDetailsConnector);

      const groupIndex = connector.rkDetails.groupIndex;
      let group = groups.find((g) => g.groupIndex === groupIndex);
      if (!group) {
        group = { groupIndex, groupName: connector.rkDetails.groupName, connectors: [] };
        groups.push(group);
      }
      if (group.connectors.every((c) => c.rkDetails?.id !== connector.rkDetails?.id))
        group.connectors.push(rkDetailsConnector);
    }
    groups.sort((a, b) => a.groupIndex - b.groupIndex);
    return groups;
  });

  constructor() {
    effect(
      () => {
        const icons = {} as Record<string, string>;

        Promise.all(
          this.rawConnectors().map(async (connector) => {
            if (!connector.rkDetails) return;
            const url = connector.rkDetails.iconUrl;
            if (typeof url === 'string') return Promise.resolve(url);
            return url();
          }),
        ).then((iconUrls) => {
          iconUrls.map((iconUrl, i) => {
            if (!iconUrl) return;
            const connector = this.rawConnectors()[i];
            icons[connector.rkDetails!.id] = iconUrl;
          });
          this.icons.set(icons);
        });
      },
      { allowSignalWrites: true },
    );
  }

  async connect(connector: RkConnector<true>) {
    this.connectingConnector.set(connector);
    await connector.disconnect();
    await connector.connect();
    console.log('logggg connected');
  }
}
