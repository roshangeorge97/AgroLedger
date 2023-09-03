import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';

function AddMed() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState('');
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState([]);
  const [MedName, setMedName] = useState('');
  const [MedStage, setMedStage] = useState([]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
      setSupplyChain(supplychain);
      const medCtr = await supplychain.methods.medicineCtr().call();
      const med = [];
      const medStage = [];
      for (let i = 0; i < medCtr; i++) {
        med[i] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      window.alert('The smart contract is not deployed to the current network');
    }
  };

  const redirect_to_home = () => {
    history.push('/');
  };

  const handlerChangeNameMED = (event) => {
    setMedName(event.target.value);
  };

  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      const receipt = await SupplyChain.methods.addMedicine(MedName).send({ from: currentaccount });
      if (receipt) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert('An error occurred!!!');
    }
  };

  return (
    <div className="bg-green-100 min-h-screen p-4">
      <div className="container mx-auto">
        <span className="block text-lg font-semibold text-green-800">
          Current Account Address: {currentaccount}
        </span>
        <button
          onClick={redirect_to_home}
          className="block mt-2 px-4 py-1 text-white bg-red-500 rounded-md"
        >
          HOME
        </button>

        <div className="mt-4">
          <h5 className="text-lg font-semibold text-green-800">Add Product Order:</h5>
          <form onSubmit={handlerSubmitMED} className="mt-2">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              type="text"
              onChange={handlerChangeNameMED}
              placeholder="Product Name"
              required
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
            >
              Order
            </button>
          </form>
        </div>

        <div className="mt-4">
          <h5 className="text-lg font-semibold text-green-800">Ordered Medicines:</h5>
          <table className="w-full mt-2 border-collapse border border-green-500">
            <thead>
              <tr>
                <th className="border border-green-500 px-4 py-2 text-green-800">ID</th>
                <th className="border border-green-500 px-4 py-2 text-green-800">Name</th>
                <th className="border border-green-500 px-4 py-2 text-green-800">Description</th>
                <th className="border border-green-500 px-4 py-2 text-green-800">Current Stage</th>
              </tr>
            </thead>
            <tbody>
              {MED.map((med, index) => (
                <tr key={index}>
                  <td className="border border-green-500 px-4 py-2">{med.id}</td>
                  <td className="border border-green-500 px-4 py-2">{med.name}</td>
                  <td className="border border-green-500 px-4 py-2">{med.description}</td>
                  <td className="border border-green-500 px-4 py-2">{MedStage[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddMed
