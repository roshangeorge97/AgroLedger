import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import QRCode from 'qrcode';
import SupplyChainABI from "./artifacts/SupplyChain.json"
import { Data } from './utils/data';
import PieChart from './PiChart';
import { Chart } from 'chart.js';
import { CategoryScale,ArcElement } from "chart.js";

Chart.register(CategoryScale,ArcElement);

function Track() {
  const [chartData, setChartData] = useState();
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [SOIL, setSOIL] = useState();
    const [STG, setSTG] = useState();
    const [CTF, setCTF] = useState();
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();
    const [RMS, setRMS] = useState();
    const [MAN, setMAN] = useState();
    const [DIS, setDIS] = useState();
    const [RET, setRET] = useState();
    const [TrackTillSold, showTrackTillSold] = useState(false);
    const [TrackTillRetail, showTrackTillRetail] = useState(false);
    const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
    const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
    const [TrackTillRMS, showTrackTillRMS] = useState(false);
    const [TrackTillOrdered, showTrackTillOrdered] = useState(false);
    const [qrCodeImage, setQRCodeImage] = useState(null);
    
    
    
   

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
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
            var i;
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const soil = {};
            const storage = {};
            const certificate = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
                soil[i + 1] = await supplychain.methods.Soil(i + 1).call();
                storage[i + 1] = await supplychain.methods.StorageStock(i + 1).call();
                certificate[i + 1] = await supplychain.methods.CertificationStock(i + 1).call();
                medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setSOIL(soil);
            setSTG(storage);
            setCTF(certificate);
            setMedStage(medStage);
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (i = 0; i < rmsCtr; i++) {
                rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i + 1] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (i = 0; i < disCtr; i++) {
                dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (i = 0; i < retCtr; i++) {
                ret[i + 1] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }
    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        )
    }
    if (TrackTillSold) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                    <span><b>Price: </b>{MED[ID].price5}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                        <span><b>Price: </b>{MED[ID].price1}</span>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                        <span><b>Price: </b>{MED[ID].price2}</span>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                        <span><b>Price: </b>{MED[ID].price3}</span>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Retailed by:</u></h4>
                        <p><b>Retailer ID: </b>{RET[MED[ID].RETid].id}</p>
                        <p><b>Name:</b> {RET[MED[ID].RETid].name}</p>
                        <p><b>Place: </b>{RET[MED[ID].RETid].place}</p>
                        <span><b>Price: </b>{MED[ID].price4}</span>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Sold</u></h4>
                    </article>
                </section>
                {qrCodeImage && <img src={qrCodeImage} alt="QR Code" />}
                <button onClick={() => {
                    showTrackTillSold(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillRetail) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                    <span><b>Price: </b>{MED[ID].price4}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                        <span><b>Price: </b>{MED[ID].price1}</span>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                        <span><b>Price:</b>{MED[ID].price2}</span>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                        <span><b>Price: </b>{MED[ID].price3}</span>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Retailed by:</u></h4>
                        <p><b>Retailer ID: </b>{RET[MED[ID].RETid].id}</p>
                        <p><b>Name:</b> {RET[MED[ID].RETid].name}</p>
                        <p><b>Place: </b>{RET[MED[ID].RETid].place}</p>
                        <span><b>Price: </b>{MED[ID].price4}</span>
                    </article>
                </section>
                {qrCodeImage && <img src={qrCodeImage} alt="QR Code" />}
                <button onClick={() => {
                    showTrackTillRetail(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillDistribution) {
        return (
            <>
           
        
         <span><b>Current Account Address:</b> {currentaccount}</span>
       
                                    
              <div   className="flex">
        
                {/* Left section */}
                <div className="w-2/3 bg-white-100 p-4 flex flex-col mb-4">
                  {/* Top section */}
                  <h1 className="text-2xl font-bold mb-10">{MED[ID].name}</h1>
                  <div className="flex items-center">
                    <img
                      src="https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=170667a&w=0&k=20&c=QDuN_TDSFCW2m-np7xPWPslXyrhwtIYP9Wq6W3NysPc="
                      alt="Image 1"
                      className="w-60 h-60 rounded-full mr-2"
                    />
                    <p>{MED[ID].id}</p>
                  </div>
                  {/* Bottom section */}
                  <div className="flex items-center mt-20">
                    <div>
                      <h1 className="text-2xl font-bold mb-10">Sustainability Score </h1>
                      <div className='h-24 w-24'>
                        <ul>
                       <li> Organic Fertlizeer:  {SOIL[ID].Organicertilizer}</li>
                       <li> Natural Fertilizer: {SOIL[ID].NaturalFertilizer}</li>
                       <li>Synthetic Fertilizer: {SOIL[ID].SyntheticFertilizer}</li>
                       <li> pH Quality: 5</li>
                       <li> Water Quality: 5</li>
                       <li> Tempreature: 52</li>
                       <li> Humidity : 23</li>

                        Sustaibility Score: 72
                        </ul>
                      <PieChart chartData={chartData} />
           </div>
                
                    </div>
                  </div>
        
                </div>
                {/* Right section */}
                <div class="min-h-screen bg-white-500 py-6 flex flex-col justify-center sm:py-12">
          <div class="py-3 sm:max-w-xl sm:mx-auto w-full px-2 sm:px-0">
        
            <div class="relative text-gray-700 antialiased text-sm font-semibold">
        
              {/* <!-- Vertical bar running through middle --> */}
              <div class="hidden sm:block w-1 bg-green-300 absolute h-full left-1/2 transform -translate-x-1/2"></div>
        
              {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
              <div class="mt-6 sm:mt-0 sm:mb-12">
                <div class="flex flex-col sm:flex-row items-center">
                  <div class="flex justify-start w-full mx-auto items-center">
                    <div class="w-full sm:w-1/2 sm:pr-8">
                      <div class="p-4 bg-green-200 rounded shadow">
                        {RMS[MED[ID].RMSid].id}
                        {RMS[MED[ID].RMSid].name}
                        {RMS[MED[ID].RMSid].place}
                        {RMS[MED[ID].RMSid].price1}
                      </div>
                    </div>
                  </div>
                  <div class="rounded-full bg-green-500 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
        
              {/* <!-- Right section, set by justify-end and sm:pl-8 --> */}
              <div class="mt-6 sm:mt-0 sm:mb-12">
                <div class="flex flex-col sm:flex-row items-center">
                  <div class="flex justify-end w-full mx-auto items-center">
                    <div class="w-full sm:w-1/2 sm:pl-8">
                      <div class="p-4 bg-green-200 rounded shadow">
                      {MAN[MED[ID].MANid].id}
                      {MAN[MED[ID].MANid].name}
                      {MAN[MED[ID].MANid].place}
                      {MAN[MED[ID].MANid].price2}
                      </div>
                    </div>
                  </div>
                  <div class="rounded-full bg-green-500 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
              </div>
        
              {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
              <div class="mt-6 sm:mt-0 sm:mb-12">
                <div class="flex flex-col sm:flex-row items-center">
                  <div class="flex justify-start w-full mx-auto items-center">
                    <div class="w-full sm:w-1/2 sm:pr-8">
                      <div class="p-4 bg-green-200 rounded shadow">
                        {DIS[MED[ID].DISid].id}
                        {DIS[MED[ID].DISid].name}
                      {DIS[MED[ID].DISid].place}
                      {DIS[MED[ID].DISid].price3}
                      </div>
                    </div>
                  </div>
                  <div class="rounded-full bg-green-500 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
      
        
        
        
            </div>
        
          </div>
        </div>
              </div>
              
            </>
          );
    }
    if (TrackTillManufacture) {
      return (
        <div className="flex bg-green-300 h-screen">
          {/* Left section */}
          <div className="w-2/3 p-8 bg-white flex flex-col">
            {/* Top section */}
            <h1 className="text-3xl font-semibold mb-6">{MED[ID].name}</h1>
            <div className="flex items-center mb-6">
              <div className="w-40 h-40 rounded-full bg-green-300 mr-4">
                <img
                  src="https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=170667a&w=0&k=20&c=QDuN_TDSFCW2m-np7xPWPslXyrhwtIYP9Wq6W3NysPc="
                  alt="Product Image"
                  className="w-full h-full rounded-full"
                />
              </div>
              <p className="text-lg">Product Id: {MED[ID].id}</p>
            </div>
            {/* Bottom section */}
            <div className="flex items-center">
              <div className="mr-8">
                <h2 className="text-xl font-semibold mb-4">Sustainability Score</h2>
                <ul>
                  <li>Organic Fertilizer: {SOIL[ID].Organicertilizer}</li>
                  <li>Natural Fertilizer: {SOIL[ID].NaturalFertilizer}</li>
                  <li>Synthetic Fertilizer: {SOIL[ID].SyntheticFertilizer}</li>
                  <li>pH Quality: 5</li>
                  <li>Water Quality: 5</li>
                  <li>Temperature: 52</li>
                  <li>Humidity: 23</li>
                </ul>
              </div>
              <div className="h-24 w-24">
                <PieChart chartData={chartData} />
              </div>
            </div>
          </div>
          {/* Right section */}
          <div className="w-1/3 py-12 px-8 bg-white flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-4">Scan the QR Code for More Details</h2>
            <p className="text-gray-600">
              Scan the QR code to access additional information about this product and its journey through various stages.
            </p>
          </div>
          {/* QR Code section */}
          <div className="w-1/6 flex items-center justify-center">
            {qrCodeImage && <img src={qrCodeImage} alt="QR Code" className="h-32" />}
          </div>
        </div>
      );
      
    }
    if (TrackTillRMS) {
      return (
        <>
          <span className="block font-semibold mt-4">
            Current Account Address: {currentaccount}
          </span>
          <div className="flex mt-2 bg-gray-100">
            {/* Left section */}
            <div className="w-2/3 bg-white p-4 flex flex-col mb-4">
              {/* Top section */}
              <h1 className="text-2xl font-bold mb-10">{MED[ID].name}</h1>
              <div className="flex items-center">
                <img
                  src="https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=170667a&w=0&k=20&c=QDuN_TDSFCW2m-np7xPWPslXyrhwtIYP9Wq6W3NysPc="
                  alt="Image 1"
                  className="w-60 h-60 rounded-full mr-2"
                />
                <p>{MED[ID].id}</p>
              </div>
              {/* Bottom section */}
              <div className="flex items-center mt-20">
                <div>
                  <h1 className="text-2xl font-bold mb-10">Sustainability Score</h1>
                  <div className='h-24 w-24'>
                    <ul>
                      <li>Organic Fertilizer: {SOIL[ID].Organicertilizer}</li>
                      <li>Natural Fertilizer: {SOIL[ID].NaturalFertilizer}</li>
                      <li>Synthetic Fertilizer: {SOIL[ID].SyntheticFertilizer}</li>
                      <li>pH Quality: 5</li>
                      <li>Water Quality: 5</li>
                      <li>Temperature: 52</li>
                      <li>Humidity: 23</li>
                    </ul>
                    Sustainability Score: 72
                    <PieChart chartData={chartData} />
                  </div>
                </div>
              </div>
            </div>
            {/* Right section */}
            <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-white">
              <div className="py-3 sm:max-w-xl sm:mx-auto w-full px-2 sm:px-0">
                <div className="relative text-gray-700 antialiased text-sm font-semibold">
                  <div className="hidden sm:block w-1 bg-green-300 absolute h-full left-1/2 transform -translate-x-1/2"></div>
      
                  {/* Left section */}
                  <div className="mt-6 sm:mt-0 sm:mb-12">
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="flex justify-start w-full mx-auto items-center">
                        <div className="w-full sm:w-1/2 sm:pr-8">
                          <div className="p-4 bg-green-200 rounded shadow">
                            {RMS[MED[ID].RMSid].id}
                            {RMS[MED[ID].RMSid].name}
                            {RMS[MED[ID].RMSid].place}
                            {RMS[MED[ID].RMSid].price1}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-full bg-green-500 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                  </div>
      
                  {/* Right section */}
                  <div className="mt-6 sm:mt-0 sm:mb-12">
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="flex justify-end w-full mx-auto items-center">
                        <div className="w-full sm:w-1/2 sm:pl-8">
                          <div className="p-4 bg-green-200 rounded shadow">
                            {MAN[MED[ID].MANid].id}
                            {MAN[MED[ID].MANid].name}
                            {MAN[MED[ID].MANid].place}
                            {MAN[MED[ID].MANid].price2}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-full bg-green-500 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                    </div>
                  </div>
      
                  {/* ... Add similar structure for other sections ... */}
      
                </div>
              </div>
            </div>
          </div>
        </>
      );
      
    }
    if (TrackTillOrdered) {
        return (
           <>
    <span className="block font-semibold mt-4">
      Current Account Address: {currentaccount}
    </span>
    <div className="flex mt-2">
      {/* Left section */}
      <div className="w-2/3 bg-white p-4 flex flex-col mb-4">
        {/* Top section */}
        <h1 className="text-2xl font-bold mb-10">{MED[ID].name}</h1>
        <div className="flex items-center">
          <img
            src="https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=170667a&w=0&k=20&c=QDuN_TDSFCW2m-np7xPWPslXyrhwtIYP9Wq6W3NysPc="
            alt="Image 1"
            className="w-60 h-60 rounded-full mr-2"
          />
          <p>{MED[ID].id}</p>
        </div>
        {/* Bottom section */}
        <div className="flex items-center mt-20">
          <div>
            <h1 className="text-2xl font-bold mb-10">
              {SOIL[ID].NaturalFertilizer} {SOIL[ID].SyntheticFertilizer} {SOIL[ID].Organicertilizer}
            </h1>
            <div className="h-24 w-24">
              <PieChart chartData={chartData} />
            </div>
          </div>
        </div>
      </div>
      {/* Right section */}
      <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-white">
        <div className="py-3 sm:max-w-xl sm:mx-auto w-full px-2 sm:px-0">
          <div className="relative text-gray-700 antialiased text-sm font-semibold">
            <div className="hidden sm:block w-1 bg-green-300 absolute h-full left-1/2 transform -translate-x-1/2"></div>
            
            {/* Sections */}
            <div className="mt-6 sm:mt-0 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="flex justify-start w-full mx-auto items-center">
                  <div className="w-full sm:w-1/2 sm:pr-8">
                    <div className="p-4 bg-green-200 rounded shadow">
                      Now this is a story all about how,
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-green-500 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  </>
          );
    }
    const handlerChangeID = (event) => {
        setID(event.target.value);
    }
    const redirect_to_home = () => {
        history.push('/')
    }
    
    const handlerSubmit = async (event) => {
        event.preventDefault();
        const data = `ID: ${ID}\nStage: ${MED[ID].stage}`;
        QRCode.toDataURL(data, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        setQRCodeImage(url);
        console.log(qrCodeImage)
      });
      const Data = [
        {
          id: 1,
          year: 2016,
          userGain: SOIL[ID].NaturalFertilizer,
        },
        {
          id: 2,
          year: 2017,
          userGain: SOIL[ID].SyntheticFertilizer,
        },
        {
          id: 3,
          year: 2018,
          userGain:SOIL[ID].Organicertilizer,
        },
      ];
      setChartData({
        labels: Data.map((data) => data.year), 
        datasets: [
          {
            label: "Users Gained ",
            data: Data.map((data) => data.userGain),
            backgroundColor: [
              "#50AF95",
              "#f3ba2f",
              "#2a71d0"
            ],
            borderColor: "black",
            borderWidth: 2
          }
        ]
      })
        var ctr = await SupplyChain.methods.medicineCtr().call();
        if (!((ID > 0) && (ID <= ctr)))
            alert("Invalid Product ID!!!");
        else {
            // eslint-disable-next-line
            if (MED[ID].stage == 5)
                showTrackTillSold(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 4)
                showTrackTillRetail(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 3)
                showTrackTillDistribution(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 2)
                showTrackTillManufacture(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 1)
                showTrackTillRMS(true);
            else
                showTrackTillOrdered(true);
            
        }
        
      
    }

    return (
        <div>
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

    <table className="w-full mt-4 border-collapse border border-green-500">
      <thead>
        <tr>
          <th className="border border-green-500 px-4 py-2 text-green-800">Product ID</th>
          <th className="border border-green-500 px-4 py-2 text-green-800">Name</th>
          <th className="border border-green-500 px-4 py-2 text-green-800">Description</th>
          <th className="border border-green-500 px-4 py-2 text-green-800">Current Price</th>
          <th className="border border-green-500 px-4 py-2 text-green-800">Current Processing Stage</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(MED).map(function (key) {
          return (
            <tr key={key}>
              <td className="border border-green-500 px-4 py-2">{MED[key].id}</td>
              <td className="border border-green-500 px-4 py-2">{MED[key].name}</td>
              <td className="border border-green-500 px-4 py-2">{MED[key].description}</td>
              <td className="border border-green-500 px-4 py-2">
                <span className="text-green-800">
                  {
                    MedStage[key] === 'Raw Material Supply Stage'
                    ? MED[key].price1
                    : MedStage[key] === 'Manufacturing Stage'
                    ? MED[key].price2
                    : MedStage[key] === 'Distribution Stage'
                    ? MED[key].price3
                    : MedStage[key] === 'Retail Stage'
                    ? MED[key].price4
                    : null // add a default value or handle case when no matching stage is found
                  }
                </span>
              </td>
              <td className="border border-green-500 px-4 py-2">{MedStage[key]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    <h5 className="mt-4 font-semibold text-green-800">Enter Product ID to Track it</h5>
    <form onSubmit={handlerSubmit} className="flex mt-2">
      <input
        className="form-input px-2 py-1 w-1/2 rounded-md border border-green-500"
        type="text"
        onChange={handlerChangeID}
        placeholder="Enter Product ID"
        required
      />
      <button
        className="ml-2 px-4 py-1 text-white bg-green-500 rounded-md"
        onSubmit={handlerSubmit}
      >
        Track
      </button>
    </form>
  </div>
</div>

           
        </div>
    )
}

export default Track
