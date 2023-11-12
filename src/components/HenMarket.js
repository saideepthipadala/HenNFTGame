import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const HenCard = ({ hen, onBuy }) => (
  <Box p={4} borderWidth="1px" borderRadius="lg">
    <Heading size="md" mb={2}>
      {hen.name}
    </Heading>
    <Text>Hen ID: {hen.id}</Text>
    <Text>Price: {hen.price} ETH</Text>
    <Button mt={4} colorScheme="teal" onClick={() => onBuy(hen)}>
      Buy
    </Button>
  </Box>
);

const HenMarket = ({ currentAccount, contractInstance }) => {
  const [hensForSale, setHensForSale] = useState([]);
  const [selectedHen, setSelectedHen] = useState(null);

  useEffect(() => {
    const loadHensForSale = async () => {
      try {
        // Call your smart contract function to get hens for sale
        const hens = await contractInstance.getHensForSale();
        setHensForSale(hens);
      } catch (error) {
        console.error('Error loading hens for sale:', error);
      }
    };

    if (currentAccount && contractInstance) {
      loadHensForSale();
    }
  }, [currentAccount, contractInstance]);

  const handleBuyHen = async (hen) => {
    try {
      // Call your smart contract function to buy the selected hen
      await contractInstance.buyHen(hen.id, {
        from: currentAccount,
        value: hen.price,
      });

      // Refresh the list of hens for sale after buying
      setHensForSale((prevHens) => prevHens.filter((h) => h.id !== hen.id));
      setSelectedHen(null);
    } catch (error) {
      console.error('Error buying hen:', error);
    }
  };

  return (
    <Box maxW="xl" mx="auto" p={8}>
      <Heading mb={8}>Hen Market</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
        {hensForSale.map((hen) => (
          <HenCard key={hen.id} hen={hen} onBuy={handleBuyHen} />
        ))}
      </SimpleGrid>
      {selectedHen && (
        <Box mt={8}>
          <Heading size="md" mb={4}>
            Selected Hen
          </Heading>
          <HenCard hen={selectedHen} onBuy={handleBuyHen} />
        </Box>
      )}
    </Box>
  );
};

export default HenMarket;
