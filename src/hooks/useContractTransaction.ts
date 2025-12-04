import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useContract } from './useContract';
import { useInvalidateWeb3Queries } from './useWeb3Query';

interface TransactionOptions {
  onSuccess?: (receipt: ethers.providers.TransactionReceipt) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  invalidateOnSuccess?: boolean;
}

export const useContractTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { contract } = useContract();
  const { toast } = useToast();
  const { invalidateAll } = useInvalidateWeb3Queries();

  const execute = useCallback(
    async <T extends (...args: any[]) => Promise<ethers.ContractTransaction>>(
      contractMethod: T,
      args: Parameters<T>,
      options: TransactionOptions = {}
    ) => {
      const {
        onSuccess,
        onError,
        successMessage = 'Transaction successful',
        errorMessage = 'Transaction failed',
        invalidateOnSuccess = true,
      } = options;

      if (!contract) {
        toast({
          title: 'Error',
          description: 'Contract not available',
          variant: 'destructive',
        });
        return null;
      }

      setLoading(true);
      setTxHash(null);

      try {
        const tx = await contractMethod(...args);
        setTxHash(tx.hash);

        toast({
          title: 'Transaction Submitted',
          description: `TX: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
        });

        const receipt = await tx.wait();

        if (invalidateOnSuccess) {
          invalidateAll();
        }

        toast({
          title: 'Success',
          description: successMessage,
        });

        onSuccess?.(receipt);
        return receipt;
      } catch (error: any) {
        const message = error?.reason || error?.message || errorMessage;
        
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });

        onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [contract, toast, invalidateAll]
  );

  return {
    execute,
    loading,
    txHash,
    contract,
  };
};
