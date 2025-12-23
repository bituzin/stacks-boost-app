"use client";

const quickstartCards = [
  { title: "Android", icon: "android", href: "/wallet-sdk/android/installation" },
  { title: "iOS", icon: "apple", href: "/wallet-sdk/ios/installation" },
  { title: "React Native", icon: "react", href: "/wallet-sdk/react-native/installation" },
  { title: "Flutter", icon: "flutter", href: "/wallet-sdk/flutter/installation" },
  { title: "Web", icon: "js", href: "/wallet-sdk/web/installation" },
  { title: ".NET", icon: "code", href: "/wallet-sdk/c-sharp/installation" },
];

const features = [
  {
    title: "Sign API",
    detail: "Allows dapps to request that the user sign a transaction or message.",
  },
  {
    title: "Auth API",
    detail:
      "Lets dapps verify wallet address ownership through a single signature request.",
  },
  {
    title: "Chain agnostic",
    detail:
      "Designed to work with any blockchain, supporting multiple chains without extra integration.",
  },
];

const coreMethods = [
  {
    title: "stx_getAddresses",
    summary: "Retrieve active account addresses; primarily Stacks-focused.",
    notes: [
      "Use this first to select the wallet's active address.",
      "Filter on symbol: \"STX\" or by address prefix (SP mainnet, ST testnet).",
    ],
    request: `{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "stx_getAddresses",
  "params": {}
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "addresses": [
      {
        "symbol": "STX",
        "address": "SP..."
      }
    ]
  }
}`,
  },
];

const stacksMethods = [
  {
    title: "stx_transferStx",
    summary: "Transfer STX.",
    params: [
      ["sender", "Required", "string", "Stacks address of sender"],
      ["recipient", "Required", "string", "Stacks address"],
      ["amount", "Required", "string", "micro-STX (uSTX)"],
      ["memo", "Optional", "string", "Memo string"],
      ["network", "Optional", "string", "mainnet | testnet | devnet"],
    ],
    request: `{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "stx_transferStx",
  "params": {
    "sender": "SP3F7GQ48JY59521DZEE6KABHBF4Q33PEYJ823ZXQ",
    "recipient": "SP3F7GQ48JY59521DZEE6KABHBF4Q33PEYJ823ZXQ",
    "amount": "100000000000",
    "memo": "",
    "network": "mainnet"
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "txid": "1234567890abcdef1234567890abcdef12345678",
    "transaction": "0x..."
  }
}`,
  },
  {
    title: "stx_signTransaction",
    summary: "Sign a Stacks transaction. Optional broadcast.",
    params: [
      ["transaction", "Required", "string", "hex transaction"],
      ["broadcast", "Optional", "boolean", "default false"],
      ["network", "Optional", "string", "mainnet | testnet | devnet"],
    ],
    request: `{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "stx_signTransaction",
  "params": {
    "transaction": "0x...",
    "broadcast": false,
    "network": "mainnet"
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "signature": "0x...",
    "transaction": "0x...",
    "txid": "1234567890abcdef1234567890abcdef12345678"
  }
}`,
    note: "txid is present if broadcast=true.",
  },
  {
    title: "stx_signMessage",
    summary: "Sign arbitrary message; supports structured (SIP-018).",
    params: [
      ["address", "Required", "string", "Stacks address of sender"],
      ["message", "Required", "string", "Utf-8 message"],
      ["messageType", "Optional", "string", "utf8 | structured"],
      ["network", "Optional", "string", "mainnet | testnet | signet | devnet"],
      ["domain", "Optional", "string", "Domain tuple (structured only)"],
    ],
    request: `{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "stx_signMessage",
  "params": {
    "address": "SP3F7GQ48JY59521DZEE6KABHBF4Q33PEYJ823ZXQ",
    "message": "message",
    "messageType": "utf8",
    "network": "mainnet",
    "domain": "example.com"
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "signature": "0x..."
  }
}`,
  },
  {
    title: "stx_signStructuredMessage",
    summary: "Domain-bound structured signing (SIP-018).",
    params: [
      ["message", "Required", "string | object", "Message to sign"],
      ["domain", "Required", "string | object", "Domain for structured signing"],
    ],
    request: `{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "stx_signStructuredMessage",
  "params": {
    "message": "message",
    "domain": "domain"
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "signature": "0x...",
    "publicKey": "0x04..."
  }
}`,
    note: "publicKey is optional.",
  },
  {
    title: "stx_callContract",
    summary: "Wrapper method for stx_signTransaction that calls a Stacks contract.",
    params: [
      ["contract", "Required", "string", "Stacks address + contract name"],
      ["functionName", "Required", "string", "Function to call"],
      ["functionArgs", "Required", "string[]", "Args encoded as strings"],
    ],
    request: `{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "stx_callContract",
  "params": {
    "contract": "SP3F7GQ48JY59521DZEE6KABHBF4Q33PEYJ823ZXQ.my-contract",
    "functionName": "get-balance",
    "functionArgs": []
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "txid": "stack_tx_id",
    "transaction": "raw_tx_hex"
  }
}`,
    note: "txid identifies the transaction on the explorer.",
  },
];

