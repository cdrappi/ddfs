import Web3 from 'web3'
import {address, ABI} from './constants/pgaDfsContract'

let getContract = new Promise(function (resolve, reject) {
 let web3 = new Web3(window.web3.currentProvider)
 let pgaDfsContract = web3.eth.contract(ABI)
 let pgaDfsContractInstance = pgaDfsContract.at(address)
 // casinoContractInstance = () => casinoContractInstance
 resolve(pgaDfsContractInstance)
})
export default getContract
