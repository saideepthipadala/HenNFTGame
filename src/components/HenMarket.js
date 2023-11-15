import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

const HenCard = ({ hen, onBuy }) => (
  <Box p={4} borderWidth="1px" borderRadius="lg">
    {hen ? (
      <>
        <Heading size="md" mb={2}>
          {hen.name}
        </Heading>
        <Text>Hen ID: {hen.id.toString()}</Text>
        <Text>Gender: {hen.gender ? 'Male' : 'Female'}</Text>
        <Text>Generation: {hen.generation.toString()}</Text>
        <Text>Price: {ethers.utils.formatEther(hen.price)} ETH</Text>
        <Button mt={4} colorScheme="teal" onClick={() => onBuy(hen)}>
          Buy
        </Button>
      </>
    ) : (
      <Text>No information available for this hen.</Text>
    )}
  </Box>
);

const HenMarket = ({ currentAccount, contractInstance }) => {
  const [hensForSale, setHensForSale] = useState([]);

  useEffect(() => {
    if (contractInstance && currentAccount) {
      const loadHensForSale = async () => {
        try {
          // Call your smart contract function to get hens for sale
          const hens = await contractInstance.getHensForSale();

          // Update the state with the fetched hens
          setHensForSale(hens);
          console.log("hens---", hens);
        } catch (error) {
          console.error('Error loading hens for sale:', error);
        }
      };
      loadHensForSale();
    }
  }, [currentAccount, contractInstance]);

  const handleBuyHen = async (hen) => {
    try {
      let formattedPrice = ethers.utils.formatEther(hen.price);
      formattedPrice = ethers.utils.parseEther(formattedPrice).toString()

      // Call your smart contract function to buy the selected hen
      await contractInstance.buyHen(hen.id, {
        from: currentAccount,
        value: formattedPrice,
      });

      // Refresh the list of hens for sale after buying
      setHensForSale((prevHens) => prevHens.filter((h) => h.id !== hen.id));
    } catch (error) {
      console.error('Error buying hen:', error);
    }
  }

  console.log("hensForSale", hensForSale);

  return (
    <Box maxW="xl" mx="auto" p={8}>
      <Heading mb={8}>Hen Market</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
        {hensForSale.map((hen) => (
          <HenCard key={hen.id} hen={hen} onBuy={handleBuyHen} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HenMarket;