const installCommand =
  "npm install @reown/appkit @reown/appkit-universal-connector @reown/appkit-common ethers";

const installTabs = ["npm", "Yarn", "Bun", "pnpm"] as const;

const universalConnectorExample = `import type { AppKitNetwork } from '@reown/appkit/networks'
import type { CustomCaipNetwork } from '@reown/appkit-common'
import { UniversalConnector } from '@reown/appkit-universal-connector'

// Get projectId from https://dashboard.walletconnect.com
export const projectId = import.meta.env.VITE_PROJECT_ID || "YOUR_PROJECT_ID_HERE"

if (!projectId || projectId === "YOUR_PROJECT_ID_HERE") {
  throw new Error('Project ID is not defined. Please set your project ID from the WalletConnect Dashboard.')
}

// you can configure your own network
const suiMainnet: CustomCaipNetwork<'sui'> = {
  id: 784,
  chainNamespace: 'sui' as const,
  caipNetworkId: 'sui:mainnet',
  name: 'Sui',
  nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 9 },
  rpcUrls: { default: { http: ['https://fullnode.mainnet.sui.io:443'] } }
}

export const networks = [suiMainnet] as [AppKitNetwork, ...AppKitNetwork[]]

export async function getUniversalConnector() {
  const universalConnector = await UniversalConnector.init({
    projectId,
    metadata: {
      name: 'Universal Connector',
      description: 'Universal Connector',
      url: 'https://www.walletconnect.com',
      icons: ['https://www.walletconnect.com/icon.png']
    },
    networks: [
      {
        methods: ['sui_signPersonalMessage'],
        chains: [suiMainnet as CustomCaipNetwork],
        events: [],
        namespace: 'sui'
      }
    ]
  })

  return universalConnector
}`;

const appIntegrationExample = `import { useState, useEffect } from 'react'
import { getUniversalConnector } from './config'
import { UniversalConnector } from '@reown/appkit-universal-connector'

export function App() {
  const [universalConnector, setUniversalConnector] = useState<UniversalConnector>()
  const [session, setSession] = useState<any>()

  useEffect(() => {
    getUniversalConnector().then(setUniversalConnector)
  }, [])

  useEffect(() => {
    setSession(universalConnector?.provider.session)
  }, [universalConnector?.provider.session])
}`;

const connectExample = `const handleConnect = async () => {
  if (!universalConnector) {
    return
  }

  const { session: providerSession } = await universalConnector.connect()
  setSession(providerSession)
}

const handleDisconnect = async () => {
  if (!universalConnector) {
    return
  }
  await universalConnector.disconnect()
  setSession(null)
}`;

const wagmiExample = `import { useReadContract } from "wagmi";
import { USDTAbi } from "../abi/USDTAbi";

const USDTAddress = "0x...";

function App() {
  const result = useReadContract({
    abi: USDTAbi,
    address: USDTAddress,
    functionName: "totalSupply",
  });
}`;

const useCases = [
  "Custom wallet infrastructure.",
  "Governance flows with onchain or offchain execution.",
  "Secure DeFi access from custody-controlled environments.",
  "Seamless cross-chain policy enforcement.",
  "In-app and in-wallet payments.",
  "Secure in-app signature workflows.",
  "Access to 65,000+ onchain apps.",
  "Chain agnostic by design.",
  "Fast, frictionless integration.",
  "Transparent and open source.",
  "Battle-tested and audit-proven security.",
  "No dropped connections, no interruptions.",
];

