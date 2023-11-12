import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Heading,
    SimpleGrid,
    Text,
    Stack,
    Badge,
} from '@chakra-ui/react';

const HenCard = ({ hen, onSetForSale }) => (
    <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center">
        <Heading size="md" mb={2}>
            {hen.name}
        </Heading>
        <Text>Hen ID: {hen.id.toString()}</Text>
        <Text>Generation: {hen.generation.toString()}</Text>
        <Text>Gender: {hen.gender ? 'Male' : 'Female'}</Text>
        {hen.forSale ? (
            <Stack mt={4} direction="column" align="center">
                <Text>Price: {hen.price.toString()} ETH</Text>
                <Badge colorScheme="green">For Sale</Badge>
                <Button
                    mt={2}
                    colorScheme="red"
                    onClick={() => onSetForSale(hen, 0)}
                >
                    Remove from Sale
                </Button>
            </Stack>
        ) : (
            <Stack mt={4} direction="column" align="center">
                <Text>Not for Sale</Text>
                <Button
                    mt={2}
                    colorScheme="teal"
                    onClick={() => onSetForSale(hen, prompt('Enter the price in ETH'))}
                >
                    Set for Sale
                </Button>
            </Stack>
        )}
    </Box>
);

const UserProfile = ({ currentAccount, contractInstance }) => {
    const [ownedHens, setOwnedHens] = useState([]);
    const [numHensSold, setNumHensSold] = useState(0);

    useEffect(() => {
        if (currentAccount && contractInstance) {
            const loadUserProfile = async () => {
                try {
                    // Call your smart contract functions to get user profile data
                    const hens = await contractInstance.getOwnedHens(currentAccount);

                    setOwnedHens(hens);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                }
            };
            loadUserProfile();
        }
    }, [currentAccount, contractInstance]);

    console.log(ownedHens);

    const handleSetForSale = async (hen, price) => {
        try {
            // Call your smart contract function to set/unset the hen for sale
            await contractInstance.setHenForSale(hen.id, price, !hen.forSale, {
                from: currentAccount,
            });

            // Refresh the list of owned hens after setting for sale
            const updatedHens = await contractInstance.getOwnedHens(currentAccount);
            setOwnedHens(updatedHens);
        } catch (error) {
            console.error('Error setting hen for sale:', error);
        }
    };

    return (
        <Box maxW="xl" mx="auto" p={8}>
            <Heading mb={8}>User Profile</Heading>
            <Text mb={4}>Account Address: {currentAccount}</Text>
            <Text mb={4}>Number of Hens Sold: {numHensSold}</Text>
            <Heading size="md" mb={4}>
                Owned Hens
            </Heading>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
                {ownedHens.map((hen) => (
                    <HenCard key={hen.id} hen={hen} onSetForSale={handleSetForSale} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default UserProfile;
