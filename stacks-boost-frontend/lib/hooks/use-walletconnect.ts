"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { UniversalConnector } from "@reown/appkit-universal-connector";

import { getUniversalConnector } from "@/lib/walletconnect";

type StxAddressEntry = {
  symbol?: string;
  address?: string;
};

type WalletConnectStatus = "idle" | "pending" | "connected" | "disconnected" | "error";

type WalletConnectState = {
  status: WalletConnectStatus;
  isReady: boolean;
  isLoading: boolean;
  error?: string | null;
  session?: unknown;
  addresses: StxAddressEntry[];
};

type WalletConnectRequest = <T = unknown>(args: {
  method: string;
  params?: Record<string, unknown> | unknown;
}) => Promise<T>;

const initialState: WalletConnectState = {
  status: "idle",
  isReady: false,
  isLoading: true,
  error: null,
  session: undefined,
  addresses: [],
};

function pickStxAddress(addresses: StxAddressEntry[]) {
  return (
    addresses.find((entry) => entry.symbol === "STX")?.address ??
    addresses.find((entry) => entry.address?.startsWith("SP"))?.address ??
    addresses.find((entry) => entry.address?.startsWith("ST"))?.address ??
    undefined
  );
}

export function useWalletConnect() {
  const [state, setState] = useState<WalletConnectState>(initialState);
  const [connector, setConnector] = useState<UniversalConnector | null>(null);

  useEffect(() => {
    let isMounted = true;

    getUniversalConnector()
      .then((instance) => {
        if (!isMounted) return;
        setConnector(instance);
        setState((prev) => ({
          ...prev,
          status: "disconnected",
          isReady: true,
          isLoading: false,
        }));
      })
      .catch((error) => {
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          status: "error",
          isReady: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to init WalletConnect.",
        }));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const request = useCallback<WalletConnectRequest>(
    async (args) => {
      if (!connector?.provider) {
        throw new Error("WalletConnect provider not ready.");
      }
      const provider = connector.provider as {
        request: WalletConnectRequest;
      };
      return provider.request(args);
    },
    [connector],
  );

  const refreshAddresses = useCallback(async () => {
    if (!connector) return [];
    const response = (await request({
      method: "stx_getAddresses",
      params: {},
    })) as { addresses?: StxAddressEntry[] };
    const addresses = response?.addresses ?? [];
    setState((prev) => ({ ...prev, addresses }));
    return addresses;
  }, [connector, request]);

  const connect = useCallback(async () => {
    if (!connector) {
      setState((prev) => ({
        ...prev,
        status: "error",
        isLoading: false,
        error: "WalletConnect is not ready yet.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: "pending", isLoading: true, error: null }));

    try {
      const { session } = await connector.connect();
      const addresses = await refreshAddresses();
      setState((prev) => ({
        ...prev,
        status: "connected",
        isLoading: false,
        session,
        addresses,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        isLoading: false,
        error: error instanceof Error ? error.message : "WalletConnect connection failed.",
      }));
    }
  }, [connector, refreshAddresses]);

  const disconnect = useCallback(async () => {
    if (!connector) return;
    await connector.disconnect();
    setState((prev) => ({
      ...prev,
      status: "disconnected",
      isLoading: false,
      session: null,
      addresses: [],
    }));
  }, [connector]);

  const stxAddress = useMemo(() => pickStxAddress(state.addresses), [state.addresses]);

  return {
    ...state,
    connect,
    disconnect,
    request,
    stxAddress,
    isConnected: state.status === "connected",
    isPending: state.status === "pending",
  };
}
