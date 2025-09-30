// Utility function to shorten Ethereum addresses
const shortenAddress = (address: string): string => {
  // Check for zero address
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    return "Not set";
  }
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export default shortenAddress;
