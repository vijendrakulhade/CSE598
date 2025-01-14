## How to install chaincode into hyperledger fabric test-network
1. Start the test-network with below command and create a new channel. Channel is a private layer of communication between specific orgnizations and invisible to other members of network.
`./network.sh up createChannel -c cse598 -s couchdb`
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
`export CC_PACKAGE_ID=assignment_1.0:6e95956f756c05fa905047dc110cae499647f4822eb3da18d5b2f7a80cf802ce`
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
15. We can query chaincode using `peer chaincode query -C cse598 -n assignment1 -c '{"Args":["createPatientRecord","Sur008","Suresh","08-10-1974","Male","O+ve"]}'`
`peer chaincode query -C cse598 -n assignment1 -c '{"Args":["getPatientByKey","Sur008","Suresh"]}'`
`peer chaincode query -C cse598 -n assignment1 -c '{"Args":["updateCheckupDate","Sur008","Suresh","08-10-1974"]}'`
`peer chaincode query -C cse598 -n assignment1 -c '{"Args":["queryByGender","Male"]}'`
`peer chaincode query -C cse598 -n assignment1 -c '{"Args":["queryByBlood_Type","O+ve"]}'`
 ### Upgrade Chaincode
 1. To upgrade chain code we need to create the repackage the chaincode.
 `peer lifecycle chaincode package assignment_2.tar.gz --path ../../CSE598/Assignment1 --lang node --label assignment_2.0`
 2. Node we can install this package into Orgs, First we should set the env variables for Orgs
 `export CORE_PEER_LOCALMSPID="Org2MSP"`
`export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`
`export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`
`export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`
`export CORE_PEER_ADDRESS=localhost:9051`
 `peer lifecycle chaincode install assignment_2.tar.gz`
 2. Now we can approve this new installed chaincode from Org2
 `peer lifecycle chaincode queryinstalled` check package id from this comment.
 We need to set variable for this new package id.
 `export NEW_CC_PACKAGE_ID=basic_2.0:1d559f9fb3dd879601ee17047658c7e0c84eab732dca7c841102f20e42a9e7d4`
 Than we are approving the new chaincode in Org2
 `peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID cse598 --name assignment1 --version 2.0 --package-id $NEW_CC_PACKAGE_ID --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`
 3. Same approval process we will be doing for Org1 as well.

 4. Now we can check the approval readiness with this command.
 `peer lifecycle chaincode checkcommitreadiness --channelID cse598 --name assignment1 --version 2.0 --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json`
.

 4. Now we can check the approval readiness with this command.
 `peer lifecycle chaincode checkcommitreadiness --channelID cse598 --name assignment1 --version 2.0 --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json`
 5. Now we can commit the chaincode.
 `peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID cse598 --name assignment1 --version 2.0 --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"`

 ## Couchdb setup
 1. pull the docker image of couchdb `docker pull couchdb`
 2. Run couchbase docker container in admin mode
 `docker run -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -d couchdb`

# Advanced Usage
 ## Direct deploy chaincode 
1.  `./network.sh deployCC -c cse598 -ccn assignment1 -ccp  ../../CSE598/Assignment1/ -ccl javascript -s couchdb`
 After direct installation as well we need to set the variable to invoke the chaincode. 
 After the variable getting this error while invoking 
 `peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C cse598 -n assignment1 --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"init","Args":[]}'`

 Error: error getting endorser client for invoke: endorser client failed to connect to localhost:7051: failed to create new connection: context deadline exceeded

 peer chaincode invoke -C mychannel -n basic -c '{"Args":["CreateAsset","asset1","blue","5","tom","35"]}'