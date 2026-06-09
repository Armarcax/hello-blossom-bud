import { useMemo, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WEB3_CONFIG } from '@/config/web3';
import { useWeb3Context } from '@/contexts/Web3Context';
import HAYQArtifact from '@/contracts/abis/HAYQ.json';

type AbiLike = any;

const ABI: AbiLike = (HAYQArtifact as any)?.abi ?? HAYQArtifact;

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export const useContract = () => {
  const { provider, signer, chainId, isConnected, isWrongNetwork, targetChainId } = useWeb3Context();

  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ name: '', symbol: 'HAYQ', decimals: 18 });
  const [contractError, setContractError] = useState<string | null>(null);
  const [contractCode, setContractCode] = useState<string | null>(null);

  const contractAddress = WEB3_CONFIG.contractAddress;

  const readContract = useMemo(() => {
    if (!provider || !contractAddress || isWrongNetwork || !!contractError) return null;
    try {
      return new ethers.Contract(contractAddress, ABI, provider);
    } catch {
      return null;
    }
  }, [provider, contractAddress, isWrongNetwork, contractError]);

  const contract = useMemo(() => {
    if (!provider || !contractAddress || isWrongNetwork || !!contractError) return null;
    try {
      return new ethers.Contract(contractAddress, ABI, signer ?? provider);
    } catch {
      return null;
    }
  }, [provider, signer, contractAddress, isWrongNetwork, contractError]);

  useEffect(() => {
    const run = async () => {
      setContractCode(null);

      if (!isConnected) {
        setContractError(null);
        return;
      }

      if (isWrongNetwork) {
        setContractError(null);
        return;
      }

      if (!provider) {
        setContractError('Provider not initialized');
        return;
      }

      if (!contractAddress) {
        setContractError('Contract address is not configured (VITE_CONTRACT_ADDRESS)');
        return;
      }

      try {
        const code = await provider.getCode(contractAddress);
        setContractCode(code);

        if (!code || code === '0x') {
          setContractError(
            `No contract deployed at ${contractAddress} on chainId ${chainId ?? 'unknown'} (expected ${targetChainId})`
          );
          return;
        }
      } catch {
        setContractError('Failed to verify contract deployment');
        return;
      }

      // Fetch ERC20 metadata. If any of these fail, surface it explicitly.
      try {
        const name = await provider
          .call({ to: contractAddress, data: new ethers.utils.Interface(ABI).encodeFunctionData('name', []) })
          .then(() => (readContract ? readContract.name() : ''))
          .catch(() => '');

        const symbol = await (readContract ? readContract.symbol().catch(() => '') : Promise.resolve(''));
        const decimals = await (readContract ? readContract.decimals() : Promise.reject(new Error('No read contract')));

        setTokenInfo({
          name: name || 'Token',
          symbol: symbol || 'TOKEN',
          decimals: typeof decimals === 'number' ? decimals : Number(decimals),
        });

        setContractError(null);
      } catch {
        setContractError('Unable to read token metadata. Contract/ABI mismatch.');
      }
    };

    run();
  }, [chainId, contractAddress, isConnected, isWrongNetwork, provider, readContract, targetChainId]);

  return {
    contract,
    readContract,
    isReady: isConnected && !isWrongNetwork && !!contract && !contractError,
    contractAddress,
    contractCode,
    tokenInfo,
    contractError,
    targetChainId,
  };
};
