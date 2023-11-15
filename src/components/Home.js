// src/components/Home.js
import React from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';

const Home = ({ currentAccount, contractInstance, ownerAccount }) => {
  const isOwner = currentAccount === ownerAccount;
  const toast = useToast();


  const mintFirstHen = async () => {
    try {
      if (isOwner) {
       const tx =  await contractInstance.mintFirstHen("Hen1");
        console.log("Minting the first hen...");
        await tx.wait();
        toast({
          title: "Successfully Minted first hen!",
          position: "top",
          isClosable: true,
          status: "success"
        })
      } else {
        console.error('Only the owner can mint the first hen.');
      }
    } catch (error) {
      if (error.message.includes("First hen already minted")){
        toast({
          title: "First Hen Already Minted",
          description: "You can mint the 1st hen only once",
          position: "top",
          isClosable: true,
          status: "warning"
        })
      }
      console.error('Error minting the first hen:', error);
    }
  };

  const mintSecondHen = async () => {
    try {
      if (isOwner) {
       const tx =  await contractInstance.mintSecondHen("Hen2");
        console.log("Minting the second hen...");

      await tx.wait();
        toast({
          title: "Successfully Minted second hen!",
          position: "top",
          isClosable: true,
          status: "success"
        })
      } else {
        console.error('Only the owner can mint the second hen.');
      }
    } catch (error) {
      if (error.message.includes("Second hen already minted")) {
        toast({
          title: "Second Hen Already Minted",
          description: "You can mint the 2nd hen only once",
          position: "top",
          isClosable: true,
          status: "warning"
        })
      }
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
          Mint your hens by purchasing them from the market or breed from other hens.
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
