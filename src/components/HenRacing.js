// HenRacing.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Input,
  Button,
  Select,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { ethers } from 'ethers';



const CreateRaceTab = ({ entryFee, setEntryFee, handleStartRace }) => (
  <TabPanel>
    <Box p={4}>
      <Heading mb={4}>Create a New Race</Heading>
      <Box mb={4}>
        <Text>Entry Fee (ETH):</Text>
        <Input
          type="text"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          placeholder="Enter entry fee"
        />
      </Box>
      <Button colorScheme="teal" onClick={handleStartRace}>
        Create Race
      </Button>
    </Box>
  </TabPanel>
);

const EnterRaceTab = ({ selectedRaceId, entryFee, setSelectedRaceId, handleEnterRace, setEntryFee, ownedHens, setSelectedHenId }) => (
  <TabPanel>
    <Box p={4}>
      <Heading mb={4}>Enter a Race</Heading>
      <Box mb={4}>
        <Text>Race ID:</Text>
        <Input
          type="text"
          value={selectedRaceId}
          onChange={(e) => setSelectedRaceId(e.target.value)}
          placeholder="Enter race ID"
        />
      </Box>
      <Box mb={4}>
        <Text>Entry Fee (ETH):</Text>
        <Input
          type="text"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          placeholder="Enter entry fee"
        />
      </Box>
      <Box mb={4}>
        <Text>Select Your Hen:</Text>
        <Select onChange={(e) => setSelectedHenId(e.target.value)}>
          <option value="" disabled>
            Choose a Hen
          </option>
          {ownedHens.map((hen) => (
            <option key={hen.id} value={hen.id.toString()}>
              {hen.name} - {hen.id.toString()}
            </option>
          ))}
        </Select>
      </Box>
      <Button colorScheme="teal" onClick={handleEnterRace}>
        Enter Race
      </Button>
    </Box>
  </TabPanel>
);
const HenRacing = ({ currentAccount, contractInstance, ownerAccount }) => {
  const [races, setRaces] = useState([]);
  const [entryFee, setEntryFee] = useState('');
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [selectedHenId, setSelectedHenId] = useState(''); // Define the state variable
  const [activeTab, setActiveTab] = useState('create');
  const [ownedHens, setOwnedHens] = useState([]);

  useEffect(() => {
    const loadRaces = async () => {
      try {
        // Call your smart contract function to get the list of races
        const races = await contractInstance.getRaces();
        setRaces(races);
      } catch (error) {
        console.error('Error loading races:', error);
      }
    };

    const loadOwnedHens = async () => {
      try {
        // Call your smart contract function to get the list of owned hens for the current user
        const hens = await contractInstance.getOwnedHens(currentAccount);
        setOwnedHens(hens);
      } catch (error) {
        console.error('Error loading owned hens:', error);
      }
    };

    if (currentAccount && contractInstance) {
      loadRaces();
      loadOwnedHens();
    }
  }, [currentAccount, contractInstance]);

  const handleStartRace = async () => {
    try {
      // Call your smart contract function to start a new race
      const parsedEntryFee = ethers.utils.parseEther(entryFee);
      await contractInstance.startRace(parsedEntryFee, {
        from: ownerAccount, // Only allow the owner to start a race
      });

      // Refresh the list of races after starting a new race
      setRaces(await contractInstance.getRaces());
      setEntryFee('');
    } catch (error) {
      console.error('Error starting race:', error);
    }
  };

  const handleEnterRace = async () => {
    try {
      const parsedRaceId = parseInt(selectedRaceId, 10); // Parse the race ID
      const parsedEntryFee = ethers.utils.parseEther(entryFee); // Parse the entry fee

      // Call your smart contract function to enter the selected race with the chosen hen
      await contractInstance.enterRace(parsedRaceId, selectedHenId, {
        from: currentAccount,
        value: parsedEntryFee,
      });

      // Refresh the list of races after entering a race
      setRaces(await contractInstance.getRaces());
      setEntryFee('');
      setSelectedRaceId('');
      setSelectedHenId('');
    } catch (error) {
      console.error('Error entering race:', error);
    }
  };


  return (
    <Box maxW="xl" mx="auto" p={8}>
      <Heading mb={8}>Hen Races</Heading>
      <Tabs isFitted variant="enclosed-colored" colorScheme="teal" size="lg">
        <TabList mb="1em">
          <Tab onClick={() => setActiveTab('create')}>Create a Race</Tab>
          <Tab onClick={() => setActiveTab('enter')}>Enter a Race</Tab>
        </TabList>
        <TabPanels>
          <CreateRaceTab entryFee={entryFee} setEntryFee={setEntryFee} handleStartRace={handleStartRace} />
          <EnterRaceTab
            selectedRaceId={selectedRaceId}
            entryFee={entryFee}
            setSelectedRaceId={setSelectedRaceId}
            handleEnterRace={handleEnterRace}
            setEntryFee={setEntryFee}
            ownedHens={ownedHens}
            setSelectedHenId={setSelectedHenId} // Pass setSelectedHenId to EnterRaceTab
          />
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default HenRacing;
