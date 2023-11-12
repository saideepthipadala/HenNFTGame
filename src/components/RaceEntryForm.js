// RaceEntryForm.js
import React, { useState } from 'react';
import { Box, Text, Input, Select, Button, VStack } from '@chakra-ui/react';

const RaceEntryForm = ({ ownedHens, onSubmit }) => {
    const [selectedHenId, setSelectedHenId] = useState('');
    const [entryFee, setEntryFee] = useState('');

    const handleSubmit = () => {
        // Validate the inputs, handle any additional logic if needed

        // Call the onSubmit function with the selected data
        onSubmit({
            henId: selectedHenId,
            entryFee: entryFee,
        });

        // Clear the form after submission
        setSelectedHenId('');
        setEntryFee('');
    };

    return (
        <VStack spacing={4}>
            <Box>
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
            <Box>
                <Text>Entry Fee (ETH):</Text>
                <Input
                    type="text"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    placeholder="Enter entry fee"
                />
            </Box>
            <Button colorScheme="teal" onClick={handleSubmit}>
                Submit
            </Button>
        </VStack>
    );
};

export default RaceEntryForm;