export function WalletPanel() {
  return (
    <section className="w-full rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_24px_70px_rgba(30,12,6,0.55)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/70">
            WalletConnect
          </p>
          <h2 className="text-2xl font-semibold text-white">
            WalletConnect Wallet SDK
          </h2>
          <p className="mt-2 text-sm text-orange-100/70">
            Wallet SDK is WalletConnect&apos;s modular SDK for integrating secure,
            multichain, policy-aligned wallet access directly into your infrastructure.
            It&apos;s designed for apps, institutions, and custodians that need full
            control over key management, signing, and access without compromising
            UX or compliance.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-orange-100/70">
          Powered by the WalletConnect Network
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/70">
            Quickstart
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {quickstartCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-white/30 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-orange-100/70">
                    {card.icon}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {card.title}
                  </span>
                </div>
                <p className="mt-3 text-xs text-orange-100/70">
                  Get started with Wallet SDK in {card.title}.
                </p>
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/70">
              Features
            </p>
            <div className="mt-4 grid gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="mt-2 text-xs text-orange-100/70">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img
              src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/walletkit.png"
              alt="Wallet SDK banner"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/70">
            Use Cases
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {useCases.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-orange-100/70"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/70">
                Chain Support
              </p>
              <h3 className="text-lg font-semibold text-white">Stacks</h3>
              <p className="text-xs text-orange-100/70">
                JSON-RPC methods supported by Wallet SDK for Stacks transfers and messages.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-100 transition hover:border-white/30 hover:bg-white/10"
            >
              Copy page
            </button>
          </div>

          <div className="mt-5 grid gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Core Methods (common)
              </p>
              <div className="mt-3 grid gap-4">
                {coreMethods.map((method) => (
                  <div
                    key={method.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{method.title}</p>
                    <p className="mt-2 text-xs text-orange-100/70">{method.summary}</p>
                    <div className="mt-3 grid gap-2 text-xs text-orange-100/70">
                      {method.notes.map((note) => (
                        <p key={note}>{note}</p>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.26em] text-orange-200/70">
                          Request
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                          {method.request}
                        </pre>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.26em] text-orange-200/70">
                          Response
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                          {method.response}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Stacks Methods
              </p>
              <div className="mt-3 grid gap-4">
                {stacksMethods.map((method) => (
                  <div
                    key={method.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{method.title}</p>
                        <p className="mt-2 text-xs text-orange-100/70">{method.summary}</p>
                      </div>
                      {method.note ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-orange-100/70">
                          Note
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                      <div className="grid grid-cols-4 gap-2 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-orange-200/70">
                        <span>Parameter</span>
                        <span>Required</span>
                        <span>Type</span>
                        <span>Description</span>
                      </div>
                      <div className="grid gap-2 px-3 py-3 text-xs text-orange-100/70">
                        {method.params.map(([param, required, type, desc]) => (
                          <div key={param} className="grid grid-cols-4 gap-2">
                            <span className="font-mono text-orange-100/80">{param}</span>
                            <span>{required}</span>
                            <span className="font-mono text-orange-100/80">{type}</span>
                            <span>{desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.26em] text-orange-200/70">
                          Request
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                          {method.request}
                        </pre>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.26em] text-orange-200/70">
                          Response
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                          {method.response}
                        </pre>
                      </div>
                    </div>
                    {method.note ? (
                      <p className="mt-3 text-xs text-orange-100/70">
                        {method.note}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Session Properties
              </p>
              <p className="mt-2 text-xs text-orange-100/70">
                In a connection request, serialize the response to stx_getAddresses in
                session.sessionProperties.stacks_getAddresses. This lets dapps consume
                an active session without re-requesting all addresses and public keys.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/70">
                Installation
              </p>
              <h3 className="text-lg font-semibold text-white">WalletConnect App SDK</h3>
              <p className="text-xs text-orange-100/70">
                Chain agnostic integration with Universal Provider compatibility across
                blockchain protocols.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-100 transition hover:border-white/30 hover:bg-white/10"
            >
              Copy page
            </button>
          </div>

          <div className="mt-5 grid gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Pre-requisites
              </p>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-orange-100/70">
                <p>
                  Create a new project on WalletConnect Dashboard at
                  https://dashboard.walletconnect.com and obtain a project ID. This
                  project ID initializes WalletConnect in your app.
                </p>
                <p className="mt-2">
                  Don&apos;t have a project ID? Head over to WalletConnect Dashboard and
                  create a new project now!
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Installation
              </p>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.28em] text-orange-100/70">
                  {installTabs.map((tab) => (
                    <span
                      key={tab}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                  {installCommand}
                </pre>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Implementation
              </p>
              <p className="mt-2 text-xs text-orange-100/70">
                Use the UniversalConnector for a single interface across protocols.
                Configure supported networks (see RPC Reference in the docs).
              </p>
              <div className="mt-4 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-orange-200/70">
                    Config (Generic example)
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                    {universalConnectorExample}
                  </pre>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-orange-200/70">
                    App integration
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                    {appIntegrationExample}
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Trigger the modal
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                {connectExample}
              </pre>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Smart Contract Interaction
              </p>
              <p className="mt-2 text-xs text-orange-100/70">
                Wagmi hooks can help interact with wallets and smart contracts:
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-orange-100/80">
                {wagmiExample}
              </pre>
              <p className="mt-2 text-xs text-orange-100/70">
                Read more about Wagmi hooks in the docs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
