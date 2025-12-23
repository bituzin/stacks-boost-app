"use client";

import type { AppKitNetwork } from "@reown/appkit/networks";
import type { CustomCaipNetwork } from "@reown/appkit-common";
import { UniversalConnector } from "@reown/appkit-universal-connector";

import { STACKS_APP_DETAILS, STACKS_NETWORK, STACKS_NETWORK_INSTANCE } from "@/lib/stacks-config";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

const stacksNetwork: CustomCaipNetwork<"stacks"> = {
  id: STACKS_NETWORK === "mainnet" ? 1 : 2,
  chainNamespace: "stacks" as const,
  caipNetworkId: `stacks:${STACKS_NETWORK}`,
  name: STACKS_NETWORK === "mainnet" ? "Stacks Mainnet" : "Stacks Testnet",
  nativeCurrency: { name: "Stacks", symbol: "STX", decimals: 6 },
  rpcUrls: { default: { http: [STACKS_NETWORK_INSTANCE.client.baseUrl] } },
};

const networks = [stacksNetwork] as [AppKitNetwork, ...AppKitNetwork[]];

export function getWalletConnectProjectId() {
  return projectId;
}

export async function getUniversalConnector() {
  if (!projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Create a project on https://dashboard.walletconnect.com.",
    );
  }

  return UniversalConnector.init({
    projectId,
    metadata: {
      name: STACKS_APP_DETAILS.name,
      description: "Stacks Boost Lending",
      url: typeof window !== "undefined" ? window.location.origin : "https://localhost",
      icons: [STACKS_APP_DETAILS.icon],
    },
    networks: [
      {
        methods: [
          "stx_getAddresses",
          "stx_transferStx",
          "stx_signTransaction",
          "stx_signMessage",
          "stx_signStructuredMessage",
          "stx_callContract",
        ],
        chains: networks as CustomCaipNetwork[],
        events: [],
        namespace: "stacks",
      },
    ],
  });
}

export { stacksNetwork };
