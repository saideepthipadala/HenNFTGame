// src/components/Home.js
import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

const Home = ({ currentAccount, contractInstance, ownerAccount }) => {
  const isOwner = currentAccount === ownerAccount;

  const mintFirstHen = async () => {
    try {
      if (isOwner) {
        await contractInstance.mintFirstHen("Hen1");
        console.log("Minting the first hen...");
      } else {
        console.error('Only the owner can mint the first hen.');
      }
    } catch (error) {
      console.error('Error minting the first hen:', error);
    }
  };

  const mintSecondHen = async () => {
    try {
      if (isOwner) {
        await contractInstance.mintSecondHen("Hen2");
        console.log("Minting the second hen...");
      } else {
        console.error('Only the owner can mint the second hen.');
      }
    } catch (error) {
      console.error('Error minting the second hen:', error);
    }
  };

  return (
    <Box maxW="xl" mx="auto" p={8}>
      <Text fontSize="2xl" mb={4}>
        Welcome to Hen NFT Game!
      </Text>

      {!isOwner && (
        <Text mb={4}>
          1. Mint your hens by purchasing them from the market.
        </Text>
      )}

      {isOwner && (
        <>
          <Button
            colorScheme="blue"
            onClick={mintFirstHen}
            mr={2}
          >
            Mint First Hen
          </Button>
          <Button
            colorScheme="green"
            onClick={mintSecondHen}
          >
            Mint Second Hen
          </Button>

          <Text mt={4} color="blue.500">
            You are the owner! You have special privileges.
          </Text>
        </>
      )}
    </Box>
  );
};

export default Home;
