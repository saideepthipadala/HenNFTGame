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
  SimpleGrid,
  Alert, AlertIcon, AlertTitle, AlertDescription
} from '@chakra-ui/react';

import { ethers } from 'ethers';

const CreateRaceTab = ({ newRaceEntryFee, setNewRaceEntryFee, handleStartRace }) => (
  <TabPanel>

    <Box p={4}>
      <Heading mb={4}>Create a New Race</Heading>
      <Box mb={4}>
        <Text>Entry Fee (ETH):</Text>
        <Input
          type="text"
          value={newRaceEntryFee}
          onChange={(e) => setNewRaceEntryFee(e.target.value)}
          placeholder="Enter entry fee"
        />
      </Box>
      <Button colorScheme="teal" onClick={handleStartRace}>
        Create Race
      </Button>
    </Box>
  </TabPanel>
);


const ListRacesTab = ({ races, currentAccount, ownerAccount, handleStartRaceNow }) => {
  return (
    <TabPanel>
      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          List of Races
        </Text>
        {races && races.length > 0 ? (
          <SimpleGrid columns={1} spacing={4}>
            {races.map((race) => (
              <Box key={race.id} borderWidth="2px" borderRadius="lg" p={6} >
                <Text mb={2} fontSize="lg" fontWeight="bold">
                  Race ID: {race.id.toString()}
                </Text>
                <Text mb={2}>
                  Entry Fee: {ethers.utils.formatEther(race.entryFee.toString())} ETH
                </Text>
                <Text mb={2}>Participants: {race.participants.length}</Text>
                {race.winner !== '0x0000000000000000000000000000000000000000' ? (
                  <Alert status="success" mb={2}>
                    <AlertIcon />
                    <AlertTitle mr={2} fontWeight="bold">Winner: {race.winner}</AlertTitle>
                    <AlertDescription>Race Ended</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {currentAccount === ownerAccount && (
                      <Button onClick={() => handleStartRaceNow(race.id)} colorScheme="teal" mb={4}>
                        Start Race Now
                      </Button>
                    )}
                  </>
                )}
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text>No races available.</Text>
        )}
      </Box>
    </TabPanel>
  );
};



// JoinRacePanel component
const JoinRacePanel = ({
  races,
  selectedRaceId,
  setSelectedRaceId,
  handleEnterRace,
  ownedHens,
  selectedHenId,
  setSelectedHenId,
  setEntryFee, // Add setEntryFee to update the entry fee
}) => {
  // Filter active races (those that haven't ended)
  const activeRaces = races.filter((race) => race.winner === '0x0000000000000000000000000000000000000000');

  // Function to handle race selection
  const handleRaceSelection = (e) => {
    const selectedRaceId = e.target.value;
    // Find the selected race based on the race ID
    const selectedRace = activeRaces.find((race) => race.id.toString() === selectedRaceId);
    // Check if the selected race exists
    if (selectedRace) {
      // Set the selected race ID and its entry fee in the state
      setSelectedRaceId(selectedRaceId);
      setEntryFee(ethers.utils.formatEther(selectedRace.entryFee.toString()));
    } else {
      // Handle the case when the selected race is not found
      console.error('Selected race not found or has already ended.');
    }
  };

  return (
    <TabPanel>
      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Join a Race
        </Text>
        <SimpleGrid columns={1} spacing={4}>
          <Box borderWidth="1px" borderRadius="lg" p={4}>
            <Text mb={2} fontSize="lg" fontWeight="bold">
              Select a Race to Join:
            </Text>
            <Select value={selectedRaceId} onChange={handleRaceSelection}>
              <option value="" disabled>
                Choose a Race
              </option>
              {activeRaces.map((race) => (
                <option key={race.id} value={race.id.toString()}>
                  {" RACE ID: " +
                    race.id.toString() +
                    " - Entry fee: " +
                    ethers.utils.formatEther(race.entryFee.toString())} ETH
                </option>
              ))}
            </Select>
          </Box>

          <Box borderWidth="1px" borderRadius="lg" p={4}>
            <Text mb={2} fontSize="lg" fontWeight="bold">
              Select Your Hen:
            </Text>
            <Select value={selectedHenId} onChange={(e) => setSelectedHenId(e.target.value)}>
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
          <Button colorScheme="teal" onClick={handleEnterRace} marginTop="4">
            Join Race
          </Button>
        </SimpleGrid>
      </Box>
    </TabPanel>
  );
};

// Modify EnterRaceTab to include the ListRacesTab and JoinRacePanel
const EnterRaceTab = ({
  races,
  selectedRaceId,
  entryFee,
  setSelectedRaceId,
  handleEnterRace,
  setEntryFee,
  ownedHens,
  selectedHenId,
  setSelectedHenId,
}) => (
  <TabPanel>
    <JoinRacePanel
      races={races}
      selectedRaceId={selectedRaceId}
      entryFee={entryFee}
      setSelectedRaceId={setSelectedRaceId}
      handleEnterRace={handleEnterRace}
      setEntryFee={setEntryFee}
      ownedHens={ownedHens}
      selectedHenId={selectedHenId}
      setSelectedHenId={setSelectedHenId}
    />
  </TabPanel>
);

const HenRacing = ({ currentAccount, contractInstance, ownerAccount }) => {
  const [races, setRaces] = useState([]);
  const [entryFee, setEntryFee] = useState('');
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [selectedHenId, setSelectedHenId] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [ownedHens, setOwnedHens] = useState([]);
  const [newRaceEntryFee, setNewRaceEntryFee] = useState('');

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const races = await contractInstance.getRaces();
        setRaces(races);
      } catch (error) {
        console.error('Error loading races:', error);
      }
    };

    const loadOwnedHens = async () => {
      try {
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
      const parsedNewRaceEntryFee = ethers.utils.parseEther(newRaceEntryFee);
      await contractInstance.startRace(parsedNewRaceEntryFee, {
        from: ownerAccount,
      });

      setRaces(await contractInstance.getRaces());
      setNewRaceEntryFee('');
    } catch (error) {
      console.error('Error starting race:', error);
    }
  };

  const handleEnterRace = async () => {
    try {
      console.log('Before parsing - selectedRaceId:', selectedRaceId, 'entryFee:', entryFee);

      // Validate selectedRaceId and entryFee before parsing
      const parsedRaceId = selectedRaceId !== '' ? parseInt(selectedRaceId, 10) : null;
      const parsedEntryFee = entryFee !== '' ? ethers.utils.parseEther(entryFee) : null;

     

      // Check if parsedRaceId and parsedEntryFee are valid numbers
      if (parsedRaceId === null || isNaN(parsedRaceId) || parsedEntryFee === null) {
        console.error('Invalid input. Please enter valid values for Race ID and Entry Fee.');
        return;
      }

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

  const handleStartRaceNow = async (raceId) => {
    try {
      await contractInstance.startRaceNow(raceId, {
        from: ownerAccount,
      });

      // Refresh the list of races after starting the race
      setRaces(await contractInstance.getRaces());
    } catch (error) {
      console.error('Error starting race now:', error);
    }
  };
  const isOwner = currentAccount === ownerAccount;

  return (
    <Box maxW="xl" mx="auto" p={8}>
      <Heading mb={8}>Hen Races</Heading>
      <Tabs isFitted variant="enclosed-colored" colorScheme="teal" size="lg">
        <TabList mb="1em">
          {isOwner && (
            <Tab onClick={() => setActiveTab('create')}>Create a Race</Tab>
          )}
          <Tab onClick={() => setActiveTab('enter')}>Enter a Race</Tab>
          <Tab onClick={() => setActiveTab('list')}>List Races</Tab>
        </TabList>
        <TabPanels>
          {isOwner && (
            <CreateRaceTab
              newRaceEntryFee={newRaceEntryFee}
              setNewRaceEntryFee={setNewRaceEntryFee}
              handleStartRace={handleStartRace}
              races={races}
            />
          )}
          <EnterRaceTab
            races={races}
            selectedRaceId={selectedRaceId}
            entryFee={entryFee}
            setSelectedRaceId={setSelectedRaceId}
            handleEnterRace={handleEnterRace}
            setEntryFee={setEntryFee}
            ownedHens={ownedHens}
            selectedHenId={selectedHenId}
            setSelectedHenId={setSelectedHenId}
          />
          <ListRacesTab races={races} currentAccount={currentAccount} ownerAccount={ownerAccount} handleStartRaceNow={handleStartRaceNow} />
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default HenRacing;
