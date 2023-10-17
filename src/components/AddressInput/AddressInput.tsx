import React, { useState, useCallback, type FC, type ChangeEvent } from "react";

import { Box, Input, InputGroup, InputLeftAddon, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { isAddress, zeroAddress } from "viem";
import { useEnsResolver } from "wagmi";

import { useDebounce, useNotify } from "@/hooks";

import Jazzicons from "./Jazzicons";
import warningImage from "../../../public/img/warning.svg";

type AddressInputProps = {
  setReceiver: (receiver: string) => void;
};

const AddressInput: FC<AddressInputProps> = ({ setReceiver }) => {
  const [inputValue, setInputValue] = useState("");
  const {
    data: resolvedAddress,
    isLoading: isResolvingInProgress,
    isError,
    error,
  } = useEnsResolver({
    name: inputValue,
  });

  const debouncedReceiver = useDebounce(inputValue, 2000);
  const notify = useNotify();

  const isValidEthAddress = (value: string) => value.startsWith("0x") && value.length === 42;

  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      setInputValue(value);

      if (isValidEthAddress(value)) {
        setReceiver(value);
      } else if (resolvedAddress && resolvedAddress !== zeroAddress) {
        setReceiver(resolvedAddress);
      } else if (debouncedReceiver && debouncedReceiver.length > 0 && isError) {
        notify({
          title: "Error:",
          message: error?.message ?? "Invalid address or ENS name.",
          status: "error",
        });
      } else if (!value.length) {
        setReceiver("");
      }
    },
    [resolvedAddress, debouncedReceiver, isError, error?.message, notify, setReceiver],
  );

  const getAddonContent = (): JSX.Element | null => {
    if (isResolvingInProgress) return <Spinner />;
    const validAddress = isValidEthAddress(inputValue)
      ? inputValue
      : isAddress(resolvedAddress as string) && resolvedAddress !== zeroAddress
      ? resolvedAddress
      : undefined;

    if (validAddress) return <Jazzicons seed={validAddress.toLowerCase()} size={30} />;
    if (!resolvedAddress && inputValue && !isResolvingInProgress)
      return (
        <Image
          alt="warning icon"
          src={warningImage.src}
          className="icon-wrapper error-icon"
          width={30}
          height={30}
        />
      );
    return null;
  };

  return (
    <Box w={"100%"}>
      <InputGroup>
        <InputLeftAddon w={"50px"} p={0} justifyContent={"center"}>
          {getAddonContent()}
        </InputLeftAddon>
        <Input
          value={inputValue}
          onChange={handleInput}
          placeholder="Enter Ethereum name or address"
          name="ethereum"
          spellCheck={false}
        />
      </InputGroup>
    </Box>
  );
};

export default AddressInput;