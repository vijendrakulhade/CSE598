'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const patientrecordcontract = require('patientrecordcontract.js');

let assert = sinon.assert;
chai.use(sinonChai);
describe("patientrecord basic test",()=>{
    let transactionContext, chaincodeStub;
    beforeEach(()=>{
        transactionContext = new Context();

        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext.setChaincodeStub(chaincodeStub);
    }); 
})