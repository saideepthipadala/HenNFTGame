import React, { useState, useEffect } from 'react';
import { Box, Select, Button, Heading, Input, FormControl, FormLabel, VStack } from '@chakra-ui/react';

const HenBreeding = ({ currentAccount, contractInstance }) => {
  const [motherId, setMotherId] = useState('');
  const [fatherId, setFatherId] = useState('');
  const [offspringName, setOffspringName] = useState('');
  const [motherHens, setMotherHens] = useState([]);
  const [fatherHens, setFatherHens] = useState([]);

  useEffect(() => {
    if (contractInstance && currentAccount) {
      const loadMotherHens = async () => {
        try {
          // Call your smart contract function to get the list of mother hens
          const mothers = await contractInstance.getMotherHensForBreeding();
          setMotherHens(mothers);
        } catch (error) {
          console.error('Error loading mother hens:', error);
        }
      };

      const loadFatherHens = async () => {
        try {
          // Call your smart contract function to get the list of father hens
          const fathers = await contractInstance.getFatherHensForBreeding();
          setFatherHens(fathers);
        } catch (error) {
          console.error('Error loading father hens:', error);
        }
      };
      loadMotherHens();
      loadFatherHens();
    }


  }, [currentAccount, contractInstance]);

  const handleBreedHens = async () => {
    try {
      // Call your smart contract function to breed hens
      await contractInstance.breedHens(motherId, fatherId, offspringName, {
        from: currentAccount,
      });

      // Optionally, you can fetch and display the updated list of hens after breeding
      const updatedHens = await contractInstance.getHens();
      console.log(updatedHens);

      // Reset form fields after successful breeding
      setMotherId('');
      setFatherId('');
      setOffspringName('');
    } catch (error) {
      console.error('Error breeding hens:', error);
    }
  };

  return (
    <Box maxW="xl" mx="auto" p={8}>
      <Heading mb={8}>Hen Breeding</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Father Hen:</FormLabel>
          <Select placeholder="Select Father Hen" value={fatherId} onChange={(e) => setFatherId(e.target.value)}>
            {fatherHens.map((hen) => (
              <option key={hen.id} value={hen.id.toString()}>
                {hen.name} (ID: {hen.id.toString()})
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Mother Hen:</FormLabel>
          <Select placeholder="Select Mother Hen" value={motherId} onChange={(e) => setMotherId(e.target.value)}>
            {motherHens.map((hen) => (
              <option key={hen.id} value={hen.id.toString()}>
                {hen.name} (ID: {hen.id.toString()})
              </option>
            ))}
          </Select>
        </FormControl>
       
        <FormControl>
          <FormLabel>Offspring Name:</FormLabel>
          <Input type="text" value={offspringName} onChange={(e) => setOffspringName(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleBreedHens}>
          Breed Hens
        </Button>
      </VStack>
    </Box>
  );
};

export default HenBreeding;
