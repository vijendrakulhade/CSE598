## How to install chaincode into hyperledger fabric test-network
1. Start the test-network with below command and create a new channel. Channel is a private layer of communication between specific orgnizations and invisible to other members of network.
`./network.sh up createChannel -c cse598`
2. Install the chaincode using `npm install --registry https://registry.npmjs.org`. We have made the neccessary changes in contract functions.
3. Once the chaincode is packaged, go to test-network directory and exucute below commands to set the path.
`export PATH=${PWD}/../bin:$PATH`
`export FABRIC_CFG_PATH=$PWD/../config/`
4. Once the path is set check the peer version using `peer version`
5. Package the chaincode for deployment.
`peer lifecycle chaincode package assignment_1.tar.gz --path ../../CSE598/Assignment1 --lang node --label assignment_1.0`
6. Install the chaincode into Org1. 
`export CORE_PEER_TLS_ENABLED=true`
`export CORE_PEER_LOCALMSPID="Org1MSP"`
`export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`
`export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`
`export CORE_PEER_ADDRESS=localhost:7051`
`peer lifecycle chaincode install assignment_1.tar.gz`
7. Install the chaincode into Org2.
`export CORE_PEER_LOCALMSPID="Org2MSP"`
`export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`
`export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`
`export CORE_PEER_ADDRESS=localhost:9051`
`peer lifecycle chaincode install assignment_1.tar.gz`
*Note:- This will not install chaincode on cse598 channel, we need to check how to fix that. As if now it will install it into default channel, i.e mychannel*
8. Once the chaincode is installed, it needs to be approved by the Organizations. To apporve the chaincode by Organizations we need to find out the chaincode id using `peer lifecycle chaincode queryinstalled`
9. The chaincode package Id found from above command needs to be approved by organizations. We will export CC_PACKAGE_ID variable to store this package id. In this case package Id is shown like below.
`export CC_PACKAGE_ID=assignment_1.0:ba30f36e238fbfbe63d5a6d6d8d5e05839bb5f47b5440d2fff84407f5504327b`
10. Chaincode approval can be done by below command, However this approval needs to be done for both Organizations, as we have 2 org only.
`peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID cse598 --name assignment1 --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`
11. Once it is approve by one org, we will change the variables to org1 and approve again with org1
`export CORE_PEER_LOCALMSPID="Org1MSP"`
`export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`
`export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`
`export CORE_PEER_ADDRESS=localhost:7051`
`peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID cse598 --name assignment1 --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`
12. Check for commit readiness, below command will show that the chaincode is approved by the orgs.
`peer lifecycle chaincode checkcommitreadiness --channelID cse598 --name assignment1 --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json`
13. Use below command to commit the chaincode.
`peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID cse598 --name assignment1 --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"`
14. Once chaincode is committed, We can initialize ledger with below command.
`peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C cse598 -n assignment1 --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"init","Args":[]}'`
15. We can query chaincode using `peer chaincode query -C cse598 -n assignment1 -c '{"Args":["createPatientRecord","vj007","Vijendra","07-07-1984","Male","O+ve"]}'`