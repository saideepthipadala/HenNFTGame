// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HenNFT is ERC721 {
    uint256 public nextHenId;
    uint256 public constant maxHens = 10000;
    address public admin;
    uint256 public breedingCooldown = 6 days; // Adjust the duration as needed
    bool public firstHenMinted = false;
    bool public secondHenMinted = false;
    uint256 public raceIdCounter = 0;
    Race[] public races;
    struct Hen {
        uint256 id;
        string name;
        uint256 speed;
        uint256 strength;
        bool readyToRace;
        bool forSale;
        bool isMale;
        uint256 price;
        uint256 motherId; // ID of the mother hen
        uint256 fatherId; // ID of the father hen
        uint256 generation; // Generation of the hen
    }
    struct HenInfo {
        uint256 id;
        string name;
        uint256 generation;
        bool gender;
        uint256 price;
    }
    struct Race {
        uint256 id;
        uint256 entryFee;
        uint256 startTime;
        address[] participants;
        address winner;
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    mapping(uint256 => Hen) public hens;
    mapping(address => Hen[]) public ownedHens;
    mapping(uint256 => uint256) public lastBreedTime;
    mapping(uint256 => uint256) public henRaceStatus; // Map hen ID to the race they are in
    mapping(uint256 => Hen) public maleHens;
    mapping(uint256 => Hen) public femaleHens;

    event HenMinted(address owner, uint256 henId, string name);
    event HenBred(address owner, string newName);
    event HenForSale(uint256 henId, uint256 price);
    event HenNoLongerForSale(uint256 henId);
    event HenPurchased(
        address buyer,
        address seller,
        uint256 henId,
        uint256 price
    );
    event TokensTransferred(address from, address to, uint256 amount);

    event RaceStarted(uint256 raceId, uint256 startTime, uint256 entryFee);
    event HenEnteredRace(uint256 raceId, uint256 henId);
    event RaceFinished(uint256 raceId, address winner);

    constructor() ERC721("HenNFT", "HEN") {
        admin = msg.sender;
    }

    function mintFirstHen(string memory henName) external {
        require(msg.sender == admin, "Only admin can mint the first hen");
        require(!firstHenMinted, "First hen already minted");

        uint256 motherId = 0; // Set motherId to 0 for the first hen
        uint256 fatherId = 0; // Set fatherId to 0 for the first hen
        uint256 speed = getRandomSpeed() + 3; // Initialize speed
        uint256 strength = getRandomStrength() + 5; // Initialize strength
        uint256 offspringGeneration = 1; // Initialize generation
        bool isMaleOffspring = true; // Initialize gender
        hens[nextHenId] = Hen(
            nextHenId,
            henName,
            speed,
            strength,
            false,
            false,
            isMaleOffspring,
            0,
            motherId,
            fatherId,
            offspringGeneration
        );
        _safeMint(admin, nextHenId);

        ownedHens[admin].push(hens[nextHenId]);
        nextHenId++;

        emit HenMinted(admin, nextHenId - 1, henName);

        firstHenMinted = true;
    }

    function mintSecondHen(string memory henName) external {
        require(msg.sender == admin, "Only admin can mint the second hen");
        require(!secondHenMinted, "Second hen already minted");

        uint256 motherId = 0; // Set motherId to 0 for the second hen
        uint256 fatherId = 0; // Set fatherId to 0 for the second hen
        uint256 speed = getRandomSpeed() + 11; // Initialize speed
        uint256 strength = getRandomStrength() + 21; // Initialize strength
        uint256 offspringGeneration = 1; // Initialize generation
        bool isMaleOffspring = false; // Initialize gender

        hens[nextHenId] = Hen(
            nextHenId,
            henName,
            speed,
            strength,
            false,
            false,
            isMaleOffspring,
            0,
            motherId,
            fatherId,
            offspringGeneration
        );

        _safeMint(admin, nextHenId);

        ownedHens[admin].push(hens[nextHenId]);
        nextHenId++;

        emit HenMinted(admin, nextHenId - 1, henName);

        secondHenMinted = true;
    }

    function setHenForSale(uint256 henId, uint256 price) external {
        require(_isOwnerOf(msg.sender, henId), "Not the owner of the hen");
        require(henExists(henId), "Hen with specified ID does not exist");
        hens[henId].forSale = true;
        hens[henId].price = price;

        emit HenForSale(henId, price);
    }

    function buyHen(uint256 henId) external payable {
        require(henExists(henId), "Hen with specified ID does not exist");
        require(hens[henId].forSale, "Hen not for sale");
        require(msg.value >= hens[henId].price, "Insufficient funds");

        address seller = ownerOf(henId);
        _transfer(seller, msg.sender, henId); // Transfer ownership to the buyer

        hens[henId].forSale = false;
        hens[henId].price = 0;

        // Update the ownedHens mapping for the seller and buyer
        ownedHens[seller] = removeHen(ownedHens[seller], henId);
        ownedHens[msg.sender].push(hens[henId]);

        payable(seller).transfer(msg.value);

        // Emit the HenPurchased event
        emit HenPurchased(msg.sender, seller, henId, msg.value);

        // Emit the TokensTransferred event
        emit TokensTransferred(msg.sender, seller, msg.value);
    }

    function withdrawHenFromSale(uint256 henId) external {
        require(_isOwnerOf(msg.sender, henId), "Not the owner of the hen");

        hens[henId].forSale = false;
        hens[henId].price = 0;

        emit HenNoLongerForSale(henId);
    }

    function removeHen(Hen[] storage hensList, uint256 henId)
        internal
        returns (Hen[] storage)
    {
        for (uint256 i = 0; i < hensList.length; i++) {
            if (hensList[i].id == henId) {
                hensList[i] = hensList[hensList.length - 1];
                hensList.pop();
                break;
            }
        }
        return hensList;
    }

    // Other functions, including breedHens, startRace, etc.

    function _isOwnerOf(address player, uint256 henId)
        internal
        view
        returns (bool)
    {
        return ownerOf(henId) == player;
    }

    // Helper function to generate random attributes using blockhash
    function getRandomSpeed() internal view returns (uint256) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                block.timestamp,
                msg.sender
            )
        );
        uint256 randomNumber = uint256(hash);
        return (randomNumber % 100);
    }

    function getRandomStrength() internal view returns (uint256) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                block.timestamp,
                msg.sender
            )
        );
        uint256 randomNumber = uint256(hash);
        return (randomNumber % 100);
    }

    function getOwnedHens(address owner) external view returns (HenInfo[] memory) {
    Hen[] storage hensOwned = ownedHens[owner];
    HenInfo[] memory ownedHenInfo = new HenInfo[](hensOwned.length);

    for (uint256 i = 0; i < hensOwned.length; i++) {
        ownedHenInfo[i] = HenInfo(
            hensOwned[i].id,
            hensOwned[i].name,
            hensOwned[i].generation,
            hensOwned[i].isMale,
            hensOwned[i].price
        );
    }

    return ownedHenInfo;
}


    // Modify breeding function to ensure compatibility.
    function breedHens(
        uint256 motherId,
        uint256 fatherId,
        string memory offspringName
    ) external {
        require(
            henExists(motherId) && henExists(fatherId),
            "One or both parents do not exist"
        );
        require(
            getHenGender(motherId) != getHenGender(fatherId),
            "Incompatible genders for breeding"
        );

        Hen storage mother = hens[motherId];
        Hen storage father = hens[fatherId];

        require(
            canBreed(motherId) && canBreed(fatherId),
            "One or both parents are still in the cooling period"
        );

        // Determine the generation of the offspring
        uint256 maxGeneration = mother.generation > father.generation
            ? mother.generation
            : father.generation;
        uint256 offspringGeneration = maxGeneration + 1;

        // Implement genetic inheritance based on attributes
        uint256 speed;
        uint256 strength;

        // Determine offspring attributes based on parents (simplistic example).
        if (mother.isMale) {
            speed = (mother.speed + father.speed) / 2 + 1;
            strength = (mother.strength + father.strength) / 2 + 1;
        } else {
            speed = mother.speed + 2;
            strength = father.strength + 2;
        }

        // Mint the offspring hen
        hens[nextHenId] = Hen(
            nextHenId,
            offspringName,
            speed,
            strength,
            false,
            false,
            getHenGender(nextHenId),
            0,
            motherId,
            fatherId,
            offspringGeneration
        );

        // Update the last breeding time for both parents
        lastBreedTime[motherId] = block.timestamp;
        lastBreedTime[fatherId] = block.timestamp;

        _safeMint(msg.sender, nextHenId);

        ownedHens[msg.sender].push(hens[nextHenId]);
        nextHenId++;

        emit HenBred(msg.sender, offspringName);
    }

    // Helper function to check if a hen exists
    function henExists(uint256 henId) internal view returns (bool) {
        return hens[henId].id == henId;
    }

    // Helper function to check if a hen is eligible for breeding based on the cooldown period
    function canBreed(uint256 henId) internal view returns (bool) {
        if (hens[henId].generation == 1) {
            return true; // First-generation hens have no initial cooldown
        } else {
            return (block.timestamp - lastBreedTime[henId]) >= breedingCooldown;
        }
    }

    function getHenGender(uint256 henId) public pure returns (bool) {
        // Determine the gender of the hen based on its ID (e.g., even IDs are male, odd IDs are female).
        return henId % 2 == 0;
    }

    function getMotherHensForBreeding()
        external
        view
        returns (HenInfo[] memory)
    {
        uint256 count = 0;

        for (uint256 i = 0; i < nextHenId; i++) {
            if (!hens[i].forSale && canBreed(i) && !hens[i].isMale) {
                count++;
            }
        }

        HenInfo[] memory motherHens = new HenInfo[](count);
        count = 0;

        for (uint256 i = 0; i < nextHenId; i++) {
            if (!hens[i].forSale && canBreed(i) && !hens[i].isMale) {
                motherHens[count] = HenInfo(
                   hens[i].id,
                    hens[i].name,
                    hens[i].generation,
                    hens[i].isMale,
                    hens[i].price
                );
                count++;
            }
        }

        return motherHens;
    }

    function getFatherHensForBreeding()
        external
        view
        returns (HenInfo[] memory)
    {
        uint256 count = 0;

        for (uint256 i = 0; i < nextHenId; i++) {
            if (!hens[i].forSale && canBreed(i) && hens[i].isMale) {
                count++;
            }
        }

        HenInfo[] memory fatherHens = new HenInfo[](count);
        count = 0;

        for (uint256 i = 0; i < nextHenId; i++) {
            if (!hens[i].forSale && canBreed(i) && hens[i].isMale) {
                fatherHens[count] = HenInfo(
                    hens[i].id,
                    hens[i].name,
                    hens[i].generation,
                    hens[i].isMale,
                    hens[i].price
                );
                count++;
            }
        }

        return fatherHens;
    }

    function getHensForSale() external view returns (HenInfo[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < nextHenId; i++) {
            if (hens[i].forSale) {
                count++;
            }
        }

        HenInfo[] memory hensForSale = new HenInfo[](count);
        count = 0;

        for (uint256 i = 0; i < nextHenId; i++) {
            if (hens[i].forSale) {
                hensForSale[count] = HenInfo(
                    hens[i].id,
                    hens[i].name,
                    hens[i].generation,
                    hens[i].isMale,
                    hens[i].price
                );
                count++;
            }
        }

        return hensForSale;
    }

    function getRaces() external view returns (Race[] memory) {
        return races;
    }

    function startRace(uint256 entryFee) external {
        require(msg.sender == admin, "Only admin can start a race");
        require(entryFee > 0, "Entry fee must be greater than zero");

        races.push(
            Race({
                id: raceIdCounter,
                entryFee: entryFee,
                startTime: 0,
                participants: new address[](0),
                winner: address(0)
            })
        );

        raceIdCounter++;

        emit RaceStarted(raceIdCounter - 1, block.timestamp, entryFee);
    }

    function enterRace(uint256 raceId, uint256 henId) external payable {
        require(raceId < raceIdCounter, "Race does not exist");
        require(henExists(henId), "Hen with specified ID does not exist");
        require(!hens[henId].forSale, "Hen is currently for sale");

        Race storage race = races[raceId];
        require(race.startTime == 0, "Race has already started");
        require(msg.sender == ownerOf(henId), "Not the owner of the hen");

        // Ensure the participant has enough balance to pay the entry fee
        require(msg.value >= race.entryFee, "Insufficient entry fee");

        // Add the participant to the race
        henRaceStatus[henId] = raceId;
        race.participants.push(msg.sender);

        emit HenEnteredRace(raceId, henId);
    }

    function startRaceNow(uint256 raceId) external payable {
        require(
            msg.sender == admin,
            "Only the race administrator can start the race"
        );
        Race storage race = races[raceId];

        // Check if the race has not started and has participants
        require(race.startTime == 0, "Race has already started");
        require(race.participants.length > 0, "No participants in the race");

        // Determine the winner
        uint256 winnerIndex = determineRaceWinner(raceId);

        address winner = race.participants[winnerIndex];

        // Calculate the prize for the winner (total entry fees)
        uint256 prize = race.entryFee * race.participants.length;

        // Ensure that the contract has sufficient balance to cover the prize
        require(
            address(this).balance >= prize,
            "Insufficient contract balance for prize"
        );

        race.winner = winner;

        // Transfer the prize directly to the winner
        payable(winner).transfer(prize);

        emit RaceFinished(raceId, winner);
    }

    function determineRaceWinner(uint256 raceId)
        internal
        view
        returns (uint256)
    {
        require(raceId < raceIdCounter, "Race does not exist");
        Race storage race = races[raceId];

        uint256 maxPerformance = 0;
        uint256 winnerIndex = type(uint256).max; // Initialize with the maximum possible value

        for (uint256 i = 0; i < race.participants.length; i++) {
            address participant = race.participants[i];

            Hen[] storage participantHens = ownedHens[participant];

            // Skip participants with no hens
            if (participantHens.length == 0) {
                continue;
            }

            for (uint256 j = 0; j < participantHens.length; j++) {
                uint256 henId = participantHens[j].id;

                require(henExists(henId), "Invalid hen ID");

                Hen storage hen = hens[henId];

                uint256 henPerformance = hen.speed + hen.strength;

                if (henPerformance > maxPerformance) {
                    maxPerformance = henPerformance;
                    winnerIndex = i; // Store the index of the participant with the best-performing hens
                }
            }
        }

        // Check if no participants had hens
        if (winnerIndex == type(uint256).max) {
            revert("No participants with hens in the race");
        }

        return winnerIndex;
    }

    function henInRace(uint256 henId) internal view returns (bool) {
        for (uint256 i = 0; i < races.length; i++) {
            for (uint256 j = 0; j < races[i].participants.length; j++) {
                if (races[i].participants[j] == ownerOf(henId)) {
                    return true;
                }
            }
        }
        return false;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = admin.call{value: balance}("");
        require(success, "Transfer to owner failed");
    }
}
